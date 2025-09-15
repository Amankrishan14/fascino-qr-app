import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, ExternalLink, Github, Linkedin, Twitter, Instagram, Youtube, Facebook, Image, Video, ArrowLeft, RefreshCw, FileText, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import FascinoLogo from './FascinoLogo';

interface ProfileData {
  id: string;
  handle: string;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_approved: boolean;
  created_at: string;
}

interface MediaItem {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  title: string | null;
}

interface LinkItem {
  id: string;
  label: string;
  url: string;
}

interface SocialItem {
  id: string;
  platform: string;
  handle: string;
  url: string;
}

interface PdfItem {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size?: number;
}

const PublicPortfolio = () => {
  const { handle } = useParams<{ handle: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [socials, setSocials] = useState<SocialItem[]>([]);
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!handle) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('handle', handle)
          .eq('is_approved', true)
          .single();
        
        if (profileError || !profileData) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        setProfile(profileData);
        
        // Fetch media
        const { data: mediaData } = await supabase
          .from('media')
          .select('*')
          .eq('profile_id', profileData.id)
          .order('created_at', { ascending: false });
        
        setMedia(mediaData || []);
        
        // Fetch links
        const { data: linksData } = await supabase
          .from('links')
          .select('*')
          .eq('profile_id', profileData.id)
          .order('created_at', { ascending: false });
        
        setLinks(linksData || []);
        
        // Fetch socials
        const { data: socialsData } = await supabase
          .from('socials')
          .select('*')
          .eq('profile_id', profileData.id)
          .order('created_at', { ascending: false });
        
        setSocials(socialsData || []);
        
        // Fetch PDFs
        const { data: pdfsData } = await supabase
          .from('pdfs')
          .select('*')
          .eq('profile_id', profileData.id)
          .order('created_at', { ascending: false });
        
        setPdfs(pdfsData || []);
      } catch (err: any) {
        console.error('Error fetching portfolio:', err);
        setError('Failed to load portfolio data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPortfolio();
  }, [handle]);

  const getSocialIcon = (platform: string) => {
    const className = "w-6 h-6";
    switch (platform.toLowerCase()) {
      case 'github': return <Github className={className} />;
      case 'linkedin': return <Linkedin className={className} />;
      case 'twitter': return <Twitter className={className} />;
      case 'instagram': return <Instagram className={className} />;
      case 'youtube': return <Youtube className={className} />;
      case 'facebook': return <Facebook className={className} />;
      case 'whatsapp': return <MessageCircle className={className} />;
      default: return <ExternalLink className={className} />;
    }
  };

  const getMediaIcon = (type: string) => {
    const className = "w-5 h-5";
    return type === 'VIDEO' ? <Video className={className} /> : <Image className={className} />;
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">
            This profile doesn't exist or hasn't been approved yet.
          </p>
          <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 text-center">
          <div className="mb-6">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.handle}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-indigo-100 flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-indigo-500">
                  {profile.handle.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">@{profile.handle}</h1>
            {profile.headline && (
              <h2 className="text-xl text-gray-600 mb-4">{profile.headline}</h2>
            )}
            {profile.bio && (
              <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">{profile.bio}</p>
            )}
          </div>


        </div>

        {/* Social Links */}
        {socials.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-green-500" />
              Connect With Me
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 hover:bg-gray-200 p-4 rounded-full transition-colors group"
                  title={`${social.platform}: ${social.handle}`}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images Gallery */}
          {media.filter(item => item.type === 'IMAGE').length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Image className="w-5 h-5 mr-2 text-purple-500" />
                Photos
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {media.filter(item => item.type === 'IMAGE').map((item) => (
                  <div key={item.id} className="relative group">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <img
                        src={item.url}
                        alt={item.title || `Photo`}
                        className="w-full h-40 object-cover rounded-xl group-hover:scale-105 transition-transform duration-200"
                      />
                    </a>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl" />
                    {item.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white text-sm rounded-b-xl">
                        {item.title}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Gallery */}
          {media.filter(item => item.type === 'VIDEO').length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Video className="w-5 h-5 mr-2 text-blue-500" />
                Videos
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {media.filter(item => item.type === 'VIDEO').map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="relative w-full h-40 rounded-xl overflow-hidden bg-black">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Video className="w-12 h-12 text-white opacity-80" />
                      </a>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl" />
                    {item.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white text-sm rounded-b-xl">
                        {item.title}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Links */}
          {links.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <ExternalLink className="w-5 h-5 mr-2 text-blue-500" />
                Links
              </h3>
              
              <div className="space-y-3">
                {links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 group-hover:text-blue-600">
                        {link.label}
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* PDF Documents */}
          {pdfs.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-red-500" />
                Documents
              </h3>
              
              <div className="space-y-3">
                {pdfs.map((pdf) => (
                  <a
                    key={pdf.id}
                    href={pdf.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <FileText className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 group-hover:text-red-600 truncate">
                          {pdf.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {pdf.file_name} • {(pdf.file_size ? pdf.file_size / 1024 / 1024 : 0).toFixed(1)} MB
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <FascinoLogo width={24} height={24} />
            <span className="text-sm">Powered by Fascino Agency</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPortfolio;