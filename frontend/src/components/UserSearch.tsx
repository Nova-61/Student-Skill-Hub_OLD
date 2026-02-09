import { useState, useEffect } from "react"
import { api } from "../api"

interface User {
  id: number
  email: string
  username: string
  avatar?: string
  resume?: {
    title?: string
    location?: string
    skills?: string
  }
  avg_rating?: number
  total_reviews?: number
}

export default function UserSearch() {
  // состояние для списка пользователей
  const [users, setUsers] = useState<User[]>([])
  // состояние загрузки
  const [loading, setLoading] = useState(false)
  // параметры поиска
  const [searchQuery, setSearchQuery] = useState("")
  const [skill, setSkill] = useState("")
  const [location, setLocation] = useState("")

  // загружаем список при открытии страницы
  useEffect(() => {
    searchUsers()
  }, [])

  const searchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      if (skill) params.append("skill", skill)
      if (location) params.append("location", location)

      const queryString = params.toString()
      const url = queryString ? `users/search/?${queryString}` : "users/search/"

      const res = await api.get(url)
      setUsers(res.data)
    } catch (err) {
      console.error("Ошибка при поиске пользователей:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchUsers()
  }

  const getRatingColor = (rating: number | undefined) => {
    if (!rating) return "text-gray-500"
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 3) return "text-blue-600"
    return "text-orange-600"
  }

  const getAvatarInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex-1">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-bold text-gray-900 mb-6">Поиск специалистов</h1>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Поиск по имени или email
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Введите имя или email..."
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Навык
                </label>
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="Например: React, Python"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Местоположение
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Например: Москва"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              {loading ? "Поиск..." : "Поиск"}
            </button>
          </form>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-sm">Загрузка...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600 text-sm">Специалистов не найдено</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 p-5 transition-all duration-300 flex flex-col h-full">
                
                {/* Аватар */}
                <div className="flex justify-center mb-4">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-20 h-20 rounded-full border-3 border-blue-200 object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full border-3 border-blue-200 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-sm">
                      {getAvatarInitials(user.username)}
                    </div>
                  )}
                </div>

                {/* Имя и почта */}
                <h3 className="text-sm font-semibold text-gray-900 text-center">{user.username}</h3>
                <p className="text-xs text-gray-500 text-center mb-4">{user.email}</p>

                {/* Рейтинг */}
                <div className="flex items-center justify-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <span className={`font-semibold text-sm ${getRatingColor(user.avg_rating)}`}>
                    {user.avg_rating ? user.avg_rating.toFixed(1) : "Нет оценок"}
                  </span>
                  <span className="text-xs text-gray-600">
                    ({user.total_reviews} {user.total_reviews === 1 ? "отзыв" : "отзывов"})
                  </span>
                </div>

                {/* Информация из резюме */}
                <div className="flex-1 mb-4">
                  {user.resume?.title && (
                    <p className="text-xs font-medium text-gray-900 text-center mb-2">{user.resume.title}</p>
                  )}
                  
                  {user.resume?.location && (
                    <p className="text-xs text-gray-600 text-center mb-3">{user.resume.location}</p>
                  )}

                  {/* Навыки */}
                  {user.resume?.skills && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Навыки</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {user.resume.skills.split(",").slice(0, 3).map((skillItem, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-200 transition-colors hover:bg-blue-100"
                          >
                            {skillItem.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Кнопка профиля */}
                <a
                  href={`/profile/${user.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-xs font-semibold text-center hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105 active:scale-95 w-full"
                >
                  Профиль
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
