/**
 * Job role matching utility
 * Matches candidates to job roles based on skills and experience
 */

export const jobMatcher = {
  /**
   * Calculate match score between candidate skills and job role requirements
   * @param {Array} candidateSkills - Array of candidate skills
   * @param {Array} roleRequirements - Array of required skills for the role
   * @returns {number} Match score (0-100)
   */
  calculateMatchScore(candidateSkills, roleRequirements) {
    if (!candidateSkills || !roleRequirements || roleRequirements.length === 0) {
      return 0;
    }

    const normalizedCandidateSkills = candidateSkills.map(s => s.toLowerCase().trim());
    const normalizedRoleRequirements = roleRequirements.map(s => s.toLowerCase().trim());

    // Count matching skills
    const matchingSkills = normalizedRoleRequirements.filter(req =>
      normalizedCandidateSkills.some(skill => 
        skill.includes(req) || req.includes(skill)
      )
    );

    // Calculate percentage match
    const matchPercentage = (matchingSkills.length / normalizedRoleRequirements.length) * 100;
    return Math.round(matchPercentage);
  },

  /**
   * Find best matching job roles for a candidate
   * @param {Object} candidate - Candidate object with skills
   * @param {Array} jobRoles - Array of job role objects
   * @returns {Array} Top 3 matching roles with scores
   */
  findBestMatches(candidate, jobRoles) {
    if (!candidate.skills || !jobRoles || jobRoles.length === 0) {
      return [];
    }

    const matches = jobRoles.map(role => {
      // Parse required skills from role description or requirements
      const requiredSkills = this.extractSkillsFromRole(role);
      const matchScore = this.calculateMatchScore(candidate.skills, requiredSkills);

      return {
        ...role,
        matchScore,
        matchingSkills: this.getMatchingSkills(candidate.skills, requiredSkills),
        missingSkills: this.getMissingSkills(candidate.skills, requiredSkills),
      };
    });

    // Sort by match score and return top 3
    return matches
      .filter(m => m.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  },

  /**
   * Extract skills from job role description/requirements
   * @param {Object} role - Job role object
   * @returns {Array} Array of required skills
   */
  extractSkillsFromRole(role) {
    const skills = [];
    const text = `${role.requirements || ''} ${role.description || ''}`.toLowerCase();

    // Common skill patterns
    const skillPatterns = {
      programming: ['python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'php', 'go', 'rust', 'swift', 'kotlin'],
      web: ['react', 'vue', 'angular', 'node.js', 'express', 'django', 'flask', 'fastapi', 'spring', 'html', 'css', 'tailwind'],
      data: ['sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'spark'],
      cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd'],
      tools: ['git', 'linux', 'rest api', 'graphql', 'microservices', 'agile', 'scrum'],
    };

    // Extract skills from text
    Object.values(skillPatterns).flat().forEach(skill => {
      if (text.includes(skill.toLowerCase())) {
        skills.push(skill);
      }
    });

    return skills;
  },

  /**
   * Get matching skills between candidate and role
   * @param {Array} candidateSkills - Candidate skills
   * @param {Array} roleSkills - Role required skills
   * @returns {Array} Matching skills
   */
  getMatchingSkills(candidateSkills, roleSkills) {
    if (!candidateSkills || !roleSkills) return [];

    const normalizedCandidateSkills = candidateSkills.map(s => s.toLowerCase().trim());
    const normalizedRoleSkills = roleSkills.map(s => s.toLowerCase().trim());

    return candidateSkills.filter((skill, idx) =>
      normalizedRoleSkills.some(req => 
        normalizedCandidateSkills[idx].includes(req) || req.includes(normalizedCandidateSkills[idx])
      )
    );
  },

  /**
   * Get missing skills for a candidate
   * @param {Array} candidateSkills - Candidate skills
   * @param {Array} roleSkills - Role required skills
   * @returns {Array} Missing skills
   */
  getMissingSkills(candidateSkills, roleSkills) {
    if (!candidateSkills || !roleSkills) return roleSkills || [];

    const normalizedCandidateSkills = candidateSkills.map(s => s.toLowerCase().trim());
    
    return roleSkills.filter(req =>
      !normalizedCandidateSkills.some(skill => 
        skill.includes(req.toLowerCase()) || req.toLowerCase().includes(skill)
      )
    );
  },

  /**
   * Get match level label and color
   * @param {number} score - Match score (0-100)
   * @returns {Object} Label and color
   */
  getMatchLevel(score) {
    if (score >= 80) {
      return { label: 'Excellent Match', color: 'green' };
    } else if (score >= 60) {
      return { label: 'Good Match', color: 'blue' };
    } else if (score >= 40) {
      return { label: 'Fair Match', color: 'yellow' };
    } else if (score > 0) {
      return { label: 'Partial Match', color: 'orange' };
    } else {
      return { label: 'No Match', color: 'gray' };
    }
  },
};
