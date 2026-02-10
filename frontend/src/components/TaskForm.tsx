import { useState, useEffect } from "react"
import { api } from "../api"

interface TaskFormProps {
  taskId?: number
  onSuccess?: () => void
  onCancel?: () => void
}

export default function TaskForm({ taskId, onSuccess, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    deadline: "",
    importance: "medium",
    skills_required: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (taskId) {
      // Load task data for editing
      api
        .get(`tasks/${taskId}/`)
        .then((res) => {
          const task = res.data
          setFormData({
            title: task.title,
            description: task.description,
            price: task.price,
            city: task.city || "",
            deadline: task.deadline ? task.deadline.substring(0, 16) : "",
            importance: task.importance || "medium",
            skills_required: task.skills_required || "",
          })
        })
        .catch(() => setError("Ошибка при загрузке задачи"))
    }
  }, [taskId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Use FormData because backend parsers expect form/multipart data
      const fd = new FormData()
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== undefined) fd.append(k, String(v))
      })

      if (taskId) {
        // Update existing task
        await api.put(`tasks/${taskId}/`, fd, { headers: { "Content-Type": "multipart/form-data" } })
      } else {
        // Create new task
        await api.post("tasks/", fd, { headers: { "Content-Type": "multipart/form-data" } })
      }
      onSuccess?.()
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ошибка при сохранении задачи")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-6">{taskId ? "Редактировать задачу" : "Создать новую задачу"}</h2>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название задачи *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Например: Разработать мобильное приложение"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Стоимость (₽) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="100"
              className="w-full border rounded px-3 py-2"
              placeholder="10000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Описание задачи *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border rounded px-3 py-2"
            placeholder="Подробно опишите, что нужно сделать..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Город
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Москва"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Срок выполнения
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Важность
            </label>
            <select
              name="importance"
              value={formData.importance}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="low">Низкая</option>
              <option value="medium">Средняя</option>
              <option value="high">Высокая</option>
              <option value="critical">Критическая</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Требуемые навыки
            </label>
            <input
              type="text"
              name="skills_required"
              value={formData.skills_required}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="JavaScript, React, Node.js"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Сохранение..." : taskId ? "Обновить" : "Создать"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Отмена
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
