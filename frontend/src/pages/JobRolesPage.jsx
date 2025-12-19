import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Briefcase, Plus, Edit2, Trash2, X } from 'lucide-react';
import { jobRoleService } from '../services/jobRoleService';
import toast from 'react-hot-toast';

export default function JobRolesPage() {
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    role_name: '',
    description: '',
  });

  useEffect(() => {
    fetchJobRoles();
  }, []);

  const fetchJobRoles = async () => {
    try {
      const response = await jobRoleService.getAllJobRoles();
      setJobRoles(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch job roles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingRole) {
        await jobRoleService.updateJobRole(editingRole.id, formData);
        toast.success('Job role updated successfully');
      } else {
        await jobRoleService.createJobRole(formData);
        toast.success('Job role created successfully');
      }
      
      setShowModal(false);
      setFormData({ role_name: '', description: '' });
      setEditingRole(null);
      fetchJobRoles();
    } catch (error) {
      toast.error(editingRole ? 'Failed to update job role' : 'Failed to create job role');
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      role_name: role.role_name,
      description: role.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job role?')) return;
    
    try {
      await jobRoleService.deleteJobRole(id);
      toast.success('Job role deleted successfully');
      fetchJobRoles();
    } catch (error) {
      toast.error('Failed to delete job role');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRole(null);
    setFormData({ role_name: '', description: '' });
  };

  // Get candidate count for each role (if available in your data structure)
  const getRoleCandidateCount = (roleName) => {
    // This would need to be implemented based on your actual data structure
    return 0; // Placeholder
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              
              <h1 className="text-3xl font-bold text-gray-900">Job Roles</h1>
            </div>
            <p className="text-gray-600">Manage your open positions and requirements</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Role</span>
          </button>
        </div>

        {/* Job Roles Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading job roles...</p>
          </div>
        ) : jobRoles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobRoles.map((role) => (
              <div
                key={role.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{role.role_name}</h3>
                    {role.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">{role.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(role)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Active Candidates</span>
                    <span className="text-sm font-semibold text-primary-600">
                      {getRoleCandidateCount(role.role_name)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No job roles yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first job role</p>
            <button 
              onClick={() => setShowModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Job Role</span>
            </button>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingRole ? 'Edit Job Role' : 'Add New Job Role'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.role_name}
                    onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Senior Frontend Developer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field resize-none"
                    rows={4}
                    placeholder="Brief description of the role and requirements..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary py-3"
                  >
                    {editingRole ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
