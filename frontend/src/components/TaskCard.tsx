import { useState } from "react"
import EditTaskModal from "./EditTaskModal"

interface TaskCardProps {
  id?: number
  title: string
  description: string
  price: number
  status: string
  city?: string
  deadline?: string
  importance?: string
  skills_required?: string
  owner_id?: number
  owner_name?: string
  currentUserId?: number | null
  onTaskUpdated?: () => void
}

export default function TaskCard({
  id,
  title,
  description,
  price,
  status,
  city,
  deadline,
  importance,
  skills_required,
  owner_id,
  owner_name,
  currentUserId,
  onTaskUpdated,
}: TaskCardProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const appliedKey = `applied_task_${id}`
  const isApplied = id ? localStorage.getItem(appliedKey) === "1" : false
  const isOwner = currentUserId && owner_id && currentUserId === owner_id

  const onApply = async () => {
    if (!id) return
    try {
      // require authentication
      const token = localStorage.getItem("access")
      if (!token) {
        window.location.href = "/login"
        return
      }
      const { api } = await import("../api")
      await api.post(`tasks/${id}/apply/`)
      // notify widgets to refresh
      window.dispatchEvent(new CustomEvent("applied_changed"))
      alert("Отклик отправлен — теперь вы можете писать в чате по этой задаче")
      // mark local flag for immediate UI update
      localStorage.setItem(appliedKey, "1")
      const list = JSON.parse(localStorage.getItem("applied_tasks") || "[]") as number[]
      if (!list.includes(id)) {
        list.push(id)
        localStorage.setItem("applied_tasks", JSON.stringify(list))
      }
      // update UI without reload
      window.location.reload()
    } catch (err) {
      alert("Не удалось отправить отклик")
    }
  }

  const getImportanceColor = (importance?: string) => {
    switch (importance) {
      case "critical":
        return "bg-red-100 text-red-700"
      case "high":
        return "bg-orange-100 text-orange-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getImportanceLabel = (importance?: string) => {
    switch (importance) {
      case "critical":
        return "Критическая"
      case "high":
        return "Высокая"
      case "medium":
        return "Средняя"
      case "low":
        return "Низкая"
      default:
        return "Средняя"
    }
  }

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null
    const date = new Date(deadline)
    return date.toLocaleDateString("ru-RU", { month: "short", day: "numeric" })
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 hover:shadow-md transition-all duration-200 flex justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{title}</h3>
            {isOwner && (
              <button
                onClick={() => setShowEditModal(true)}
                className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition-colors flex-shrink-0"
              >
                Ред.
              </button>
            )}
          </div>
          {owner_name && (
            <div className="text-xs text-gray-600 mb-2">От: <span className="font-medium text-gray-900">{owner_name}</span></div>
          )}
          <p className="text-gray-600 text-xs line-clamp-2">{description}</p>

          {/* Tags and Info */}
          <div className="mt-2 flex gap-2 flex-wrap items-center text-xs">
            {city && <span className="text-gray-600">📍 {city}</span>}
            {deadline && (
              <span className="text-gray-600">📅 {formatDeadline(deadline)}</span>
            )}
            {importance && (
              <span className={`px-2 py-1 rounded text-xs font-medium transition-colors ${getImportanceColor(importance)}`}>
                {getImportanceLabel(importance)}
              </span>
            )}
          </div>

          {/* Skills */}
          {skills_required && (
            <div className="mt-2 flex gap-1 flex-wrap">
              {skills_required.split(",").slice(0, 3).map((skill, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded transition-colors">
                  {skill.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
          <div className="text-right">
            <div className="text-sm font-bold text-gray-900">₽{price}</div>
            <div className="text-xs text-gray-600">{status === "open" ? "Открыто" : status === "in_progress" ? "В процессе" : status === "completed" ? "Завершено" : status}</div>
          </div>

          {!isOwner && (
            <>
              {!isApplied ? (
                <button
                  onClick={onApply}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap font-semibold hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105 active:scale-95"
                >
                  Откликнуться
                </button>
              ) : (
                <div className="text-xs text-green-600 font-medium">✓ Отклик</div>
              )}
            </>
          )}
        </div>
      </div>

      {showEditModal && id && (
        <EditTaskModal
          task={{
            id,
            title,
            description,
            price,
            status,
            city,
            deadline,
            importance,
            skills_required,
          }}
          onClose={() => setShowEditModal(false)}
          onSaved={() => {
            setShowEditModal(false)
            if (onTaskUpdated) onTaskUpdated()
          }}
        />
      )}
    </>
  )
}
