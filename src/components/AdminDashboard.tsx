import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Check, X, Eye, ArrowLeft, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ProfileWithUser {
  id: string;
  handle: string;
  headline: string | null;
  is_approved: boolean;
  created_at: string;
  user: {
    email: string;
  } | null;
}

const AdminDashboard = () => {
  const [profiles, setProfiles] = useState<ProfileWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          handle,
          headline,
          is_approved,
          created_at,
          user:user_id (
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProfiles(data || []);
    } catch (err: any) {
      console.error('Error fetching profiles:', err);
      setError('Failed to load profiles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const updateProfileStatus = async (id: string, is_approved: boolean) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('profiles')
        .update({ is_approved, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setProfiles(profiles.map(profile => 
        profile.id === id ? { ...profile, is_approved } : profile
      ));
    } catch (err: any) {
      console.error('Error updating profile status:', err);
      setError('Failed to update profile status. Please try again.');
    }
  };

  const getStatusColor = (is_approved: boolean) => {
    return is_approved 
      ? 'text-green-600 bg-green-50' 
      : 'text-yellow-600 bg-yellow-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Shield className="w-6 h-6 text-red-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button 
              onClick={fetchProfiles}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 mr-1 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {profiles.length}
            </div>
            <div className="text-gray-600">Total Profiles</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {profiles.filter(p => p.is_approved).length}
            </div>
            <div className="text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {profiles.filter(p => !p.is_approved).length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">User Profiles</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : profiles.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No profiles found
            </div>
          ) : (
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
                          <div className="text-sm text-gray-500">{profile.user?.email || 'No email'}</div>
                          <div className="text-sm text-gray-500">{profile.headline || 'No headline'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(profile.is_approved)}`}>
                          {profile.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(profile.created_at).toLocaleDateString()}
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
                          
                          {!profile.is_approved && (
                            <button
                              onClick={() => updateProfileStatus(profile.id, true)}
                              className="text-green-600 hover:text-green-700 p-1 rounded transition-colors"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          
                          {profile.is_approved && (
                            <button
                              onClick={() => updateProfileStatus(profile.id, false)}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;