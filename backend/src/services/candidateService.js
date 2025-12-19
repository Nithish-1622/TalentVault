import supabaseAdmin from '../config/supabase.js';
import { config } from '../config/index.js';
import { aiService } from './aiService.js';

export const candidateService = {
  /**
   * Upload resume to Supabase Storage
   */
  async uploadResume(file, candidateId) {
    const filename = `${candidateId}-${Date.now()}-${file.originalname}`;
    const filePath = `${candidateId}/${filename}`;

    const { data, error } = await supabaseAdmin.storage
      .from(config.supabase.resumeBucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Resume upload error:', error);
      throw new Error('Failed to upload resume');
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(config.supabase.resumeBucket)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      filename: file.originalname,
      size: file.size,
    };
  },

  /**
   * Create new candidate with AI processing
   */
  async createCandidate(candidateData, resumeFile) {
    try {
      // First, create candidate record to get ID
      const { data: candidate, error: candidateError } = await supabaseAdmin
        .from('candidates')
        .insert({
          full_name: candidateData.fullName,
          email: candidateData.email,
          phone: candidateData.phone,
          job_role_id: candidateData.jobRoleId || null,
          job_role_text: candidateData.jobRoleText,
          resume_url: 'pending', // Temporary
          resume_filename: resumeFile.originalname,
          resume_file_size: resumeFile.size,
          status: 'Applied',
        })
        .select()
        .single();

      if (candidateError) {
        throw new Error('Failed to create candidate');
      }

      // Upload resume
      const resumeData = await this.uploadResume(resumeFile, candidate.id);

      // Update candidate with resume URL
      const { error: updateError } = await supabaseAdmin
        .from('candidates')
        .update({
          resume_url: resumeData.url,
        })
        .eq('id', candidate.id);

      if (updateError) {
        throw new Error('Failed to update candidate with resume URL');
      }

      // Process resume with AI (async - don't block response)
      this.processResumeAI(candidate.id, resumeData.url, resumeFile.originalname)
        .catch(err => console.error('AI Processing Error:', err));

      return {
        ...candidate,
        resume_url: resumeData.url,
      };
    } catch (error) {
      console.error('Create candidate error:', error);
      throw error;
    }
  },

  /**
   * Process resume with AI service
   */
  async processResumeAI(candidateId, resumeUrl, filename) {
    try {
      // Parse resume
      const aiResult = await aiService.parseResume(resumeUrl, filename);

      // Store AI insights
      const { error } = await supabaseAdmin
        .from('ai_insights')
        .insert({
          candidate_id: candidateId,
          extracted_text: aiResult.extracted_text || '',
          summary: aiResult.summary || '',
          skills: aiResult.skills || [],
          experience_years: aiResult.experience_years || 0,
          education: aiResult.education || [],
          certifications: aiResult.certifications || [],
          languages: aiResult.languages || [],
          embedding_id: aiResult.embedding_id || null,
        });

      if (error) {
        console.error('Failed to store AI insights:', error);
      }
    } catch (error) {
      console.error('AI processing error:', error);
      // Don't throw - AI processing is not critical for candidate creation
    }
  },

  /**
   * Get all candidates with AI insights
   */
  async getAllCandidates(filters = {}) {
    let query = supabaseAdmin
      .from('candidate_dashboard')
      .select('*');

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.jobRole) {
      query = query.eq('role_name', filters.jobRole);
    }

    if (filters.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    // Order by most recent
    query = query.order('applied_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error('Failed to fetch candidates');
    }

    return data;
  },

  /**
   * Get candidate by ID
   */
  async getCandidateById(candidateId) {
    const { data, error } = await supabaseAdmin
      .from('candidate_dashboard')
      .select('*')
      .eq('id', candidateId)
      .single();

    if (error || !data) {
      throw new Error('Candidate not found');
    }

    return data;
  },

  /**
   * Update candidate status
   */
  async updateCandidateStatus(candidateId, status, recruiterId, notes) {
    const { data, error } = await supabaseAdmin
      .from('candidates')
      .update({
        status,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', candidateId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update candidate status');
    }

    // Log activity
    await supabaseAdmin
      .from('activity_log')
      .insert({
        recruiter_id: recruiterId,
        candidate_id: candidateId,
        action_type: 'status_change',
        description: `Changed status to ${status}`,
        metadata: { previous_status: data.status, new_status: status },
      });

    return data;
  },

  /**
   * Semantic search for candidates
   */
  async semanticSearch(query, recruiterId) {
    try {
      // Get all candidate IDs
      const { data: candidates } = await supabaseAdmin
        .from('candidates')
        .select('id');

      const candidateIds = candidates?.map(c => c.id) || [];

      // Perform semantic search via AI service
      const searchResults = await aiService.semanticSearch(query, candidateIds);

      // Get full candidate details for results
      const rankedCandidates = await Promise.all(
        searchResults.results.map(async (result) => {
          const candidate = await this.getCandidateById(result.candidate_id);
          return {
            ...candidate,
            relevance_score: result.score,
            match_reason: result.reason,
          };
        })
      );

      // Log search query
      await supabaseAdmin
        .from('search_queries')
        .insert({
          recruiter_id: recruiterId,
          query_text: query,
          results_count: rankedCandidates.length,
          search_type: 'semantic',
        });

      return rankedCandidates;
    } catch (error) {
      console.error('Semantic search error:', error);
      throw new Error('Failed to perform semantic search');
    }
  },

  /**
   * Get candidate statistics
   */
  async getStatistics() {
    const { data: stats } = await supabaseAdmin
      .rpc('get_candidate_stats');

    // If RPC doesn't exist, calculate manually
    const { count: totalCandidates } = await supabaseAdmin
      .from('candidates')
      .select('*', { count: 'exact', head: true });

    const { count: appliedCount } = await supabaseAdmin
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Applied');

    const { count: shortlistedCount } = await supabaseAdmin
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Shortlisted');

    const { count: interviewedCount } = await supabaseAdmin
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Interviewed');

    const { count: hiredCount } = await supabaseAdmin
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Hired');

    return {
      total: totalCandidates || 0,
      applied: appliedCount || 0,
      shortlisted: shortlistedCount || 0,
      interviewed: interviewedCount || 0,
      hired: hiredCount || 0,
    };
  },
};
