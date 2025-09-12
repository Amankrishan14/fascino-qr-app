import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, User, Sparkles } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        {/* Hero Icon */}
        <div className="mb-8 flex justify-center">
          <div className="bg-blue-500 p-4 rounded-full shadow-lg">
            <QrCode className="w-12 h-12 text-white" />
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
          Portfolio QR
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Create your portfolio, add photos, videos, links, and share via QR
        </p>
        
        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <User className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Easy Setup</h3>
            <p className="text-gray-600 text-sm">Create your professional portfolio in minutes</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <QrCode className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">QR Sharing</h3>
            <p className="text-gray-600 text-sm">Share your portfolio instantly with QR codes</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Rich Content</h3>
            <p className="text-gray-600 text-sm">Add photos, videos, links, and social profiles</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Login / Signup
          </Link>
          <Link
            to="/dashboard"
            className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl border border-gray-200 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;