
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-xl font-bold gradient-text">
              TextHuman
            </Link>
            <p className="mt-3 text-gray-600 text-sm max-w-md">
              Transform your AI-generated content into natural, human-like text that bypasses AI detection tools.
            </p>
            <div className="mt-6">
              <p className="text-sm text-gray-500">© {new Date().getFullYear()} TextHuman. All rights reserved.</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Product
            </h3>
            <div className="mt-4 space-y-2">
              <Link to="/" className="text-sm text-gray-600 hover:text-brand-600 block">
                Home
              </Link>
              <Link to="/pricing" className="text-sm text-gray-600 hover:text-brand-600 block">
                Pricing
              </Link>
              <Link to="/login" className="text-sm text-gray-600 hover:text-brand-600 block">
                Login
              </Link>
              <Link to="/signup" className="text-sm text-gray-600 hover:text-brand-600 block">
                Sign Up
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Company
            </h3>
            <div className="mt-4 space-y-2">
              <Link to="/contact" className="text-sm text-gray-600 hover:text-brand-600 block">
                Contact
              </Link>
              <a href="#" className="text-sm text-gray-600 hover:text-brand-600 block">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-brand-600 block">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
