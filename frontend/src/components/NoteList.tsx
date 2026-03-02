import { useToggleArchiveNote, useDeleteNote } from '../hooks/useNotes'
import type { Note } from '../types'

interface NoteListProps {
  notes: Note[]
  onEdit: (note: Note) => void
}

export default function NoteList({ notes, onEdit }: NoteListProps) {
  const toggleArchive = useToggleArchiveNote()
  const deleteNote = useDeleteNote()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-800 line-clamp-1">
              {note.title}
            </h3>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {note.content}
          </p>

          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {note.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              {formatDate(note.created_at)}
            </span>
            
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(note)}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <button
                onClick={() => toggleArchive.mutate(note.id)}
                disabled={toggleArchive.isPending}
                className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                title={note.is_archived ? "Unarchive" : "Archive"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {note.is_archived ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  )}
                </svg>
              </button>
              
              <button
                onClick={() => {
                  if (confirm('Delete this note?')) {
                    deleteNote.mutate(note.id)
                  }
                }}
                disabled={deleteNote.isPending}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
