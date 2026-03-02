import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTags } from '../hooks/useTags'
import { useNotes } from '../hooks/useNotes'
import NoteList from '../components/NoteList'
import NoteModal from '../components/NoteModal'
import TagManager from '../components/TagManager'
import clsx from 'clsx'
import type { Note } from '../types'

export default function Layout(_props: { children?: React.ReactNode }) {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { data: tagsData } = useTags()
  const [activeView, setActiveView] = useState<'active' | 'archived'>('active')
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false)

  const { data, isLoading, error } = useNotes({
    is_archived: activeView === 'archived',
    tag_id: selectedTagId || undefined,
    page,
    limit: 10,
  })

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const tags = tagsData?.data?.items || []
  const notes = data?.data?.items || []
  const totalPages = data?.data?.total_pages || 1

  const handleEdit = (note: Note) => {
    setEditingNote(note)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingNote(null)
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Notes App</h1>
          <p className="text-sm text-gray-500 mt-1">{user?.username}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => {
              setActiveView('active')
              setSelectedTagId(null)
            }}
            className={clsx(
              'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              activeView === 'active' && !selectedTagId
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            Active Notes
          </button>
          <button
            onClick={() => {
              setActiveView('archived')
              setSelectedTagId(null)
            }}
            className={clsx(
              'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              activeView === 'archived' && !selectedTagId
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            Archived
          </button>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              My Tags
            </h3>
            <div className="space-y-1">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => {
                    setActiveView('active')
                    setSelectedTagId(tag.id)
                  }}
                  className={clsx(
                    'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    selectedTagId === tag.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {tag.name}
                </button>
              ))}
              {tags.length === 0 && (
                <p className="px-3 text-sm text-gray-400">No tags</p>
              )}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {selectedTagId 
                ? 'Notes by Tag' 
                : activeView === 'archived' 
                  ? 'Archived Notes' 
                  : 'Active Notes'
              }
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsTagManagerOpen(true)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Manage Tags
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                New Note
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              Error loading notes
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No {activeView === 'archived' ? 'archived ' : ''}notes
            </div>
          ) : (
            <>
              <NoteList notes={notes} onEdit={handleEdit} />
              
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          <NoteModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            note={editingNote}
          />

          <TagManager
            isOpen={isTagManagerOpen}
            onClose={() => setIsTagManagerOpen(false)}
          />
        </div>
      </main>
    </div>
  )
}
