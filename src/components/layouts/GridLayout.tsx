import { motion } from 'framer-motion'
import type { Link, RSSItem } from '@/lib/types'
import { ExternalLink } from 'lucide-react'

interface Props {
  items: (Link | RSSItem)[]
  config?: Record<string, any>
}

export default function GridLayout({ items, config = {} }: Props) {
  const columns = config.columns || 3

  const isLink = (item: any): item is Link => 'section_id' in item
  const isRSSItem = (item: any): item is RSSItem => 'pubDate' in item

  return (
    <div
      className="grid gap-6 w-full"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${300 / columns}px, 1fr))`,
      }}
    >
      {items.map((item, index) => (
        <motion.div
          key={isLink(item) ? item.id : index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
        >
          {/* Thumbnail */}
          {(isLink(item) ? item.thumbnail_url : item.thumbnail) && (
            <div className="aspect-video w-full overflow-hidden bg-gray-100">
              <img
                src={isLink(item) ? item.thumbnail_url! : item.thumbnail!}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {item.title}
            </h3>
            
            {isLink(item) && item.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {item.description}
              </p>
            )}

            {isRSSItem(item) && (
              <p className="text-sm text-gray-500">
                {new Date(item.pubDate).toLocaleDateString()}
              </p>
            )}

            {/* Link */}
            <a
              href={isLink(item) ? item.url : item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mt-2"
              onClick={() => {
                if (isLink(item)) {
                  // Track click
                  supabase.from('link_clicks').insert({
                    link_id: item.id,
                    clicked_at: new Date().toISOString(),
                  })
                }
              }}
            >
              View <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
