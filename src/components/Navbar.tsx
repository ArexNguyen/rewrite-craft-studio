
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, LogIn } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];
  
  const userNavLinks = user ? [
    { name: 'Dashboard', path: '/dashboard' },
  ] : [];

  const allNavLinks = [...navLinks, ...userNavLinks];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold gradient-text">TextHuman</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {allNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out
                  ${isActive(link.path) 
                    ? 'text-brand-700 bg-brand-50' 
                    : 'text-gray-700 hover:text-brand-600 hover:bg-gray-100'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center ml-4 space-x-3">
                <div className="flex items-center text-sm font-medium text-brand-700">
                  <User size={18} className="mr-1.5" />
                  {user.username}
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center ml-4 space-x-3">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" className="bg-brand-600 hover:bg-brand-700" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-fade-in">
          <div className="px-2 py-3 space-y-1 sm:px-3">
            {allNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium 
                  ${isActive(link.path) 
                    ? 'bg-brand-100 text-brand-700' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-brand-600'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <>
                <div className="px-3 py-2 text-sm font-medium text-brand-700 flex items-center">
                  <User size={16} className="mr-1.5" />
                  {user.username}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Button variant="outline" className="justify-center" asChild>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <LogIn size={16} className="mr-2" />
                    Login
                  </Link>
                </Button>
                <Button className="bg-brand-600 hover:bg-brand-700 justify-center" asChild>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
