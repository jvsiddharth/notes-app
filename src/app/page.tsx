// src/app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Notes SaaS</h1>
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Multi-Tenant
              </span>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Multi-Tenant
            <span className="text-blue-600"> Notes SaaS</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Secure, isolated note management for multiple organizations. 
            Built with Next.js, Prisma, and modern authentication.
          </p>
          
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Try Demo
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a
                href="/api/health"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Health Check
              </a>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Multi-Tenancy */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Multi-Tenant Architecture</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Complete data isolation between tenants with secure access controls.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Authentication */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">JWT Authentication</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Secure token-based authentication with role-based access control.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Plans */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Subscription Management</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Free and Pro plans with feature gating and upgrade capabilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="mt-16 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Test Accounts Available
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Acme Corp */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Acme Corporation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admin:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">admin@acme.test</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">user@acme.test</code>
                  </div>
                  <div className="text-center mt-2 pt-2 border-t border-gray-100">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      FREE Plan
                    </span>
                  </div>
                </div>
              </div>

              {/* Globex Corp */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Globex Corporation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admin:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">admin@globex.test</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">user@globex.test</code>
                  </div>
                  <div className="text-center mt-2 pt-2 border-t border-gray-100">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      FREE Plan
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                All test accounts use password: 
                <code className="bg-gray-100 px-2 py-1 rounded ml-1">password</code>
              </p>
            </div>
          </div>
        </div>

        {/* API Status */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              <span className="text-gray-600">Database Connected</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              <span className="text-gray-600">APIs Ready</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
              <span className="text-gray-600">Multi-Tenant Ready</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Test Login
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Register New User
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 pt-8">
            <p className="text-center text-sm text-gray-500">
              © 2025 Notes SaaS. Built with Next.js 14, Prisma, and SQLite.
            </p>
            <div className="mt-2 flex justify-center space-x-4 text-sm">
              <a href="/api/health" className="text-gray-400 hover:text-gray-500">
                Health Check
              </a>
              <span className="text-gray-300">•</span>
              <a href="https://github.com" className="text-gray-400 hover:text-gray-500">
                GitHub
              </a>
              <span className="text-gray-300">•</span>
              <a href="https://nextjs.org" className="text-gray-400 hover:text-gray-500">
                Next.js Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
