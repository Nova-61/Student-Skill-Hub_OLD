import { useEffect, useState } from "react"
import ChatModal from "./ChatModal"

interface AppliedTask {
  id: number
  title: string
  unread_count: number
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [tasks, setTasks] = useState<AppliedTask[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [totalUnread, setTotalUnread] = useState(0)

  const loadAppliedTasks = async () => {
    try {
      const token = localStorage.getItem("access")
      if (!token) return

      const { api } = await import("../api")
      const res = await api.get("tasks/applied/")
      setTasks(res.data)

      const unread = res.data.reduce((sum: number, t: AppliedTask) => sum + (t.unread_count || 0), 0)
      setTotalUnread(unread)
    } catch (e) {
      console.error("Failed to load applied tasks", e)
    }
  }

  useEffect(() => {
    loadAppliedTasks()

    // Listen for applied/withdrawn events
    const handleAppliedChanged = () => {
      loadAppliedTasks()
    }

    window.addEventListener("applied_changed", handleAppliedChanged)
    return () => window.removeEventListener("applied_changed", handleAppliedChanged)
  }, [])

  if (!localStorage.getItem("access")) {
    return null
  }

  return (
    <>
      {/* Floating chat button - minimalist */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-blue-700 active:scale-95 transition-all duration-200"
        title="Чат"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8l-2 2V4h14v12z" />
        </svg>
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md text-xxs">
            {totalUnread > 9 ? "9+" : totalUnread}
          </span>
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-40 bg-white rounded-lg shadow-2xl w-72 max-h-96 overflow-y-auto border border-gray-200 animate-slideUp">
          <div className="sticky top-0 p-4 border-b border-gray-200 bg-white font-semibold text-gray-900 text-sm">
            Мои отклики
          </div>
          {tasks.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-xs">Нет откликов на задания</div>
          ) : (
            tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => {
                  setSelectedTaskId(task.id)
                  setIsOpen(false)
                }}
                className="w-full text-left p-3 border-b border-gray-100 hover:bg-blue-50 flex justify-between items-start transition-colors duration-150 gap-2"
              >
                <span className="text-xs text-gray-800 flex-1 line-clamp-2">
                  {task.title}
                </span>
                {task.unread_count > 0 && (
                  <span className="ml-2 flex-shrink-0 inline-flex bg-red-500 text-white text-xs rounded-full w-5 h-5 items-center justify-center font-bold">
                    {task.unread_count > 9 ? "9+" : task.unread_count}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}

      {/* Chat modal for selected task */}
      {selectedTaskId && <ChatModal taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />}
    </>
  )
}

