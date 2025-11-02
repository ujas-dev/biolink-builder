import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { RSSItem } from '@/lib/types'

export function useRSSFeed(feedUrl: string, maxItems: number = 10) {
  const [items, setItems] = useState<RSSItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFeed = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: funcError } = await supabase.functions.invoke('fetch-rss', {
        body: { feedUrl, maxItems },
      })

      if (funcError) throw funcError
      setItems(data.items || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (feedUrl) {
      fetchFeed()
    }
  }, [feedUrl, maxItems])

  return { items, loading, error, refetch: fetchFeed }
}
