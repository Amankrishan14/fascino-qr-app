import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FascinoLogo from './FascinoLogo';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  // Check if we're on a preview page (routes starting with /p/)
  const isPreviewPage = location.pathname.startsWith('/p/');

  return (
    <div className="flex flex-col min-h-screen">
      {!isPreviewPage && (
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <FascinoLogo width={32} height={32} />
                  <span className="text-xl font-bold text-indigo-600">Fascino</span>
                </Link>
              </div>
              <nav className="flex space-x-4 items-center">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === '/dashboard'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/auth'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </header>
      )}
      <main className="flex-grow">
        {isPreviewPage ? (
          children
        ) : (
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
        )}
      </main>
      {!isPreviewPage && (
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Fascino Agency. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
