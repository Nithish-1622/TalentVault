import DashboardLayout from '../components/DashboardLayout';
import { FileCheck, Filter } from 'lucide-react';

export default function ApplicationsPage() {
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Applications</h1>
          </div>
          <p className="text-gray-600">Manage and track all candidate applications</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <p className="text-center text-gray-500">Applications management coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
