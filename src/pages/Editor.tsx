import { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useProfile } from '@/hooks/useProfile'
import { useSections } from '@/hooks/useSections'
import DragDropList from '@/components/editor/DragDropList'
import ThemeSelector from '@/components/editor/ThemeSelector'
import { Plus, Save, Eye, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export default function Editor() {
  const { user } = useAuth()
  const { profile, updateProfile } = useProfile(user?.id || null)
  const { sections, addSection, updateSection, deleteSection, reorderSections } = useSections(
    profile?.id || null
  )
  const [activeTab, setActiveTab] = useState<'content' | 'theme' | 'settings'>('content')
  const [profileData, setProfileData] = useState({
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || '',
  })

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileData)
      toast.success('Profile updated!')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleAddSection = async (type: string) => {
    try {
      await addSection({
        profile_id: profile!.id,
        type: type as any,
        title: `New ${type} Section`,
        config: {},
        layout: 'list',
        position: sections.length,
        visible: true,
      })
      toast.success('Section added!')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const uploadAvatar = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user!.id}-avatar.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

      setProfileData({ ...profileData, avatar_url: data.publicUrl })
      await updateProfile({ avatar_url: data.publicUrl })
      toast.success('Avatar uploaded!')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <div className="flex items-center gap-3">
              <a
                href={`/${profile?.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Eye className="h-5 w-5" />
                Preview
              </a>
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Save className="h-5 w-5" />
                Save Changes
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-6 border-b">
            <button
              onClick={() => setActiveTab('content')}
              className={`pb-3 px-2 font-semibold ${
                activeTab === 'content'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600'
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`pb-3 px-2 font-semibold ${
                activeTab === 'theme'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600'
              }`}
            >
              Theme
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 px-2 font-semibold ${
                activeTab === 'settings'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Content Tab */}
        {activeTab === 'content' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Sections</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddSection('links')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Plus className="h-5 w-5" />
                  Add Links Section
                </button>
                <button
                  onClick={() => handleAddSection('rss')}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <Plus className="h-5 w-5" />
                  Add RSS Feed
                </button>
              </div>
            </div>

            <DragDropList
              sections={sections}
              onReorder={reorderSections}
              onUpdateSection={updateSection}
              onDeleteSection={deleteSection}
            />
          </div>
        )}

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose Theme</h2>
            <ThemeSelector
              currentTheme={profile?.theme || 'default'}
              onSelectTheme={(themeId) => updateProfile({ theme: themeId })}
            />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

            <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
              <div>
                <label className="block font-medium mb-2">Profile Picture</label>
                <div className="flex items-center gap-4">
                  {profileData.avatar_url && (
                    <img
                      src={profileData.avatar_url}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="h-5 w-5" />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) uploadAvatar(file)
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2">Display Name</label>
                <input
                  type="text"
                  value={profileData.display_name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, display_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell people about yourself..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={profile?.username}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 cursor-not-allowed"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Username cannot be changed after creation
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
