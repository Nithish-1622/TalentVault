import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users2, FileCheck, Briefcase,
  Sparkles, BarChart3, Settings, LogOut, Menu, X,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';

export default function Sidebar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navigationItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-50',
    },
    {
      name: 'Candidates',
      path: '/dashboard/candidates',
      icon: Users2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverBg: 'hover:bg-purple-50',
    },
    {
      name: 'Applications',
      path: '/dashboard/applications',
      icon: FileCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverBg: 'hover:bg-green-50',
    },
    {
      name: 'Job Roles',
      path: '/dashboard/job-roles',
      icon: Briefcase,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverBg: 'hover:bg-orange-50',
    },
    {
      name: 'AI Search',
      path: '/dashboard/ai-search',
      icon: Sparkles,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      hoverBg: 'hover:bg-pink-50',
    },
    {
      name: 'Analytics',
      path: '/dashboard/analytics',
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      hoverBg: 'hover:bg-indigo-50',
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white border-r border-gray-200 shadow-lg
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                                  <img src={logo} alt="Logo" />
               
            
              </div>
            )}
            
            {/* Collapse Toggle - Desktop Only */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl transition-all group
                  ${isActive 
                    ? `${item.bgColor} ${item.color} shadow-sm` 
                    : `text-gray-600 ${item.hoverBg}`
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon 
                      className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110
                        ${isActive ? item.color : 'text-gray-500'}
                      `} 
                    />
                    {!isCollapsed && (
                      <span className="font-medium text-sm">{item.name}</span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 space-y-2">
            <NavLink
              to="/dashboard/settings"
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all group
                ${isActive 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-100'
                }
                ${isCollapsed ? 'justify-center' : ''}
                `
              }
            >
              <Settings className="w-5 h-5 flex-shrink-0 transition-transform group-hover:rotate-90" />
              {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
            </NavLink>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                text-red-600 hover:bg-red-50 group
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <LogOut className="w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1" />
              {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Spacer */}
      <div className={`hidden lg:block transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`} />
    </>
  );
}
