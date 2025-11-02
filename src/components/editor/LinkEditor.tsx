import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { X, Upload } from 'lucide-react'

interface Props {
  sectionId: string
  onClose: () => void
}

export default function LinkEditor({ sectionId, onClose }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    icon_url: '',
    thumbnail_url: '',
  })
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Get current max position
      const { data: existingLinks } = await supabase
        .from('links')
        .select('position')
        .eq('section_id', sectionId)
        .order('position', { ascending: false })
        .limit(1)

      const position = existingLinks?.[0]?.position ?? 0

      const { error } = await supabase.from('links').insert({
        section_id: sectionId,
        ...formData,
        position: position + 1,
      })

      if (error) throw error

      toast.success('Link added successfully!')
      onClose()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const uploadImage = async (file: File, type: 'icon' | 'thumbnail') => {
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${type}s/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('link-assets')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('link-assets')
        .getPublicUrl(filePath)

      if (type === 'icon') {
        setFormData({ ...formData, icon_url: data.publicUrl })
      } else {
        setFormData({ ...formData, thumbnail_url: data.publicUrl })
      }

      toast.success('Image uploaded!')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Add Link</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="My Awesome Link"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">URL *</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="https://example.com"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Icon Image</label>
              <input
                type="text"
                value={formData.icon_url}
                onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 mb-2"
                placeholder="https://..."
              />
              <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="h-5 w-5" />
                Upload Icon
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) uploadImage(file, 'icon')
                  }}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            <div>
              <label className="block font-medium mb-2">Thumbnail Image</label>
              <input
                type="text"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 mb-2"
                placeholder="https://..."
              />
              <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="h-5 w-5" />
                Upload Thumbnail
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) uploadImage(file, 'thumbnail')
                  }}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Add Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
