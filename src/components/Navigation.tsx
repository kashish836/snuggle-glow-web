
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Baby, Menu, X, Heart } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Resources', path: '/resources' },
    { name: 'Community', path: '/community' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-pink-100 sticky top-0 z-50">
      <div className="section-padding">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Baby className="h-8 w-8 text-pink-500 animate-float" />
              <Heart className="h-3 w-3 text-pink-400 absolute -top-1 -right-1 animate-pulse-gentle" />
            </div>
            <div>
              <span className="text-2xl font-pacifico text-pink-600">SnuggleNest</span>
              <p className="text-xs text-pink-400 -mt-1 hidden sm:block">Where Little Hearts Grow & Mamas Glow</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link relative ${
                  isActive(item.path) 
                    ? 'text-pink-600 font-semibold' 
                    : 'text-gray-600 hover:text-pink-500'
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-pink-400 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full hover:bg-pink-50 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6 text-pink-600" /> : <Menu className="h-6 w-6 text-pink-600" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-pink-100">
            <div className="flex flex-col space-y-2 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-pink-100 text-pink-700 font-semibold'
                      : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
