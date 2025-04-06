import React from 'react';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { ChevronRight, ShieldCheck, Building, CreditCard } from 'lucide-react';

export default function Home() {
  return (
    <Layout title="Secure Bank - Open an Account Online">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-16 rounded-lg">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Banking Made Simple</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Open a bank account in minutes with our secure, streamlined process.
          </p>
          <Link 
            href="/onboarding"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started <ChevronRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <ShieldCheck className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Verification</h3>
              <p className="text-gray-600">
                State-of-the-art identity verification keeps your account safe from fraud.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Building className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Banking</h3>
              <p className="text-gray-600">
                Join thousands of customers who trust us with their financial needs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <CreditCard className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Account Setup</h3>
              <p className="text-gray-600">
                Open an account in minutes with our streamlined onboarding process.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-100 rounded-lg">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-start mb-8">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Enter Your Information</h3>
                <p className="text-gray-600">
                  Provide your personal details securely to begin the account opening process.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start mb-8">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Verify Your Identity</h3>
                <p className="text-gray-600">
                  We use Onfido to securely verify your identity with minimal friction.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start mb-8">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Link Your Bank</h3>
                <p className="text-gray-600">
                  Securely connect your existing bank account using Plaid's trusted platform.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Start Banking</h3>
                <p className="text-gray-600">
                  Your account is ready to use. Enjoy modern, secure banking services.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/onboarding"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Open Your Account <ChevronRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}