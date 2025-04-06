import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Secure Bank</h3>
            <p className="text-gray-300 text-sm">
              Providing secure banking services with state-of-the-art verification
              technology to protect your finances.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="#" className="hover:text-white transition-colors">Checking</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Savings</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Credit Cards</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Loans</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>1234 Banking Street</li>
              <li>Anytown, USA 12345</li>
              <li>support@securebank.example</li>
              <li>(555) 123-4567</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Secure Bank. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;