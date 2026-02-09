import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { api } from "../api"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

interface UserData {
  id: number
  email: string
  username: string
  avatar?: string
  bio?: string
}

interface UserTask {
  id: number
  title: string
  status: string
  price: number
}

export default function UserPublicProfile() {
  // параметр ID из URL
  const { id } = useParams()
  // данные пользователя
  const [user, setUser] = useState<UserData | null>(null)
  // список вакансий пользователя
  const [tasks, setTasks] = useState<UserTask[]>([])
  const [loading, setLoading] = useState(true)

  // загружаем профиль при открытии страницы
  useEffect(() => {
    loadUserProfile()
  }, [id])

  // загружаем данные пользователя и его задачи
  const loadUserProfile = async () => {
    try {
      // получаем информацию о пользователе
      const res = await api.get(`users/${id}/`)
      setUser(res.data)
      
      // загружаем только его вакансии
      const tasksRes = await api.get(`tasks/?owner_id=${id}`)
      setTasks(tasksRes.data.results || tasksRes.data || [])
    } catch (err) {
      console.error("Ошибка при загрузке профиля:", err)
    } finally {
      setLoading(false)
    }
  }

  // получаем инициалы для аватара
  const getAvatarInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 text-sm">Загрузка профиля...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 text-sm">Пользователь не найден</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="md:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 sticky top-20">
              {/* Avatar */}
              <div className="mb-4">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full rounded-lg border border-gray-300 shadow-sm object-cover"
                  />
                ) : (
                  <div className="w-full aspect-square rounded-lg border border-gray-300 shadow-sm bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-5xl">
                    {getAvatarInitials(user.username)}
                  </div>
                )}
              </div>

              {/* User Info */}
              <h1 className="text-lg font-bold text-gray-900 mb-1">{user.username}</h1>
              <p className="text-xs text-gray-600 mb-3">{user.email}</p>

              {user.bio && (
                <p className="text-xs text-gray-700 mb-4 leading-relaxed border-t pt-3">{user.bio}</p>
              )}

              <a
                href={`/profile/${user.id}`}
                className="block mt-4 w-full bg-blue-600 text-white py-2 rounded text-xs font-semibold text-center hover:bg-blue-700 transition"
              >
                Посмотреть полный профиль
              </a>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Вакансии ({tasks.length})</h2>
              
              {tasks.length === 0 ? (
                <p className="text-xs text-gray-600">Нет вакансий</p>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <a
                      key={task.id}
                      href={`/tasks/${task.id}`}
                      className="block p-3 bg-gray-50 border border-gray-200 rounded hover:border-blue-300 transition group"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition">
                          {task.title}
                        </h3>
                        <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700 flex-shrink-0">
                          {task.status === "open" ? "Открыто" : task.status === "completed" ? "Завершено" : task.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-2 font-semibold">
                        {task.price} руб.
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
