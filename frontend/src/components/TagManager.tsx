import { useState } from 'react'
import { useTags, useCreateTag, useDeleteTag } from '../hooks/useTags'

interface TagManagerProps {
  isOpen: boolean
  onClose: () => void
}

export default function TagManager({ isOpen, onClose }: TagManagerProps) {
  const [newTagName, setNewTagName] = useState('')
  const { data, isLoading } = useTags()
  const createTag = useCreateTag()
  const deleteTag = useDeleteTag()

  const tags = data?.data?.items || []

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTagName.trim()) return

    try {
      await createTag.mutateAsync(newTagName.trim())
      setNewTagName('')
    } catch (error) {
      console.error('Error creating tag:', error)
    }
  }

  const handleDeleteTag = async (id: string) => {
    if (!confirm('Delete this tag?')) return
    
    try {
      await deleteTag.mutateAsync(id)
    } catch (error) {
      console.error('Error deleting tag:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Manage Tags
          </h2>
          
          <form onSubmit={handleCreateTag} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="New tag..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={createTag.isPending || !newTagName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {createTag.isPending ? '...' : 'Add'}
            </button>
          </form>

          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : tags.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No tags</p>
            ) : (
              <ul className="space-y-2">
                {tags.map((tag) => (
                  <li
                    key={tag.id}
                    className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium text-gray-700">{tag.name}</span>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      disabled={deleteTag.isPending}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
