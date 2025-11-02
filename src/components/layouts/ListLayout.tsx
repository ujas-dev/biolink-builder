import { motion } from 'framer-motion'
import type { Link } from '@/lib/types'
import { supabase } from '@/lib/supabase'

interface Props {
  items: Link[]
}

export default function ListLayout({ items }: Props) {
  const handleClick = async (linkId: string) => {
    await supabase.from('link_clicks').insert({
      link_id: linkId,
      clicked_at: new Date().toISOString(),
    })
  }

  return (
    <div className="space-y-3 w-full max-w-2xl mx-auto">
      {items.map((link, index) => (
        <motion.a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleClick(link.id)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all group"
        >
          {/* Icon/Thumbnail */}
          {(link.icon_url || link.thumbnail_url) && (
            <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={link.icon_url || link.thumbnail_url || ''}
                alt={link.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg group-hover:text-primary-600 transition-colors">
              {link.title}
            </h3>
            {link.description && (
              <p className="text-sm text-gray-600 truncate">
                {link.description}
              </p>
            )}
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all">
            →
          </div>
        </motion.a>
      ))}
    </div>
  )
}
