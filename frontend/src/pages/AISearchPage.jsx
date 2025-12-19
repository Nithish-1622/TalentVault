import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Sparkles, Search, Loader2, Eye } from 'lucide-react';
import { candidateService } from '../services/candidateService';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

export default function AISearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await candidateService.semanticSearch(searchQuery);
      setResults(response.data || []);
      toast.success(`Found ${response.data?.length || 0} relevant candidates`);
    } catch (error) {
      toast.error('AI search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const exampleQueries = [
    "Find candidates with 5+ years of React experience",
    "Show me Python developers who know AWS",
    "Senior full-stack developers with team leadership experience",
    "Data scientists with machine learning expertise",
    "Frontend developers who know TypeScript and Next.js"
  ];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">AI-Powered Search</h1>
            <p className="text-gray-600 text-lg">Find the perfect candidates using natural language queries</p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <div className="relative">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-pink-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  placeholder="Describe the candidate you're looking for..."
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="w-full mt-4 btn-primary py-4 text-lg font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Searching with AI...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Search Candidates</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Example Queries */}
          {!hasSearched && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Try these example queries:
              </h3>
              <div className="space-y-2">
                {exampleQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(query)}
                    className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-xl transition-colors text-sm text-gray-700 hover:text-primary-600"
                  >
                    "{query}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {hasSearched && !loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {results.length} {results.length === 1 ? 'Result' : 'Results'} Found
                </h2>
                {results.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setResults([]);
                      setHasSearched(false);
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    New Search
                  </button>
                )}
              </div>

              {results.length > 0 ? (
                <div className="grid gap-4">
                  {results.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {candidate.full_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{candidate.full_name}</h3>
                            <p className="text-gray-600">{candidate.role_name}</p>
                          </div>
                        </div>
                        <StatusBadge status={candidate.status} />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-gray-900">{candidate.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-gray-900">{candidate.phone}</p>
                        </div>
                      </div>

                      {candidate.skills && candidate.skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-2">Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.slice(0, 8).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {candidate.skills.length > 8 && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                +{candidate.skills.length - 8} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {candidate.relevance_score && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-500">AI Match Score</span>
                            <span className="text-sm font-semibold text-primary-600">
                              {Math.round(candidate.relevance_score * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all"
                              style={{ width: `${candidate.relevance_score * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <button className="w-full btn-primary flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>View Full Profile</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
                  <p className="text-gray-600">Try adjusting your search query or use different keywords</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
