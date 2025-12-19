import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { BarChart3, TrendingUp, Users, Clock, Target, Download } from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { candidateService } from '../services/candidateService';
import toast from 'react-hot-toast';

export default function AnalyticsPage() {
  const [statistics, setStatistics] = useState(null);
  const [candidates, setCandidates] = useState([]);
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
      setCandidates(candidatesRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Hiring Funnel Data
  const funnelData = [
    { stage: 'Applied', count: statistics?.applied || 0, fill: '#3B82F6' },
    { stage: 'Shortlisted', count: statistics?.shortlisted || 0, fill: '#8B5CF6' },
    { stage: 'Interviewed', count: statistics?.interviewed || 0, fill: '#F59E0B' },
    { stage: 'Hired', count: statistics?.hired || 0, fill: '#10B981' },
  ];

  // Applications over time (last 7 days mock data)
  const timelineData = [
    { date: 'Mon', applications: 12 },
    { date: 'Tue', applications: 19 },
    { date: 'Wed', applications: 15 },
    { date: 'Thu', applications: 22 },
    { date: 'Fri', applications: 18 },
    { date: 'Sat', applications: 8 },
    { date: 'Sun', applications: 5 },
  ];

  // Top Skills
  const skillsCount = {};
  candidates.forEach(candidate => {
    candidate.skills?.forEach(skill => {
      skillsCount[skill] = (skillsCount[skill] || 0) + 1;
    });
  });
  const topSkills = Object.entries(skillsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // Status Distribution for Pie Chart
  const statusData = [
    { name: 'Applied', value: statistics?.applied || 0, color: '#3B82F6' },
    { name: 'Shortlisted', value: statistics?.shortlisted || 0, color: '#8B5CF6' },
    { name: 'Interviewed', value: statistics?.interviewed || 0, color: '#F59E0B' },
    { name: 'Hired', value: statistics?.hired || 0, color: '#10B981' },
    { name: 'Rejected', value: statistics?.rejected || 0, color: '#EF4444' },
  ];

  const exportReport = () => {
    toast.success('Report export feature coming soon!');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
            </div>
            <p className="text-gray-600">Track your recruitment metrics and performance</p>
          </div>
          <button onClick={exportReport} className="btn-primary flex items-center gap-2">
            <Download className="w-5 h-5" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{statistics?.total || 0}</h3>
            <p className="text-sm text-gray-600">Total Candidates</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{statistics?.shortlisted || 0}</h3>
            <p className="text-sm text-gray-600">Shortlisted</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{statistics?.hired || 0}</h3>
            <p className="text-sm text-gray-600">Hired</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {statistics?.total ? Math.round((statistics.hired / statistics.total) * 100) : 0}%
            </h3>
            <p className="text-sm text-gray-600">Conversion Rate</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Hiring Funnel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Hiring Funnel</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Applications Timeline & Top Skills */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Applications Over Time */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Applications This Week</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Skills */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Skills in Demand</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topSkills} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
