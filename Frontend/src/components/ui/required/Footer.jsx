import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
             
              <h3 className="text-2xl font-bold text-green-300">QuickCourt</h3>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              Your premier destination for sports venue bookings. Connect with players, 
              discover amazing facilities, and enjoy your favorite sports.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-300 border-b border-green-600 pb-2">
              Quick Links
            </h4>
            <nav className="space-y-2">
              <Link
                to="/"
                className="block text-green-100 hover:text-green-300 transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                to="/more-options"
                className="block text-green-100 hover:text-green-300 transition-colors text-sm"
              >
                All Venues
              </Link>
              <Link
                to="/login"
                className="block text-green-100 hover:text-green-300 transition-colors text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block text-green-100 hover:text-green-300 transition-colors text-sm"
              >
                Sign Up
              </Link>
            </nav>
          </div>

          {/* Sports & Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-300 border-b border-green-600 pb-2">
              Popular Sports
            </h4>
            <div className="space-y-2 text-sm">
              <div className="text-green-100 hover:text-green-300 transition-colors cursor-pointer">
                Badminton
              </div>
              <div className="text-green-100 hover:text-green-300 transition-colors cursor-pointer">
                Football
              </div>
              <div className="text-green-100 hover:text-green-300 transition-colors cursor-pointer">
                Table Tennis
              </div>
              <div className="text-green-100 hover:text-green-300 transition-colors cursor-pointer">
                Basketball
              </div>
              <div className="text-green-100 hover:text-green-300 transition-colors cursor-pointer">
                Tennis
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-300 border-b border-green-600 pb-2">
              Contact & Support
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-green-100">
                <Phone className="w-4 h-4 text-green-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-green-100">
                <Mail className="w-4 h-4 text-green-400" />
                <span>support@quickcourt.com</span>
              </div>
              <div className="flex items-center space-x-2 text-green-100">
                <MapPin className="w-4 h-4 text-green-400" />
                <span>Mumbai, Maharashtra</span>
              </div>
              <div className="flex items-center space-x-2 text-green-100">
                <Clock className="w-4 h-4 text-green-400" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section
        <div className="mt-12 pt-8 border-t border-green-700">
          <div className="text-center space-y-4">
            <h4 className="text-xl font-semibold text-green-300">
              Stay Updated with QuickCourt
            </h4>
            <p className="text-green-100 text-sm max-w-md mx-auto">
              Get notified about new venues, special offers, and sports events in your area.
            </p>
            <div className="flex max-w-md mx-auto space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-green-800 border border-green-600 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}

        {/* Social Media & Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-green-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social Media */}
            <div className="flex space-x-4">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 bg-green-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 bg-green-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 bg-green-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-10 h-10 bg-green-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right text-green-200 text-sm">
              <p>© {currentYear} QuickCourt. All rights reserved.</p>
              <p className="mt-1">
                Made for sports enthusiasts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-green-950 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-green-300">
            <div className="flex items-center space-x-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Cookie Policy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
