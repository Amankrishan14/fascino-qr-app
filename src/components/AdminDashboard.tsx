import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Check, X, Eye, ArrowLeft, RefreshCw, Camera, Upload, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ProfileWithUser {
  id: string;
  handle: string;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
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
  const [selectedProfile, setSelectedProfile] = useState<ProfileWithUser | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [uploading, setUploading] = useState(false);
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
          bio,
          avatar_url,
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

  const handleProfilePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedProfile || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    setUploading(true);
    
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `admin-uploads/${selectedProfile.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading file:', error);
        alert(`Failed to upload photo: ${error.message}`);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProfile.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        alert('Failed to update profile photo.');
        return;
      }

      // Update local state
      setProfiles(profiles.map(profile => 
        profile.id === selectedProfile.id 
          ? { ...profile, avatar_url: publicUrl }
          : profile
      ));

      setSelectedProfile({ ...selectedProfile, avatar_url: publicUrl });
      alert('Profile photo updated successfully!');
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
      // Clear the file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const removeProfilePhoto = async () => {
    if (!selectedProfile) return;

    try {
      // Update profile to remove avatar URL
      const { error } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProfile.id);

      if (error) {
        console.error('Error removing profile photo:', error);
        alert('Failed to remove profile photo.');
        return;
      }

      // Update local state
      setProfiles(profiles.map(profile => 
        profile.id === selectedProfile.id 
          ? { ...profile, avatar_url: null }
          : profile
      ));

      setSelectedProfile({ ...selectedProfile, avatar_url: null });
      alert('Profile photo removed successfully!');
      
    } catch (error) {
      console.error('Error removing photo:', error);
      alert('Failed to remove photo. Please try again.');
    }
  };

  const openProfileModal = (profile: ProfileWithUser) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
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
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Profile</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Created</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {profile.avatar_url ? (
                              <img
                                src={profile.avatar_url}
                                alt={profile.handle}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 font-medium text-lg">
                                  {profile.handle.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">@{profile.handle}</div>
                            <div className="text-sm text-gray-500">{profile.user?.email || 'No email'}</div>
                            <div className="text-sm text-gray-500">{profile.headline || 'No headline'}</div>
                          </div>
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
                          <button
                            onClick={() => openProfileModal(profile)}
                            className="text-purple-600 hover:text-purple-700 p-1 rounded transition-colors"
                            title="Edit Profile Photo"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                          
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

      {/* Profile Photo Modal */}
      {showProfileModal && selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Edit Profile Photo</h3>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="inline-block">
                  {selectedProfile.avatar_url ? (
                    <img
                      src={selectedProfile.avatar_url}
                      alt={selectedProfile.handle}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                      <span className="text-gray-500 font-medium text-2xl">
                        {selectedProfile.handle.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <h4 className="text-lg font-medium text-gray-900">@{selectedProfile.handle}</h4>
                <p className="text-sm text-gray-500">{selectedProfile.user?.email}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload New Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50"
                  />
                  {uploading && (
                    <div className="mt-2 text-sm text-purple-600 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                      Uploading...
                    </div>
                  )}
                </div>

                {selectedProfile.avatar_url && (
                  <div>
                    <button
                      onClick={removeProfilePhoto}
                      className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Current Photo
                    </button>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;