import { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, Eye, Users, 
  TrendingUp, Clock, CheckCircle, FileText 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import { candidateService } from '../services/candidateService';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchMode, setSearchMode] = useState('filter'); // 'filter' or 'semantic'

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [candidates, searchQuery, statusFilter]);

  const fetchData = async () => {
    try {
      const [candidatesRes, statsRes] = await Promise.all([
        candidateService.getAllCandidates(),
        candidateService.getStatistics(),
      ]);
      
      setCandidates(candidatesRes.data || []);
      setStatistics(statsRes.data || {});
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...candidates];

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Search filter
    if (searchQuery && searchMode === 'filter') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.full_name?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.role_name?.toLowerCase().includes(query) ||
        c.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    }

    setFilteredCandidates(filtered);
  };

  const handleSemanticSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const response = await candidateService.semanticSearch(searchQuery);
      setFilteredCandidates(response.data || []);
      setSearchMode('semantic');
      toast.success(`Found ${response.data?.length || 0} relevant candidates`);
    } catch (error) {
      toast.error('Semantic search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      await candidateService.updateStatus(candidateId, newStatus);
      toast.success('Status updated successfully');
      fetchData();
      if (selectedCandidate?.id === candidateId) {
        setSelectedCandidate({ ...selectedCandidate, status: newStatus });
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const openCandidateModal = (candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  if (loading && candidates.length === 0) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <StatCard
              icon={Users}
              label="Total Candidates"
              value={statistics.total || 0}
              color="blue"
            />
            <StatCard
              icon={Clock}
              label="Applied"
              value={statistics.applied || 0}
              color="gray"
            />
            <StatCard
              icon={TrendingUp}
              label="Shortlisted"
              value={statistics.shortlisted || 0}
              color="purple"
            />
            <StatCard
              icon={FileText}
              label="Interviewed"
              value={statistics.interviewed || 0}
              color="yellow"
            />
            <StatCard
              icon={CheckCircle}
              label="Hired"
              value={statistics.hired || 0}
              color="green"
            />
          </div>
        )}

        {/* Search and Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchMode('filter');
                  }}
                  className="input-field pl-10"
                  placeholder="Search by name, email, role, or skills..."
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interviewed">Interviewed</option>
                <option value="Rejected">Rejected</option>
                <option value="Hired">Hired</option>
              </select>
            </div>

            {/* AI Search Button */}
            <button
              onClick={handleSemanticSearch}
              className="btn-primary flex items-center space-x-2 whitespace-nowrap"
              disabled={!searchQuery.trim()}
            >
              <Search className="w-4 h-4" />
              <span>AI Search</span>
            </button>
          </div>

          {searchMode === 'semantic' && (
            <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-lg flex items-center justify-between">
              <p className="text-sm text-primary-700">
                Showing AI-powered semantic search results for: "<strong>{searchQuery}</strong>"
              </p>
              <button
                onClick={() => {
                  setSearchMode('filter');
                  setSearchQuery('');
                  applyFilters();
                }}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onView={() => openCandidateModal(candidate)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search or filters' : 'No candidates yet'}
            </p>
          </div>
        )}
      </div>

      {/* Candidate Detail Modal */}
      {showModal && selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setShowModal(false)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

// Statistics Card Component
function StatCard({ icon: Icon, label, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    gray: 'bg-gray-50 text-gray-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// Candidate Card Component
function CandidateCard({ candidate, onView, onStatusChange }) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {candidate.full_name}
          </h3>
          <p className="text-sm text-gray-600">{candidate.role_name || candidate.job_role_text}</p>
        </div>
        <StatusBadge status={candidate.status} />
      </div>

      {/* Contact Info */}
      <div className="space-y-1 mb-4 text-sm text-gray-600">
        <p>📧 {candidate.email}</p>
        <p>📱 {candidate.phone}</p>
      </div>

      {/* AI Summary */}
      {candidate.summary && (
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {candidate.summary}
        </p>
      )}

      {/* Skills */}
      {candidate.skills && candidate.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {candidate.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {skill}
              </span>
            ))}
            {candidate.skills.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                +{candidate.skills.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      {candidate.experience_years > 0 && (
        <p className="text-sm text-gray-600 mb-4">
          💼 {candidate.experience_years}+ years experience
        </p>
      )}

      {/* Relevance Score (for semantic search) */}
      {candidate.relevance_score && (
        <div className="mb-4 p-2 bg-primary-50 rounded">
          <p className="text-xs text-primary-700">
            Match Score: {(candidate.relevance_score * 100).toFixed(0)}%
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex-1 btn-primary text-sm flex items-center justify-center space-x-1"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>
        
        {candidate.resume_url && (
          <a
            href={candidate.resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm p-2"
            title="Download Resume"
          >
            <Download className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

// Candidate Detail Modal Component
function CandidateModal({ candidate, onClose, onStatusChange }) {
  const [newStatus, setNewStatus] = useState(candidate.status);

  const handleUpdateStatus = () => {
    if (newStatus !== candidate.status) {
      onStatusChange(candidate.id, newStatus);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {candidate.full_name}
              </h2>
              <p className="text-gray-600">{candidate.role_name || candidate.job_role_text}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Update */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Status
            </label>
            <div className="flex gap-2">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="input-field flex-1"
              >
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interviewed">Interviewed</option>
                <option value="Rejected">Rejected</option>
                <option value="Hired">Hired</option>
              </select>
              <button
                onClick={handleUpdateStatus}
                className="btn-primary"
                disabled={newStatus === candidate.status}
              >
                Update
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {candidate.email}</p>
              <p><strong>Phone:</strong> {candidate.phone}</p>
              <p><strong>Applied:</strong> {new Date(candidate.applied_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* AI Summary */}
          {candidate.summary && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Summary</h3>
              <p className="text-gray-700">{candidate.summary}</p>
            </div>
          )}

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {candidate.education && candidate.education.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
              <div className="space-y-3">
                {candidate.education.map((edu, idx) => (
                  <div key={idx} className="border-l-4 border-primary-500 pl-4">
                    <p className="font-medium text-gray-900">{edu.degree}</p>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    {edu.year && <p className="text-sm text-gray-500">{edu.year}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {candidate.experience_years > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Experience</h3>
              <p className="text-gray-700">{candidate.experience_years}+ years of professional experience</p>
            </div>
          )}

          {/* Languages */}
          {candidate.languages && candidate.languages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages</h3>
              <p className="text-gray-700">{candidate.languages.join(', ')}</p>
            </div>
          )}

          {/* Resume Download */}
          {candidate.resume_url && (
            <div>
              <a
                href={candidate.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center justify-center space-x-2 w-full"
              >
                <Download className="w-5 h-5" />
                <span>Download Resume</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
