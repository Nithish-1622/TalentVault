import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Briefcase } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Lottie Animation */}
          <div className="hidden lg:flex flex-col items-center justify-center bg-white rounded-3xl shadow-xl p-12">
            <div className="w-full h-[400px] max-w-2xl">
              <DotLottieReact
                src="https://lottie.host/e79a1a86-df0b-41ea-aa58-8d46a7d3a65d/zYRy4n5EEI.lottie"
                loop
                autoplay
              />
            </div>
            <div className="text-center mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to TalentVault
              </h2>
              <p className="text-gray-600 max-w-md">
                Streamline your recruitment process with AI-powered resume intelligence and smart candidate management.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full">
            {/* Logo - Mobile */}
            <div className="text-center mb-8 lg:hidden">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mb-4 shadow-lg">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">TalentVault</h1>
              <p className="text-gray-600">Recruiter Portal</p>
            </div>

            {/* Login Card */}
            <div className="card">
              {/* Logo - Desktop */}
              <div className="hidden lg:flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-md">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">TalentVault</h1>
                  <p className="text-sm text-gray-600">Recruiter Portal</p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sign In</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="recruiter@company.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 text-base"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                    Register here
                  </Link>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-center text-sm text-gray-600">
                  Applicant?{' '}
                  <Link to="/apply" className="text-primary-600 hover:text-primary-700 font-medium">
                    Submit your resume
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
