// src/app/dashboard/page.tsx
'use client'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  userId: string
}

interface SubscriptionStatus {
  subscription: string
  usage: { notes: number; users: number }
  limits: { notes: number; users: number }
  canUpgrade: boolean
  isLimitReached: { notes: boolean; users: boolean }
}

export default function DashboardPage() {
  const { user, logout, loading, token } = useAuth()
  const router = useRouter()
  
  const [notes, setNotes] = useState<Note[]>([])
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const [loadingNotes, setLoadingNotes] = useState(true)
  const [error, setError] = useState('')

  const fetchNotes = useCallback(async () => {
    if (!token) return
    try {
      const response = await fetch('/api/notes', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setNotes(data.notes)
      }
    } catch (_error) {
      console.error('Failed to fetch notes:', _error)
    } finally {
      setLoadingNotes(false)
    }
  }, [token])

  const fetchSubscriptionStatus = useCallback(async () => {
    if (!token) return
    try {
      const response = await fetch('/api/subscription/status', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setSubscriptionStatus(data)
      }
    } catch (_error) {
      console.error('Failed to fetch subscription status:', _error)
    }
  }, [token])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user && token) {
      fetchNotes()
      fetchSubscriptionStatus()
    }
  }, [user, loading, token, router, fetchNotes, fetchSubscriptionStatus])

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.title.trim() || !newNote.content.trim()) return

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newNote)
      })

      const data = await response.json()
      
      if (response.ok) {
        setNotes([data.note, ...notes])
        setNewNote({ title: '', content: '' })
        setIsCreating(false)
        fetchSubscriptionStatus() // Refresh usage stats
      } else {
        setError(data.error)
      }
    } catch (_error) {
      console.error('Failed to create note:', _error)
      setError('Failed to create note')
    }
  }

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingNote || !editingNote.title.trim() || !editingNote.content.trim()) return

    try {
      const response = await fetch(`/api/notes/${editingNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editingNote.title,
          content: editingNote.content
        })
      })

      if (response.ok) {
        const data = await response.json()
        setNotes(notes.map(note => 
          note.id === editingNote.id ? data.note : note
        ))
        setEditingNote(null)
      }
    } catch (_error) {
      console.error('Failed to update note:', _error)
      setError('Failed to update note')
    }
  }

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        setNotes(notes.filter(note => note.id !== id))
        fetchSubscriptionStatus() // Refresh usage stats
      }
    } catch (_error) {
      console.error('Failed to delete note:', _error)
      setError('Failed to delete note')
    }
  }

  const handleUpgrade = async () => {
    if (!user?.tenant.slug) return

    try {
      const response = await fetch(`/api/tenants/${user.tenant.slug}/upgrade`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        // Refresh user data and subscription status
        window.location.reload()
      } else {
        const data = await response.json()
        setError(data.error)
      }
    } catch (_error) {
      console.error('Failed to upgrade subscription:', _error)
      setError('Failed to upgrade subscription')
    }
  }

  if (loading || loadingNotes) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notes Dashboard</h1>
              <p className="text-sm text-gray-600">
                {user.tenant.name} • {user.role} • {user.tenant.subscription} Plan
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {user.role === 'ADMIN' && (
                <button
                  onClick={() => router.push('/admin')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Admin Panel
                </button>
              )}
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
            <button onClick={() => setError('')} className="ml-2 font-bold">×</button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subscription Status */}
        {subscriptionStatus && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Subscription Status</h3>
                <div className="mt-2 flex items-center space-x-6 text-sm text-gray-600">
                  <span>Notes: {subscriptionStatus.usage.notes}/{subscriptionStatus.limits.notes === -1 ? '∞' : subscriptionStatus.limits.notes}</span>
                  <span>Users: {subscriptionStatus.usage.users}/{subscriptionStatus.limits.users === -1 ? '∞' : subscriptionStatus.limits.users}</span>
                </div>
              </div>
              {subscriptionStatus.canUpgrade && user.role === 'ADMIN' && (
                <button
                  onClick={handleUpgrade}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Upgrade to Pro
                </button>
              )}
            </div>
            {subscriptionStatus.isLimitReached.notes && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800 text-sm">
                  {`You've reached your note limit. Upgrade to Pro for unlimited notes.`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Notes Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">My Notes</h2>
              <button
                onClick={() => setIsCreating(true)}
                disabled={subscriptionStatus?.isLimitReached.notes}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium disabled:cursor-not-allowed"
              >
                + New Note
              </button>
            </div>
          </div>

          {/* Create Note Form */}
          {isCreating && (
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <form onSubmit={handleCreateNote}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Note title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <textarea
                    placeholder="Write your note here..."
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Create Note
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false)
                        setNewNote({ title: '', content: '' })
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Notes List */}
          <div className="p-6">
            {notes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No notes yet. Create your first note to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    {editingNote?.id === note.id ? (
                      <form onSubmit={handleUpdateNote}>
                        <input
                          type="text"
                          value={editingNote.title}
                          onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                          className="w-full mb-3 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <textarea
                          value={editingNote.content}
                          onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                          rows={4}
                          className="w-full mb-3 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <div className="flex space-x-2">
                          <button type="submit" className="text-blue-600 hover:text-blue-700 text-sm">Save</button>
                          <button type="button" onClick={() => setEditingNote(null)} className="text-gray-600 hover:text-gray-700 text-sm">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <h3 className="font-semibold text-gray-900 mb-2 truncate">{note.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.content}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                          <div className="space-x-2">
                            <button
                              onClick={() => setEditingNote(note)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
