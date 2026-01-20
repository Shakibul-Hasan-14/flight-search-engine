import logo from "../../public/flight.png";
import {
  Mail,
  Apple,
  Phone,
  Plane,
  MapPin,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white flex justify-center">
      <div className="container max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand and App */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <img src={logo} alt="Logo" className="h-8 w-auto" />
              <span className="text-2xl font-bold">Flight Engine</span>
            </div>
            <p className="text-gray-400 mb-6">
              Smart picks, live answers, and on-the-go trip help. Your trusted
              partner for seamless travel experiences worldwide.
            </p>

            <div className="mb-8">
              <h4 className="font-semibold mb-4">Get Flight Engine App</h4>
              <div className="flex space-x-3">
                <button className="flex items-center justify-center space-x-2 border border-gray-700 hover:border-gray-600 rounded-lg px-4 py-2 transition-colors">
                  <Apple size={20} />
                  <span>App Store</span>
                </button>
                <button className="flex items-center justify-center space-x-2 border border-gray-700 hover:border-gray-600 rounded-lg px-4 py-2 transition-colors">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.523 15.3414C17.4112 15.7042 17.2869 16.062 17.1508 16.4145C16.5872 17.8799 15.8716 19.2834 14.9472 20.5652C14.1671 21.664 13.2383 22.6398 12.1068 23.4316C11.4701 23.8765 10.776 24.2295 10.0269 24.4764C9.73864 24.5648 9.44641 24.6407 9.15039 24.7041C8.65137 24.8115 8.14355 24.88 7.63086 24.9082C7.17773 24.9309 6.72168 24.9287 6.26514 24.9011C5.26367 24.8424 4.27344 24.6528 3.32031 24.3359C1.86914 23.8438 0.644531 22.9189 0.181641 21.4531C0.0605469 20.9941 0 20.5195 0 20.043C0 18.627 0.697266 17.2939 1.89844 16.4141C2.80078 15.75 3.88477 15.3809 4.99219 15.3414C5.35254 15.3281 5.71289 15.3477 6.06836 15.3984C6.55957 15.4688 7.04297 15.5889 7.51367 15.752C8.22188 16.002 8.89336 16.3418 9.51562 16.7617C9.75293 16.9248 9.98438 17.0957 10.209 17.2734C10.4297 17.0947 10.6572 16.9248 10.8906 16.7637C11.516 16.3447 12.1904 16.0059 12.9023 15.7559C13.3789 15.5898 13.8682 15.4688 14.3652 15.3984C14.7246 15.3477 15.0879 15.3281 15.4512 15.3414H17.523Z" />
                  </svg>
                  <span>Google Play</span>
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </button>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button className="hover:text-white transition-colors">
                  Hotels & Homes
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Flights
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Saved Trips
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Insurance
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Car Rentals
                </button>
              </li>
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h4 className="font-semibold mb-4">Discover</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button className="hover:text-white transition-colors">
                  Top Deals
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Map
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Trip Planner
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Trip Inspirations
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Travel Guides
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-start space-x-3">
                <Mail size={20} className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm">Email</p>
                  <p className="font-medium">support@flightengine.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone size={20} className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm">Phone</p>
                  <p className="font-medium">+1 (800) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm">Headquarters</p>
                  <p className="font-medium">
                    123 Travel Street
                    <br />
                    San Francisco, CA 94107
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Flight Engine, Inc. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <button className="hover:text-white transition-colors">
                Company
              </button>
              <button className="hover:text-white transition-colors">
                Contact
              </button>
              <button className="hover:text-white transition-colors">
                Help Center
              </button>
              <button className="hover:text-white transition-colors">
                Terms of Service
              </button>
              <button className="hover:text-white transition-colors">
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
