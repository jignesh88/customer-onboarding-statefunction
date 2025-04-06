import React from 'react';
import Link from 'next/link';
import { CreditCard, Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Secure Bank</span>
          </Link>
          
          <nav>
            <ul className="flex items-center space-x-6">
              <li>
                <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Open Account
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Login</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;