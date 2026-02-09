import { useState, useEffect } from "react"
import { api } from "../api"

interface ResumeData {
  id?: number
  title: string
  summary: string
  phone: string
  location: string
  skills: string
  experience: string
  education: string
  portfolio_url: string
}

interface ResumeFormProps {
  isEditing: boolean
  setIsEditing: (value: boolean) => void
}

export default function ResumeForm({ isEditing, setIsEditing }: ResumeFormProps) {
  const [resume, setResume] = useState<ResumeData>({
    title: "",
    summary: "",
    phone: "",
    location: "",
    skills: "",
    experience: "",
    education: "",
    portfolio_url: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadResume()
  }, [])

  const loadResume = async () => {
    try {
      const res = await api.get("users/me/resume/")
      setResume(res.data)
    } catch (err) {
      setMessage("Ошибка при загрузке резюме")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setResume((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    try {
      await api.put("users/me/resume/", resume)
      setMessage("Резюме успешно сохранено!")
      setIsEditing(false)
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Ошибка при сохранении резюме")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-gray-600">Загрузка резюме...</p>
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-3 rounded ${
          !message.toLowerCase().includes("ошибка") 
            ? "bg-green-50 text-green-700" 
            : "bg-red-50 text-red-700"
        }`}>
          {message}
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4">
          {/* Professional Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Профессиональное звание
            </label>
            <input
              type="text"
              name="title"
              value={resume.title}
              onChange={handleChange}
              placeholder="Например: Senior React Developer"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              О себе
            </label>
            <textarea
              name="summary"
              value={resume.summary}
              onChange={handleChange}
              rows={3}
              placeholder="Расскажите о себе, своем опыте и целях..."
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Телефон
              </label>
              <input
                type="tel"
                name="phone"
                value={resume.phone}
                onChange={handleChange}
                placeholder="+7 (999) 123-45-67"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Местоположение
              </label>
              <input
                type="text"
                name="location"
                value={resume.location}
                onChange={handleChange}
                placeholder="Москва"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Навыки (через запятую)
            </label>
            <textarea
              name="skills"
              value={resume.skills}
              onChange={handleChange}
              rows={2}
              placeholder="JavaScript, React, TypeScript, Node.js, Python..."
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Опыт работы
            </label>
            <textarea
              name="experience"
              value={resume.experience}
              onChange={handleChange}
              rows={3}
              placeholder="2020-2023: Senior Developer at Company X
2023-Present: Lead Developer at Company Y"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Образование
            </label>
            <textarea
              name="education"
              value={resume.education}
              onChange={handleChange}
              rows={2}
              placeholder="2016-2020: Moscow State University - Computer Science"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Portfolio URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Портфолио (URL)
            </label>
            <input
              type="url"
              name="portfolio_url"
              value={resume.portfolio_url}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Сохранение..." : "Сохранить изменения"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Display Resume Info */}
          {resume.title && (
            <div>
              <h3 className="text-2xl font-bold">{resume.title}</h3>
            </div>
          )}

          {resume.summary && (
            <div>
              <p className="text-gray-700">{resume.summary}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
            {resume.phone && (
              <div>
                <p className="text-sm font-medium text-gray-600">Телефон</p>
                <p className="text-gray-800">{resume.phone}</p>
              </div>
            )}
            {resume.location && (
              <div>
                <p className="text-sm font-medium text-gray-600">Местоположение</p>
                <p className="text-gray-800">{resume.location}</p>
              </div>
            )}
          </div>

          {resume.skills && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Навыки</p>
              <div className="flex flex-wrap gap-2">
                {resume.skills.split(",").map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {resume.experience && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Опыт работы</p>
              <pre className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap text-gray-800">
                {resume.experience}
              </pre>
            </div>
          )}

          {resume.education && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Образование</p>
              <pre className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap text-gray-800">
                {resume.education}
              </pre>
            </div>
          )}

          {resume.portfolio_url && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Портфолио</p>
              <a
                href={resume.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {resume.portfolio_url}
              </a>
            </div>
          )}

          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
          >
            Редактировать резюме
          </button>
        </div>
      )}
    </div>
  )
}
