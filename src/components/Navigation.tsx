import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Baby, Menu, X, Heart, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Resources', path: '/resources' },
    { name: 'Community', path: '/community' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

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
          <div className="hidden md:flex items-center space-x-6">
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

            {/* Auth Section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative rounded-full p-2 hover:bg-pink-50 group"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center group-hover:from-pink-300 group-hover:to-pink-400 transition-all">
                      <User className="h-5 w-5 text-pink-700" />
                    </div>
                    <Heart className="h-2.5 w-2.5 text-pink-500 absolute top-0 right-0 animate-pulse-gentle" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-white border border-pink-100 shadow-lg rounded-xl p-2"
                >
                  <div className="px-3 py-2 mb-1">
                    <p className="text-sm font-medium text-gray-800">Welcome, Mama! 💕</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-pink-100" />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 hover:bg-pink-50 text-gray-700"
                    >
                      <Settings className="h-4 w-4 text-pink-500" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-pink-100" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 hover:bg-pink-50 text-gray-700"
                  >
                    <LogOut className="h-4 w-4 text-pink-500" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/auth"
                className="gentle-button flex items-center gap-2 py-2 px-4 text-sm"
              >
                <Heart className="h-4 w-4" />
                Sign In
              </Link>
            )}
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
              
              {/* Mobile Auth */}
              {user ? (
                <>
                  <Link
                    to="/settings"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-lg text-gray-600 hover:bg-pink-50 hover:text-pink-600 flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg text-gray-600 hover:bg-pink-50 hover:text-pink-600 flex items-center gap-2 text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="mx-4 mt-2 gentle-button flex items-center justify-center gap-2 py-2"
                >
                  <Heart className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
