import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Section } from '@/lib/types'
import toast from 'react-hot-toast'
import { RefreshCw } from 'lucide-react'

interface Props {
  section: Section
  onUpdate: (updates: Partial<Section>) => Promise<void>
}

export default function RSSFeedEditor({ section, onUpdate }: Props) {
  const [feedUrl, setFeedUrl] = useState(section.config.feedUrl || '')
  const [maxItems, setMaxItems] = useState(section.config.maxItems || 10)
  const [testing, setTesting] = useState(false)

  const handleSave = async () => {
    await onUpdate({
      config: {
        ...section.config,
        feedUrl,
        maxItems,
      },
    })
    toast.success('RSS feed settings saved!')
  }

  const testFeed = async () => {
    setTesting(true)
    try {
      const { data, error } = await supabase.functions.invoke('fetch-rss', {
        body: { feedUrl, maxItems: 3 },
      })

      if (error) throw error

      toast.success(`Feed works! Found ${data.items.length} items`)
      console.log('Feed preview:', data.items)
    } catch (error: any) {
      toast.error(`Feed error: ${error.message}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium mb-2">RSS Feed URL</label>
        <input
          type="url"
          value={feedUrl}
          onChange={(e) => setFeedUrl(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          placeholder="https://example.com/feed.xml"
        />
        <p className="text-sm text-gray-600 mt-1">
          Supports: YouTube channels, WordPress blogs, Shopify, podcasts
        </p>
      </div>

      <div>
        <label className="block font-medium mb-2">Maximum Items</label>
        <input
          type="number"
          value={maxItems}
          onChange={(e) => setMaxItems(parseInt(e.target.value))}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          min="1"
          max="50"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={testFeed}
          disabled={!feedUrl || testing}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${testing ? 'animate-spin' : ''}`} />
          Test Feed
        </button>

        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Save Settings
        </button>
      </div>

      {/* Quick Templates */}
      <div className="pt-4 border-t">
        <p className="font-medium mb-2">Quick Templates:</p>
        <div className="space-y-2 text-sm">
          <button
            onClick={() => setFeedUrl('https://www.youtube.com/feeds/videos.xml?channel_id=')}
            className="block w-full text-left px-3 py-2 bg-gray-50 rounded hover:bg-gray-100"
          >
            YouTube Channel: Add your channel ID after the =
          </button>
          <button
            onClick={() => setFeedUrl('https://example.com/feed')}
            className="block w-full text-left px-3 py-2 bg-gray-50 rounded hover:bg-gray-100"
          >
            WordPress Blog: Replace with your blog URL + /feed
          </button>
        </div>
      </div>
    </div>
  )
}
