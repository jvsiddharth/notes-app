// src/app/login/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const testAccounts = [
    { email: 'admin@acme.test', role: 'Admin', tenant: 'Acme Corp' },
    { email: 'user@acme.test', role: 'Member', tenant: 'Acme Corp' },
    { email: 'admin@globex.test', role: 'Admin', tenant: 'Globex Corp' },
    { email: 'user@globex.test', role: 'Member', tenant: 'Globex Corp' },
  ]

  const quickLogin = (testEmail: string) => {
    setEmail(testEmail)
    setPassword('password')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Multi-tenant Notes SaaS Application
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Test Accounts</span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {testAccounts.map((account, index) => (
              <button
                key={index}
                type="button"
                onClick={() => quickLogin(account.email)}
                className="w-full text-left px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="font-medium">{account.email}</div>
                <div className="text-gray-500">{account.role} • {account.tenant}</div>
              </button>
            ))}
            <div className="text-xs text-gray-500 text-center mt-2">
              All test accounts use password: <code className="bg-gray-100 px-1 rounded">password</code>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/register" 
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            Don't have an account? Register here
          </Link>
        </div>
      </div>
    </div>
  )
}
