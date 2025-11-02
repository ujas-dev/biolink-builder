import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Theme } from '@/lib/types'
import { Check } from 'lucide-react'

interface Props {
  currentTheme: string
  onSelectTheme: (themeId: string) => void
}

export default function ThemeSelector({ currentTheme, onSelectTheme }: Props) {
  const [themes, setThemes] = useState<Theme[]>([])

  useEffect(() => {
    // For now, use built-in themes
    setThemes(builtInThemes)
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onSelectTheme(theme.id)}
          className={`relative p-4 rounded-xl border-2 transition-all ${
            currentTheme === theme.id
              ? 'border-primary-600 shadow-lg'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {currentTheme === theme.id && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          )}

          <div className="aspect-video rounded-lg mb-3 overflow-hidden">
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
              }}
            />
          </div>

          <div className="text-left">
            <h3 className="font-semibold">{theme.name}</h3>
            <div className="flex gap-2 mt-2">
              {Object.entries(theme.colors).map(([key, color]) => (
                <div
                  key={key}
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                  title={key}
                />
              ))}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

const builtInThemes: Theme[] = [
  {
    id: 'default',
    name: 'Default',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      background: '#ffffff',
      text: '#1f2937',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    borderRadius: '0.75rem',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      background: '#1f2937',
      text: '#f9fafb',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    borderRadius: '0.75rem',
  },
  {
    id: 'gradient',
    name: 'Gradient Pop',
    colors: {
      primary: '#ec4899',
      secondary: '#f43f5e',
      background: '#fdf2f8',
      text: '#1f2937',
    },
    fonts: {
      heading: 'Poppins',
      body: 'Inter',
    },
    borderRadius: '1rem',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    colors: {
      primary: '#000000',
      secondary: '#404040',
      background: '#ffffff',
      text: '#000000',
    },
    fonts: {
      heading: 'Space Grotesk',
      body: 'Inter',
    },
    borderRadius: '0.25rem',
  },
  {
    id: 'retro',
    name: 'Retro Wave',
    colors: {
      primary: '#ff006e',
      secondary: '#8338ec',
      background: '#240046',
      text: '#ffffff',
    },
    fonts: {
      heading: 'Orbitron',
      body: 'Inter',
    },
    borderRadius: '0rem',
  },
  {
    id: 'nature',
    name: 'Nature',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      background: '#f0fdf4',
      text: '#065f46',
    },
    fonts: {
      heading: 'Merriweather',
      body: 'Open Sans',
    },
    borderRadius: '0.75rem',
  },
]
