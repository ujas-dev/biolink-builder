import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/components/auth/AuthProvider'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/lib/supabase'
import { Settings, ExternalLink, BarChart2, Copy, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { profile, loading } = useProfile(user?.id || null)
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState({ totalClicks: 0, totalViews: 0 })

  useEffect(() => {
    if (profile) {
      fetchAnalytics()
    }
  }, [profile])

  const fetchAnalytics = async () => {
    const { count: clicks } = await supabase
      .from('link_clicks')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile!.id)

    setAnalytics({ totalClicks: clicks || 0, totalViews: 0 })
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const copyProfileLink = () => {
    const url = `${window.location.origin}/${profile?.username}`
    navigator.clipboard.writeText(url)
    toast.success('Profile link copied!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            {profile?.avatar_url && (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">
                {profile?.display_name || profile?.username}
              </h2>
              <p className="text-gray-600 mb-4">@{profile?.username}</p>
              <div className="flex gap-3">
                <a
                  href={`/${profile?.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <ExternalLink className="h-5 w-5" />
                  View Profile
                </a>
                <button
                  onClick={copyProfileLink}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <Copy className="h-5 w-5" />
                  Copy Link
                </button>
                <button
                  onClick={() => navigate('/editor')}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <Settings className="h-5 w-5" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {profile?.bio && (
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{profile.bio}</p>
          )}
        </div>

        {/* Analytics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <BarChart2 className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-3xl font-bold">{analytics.totalClicks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ExternalLink className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Profile Views</p>
                <p className="text-3xl font-bold">{analytics.totalViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Sections</p>
                <p className="text-3xl font-bold">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/editor')}
              className="p-6 border-2 border-dashed rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all"
            >
              <div className="text-4xl mb-2">🔗</div>
              <div className="font-semibold">Add Links</div>
            </button>
            <button
              onClick={() => navigate('/editor')}
              className="p-6 border-2 border-dashed rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all"
            >
              <div className="text-4xl mb-2">📡</div>
              <div className="font-semibold">Add RSS Feed</div>
            </button>
            <button
              onClick={() => navigate('/editor')}
              className="p-6 border-2 border-dashed rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all"
            >
              <div className="text-4xl mb-2">🎨</div>
              <div className="font-semibold">Change Theme</div>
            </button>
            <button
              onClick={() => navigate('/editor')}
              className="p-6 border-2 border-dashed rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all"
            >
              <div className="text-4xl mb-2">⚙️</div>
              <div className="font-semibold">Settings</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
