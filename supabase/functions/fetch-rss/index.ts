import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Parser from 'npm:rss-parser'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { feedUrl, maxItems = 10 } = await req.json()

    if (!feedUrl) {
      throw new Error('feedUrl is required')
    }

    const parser = new Parser({
      customFields: {
        feed: ['image'],
        item: [
          ['media:thumbnail', 'mediaThumbnail'],
          ['media:content', 'mediaContent'],
          ['content:encoded', 'contentEncoded'],
        ],
      },
    })

    const feed = await parser.parseURL(feedUrl)

    const items = feed.items.slice(0, maxItems).map((item: any) => {
      // Extract thumbnail from various sources
      let thumbnail = null
      if (item.mediaThumbnail?.$ ?.url) {
        thumbnail = item.mediaThumbnail.$.url
      } else if (item.enclosure?.url) {
        thumbnail = item.enclosure.url
      } else if (item.mediaContent?.[0]?.$ ?.url) {
        thumbnail = item.mediaContent[0].$.url
      }

      return {
        title: item.title || 'Untitled',
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        description: item.contentSnippet || item.summary || '',
        thumbnail,
        author: item.creator || item.author || feed.title,
      }
    })

    return new Response(
      JSON.stringify({
        success: true,
        feedTitle: feed.title,
        items,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: any) {
    console.error('RSS fetch error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to fetch RSS feed',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
