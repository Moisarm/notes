import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateNote, useUpdateNote } from '../hooks/useNotes'
import { useTags } from '../hooks/useTags'
import type { Note } from '../types'
import clsx from 'clsx'

interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  note?: Note | null
}

interface FormData {
  title: string
  content: string
}

export default function NoteModal({ isOpen, onClose, note }: NoteModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()
  const { data: tagsData } = useTags()
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()

  const tags = tagsData?.data?.items || []
  const isEditing = !!note

  useEffect(() => {
    if (note) {
      reset({ title: note.title, content: note.content })
      setSelectedTags(note.tags?.map(t => t.id) || [])
    } else {
      reset({ title: '', content: '' })
      setSelectedTags([])
    }
  }, [note, reset, isOpen])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && note) {
        await updateNote.mutateAsync({
          id: note.id,
          title: data.title,
          content: data.content,
          tag_ids: selectedTags,
        })
      } else {
        await createNote.mutateAsync({
          title: data.title,
          content: data.content,
          tag_ids: selectedTags,
        })
      }
      onClose()
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
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
            {isEditing ? 'Edit Note' : 'New Note'}
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                className={clsx(
                  'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                  errors.title ? 'border-red-500' : 'border-gray-300'
                )}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                {...register('content', { required: 'Content is required' })}
                rows={4}
                className={clsx(
                  'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none',
                  errors.content ? 'border-red-500' : 'border-gray-300'
                )}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={clsx(
                      'px-3 py-1 text-sm rounded-full transition-colors',
                      selectedTags.includes(tag.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {tag.name}
                  </button>
                ))}
                {tags.length === 0 && (
                  <p className="text-sm text-gray-400">No tags available</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createNote.isPending || updateNote.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {createNote.isPending || updateNote.isPending 
                  ? 'Saving...' 
                  : isEditing ? 'Update' : 'Create'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
