import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Briefcase, CheckCircle, Mail, Phone, User, FileText } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { candidateService } from '../services/candidateService';
import { jobRoleService } from '../services/jobRoleService';
import toast from 'react-hot-toast';

export default function ApplyPage() {
  const navigate = useNavigate();
  const [jobRoles, setJobRoles] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    jobRoleId: '',
    jobRoleText: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchJobRoles();
  }, []);

  const fetchJobRoles = async () => {
    try {
      const response = await jobRoleService.getAllJobRoles();
      setJobRoles(response.data || []);
    } catch (error) {
      console.error('Failed to fetch job roles:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Update jobRoleText when jobRoleId changes
    if (name === 'jobRoleId') {
      const selectedRole = jobRoles.find(role => role.id === value);
      setFormData(prev => ({
        ...prev,
        jobRoleText: selectedRole?.role_name || '',
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a PDF or DOCX file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resumeFile) {
      toast.error('Please upload your resume');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('fullName', formData.fullName);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('jobRoleId', formData.jobRoleId);
      submitData.append('jobRoleText', formData.jobRoleText);
      submitData.append('resume', resumeFile);

      await candidateService.submitApplication(submitData);
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-lg">
              <CheckCircle className="w-11 h-11 sm:w-14 sm:h-14 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully! 🎉
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-3">
              Thank you for applying to TalentVault
            </p>
            <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-lg mx-auto">
              Our AI is already analyzing your resume. Our recruitment team will review your application and reach out to you within 2-3 business days.
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary px-8 py-3"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Left Side - Hero Section with Animation */}
          <div className="hidden lg:flex order-2 lg:order-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col w-full sticky top-8">
              {/* Lottie Animation */}
              <div className="w-full flex items-center justify-center mb-6">
                <div className="w-full h-[300px] max-w-2xl">
                  <DotLottieReact
                    src="https://lottie.host/8501101f-07b2-47a9-9819-5d441f00dbc8/lQinnZduf2.lottie"
                    loop
                    autoplay
                  />
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Join Our Talent Pool
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Take the first step towards your dream career. Our AI-powered system will match you with the perfect opportunities.
              </p>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">AI-Powered Matching</h3>
                    <p className="text-xs text-gray-600">Our AI analyzes your resume to find the best job matches</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Quick & Easy</h3>
                    <p className="text-xs text-gray-600">Just 5 fields and your resume - we handle the rest</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Fast Response</h3>
                    <p className="text-xs text-gray-600">Get feedback within 2-3 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Application Form */}
          <div className="order-1 lg:order-2 w-full">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mb-3 shadow-lg">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Apply Now</h1>
              <p className="text-sm sm:text-base text-gray-600">Join our talent community</p>
            </div>

            <div className="card w-full">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Application Form</h2>
                <p className="text-xs sm:text-sm text-gray-600">Fill in your details below</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="john.doe@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="+1-555-0123"
                      required
                    />
                  </div>
                </div>

                {/* Job Role */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Job Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <select
                      name="jobRoleId"
                      value={formData.jobRoleId}
                      onChange={handleChange}
                      className="input-field pl-10 appearance-none"
                      required
                    >
                      <option value="">Select your role</option>
                      {jobRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.role_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Resume <span className="text-red-500">*</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                    resumeFile 
                      ? 'border-primary-400 bg-primary-50' 
                      : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                  }`}>
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                      required
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer block">
                      <div className={`w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center ${
                        resumeFile ? 'bg-primary-100' : 'bg-gray-100'
                      }`}>
                        {resumeFile ? (
                          <FileText className="w-7 h-7 text-primary-600" />
                        ) : (
                          <Upload className="w-7 h-7 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        {resumeFile ? resumeFile.name : 'Click to upload your resume'}
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF or DOCX format • Maximum 5MB
                      </p>
                      {resumeFile && (
                        <p className="text-xs text-primary-600 mt-2 font-medium">
                          ✓ File ready for upload
                        </p>
                      )}
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 sm:py-4 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting Application...
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <p className="text-xs sm:text-sm text-gray-600">
                  Recruiter?{' '}
                  <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                    Login here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
