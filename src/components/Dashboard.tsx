import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Camera, Link as LinkIcon, Share2, QrCode, Plus, Trash2, ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  const [profile, setProfile] = useState({
    handle: '',
    headline: '',
    bio: '',
    avatarUrl: ''
  });
  
  const [media, setMedia] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
  const [links, setLinks] = useState<{ label: string; url: string }[]>([]);
  const [socials, setSocials] = useState<{ platform: string; handle: string; url: string }[]>([]);

  const addLink = () => {
    setLinks([...links, { label: '', url: '' }]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const addSocial = () => {
    setSocials([...socials, { platform: 'GitHub', handle: '', url: '' }]);
  };

  const removeSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  const addMedia = () => {
    // Placeholder for media upload
    const newMedia = { 
      url: `https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg?w=300&h=300&fit=crop`,
      type: 'image' as const
    };
    setMedia([...media, newMedia]);
  };

  const addVideo = () => {
    // Placeholder for video upload
    const newVideo = { 
      url: `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`,
      type: 'video' as const
    };
    setMedia([...media, newVideo]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const url = URL.createObjectURL(file);
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        setMedia(prev => [...prev, { url, type }]);
      });
    }
  };
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
            <Link
              to={`/p/${profile.handle || 'preview'}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Preview
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Handle</label>
                <input
                  type="text"
                  value={profile.handle}
                  onChange={(e) => setProfile({...profile, handle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your-username"
                />
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
                  value={profile.avatarUrl}
                  onChange={(e) => setProfile({...profile, avatarUrl: e.target.value})}
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
              <div className="bg-gray-100 p-8 rounded-xl mb-4 inline-block">
                <QrCode className="w-24 h-24 text-gray-400 mx-auto" />
              </div>
              <p className="text-gray-600 mb-4">
                Share your portfolio: /p/{profile.handle || 'your-handle'}
              </p>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Download QR Code
              </button>
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
                  className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                  title="Add sample image"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {media.map((item, index) => (
                <div key={index} className="relative group">
                  {item.type === 'video' ? (
                    <div className="relative">
                      <video
                        src={item.url}
                        className="w-full h-20 object-cover rounded-lg"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                        <div className="w-6 h-6 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[6px] border-l-gray-800 border-y-[4px] border-y-transparent ml-0.5"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  )}
                  <button
                    onClick={() => setMedia(media.filter((_, i) => i !== index))}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
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
                <div key={index} className="flex gap-2 items-center">
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
                <div key={index} className="flex gap-2 items-center">
                  <select
                    value={social.platform}
                    onChange={(e) => {
                      const newSocials = [...socials];
                      newSocials[index].platform = e.target.value;
                      setSocials(newSocials);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="GitHub">GitHub</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;