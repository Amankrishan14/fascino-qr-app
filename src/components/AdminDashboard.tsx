import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Check, X, Eye, ArrowLeft } from 'lucide-react';

interface Profile {
  id: string;
  handle: string;
  email: string;
  status: 'pending' | 'approved' | 'revoked';
  headline: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [profiles, setProfiles] = useState<Profile[]>([
    {
      id: '1',
      handle: 'john-doe',
      email: 'john@example.com',
      status: 'pending',
      headline: 'Full Stack Developer',
      createdAt: '2025-01-02'
    },
    {
      id: '2',
      handle: 'jane-smith',
      email: 'jane@example.com',
      status: 'approved',
      headline: 'UI/UX Designer',
      createdAt: '2025-01-01'
    },
    {
      id: '3',
      handle: 'mike-wilson',
      email: 'mike@example.com',
      status: 'revoked',
      headline: 'Data Scientist',
      createdAt: '2024-12-30'
    }
  ]);

  const updateProfileStatus = (id: string, status: 'approved' | 'revoked') => {
    setProfiles(profiles.map(profile => 
      profile.id === id ? { ...profile, status } : profile
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'revoked': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Shield className="w-6 h-6 text-red-500 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {profiles.length}
            </div>
            <div className="text-gray-600">Total Profiles</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {profiles.filter(p => p.status === 'approved').length}
            </div>
            <div className="text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {profiles.filter(p => p.status === 'pending').length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {profiles.filter(p => p.status === 'revoked').length}
            </div>
            <div className="text-gray-600">Revoked</div>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">User Profiles</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">User</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Created</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">@{profile.handle}</div>
                        <div className="text-sm text-gray-500">{profile.email}</div>
                        <div className="text-sm text-gray-500">{profile.headline}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(profile.status)}`}>
                        {profile.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {profile.createdAt}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/p/${profile.handle}`}
                          className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        
                        {profile.status !== 'approved' && (
                          <button
                            onClick={() => updateProfileStatus(profile.id, 'approved')}
                            className="text-green-600 hover:text-green-700 p-1 rounded transition-colors"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        
                        {profile.status !== 'revoked' && (
                          <button
                            onClick={() => updateProfileStatus(profile.id, 'revoked')}
                            className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                            title="Revoke"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;