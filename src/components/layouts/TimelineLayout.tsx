import { motion } from 'framer-motion'
import type { RSSItem } from '@/lib/types'
import { Calendar } from 'lucide-react'

interface Props {
  items: RSSItem[]
}

export default function TimelineLayout({ items }: Props) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-primary-300" />

      <div className="space-y-8 pl-8">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {/* Timeline dot */}
            <div className="absolute -left-9 top-2 w-4 h-4 rounded-full bg-primary-600 border-4 border-white shadow-md" />

            {/* Content card */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Calendar className="h-4 w-4" />
                {new Date(item.pubDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>

              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>

              {item.description && (
                <p className="text-gray-600 mb-4">{item.description}</p>
              )}

              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full rounded-lg mb-4"
                />
              )}

              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-primary-600 hover:text-primary-700 font-medium"
              >
                Read more →
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
