export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'>
        Update: Partial<Omit<Profile, 'created_at'>>
      }
      sections: {
        Row: Section
        Insert: Omit<Section, 'id' | 'created_at'>
        Update: Partial<Omit<Section, 'id' | 'created_at'>>
      }
      links: {
        Row: Link
        Insert: Omit<Link, 'id' | 'created_at'>
        Update: Partial<Omit<Link, 'id' | 'created_at'>>
      }
      rss_sources: {
        Row: RSSSource
        Insert: Omit<RSSSource, 'id'>
        Update: Partial<Omit<RSSSource, 'id'>>
      }
      link_clicks: {
        Row: LinkClick
        Insert: Omit<LinkClick, 'id' | 'clicked_at'>
        Update: Partial<Omit<LinkClick, 'id' | 'clicked_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export interface Profile {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  theme: string
  custom_css: string | null
  analytics_enabled: boolean
  created_at: string
}

export interface Section {
  id: string
  profile_id: string
  type: 'links' | 'rss' | 'social' | 'video' | 'contact' | 'newsletter'
  title: string | null
  config: Json
  layout: 'list' | 'grid' | 'timeline' | 'carousel' | 'bento'
  position: number
  visible: boolean
  created_at: string
}

export interface Link {
  id: string
  section_id: string
  title: string
  url: string
  icon_url: string | null
  thumbnail_url: string | null
  description: string | null
  position: number
  click_count: number
  visible: boolean
  created_at: string
}

export interface RSSSource {
  id: string
  section_id: string
  feed_url: string
  feed_type: 'youtube' | 'blog' | 'podcast' | 'shopify' | 'generic'
  update_frequency: number
  last_fetched: string | null
  cache_items: RSSItem[] | null
  max_items: number
}

export interface RSSItem {
  title: string
  link: string
  pubDate: string
  description: string
  thumbnail: string | null
  author: string | null
}

export interface LinkClick {
  id: string
  link_id: string | null
  profile_id: string | null
  clicked_at: string
  referrer: string | null
  user_agent: string | null
}

export interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  borderRadius: string
}
