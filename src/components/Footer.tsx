
import { Baby, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-50 to-lavender border-t border-pink-100">
      <div className="section-padding py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <Baby className="h-8 w-8 text-pink-500" />
                <Heart className="h-3 w-3 text-pink-400 absolute -top-1 -right-1" />
              </div>
              <span className="text-2xl font-pacifico text-pink-600">SnuggleNest</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              A heartwarming community where new mothers find support, share experiences, and celebrate the beautiful journey of motherhood together.
            </p>
            <div className="flex space-x-2">
              <Heart className="h-5 w-5 text-pink-400 animate-pulse-gentle" />
              <Star className="h-5 w-5 text-pink-400 animate-pulse-gentle" style={{ animationDelay: '0.5s' }} />
              <Baby className="h-5 w-5 text-pink-400 animate-pulse-gentle" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-gray-600 hover:text-pink-500 transition-colors">Baby Care Tips</Link></li>
              <li><Link to="/resources" className="text-gray-600 hover:text-pink-500 transition-colors">Resources</Link></li>
              <li><Link to="/community" className="text-gray-600 hover:text-pink-500 transition-colors">Community</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-pink-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Stay Connected</h3>
            <p className="text-gray-600 text-sm mb-4">Get weekly tips and support delivered to your inbox.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 border border-pink-200 rounded-l-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <button className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-r-full transition-colors">
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-pink-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 SnuggleNest. Made with 💖 for amazing mamas everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
