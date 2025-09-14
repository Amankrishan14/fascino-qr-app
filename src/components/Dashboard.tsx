import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Camera, Link as LinkIcon, Share2, QrCode, Plus, Trash2, ArrowLeft, Loader2, Save, Check, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import QRCode from 'qrcode';

interface ProfileData {
  id: string;
  handle: string;
  headline: string;
  bio: string;
  avatar_url: string;
  is_approved: boolean;
}

interface MediaItem {
  id?: string;
  profile_id?: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  title: string | null;
}

interface LinkItem {
  id?: string;
  profile_id?: string;
  label: string;
  url: string;
}

interface SocialItem {
  id?: string;
  profile_id?: string;
  platform: 'TWITTER' | 'INSTAGRAM' | 'LINKEDIN' | 'GITHUB' | 'YOUTUBE' | 'FACEBOOK' | 'TIKTOK' | 'OTHER';
  handle: string;
  url: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  
  const [profile, setProfile] = useState<ProfileData>({
    id: '',
    handle: '',
    headline: '',
    bio: '',
    avatar_url: '',
    is_approved: false
  });
  
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [socials, setSocials] = useState<SocialItem[]>([]);
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user has a profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        if (profileData) {
          setProfile({
            id: profileData.id,
            handle: profileData.handle || '',
            headline: profileData.headline || '',
            bio: profileData.bio || '',
            avatar_url: profileData.avatar_url || '',
            is_approved: profileData.is_approved
          });
          setProfileId(profileData.id);
          
          // Generate QR code
          if (profileData.handle) {
            const url = `${window.location.origin}/p/${profileData.handle}`;
            const qrDataUrl = await QRCode.toDataURL(url, {
              width: 300,
              margin: 2,
              color: {
                dark: '#000000',
                light: '#ffffff'
              }
            });
            setQrCode(qrDataUrl);
          }
          
          // Fetch media
          const { data: mediaData } = await supabase
            .from('media')
            .select('*')
            .eq('profile_id', profileData.id);
          
          if (mediaData) {
            setMedia(mediaData);
          }
          
          // Fetch links
          const { data: linksData } = await supabase
            .from('links')
            .select('*')
            .eq('profile_id', profileData.id);
          
          if (linksData) {
            setLinks(linksData);
          }
          
          // Fetch socials
          const { data: socialsData } = await supabase
            .from('socials')
            .select('*')
            .eq('profile_id', profileData.id);
          
          if (socialsData) {
            setSocials(socialsData);
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    
    // Prevent rapid successive saves
    if (saving) return;
    
    try {
      setSaving(true);
      setSaveSuccess(false);
      setError(null);
      
      // Validate inputs
      if (!profile.handle || profile.handle.trim() === '') {
        setError('Handle is required');
        setSaving(false);
        return;
      }
      
      if (profile.handle.length < 3) {
        setError('Handle must be at least 3 characters long');
        setSaving(false);
        return;
      }
      
      if (!/^[a-zA-Z0-9_-]+$/.test(profile.handle)) {
        setError('Handle can only contain letters, numbers, underscores, and hyphens');
        setSaving(false);
        return;
      }
      
      if (profile.headline && profile.headline.length > 100) {
        setError('Headline cannot exceed 100 characters');
        setSaving(false);
        return;
      }
      
      if (profile.bio && profile.bio.length > 500) {
        setError('Bio cannot exceed 500 characters');
        setSaving(false);
        return;
      }
      
      // Check if handle is unique (if changed)
      if (profileId) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('handle', profile.handle)
          .neq('id', profileId)
          .single();
        
        if (existingProfile) {
          setError('This handle is already taken. Please choose another one.');
          setSaving(false);
          return;
        }
      } else {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('handle', profile.handle)
          .single();
        
        if (existingProfile) {
          setError('This handle is already taken. Please choose another one.');
          setSaving(false);
          return;
        }
      }
      
      // Create or update profile
      let profileResult;
      if (profileId) {
        // Update existing profile
        profileResult = await supabase
          .from('profiles')
          .update({
            handle: profile.handle,
            headline: profile.headline,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', profileId);
      } else {
        // Create new profile
        profileResult = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            handle: profile.handle,
            headline: profile.headline,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            is_approved: false
          })
          .select();
        
        if (profileResult.data && profileResult.data[0]) {
          setProfileId(profileResult.data[0].id);
          setProfile({
            ...profile,
            id: profileResult.data[0].id,
            is_approved: profileResult.data[0].is_approved
          });
        }
      }
      
      if (profileResult.error) throw profileResult.error;
      
      // Generate QR code if needed
      if (!qrCode && profile.handle) {
        const url = `${window.location.origin}/p/${profile.handle}`;
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        setQrCode(qrDataUrl);
      }
      
      // Save media, links, and socials if we have a profile ID
      if (profileId || (profileResult.data && profileResult.data[0])) {
        const currentProfileId = profileId || (profileResult.data && profileResult.data[0].id);
        
        // Handle media
        for (const item of media) {
          if (!item.id) {
            // Create new media item
            await supabase
              .from('media')
              .insert({
                profile_id: currentProfileId,
                type: item.type,
                url: item.url,
                title: item.title
              });
          }
        }
        
        // Handle links
        for (const item of links) {
          if (!item.id) {
            // Create new link
            await supabase
              .from('links')
              .insert({
                profile_id: currentProfileId,
                label: item.label,
                url: item.url
              });
          }
        }
        
        // Handle socials
        for (const item of socials) {
          if (!item.id) {
            // Create new social
            await supabase
              .from('socials')
              .insert({
                profile_id: currentProfileId,
                platform: item.platform,
                handle: item.handle,
                url: item.url
              });
          }
        }
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      // Show more detailed error message
      if (err instanceof Error) {
        setError(`Failed to save your profile: ${err.message}`);
      } else if (typeof err === 'object' && err !== null) {
        setError(`Failed to save your profile: ${JSON.stringify(err)}`);
      } else {
        setError('Failed to save your profile. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    setLinks([...links, { label: '', url: '' }]);
  };

  const removeLink = async (index: number) => {
    const link = links[index];
    if (link.id) {
      try {
        await supabase
          .from('links')
          .delete()
          .eq('id', link.id);
      } catch (error) {
        console.error('Error deleting link:', error);
      }
    }
    setLinks(links.filter((_, i) => i !== index));
  };

  const addSocial = () => {
    setSocials([...socials, { platform: 'GITHUB', handle: '', url: '' }]);
  };

  const removeSocial = async (index: number) => {
    const social = socials[index];
    if (social.id) {
      try {
        await supabase
          .from('socials')
          .delete()
          .eq('id', social.id);
      } catch (error) {
        console.error('Error deleting social:', error);
      }
    }
    setSocials(socials.filter((_, i) => i !== index));
  };

  const addMedia = () => {
    // Trigger file input
    const fileInput = document.getElementById('media-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;

    setUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        // Validate file type
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        
        if (!isImage && !isVideo) {
          alert(`File ${file.name} is not a supported image or video format.`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('media')
          .upload(fileName, file);

        if (error) {
          console.error('Error uploading file:', error);
          alert(`Failed to upload ${file.name}: ${error.message}`);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(fileName);

        // Add to media array
        setMedia(prev => [...prev, {
          url: publicUrl,
          type: isVideo ? 'VIDEO' : 'IMAGE',
          title: file.name.split('.')[0] // Use filename without extension as title
        }]);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
      // Clear the file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const updateMediaTitle = (index: number, title: string) => {
    const updatedMedia = [...media];
    updatedMedia[index].title = title;
    setMedia(updatedMedia);
  };

  const removeMedia = async (index: number) => {
    const item = media[index];
    
    try {
      // If it's a database record, delete from database
      if (item.id) {
        await supabase
          .from('media')
          .delete()
          .eq('id', item.id);
      }
      
      // If it's a storage file, delete from storage
      if (item.url.includes('storage.googleapis.com') || item.url.includes('supabase.co/storage')) {
        // Extract file path from URL
        const urlParts = item.url.split('/storage/v1/object/public/media/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage
            .from('media')
            .remove([filePath]);
        }
      }
    } catch (error) {
      console.error('Error deleting media:', error);
    }
    
    setMedia(media.filter((_, i) => i !== index));
  };


  const downloadQrCode = () => {
    if (!qrCode || !profile.handle) return;
    
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `${profile.handle}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Your Portfolio</h1>
            </div>
            <div className="flex items-center space-x-3">
              {profile.handle && (
            <Link
                  to={`/p/${profile.handle}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Preview
            </Link>
              )}
              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {!profile.is_approved && profileId && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            Your profile is pending approval. Once approved, it will be publicly visible.
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Handle <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    @
                  </span>
                <input
                  type="text"
                    value={profile.handle}
                    onChange={(e) => setProfile({...profile, handle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="johndoe"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  This will be your public URL: {window.location.origin}/p/{profile.handle || 'your-handle'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={profile.headline}
                  onChange={(e) => setProfile({...profile, headline: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full Stack Developer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                <input
                  type="url"
                  value={profile.avatar_url || ''}
                  onChange={(e) => setProfile({...profile, avatar_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
          </div>

          {/* QR Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <QrCode className="w-5 h-5 text-green-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">QR Code</h2>
            </div>
            
            <div className="text-center">
              {qrCode ? (
                <>
                  <div className="bg-white p-4 rounded-xl mb-4 inline-block border border-gray-200 shadow-sm">
                    <img src={qrCode} alt="QR Code" className="w-40 h-40" />
              </div>
              <p className="text-gray-600 mb-4">
                    Share your portfolio: {window.location.origin}/p/{profile.handle}
                  </p>
                  <button 
                    onClick={downloadQrCode}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {profile.handle ? 'Save your profile to generate a QR code' : 'Add a handle and save your profile to generate a QR code'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Camera className="w-5 h-5 text-purple-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Media Gallery (Photos & Videos)</h2>
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  id="media-upload"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="media-upload"
                  className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer text-sm font-medium"
                >
                  Upload Files
                </label>
                <button
                  onClick={addMedia}
                  disabled={uploading}
                  className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  title="Upload images and videos"
                >
                  {uploading ? 'Uploading...' : 'Add Media'}
                </button>
              </div>
            </div>
            
            {uploading && (
              <div className="text-center py-4">
                <div className="inline-flex items-center text-purple-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                  Uploading files...
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {media.map((item, index) => (
                <div key={item.id || index} className="relative group bg-gray-50 rounded-lg p-3">
                  {item.type === 'VIDEO' ? (
                    <div className="relative mb-2">
                      <video
                        src={item.url}
                        className="w-full h-32 object-cover rounded-lg"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                        <div className="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[8px] border-l-gray-800 border-y-[6px] border-y-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title || `Media ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  
                  {/* Title input */}
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => updateMediaTitle(index, e.target.value)}
                    placeholder="Add a title (optional)"
                    className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label
                htmlFor="media-upload"
                className="border-2 border-dashed border-gray-300 rounded-lg h-20 flex items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-400 cursor-pointer transition-colors"
              >
                <Plus className="w-6 h-6" />
              </label>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>• Upload images and videos from your device</p>
              <p>• Supported formats: JPG, PNG, GIF, MP4, MOV, AVI</p>
              <p>• Click the + button to add sample content</p>
            </div>
          </div>

          {/* Links Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <LinkIcon className="w-5 h-5 text-orange-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Custom Links</h2>
              </div>
              <button
                onClick={addLink}
                className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {links.map((link, index) => (
                <div key={link.id || index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      const newLinks = [...links];
                      newLinks[index].label = e.target.value;
                      setLinks(newLinks);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Link Label"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...links];
                      newLinks[index].url = e.target.value;
                      setLinks(newLinks);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                  <button
                    onClick={() => removeLink(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {links.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No links added yet. Click the + button to add a link.
                </p>
              )}
            </div>
          </div>

          {/* Social Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Share2 className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Social Profiles</h2>
              </div>
              <button
                onClick={addSocial}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid gap-3">
              {socials.map((social, index) => (
                <div key={social.id || index} className="flex gap-2 items-center">
                  <select
                    value={social.platform}
                    onChange={(e) => {
                      const newSocials = [...socials];
                      newSocials[index].platform = e.target.value as SocialItem['platform'];
                      setSocials(newSocials);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="GITHUB">GitHub</option>
                    <option value="LINKEDIN">LinkedIn</option>
                    <option value="TWITTER">Twitter</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="YOUTUBE">YouTube</option>
                    <option value="FACEBOOK">Facebook</option>
                    <option value="TIKTOK">TikTok</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <input
                    type="text"
                    value={social.handle}
                    onChange={(e) => {
                      const newSocials = [...socials];
                      newSocials[index].handle = e.target.value;
                      setSocials(newSocials);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="username"
                  />
                  <input
                    type="url"
                    value={social.url}
                    onChange={(e) => {
                      const newSocials = [...socials];
                      newSocials[index].url = e.target.value;
                      setSocials(newSocials);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                  <button
                    onClick={() => removeSocial(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {socials.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No social profiles added yet. Click the + button to add one.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;