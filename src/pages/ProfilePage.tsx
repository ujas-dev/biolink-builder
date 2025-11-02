import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { Profile, Section, Link } from '@/lib/types'
import GridLayout from '@/components/layouts/GridLayout'
import ListLayout from '@/components/layouts/ListLayout'
import TimelineLayout from '@/components/layouts/TimelineLayout'
import { useRSSFeed } from '@/hooks/useRSSFeed'

export default function ProfilePage() {
  const { username } = useParams()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [links, setLinks] = useState<Record<string, Link[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfileData()
  }, [username])

  const fetchProfileData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username!)
        .single()

      if (!profileData) {
        setLoading(false)
        return
      }

      setProfile(profileData)

      // Fetch sections
      const { data: sectionsData } = await supabase
        .from('sections')
        .select('*')
        .eq('profile_id', profileData.id)
        .eq('visible', true)
        .order('position')

      setSections(sectionsData || [])

      // Fetch links for each section
      const linksMap: Record<string, Link[]> = {}
      for (const section of sectionsData || []) {
        const { data: linksData } = await supabase
          .from('links')
          .select('*')
          .eq('section_id', section.id)
          .eq('visible', true)
          .order('position')

        linksMap[section.id] = linksData || []
      }
      setLinks(linksMap)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-12">
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
            />
          )}
          <h1 className="text-3xl font-bold mb-2">
            {profile.display_name || profile.username}
          </h1>
          {profile.bio && (
            <p className="text-gray-600 max-w-2xl mx-auto">{profile.bio}</p>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section.id}>
              {section.title && (
                <h2 className="text-2xl font-bold mb-6 text-center">
                  {section.title}
                </h2>
              )}

              <SectionRenderer
                section={section}
                links={links[section.id] || []}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS */}
      {profile.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: profile.custom_css }} />
      )}
    </div>
  )
}

function SectionRenderer({ section, links }: { section: Section; links: Link[] }) {
  if (section.type === 'rss') {
    return <RSSSectionRenderer section={section} />
  }

  const layoutComponents = {
    list: ListLayout,
    grid: GridLayout,
    timeline: TimelineLayout,
    carousel: ListLayout, // Simplified for now
    bento: GridLayout,
  }

  const LayoutComponent = layoutComponents[section.layout] || ListLayout

  return <LayoutComponent items={links} config={section.config} />
}

function RSSSectionRenderer({ section }: { section: Section }) {
  const feedUrl = section.config.feedUrl
  const maxItems = section.config.maxItems || 10
  const { items, loading } = useRSSFeed(feedUrl, maxItems)

  if (loading) {
    return <div className="text-center py-8">Loading feed...</div>
  }

  if (section.layout === 'timeline') {
    return <TimelineLayout items={items} />
  }

  return <GridLayout items={items} config={section.config} />
}
