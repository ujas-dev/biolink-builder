import { useState } from 'react'
import { Plus, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'
import type { Section } from '@/lib/types'
import LinkEditor from './LinkEditor'
import RSSFeedEditor from './RSSFeedEditor'

interface Props {
  section: Section
  onUpdate: (updates: Partial<Section>) => Promise<void>
  onDelete: () => Promise<void>
}

export default function SectionEditor({ section, onUpdate, onDelete }: Props) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showLinkEditor, setShowLinkEditor] = useState(false)

  const layoutOptions = [
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'timeline', label: 'Timeline' },
    { value: 'carousel', label: 'Carousel' },
    { value: 'bento', label: 'Bento' },
  ]

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 border-b border-gray-200">
        <button className="cursor-grab hover:bg-gray-200 p-2 rounded">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </button>

        <input
          type="text"
          value={section.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Section Title"
          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />

        <select
          value={section.layout}
          onChange={(e) => onUpdate({ layout: e.target.value as any })}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          {layoutOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => onUpdate({ visible: !section.visible })}
          className={`p-2 rounded-lg ${
            section.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
          }`}
        >
          {section.visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:bg-gray-200"
        >
          {isExpanded ? '▼' : '▶'}
        </button>

        <button
          onClick={onDelete}
          className="p-2 rounded-lg hover:bg-red-100 text-red-600"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="p-4">
          {section.type === 'rss' ? (
            <RSSFeedEditor section={section} onUpdate={onUpdate} />
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Links</h4>
                <button
                  onClick={() => setShowLinkEditor(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Link
                </button>
              </div>

              {showLinkEditor && (
                <LinkEditor
                  sectionId={section.id}
                  onClose={() => setShowLinkEditor(false)}
                />
              )}

              <LinksListEditor sectionId={section.id} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Sub-component for managing links in a section
function LinksListEditor({ sectionId }: { sectionId: string }) {
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLinks()
  }, [sectionId])

  const fetchLinks = async () => {
    const { data } = await supabase
      .from('links')
      .select('*')
      .eq('section_id', sectionId)
      .order('position')

    setLinks(data || [])
    setLoading(false)
  }

  const deleteLink = async (linkId: string) => {
    await supabase.from('links').delete().eq('id', linkId)
    fetchLinks()
  }

  if (loading) return <div className="py-4">Loading links...</div>

  return (
    <div className="space-y-2">
      {links.map((link) => (
        <div
          key={link.id}
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
        >
          {link.icon_url && (
            <img src={link.icon_url} alt="" className="w-8 h-8 rounded" />
          )}
          <div className="flex-1">
            <div className="font-medium">{link.title}</div>
            <div className="text-sm text-gray-600 truncate">{link.url}</div>
          </div>
          <button
            onClick={() => deleteLink(link.id)}
            className="p-2 hover:bg-red-100 text-red-600 rounded"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
