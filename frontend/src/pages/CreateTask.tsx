import { useState, useRef } from "react"
import { api } from "../api"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function CreateTask() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState<number>(12000)
  const [city, setCity] = useState("")
  const [deadline, setDeadline] = useState("")
  const [importance, setImportance] = useState("medium")
  const [skillsRequired, setSkillsRequired] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !price) {
      setMessage("Пожалуйста заполните обязательные поля")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("price", String(price))
      formData.append("city", city)
      formData.append("importance", importance)
      formData.append("skills_required", skillsRequired)
      if (deadline) {
        formData.append("deadline", deadline)
      }

      await api.post("tasks/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setMessage("Задача успешно создана!")
      setTitle("")
      setDescription("")
      setPrice(12000)
      setCity("")
      setDeadline("")
      setImportance("medium")
      setSkillsRequired("")
      setFiles([])
      if (fileInputRef.current) fileInputRef.current.value = ""

      setTimeout(() => {
        window.location.href = "/tasks"
      }, 1500)
    } catch (err: any) {
      console.error("Error:", err)
      setMessage((err.response?.data?.detail || err.message || "Ошибка при создании задачи"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6">
            <h1 className="text-2xl font-bold text-white mb-1">Создать новую задачу</h1>
            <p className="text-blue-100 text-sm">Найдите идеального специалиста для вашего проекта</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Message */}
            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  !message.toLowerCase().includes("ошиб")
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Название задачи *
              </label>
              <input
                type="text"
                placeholder="Разработка веб-приложения..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Описание задачи *
              </label>
              <textarea
                placeholder="Подробно опишите что нужно сделать..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
              />
            </div>

            {/* Price and City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Стоимость (₽) *
                </label>
                <input
                  type="number"
                  placeholder="12000"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  min="0"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Город
                </label>
                <input
                  type="text"
                  placeholder="Москва"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                />
              </div>
            </div>

            {/* Deadline and Importance */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Срок выполнения
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Важность
                </label>
                <select
                  value={importance}
                  onChange={(e) => setImportance(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                >
                  <option value="low">Низкая</option>
                  <option value="medium">Средняя</option>
                  <option value="high">Высокая</option>
                  <option value="critical">Критичная</option>
                </select>
              </div>
            </div>

            {/* Skills Required */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Требуемые навыки
              </label>
              <input
                type="text"
                placeholder="Python, Django, React..."
                value={skillsRequired}
                onChange={(e) => setSkillsRequired(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
              />
            </div>

            {/* Files */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Файлы (опционально)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 bg-gray-200 text-xs text-gray-900 rounded hover:bg-gray-300 transition"
                >
                  Выбрать файлы
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {files.length > 0 && (
                  <span className="text-xs text-gray-600">
                    {files.length} файл(ов)
                  </span>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded text-sm font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition transform hover:scale-105 active:scale-95"
              >
                {loading ? "Создание..." : "Создать"}
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-200 text-xs text-gray-900 rounded hover:bg-gray-300 transition"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
