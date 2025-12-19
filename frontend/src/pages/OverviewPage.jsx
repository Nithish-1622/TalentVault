import { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, Clock, CheckCircle, FileText,
  ArrowUpRight, ArrowDownRight, Sparkles, Calendar
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { candidateService } from '../services/candidateService';
import toast from 'react-hot-toast';

export default function OverviewPage() {
  const [statistics, setStatistics] = useState(null);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, candidatesRes] = await Promise.all([
        candidateService.getStatistics(),
        candidateService.getAllCandidates(),
      ]);
      
      setStatistics(statsRes.data || {});
      // Get 5 most recent candidates
      const recent = (candidatesRes.data || [])
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentCandidates(recent);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Candidates',
      value: statistics?.total || 0,
      icon: Users,
      color: 'blue',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Applied',
      value: statistics?.applied || 0,
      icon: Clock,
      color: 'gray',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Shortlisted',
      value: statistics?.shortlisted || 0,
      icon: TrendingUp,
      color: 'purple',
      trend: '+15%',
      trendUp: true,
    },
    {
      title: 'Interviewed',
      value: statistics?.interviewed || 0,
      icon: FileText,
      color: 'yellow',
      trend: '-3%',
      trendUp: false,
    },
    {
      title: 'Hired',
      value: statistics?.hired || 0,
      icon: CheckCircle,
      color: 'green',
      trend: '+5%',
      trendUp: true,
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    gray: 'bg-gray-50 text-gray-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your recruitment.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[stat.color]}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{stat.trend}</span>
                  {stat.trendUp ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Candidates */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : recentCandidates.length > 0 ? (
              <div className="space-y-4">
                {recentCandidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold">
                        {candidate.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{candidate.full_name}</h3>
                        <p className="text-sm text-gray-600">{candidate.role_name}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${candidate.status === 'Applied' ? 'bg-blue-100 text-blue-700' : ''}
                      ${candidate.status === 'Shortlisted' ? 'bg-purple-100 text-purple-700' : ''}
                      ${candidate.status === 'Interviewed' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${candidate.status === 'Hired' ? 'bg-green-100 text-green-700' : ''}
                      ${candidate.status === 'Rejected' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                      {candidate.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No recent applications</div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl shadow-sm border border-primary-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-white hover:bg-gray-50 text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 group">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">AI Search</p>
                  <p className="text-xs text-gray-600">Find best matches</p>
                </div>
              </button>
              
              <button className="w-full bg-white hover:bg-gray-50 text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 group">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">View All Candidates</p>
                  <p className="text-xs text-gray-600">Manage applications</p>
                </div>
              </button>

              <button className="w-full bg-white hover:bg-gray-50 text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 group">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">View Analytics</p>
                  <p className="text-xs text-gray-600">Track performance</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
