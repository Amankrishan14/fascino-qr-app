import React from 'react';
import { useParams } from 'react-router-dom';
import { Mail, ExternalLink, Github, Linkedin, Twitter, Instagram, Youtube } from 'lucide-react';

const PublicPortfolio = () => {
  const { handle } = useParams();

  // Mock data - in a real app, this would come from an API
  const portfolio = {
    handle: handle || 'john-doe',
    name: 'John Doe',
    headline: 'Full Stack Developer & UI/UX Designer',
    bio: 'Passionate developer with 5+ years of experience creating beautiful and functional web applications. I love working with React, Node.js, and modern web technologies.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=400&h=400&fit=crop',
    media: [
      'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/3184632/pexels-photo-3184632.jpeg?w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/3184318/pexels-photo-3184318.jpeg?w=400&h=300&fit=crop'
    ],
    links: [
      { label: 'My Portfolio Website', url: 'https://johndoe.dev' },
      { label: 'Latest Blog Post', url: 'https://blog.johndoe.dev' },
      { label: 'Open Source Project', url: 'https://github.com/johndoe/project' }
    ],
    socials: [
      { platform: 'GitHub', handle: 'johndoe', url: 'https://github.com/johndoe' },
      { platform: 'LinkedIn', handle: 'john-doe', url: 'https://linkedin.com/in/john-doe' },
      { platform: 'Twitter', handle: '@johndoe', url: 'https://twitter.com/johndoe' }
    ]
  };

  const getSocialIcon = (platform: string) => {
    const className = "w-5 h-5";
    switch (platform.toLowerCase()) {
      case 'github': return <Github className={className} />;
      case 'linkedin': return <Linkedin className={className} />;
      case 'twitter': return <Twitter className={className} />;
      case 'instagram': return <Instagram className={className} />;
      case 'youtube': return <Youtube className={className} />;
      default: return <ExternalLink className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 text-center">
          <div className="mb-6">
            <img
              src={portfolio.avatar}
              alt={portfolio.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">@{portfolio.handle}</h1>
            <h2 className="text-xl text-gray-600 mb-4">{portfolio.headline}</h2>
            <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">{portfolio.bio}</p>
          </div>

          {/* Social Links */}
          {portfolio.socials.length > 0 && (
            <div className="flex justify-center space-x-4 mb-6">
              {portfolio.socials.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors group"
                  title={`${social.platform}: ${social.handle}`}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Media Gallery */}
          {portfolio.media.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-purple-500" />
                Gallery
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {portfolio.media.map((item, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <img
                      src={item}
                      alt={`Gallery item ${index + 1}`}
                      className="w-full h-40 object-cover rounded-xl group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Links */}
          {portfolio.links.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <ExternalLink className="w-5 h-5 mr-2 text-blue-500" />
                Links
              </h3>
              
              <div className="space-y-3">
                {portfolio.links.map((link, index) => (
                  <a
                    key={index}
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
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Powered by Portfolio QR</p>
        </div>
      </div>
    </div>
  );
};

export default PublicPortfolio;