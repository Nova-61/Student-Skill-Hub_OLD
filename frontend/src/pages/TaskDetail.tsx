import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { api } from "../api"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

interface Task {
  id: number
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
}

export default function TaskDetail() {
  const { id } = useParams()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [isApplied, setIsApplied] = useState(false)

  useEffect(() => {
    loadTask()
  }, [id])

  const loadTask = async () => {
    try {
      const res = await api.get(`tasks/${id}/`)
      setTask(res.data)
      const appliedKey = `applied_task_${id}`
      setIsApplied(localStorage.getItem(appliedKey) === "1")
    } catch (err) {
      console.error("Ошибка при загрузке задачи:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("access")
      if (!token) {
        window.location.href = "/login"
        return
      }
      await api.post(`tasks/${id}/apply/`)
      window.dispatchEvent(new CustomEvent("applied_changed"))
      alert("Отклик отправлен!")
      localStorage.setItem(`applied_task_${id}`, "1")
      setIsApplied(true)
    } catch (err) {
      alert("Не удалось отправить отклик")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 text-sm">Загрузка...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 text-sm">Задача не найдена</p>
        </div>
        <Footer />
      </div>
    )
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
              {task.owner_name && (
                <p className="text-sm text-gray-600">От: <span className="font-semibold">{task.owner_name}</span></p>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">₽{task.price}</div>
              <div className="text-xs text-gray-600 mt-1">{task.status === "open" ? "Открыто" : task.status}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {task.city && (
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Город</p>
                <p className="text-sm text-gray-600">📍 {task.city}</p>
              </div>
            )}
            {task.deadline && (
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Сроки</p>
                <p className="text-sm text-gray-600">📅 {new Date(task.deadline).toLocaleDateString("ru-RU")}</p>
              </div>
            )}
            {task.importance && (
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Важность</p>
                <span className={`text-xs px-3 py-1 rounded ${getImportanceColor(task.importance)}`}>
                  {task.importance === "critical" ? "Критическая" : task.importance === "high" ? "Высокая" : task.importance === "medium" ? "Средняя" : "Низкая"}
                </span>
              </div>
            )}
          </div>

          <div className="border-t pt-6 mb-6">
            <p className="text-xs font-semibold text-gray-700 mb-3">Описание</p>
            <p className="text-sm text-gray-700 leading-relaxed">{task.description}</p>
          </div>

          {task.skills_required && (
            <div className="border-t pt-6 mb-6">
              <p className="text-xs font-semibold text-gray-700 mb-3">Требуемые навыки</p>
              <div className="flex flex-wrap gap-2">
                {task.skills_required.split(",").map((skill, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            {!isApplied ? (
              <button
                onClick={handleApply}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
              >
                Откликнуться на задачу
              </button>
            ) : (
              <div className="w-full bg-green-100 text-green-700 px-6 py-2 rounded-lg text-center text-sm font-semibold">
                ✓ Вы уже откликнулись на эту задачу
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
