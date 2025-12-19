import supabaseAdmin from '../config/supabase.js';

export const jobRoleService = {
  /**
   * Get all job roles
   */
  async getAllJobRoles() {
    const { data, error } = await supabaseAdmin
      .from('job_roles')
      .select('*')
      .order('role_name', { ascending: true });

    if (error) {
      throw new Error('Failed to fetch job roles');
    }

    return data;
  },

  /**
   * Get job role by ID
   */
  async getJobRoleById(roleId) {
    const { data, error } = await supabaseAdmin
      .from('job_roles')
      .select('*')
      .eq('id', roleId)
      .single();

    if (error || !data) {
      throw new Error('Job role not found');
    }

    return data;
  },

  /**
   * Create new job role
   */
  async createJobRole(roleName, category) {
    const { data, error } = await supabaseAdmin
      .from('job_roles')
      .insert({
        role_name: roleName,
        category: category || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Job role already exists');
      }
      throw new Error('Failed to create job role');
    }

    return data;
  },

  /**
   * Get job role categories
   */
  async getCategories() {
    const { data, error } = await supabaseAdmin
      .from('job_roles')
      .select('category')
      .not('category', 'is', null);

    if (error) {
      throw new Error('Failed to fetch categories');
    }

    // Get unique categories
    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  },
};
