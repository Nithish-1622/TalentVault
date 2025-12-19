import { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, Eye, Users, CheckSquare,
  TrendingUp, Clock, CheckCircle, FileText, X, SlidersHorizontal,
  Award, GraduationCap, Languages, Briefcase, ExternalLink, Target
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import { candidateService } from '../services/candidateService';
import { jobRoleService } from '../services/jobRoleService';
import { jobMatcher } from '../utils/jobMatcher';
import toast from 'react-hot-toast';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [jobRoles, setJobRoles] = useState([]);
  
  // Advanced filters
  const [filters, setFilters] = useState({
    experienceMin: '',
    experienceMax: '',
    skills: [],
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [candidates, searchQuery, statusFilter, filters]);

  const fetchData = async () => {
    try {
      const [candidatesRes, statsRes, rolesRes] = await Promise.all([
        candidateService.getAllCandidates(),
        candidateService.getStatistics(),
        jobRoleService.getAllJobRoles(),
      ]);
      
      setCandidates(candidatesRes.data || []);
      setStatistics(statsRes.data || {});
      setJobRoles(rolesRes.data || []);
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
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.full_name?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.role_name?.toLowerCase().includes(query) ||
        c.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // Advanced filters
    if (filters.experienceMin) {
      filtered = filtered.filter(c => c.experience_years >= parseInt(filters.experienceMin));
    }
    if (filters.experienceMax) {
      filtered = filtered.filter(c => c.experience_years <= parseInt(filters.experienceMax));
    }

    setFilteredCandidates(filtered);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const handleSelectCandidate = (id) => {
    setSelectedCandidates(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedCandidates.length === 0) {
      toast.error('Please select candidates and an action');
      return;
    }

    try {
      if (bulkAction === 'export') {
        toast.success('Export feature coming soon!');
      } else {
        // Bulk status update
        await Promise.all(
          selectedCandidates.map(id =>
            candidateService.updateStatus(id, bulkAction)
          )
        );
        toast.success(`Updated ${selectedCandidates.length} candidates to ${bulkAction}`);
        setSelectedCandidates([]);
        setBulkAction('');
        fetchData();
      }
    } catch (error) {
      toast.error('Bulk action failed');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setFilters({
      experienceMin: '',
      experienceMax: '',
      skills: [],
      dateFrom: '',
      dateTo: '',
    });
  };

  if (loading && candidates.length === 0) {
    return <Loader />;
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Candidates</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">Manage and review candidate applications</p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <StatCard icon={Users} label="Total Candidates" value={statistics.total || 0} color="blue" />
            <StatCard icon={Clock} label="Applied" value={statistics.applied || 0} color="gray" />
            <StatCard icon={TrendingUp} label="Shortlisted" value={statistics.shortlisted || 0} color="purple" />
            <StatCard icon={FileText} label="Interviewed" value={statistics.interviewed || 0} color="yellow" />
            <StatCard icon={CheckCircle} label="Hired" value={statistics.hired || 0} color="green" />
          </div>
        )}

        {/* Search and Filters */}
        <div className="card mb-6">
          <div className="flex flex-col gap-4">
            {/* Main Search Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-10 text-sm sm:text-base"
                    placeholder="Search by name, email, role..."
                  />
                </div>
              </div>

              <div className="w-full sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field text-sm sm:text-base"
                >
                  <option value="">All Statuses</option>
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interviewed">Interviewed</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Hired">Hired</option>
                </select>
              </div>

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`btn-secondary flex items-center justify-center gap-2 text-sm sm:text-base ${showAdvancedFilters ? 'bg-primary-50 text-primary-600' : ''}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Advanced</span>
              </button>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="pt-4 border-t border-gray-200 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Experience (years)</label>
                  <input
                    type="number"
                    value={filters.experienceMin}
                    onChange={(e) => setFilters({...filters, experienceMin: e.target.value})}
                    className="input-field text-sm sm:text-base"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Experience (years)</label>
                  <input
                    type="number"
                    value={filters.experienceMax}
                    onChange={(e) => setFilters({...filters, experienceMax: e.target.value})}
                    className="input-field text-sm sm:text-base"
                    placeholder="20"
                    min="0"
                  />
                </div>
                <div className="flex items-end sm:col-span-2 md:col-span-1">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            {/* Bulk Actions */}
            {selectedCandidates.length > 0 && (
              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <span className="text-sm font-medium text-gray-700">
                  {selectedCandidates.length} selected
                </span>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="input-field flex-1 text-sm sm:text-base sm:max-w-xs"
                >
                  <option value="">Select Action</option>
                  <option value="Shortlisted">Mark as Shortlisted</option>
                  <option value="Interviewed">Mark as Interviewed</option>
                  <option value="Rejected">Mark as Rejected</option>
                  <option value="Hired">Mark as Hired</option>
                  <option value="export">Export Selected</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                    className="btn-primary flex-1 sm:flex-none text-sm sm:text-base"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setSelectedCandidates([])}
                    className="btn-secondary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Candidates Table - Desktop */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => handleSelectCandidate(candidate.id)}
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold">
                          {candidate.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{candidate.full_name}</p>
                          <p className="text-sm text-gray-600">{candidate.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{candidate.role_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {candidate.skills?.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills?.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{candidate.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={candidate.status} />
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setShowDetailModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCandidates.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-600">
                {searchQuery || statusFilter ? 'Try adjusting your search or filters' : 'No candidates yet'}
              </p>
            </div>
          )}
        </div>

        {/* Candidates Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {filteredCandidates.map((candidate) => (
            <div key={candidate.id} className="card">
              <div className="flex items-start gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={selectedCandidates.includes(candidate.id)}
                  onChange={() => handleSelectCandidate(candidate.id)}
                  className="w-5 h-5 text-primary-600 rounded mt-1"
                />
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                  {candidate.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{candidate.full_name}</p>
                  <p className="text-sm text-gray-600 truncate">{candidate.email}</p>
                  <p className="text-sm text-gray-700 mt-1">{candidate.role_name}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-600 mb-2">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills?.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                  {candidate.skills?.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{candidate.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <StatusBadge status={candidate.status} />
                <button 
                  onClick={() => {
                    setSelectedCandidate(candidate);
                    setShowDetailModal(true);
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          ))}

          {filteredCandidates.length === 0 && (
            <div className="card text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-medium text-gray-900 mb-1">No candidates found</h3>
              <p className="text-sm text-gray-600">
                {searchQuery || statusFilter ? 'Try adjusting your search or filters' : 'No candidates yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {showDetailModal && selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          jobRoles={jobRoles}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedCandidate(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}

// Candidate Detail Modal Component
function CandidateDetailModal({ candidate, onClose, jobRoles = [] }) {
  // Calculate job role matches
  const roleMatches = jobMatcher.findBestMatches(candidate, jobRoles);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">{candidate.full_name}</h2>
            <div className="flex items-center gap-4 text-primary-50">
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {candidate.role_name || 'No role specified'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {candidate.experience_years || 0} years exp
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Left Column - Contact & Resume */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-600" />
                  Contact Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-gray-700">
                    <span className="font-medium">Email:</span>
                    <a href={`mailto:${candidate.email}`} className="text-primary-600 hover:underline">
                      {candidate.email}
                    </a>
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <span className="font-medium">Status:</span>
                    <StatusBadge status={candidate.status} />
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <span className="font-medium">Applied:</span>
                    {new Date(candidate.applied_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Resume Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  Resume
                </h3>
                {candidate.resume_url ? (
                  <div className="space-y-3">
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 aspect-[8.5/11] overflow-hidden">
                      {candidate.resume_filename?.endsWith('.pdf') ? (
                        <iframe
                          src={candidate.resume_url}
                          className="w-full h-full"
                          title="Resume Preview"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <FileText className="w-16 h-16 mb-2" />
                          <p className="text-sm">Preview not available for this format</p>
                          <p className="text-xs text-gray-400 mt-1">{candidate.resume_filename}</p>
                        </div>
                      )}
                    </div>
                    <a
                      href={candidate.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Full Resume
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No resume available</p>
                )}
              </div>

              {/* Languages */}
              {candidate.languages && candidate.languages.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Languages className="w-5 h-5 text-primary-600" />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Skills, Education, Certifications */}
            <div className="space-y-6">
              {/* Skills */}
              {candidate.skills && candidate.skills.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                    Skills ({candidate.skills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {candidate.education && candidate.education.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                    Education
                  </h3>
                  <div className="space-y-3">
                    {candidate.education.map((edu, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="font-medium text-gray-900">{edu.degree}</p>
                        {edu.institution && (
                          <p className="text-sm text-gray-600 mt-1">{edu.institution}</p>
                        )}
                        {edu.year && (
                          <p className="text-xs text-gray-500 mt-1">{edu.year}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {candidate.certifications && candidate.certifications.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary-600" />
                    Certifications
                  </h3>
                  <div className="space-y-2">
                    {candidate.certifications.map((cert, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="font-medium text-gray-900 text-sm">{cert.name}</p>
                        {cert.year && (
                          <p className="text-xs text-gray-500 mt-1">{cert.year}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Summary */}
              {candidate.summary && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    AI Summary
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{candidate.summary}</p>
                </div>
              )}

              {/* Job Role Matching */}
              {roleMatches && roleMatches.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Best Role Matches
                  </h3>
                  <div className="space-y-3">
                    {roleMatches.map((match, idx) => {
                      const matchLevel = jobMatcher.getMatchLevel(match.matchScore);
                      const colorClasses = {
                        green: 'bg-green-500',
                        blue: 'bg-blue-500',
                        yellow: 'bg-yellow-500',
                        orange: 'bg-orange-500',
                        gray: 'bg-gray-400',
                      };

                      return (
                        <div key={idx} className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-900 text-sm">{match.role_name}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${colorClasses[matchLevel.color]}`}>
                              {match.matchScore}%
                            </span>
                          </div>
                          
                          {/* Match Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className={`h-2 rounded-full transition-all ${colorClasses[matchLevel.color]}`}
                              style={{ width: `${match.matchScore}%` }}
                            />
                          </div>

                          <p className="text-xs text-gray-600 mb-2">{matchLevel.label}</p>

                          {/* Matching Skills */}
                          {match.matchingSkills && match.matchingSkills.length > 0 && (
                            <div className="mb-2">
                              <p className="text-xs font-medium text-gray-700 mb-1">Matching Skills:</p>
                              <div className="flex flex-wrap gap-1">
                                {match.matchingSkills.slice(0, 5).map((skill, sidx) => (
                                  <span key={sidx} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                                    {skill}
                                  </span>
                                ))}
                                {match.matchingSkills.length > 5 && (
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                    +{match.matchingSkills.length - 5} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Missing Skills */}
                          {match.missingSkills && match.missingSkills.length > 0 && match.missingSkills.length <= 5 && (
                            <div>
                              <p className="text-xs font-medium text-gray-700 mb-1">Skills Gap:</p>
                              <div className="flex flex-wrap gap-1">
                                {match.missingSkills.slice(0, 5).map((skill, sidx) => (
                                  <span key={sidx} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
