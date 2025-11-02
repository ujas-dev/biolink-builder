import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Section } from '@/lib/types'

export function useSections(profileId: string | null) {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profileId) {
      setLoading(false)
      return
    }
    fetchSections()
  }, [profileId])

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('profile_id', profileId!)
        .order('position')

      if (error) throw error
      setSections(data || [])
    } catch (err) {
      console.error('Error fetching sections:', err)
    } finally {
      setLoading(false)
    }
  }

  const addSection = async (section: Omit<Section, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('sections')
      .insert(section)
      .select()
      .single()

    if (error) throw error
    await fetchSections()
    return data
  }

  const updateSection = async (id: string, updates: Partial<Section>) => {
    const { error } = await supabase
      .from('sections')
      .update(updates)
      .eq('id', id)

    if (error) throw error
    await fetchSections()
  }

  const deleteSection = async (id: string) => {
    const { error } = await supabase
      .from('sections')
      .delete()
      .eq('id', id)

    if (error) throw error
    await fetchSections()
  }

  const reorderSections = async (newOrder: Section[]) => {
    const updates = newOrder.map((section, index) => ({
      id: section.id,
      position: index,
    }))

    for (const update of updates) {
      await supabase
        .from('sections')
        .update({ position: update.position })
        .eq('id', update.id)
    }

    await fetchSections()
  }

  return {
    sections,
    loading,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    refetch: fetchSections,
  }
}
