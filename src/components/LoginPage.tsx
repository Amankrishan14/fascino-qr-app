import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Mail, Lock, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login/signup logic here
    console.log(isLogin ? 'Login' : 'Signup', { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col">
      {/* Header */}
      <div className="p-6">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="bg-blue-500 p-3 rounded-full shadow-lg inline-block mb-4">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h1>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {/* Google Login Placeholder */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <button className="mt-4 w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                Login with Google
              </button>
            </div>

            {/* Toggle Mode */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-700 font-semibold ml-1 transition-colors"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;