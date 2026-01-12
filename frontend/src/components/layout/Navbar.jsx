import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              {/* Logo Icon - Matching Favicon */}
              <div className="relative">
                <svg 
                  className="w-10 h-10 transform group-hover:scale-110 transition-transform duration-200" 
                  viewBox="0 0 64 64" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#4F46E5', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#6366F1', stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                  <rect width="64" height="64" rx="12" fill="url(#logoGrad)"/>
                  <path 
                    d="M42 28V22C42 20.9391 41.5786 19.9217 40.8284 19.1716C40.0783 18.4214 39.0609 18 38 18H26C24.9391 18 23.9217 18.4214 23.1716 19.1716C22.4214 19.9217 22 20.9391 22 22V28M42 28H22M42 28V44C42 45.0609 41.5786 46.0783 40.8284 46.8284C40.0783 47.5786 39.0609 48 38 48H26C24.9391 48 23.9217 47.5786 23.1716 46.8284C22.4214 46.0783 22 45.0609 22 44V28M32 34H32.02" 
                    stroke="white" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              
              {/* Brand Name */}
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
                  GigFlow
                </span>
                <span className="text-xs text-gray-500 -mt-1">Freelance Marketplace</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <Link
                  to="/gigs"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Browse Gigs
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-gigs"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  My Gigs
                </Link>
                <div className="flex items-center space-x-2 pl-2 border-l border-gray-300">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 hidden sm:block">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;