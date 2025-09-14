// src/app/admin/page.tsx
'use client'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  role: string
  createdAt: string
}

export default function AdminPage() {
  const { user, token, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [isInviting, setIsInviting] = useState(false)
  const [newUser, setNewUser] = useState({ email: '', role: 'MEMBER' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/dashboard')
    } else if (user && token) {
      fetchUsers()
    }
  }, [user, loading, token, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      })

      const data = await response.json()
      
      if (response.ok) {
        setSuccess(`User invited! Temporary password: ${data.tempPassword}`)
        setUsers([...users, data.user])
        setNewUser({ email: '', role: 'MEMBER' })
        setIsInviting(false)
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Failed to invite user')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user || user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600">Manage users for {user.tenant.name}</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
            <button onClick={() => setError('')} className="ml-2 font-bold">×</button>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
            {success}
            <button onClick={() => setSuccess('')} className="ml-2 font-bold">×</button>
          </div>
        )}

        {/* Users Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
              <button
                onClick={() => setIsInviting(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                + Invite User
              </button>
            </div>
          </div>

          {/* Invite User Form */}
          {isInviting && (
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <form onSubmit={handleInviteUser}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Send Invitation
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsInviting(false)
                      setNewUser({ email: '', role: 'MEMBER' })
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Users List */}
          <div className="p-6">
            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No team members yet.</p>
              </div>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'ADMIN' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
