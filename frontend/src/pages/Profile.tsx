import { useEffect, useState, useRef } from "react"
import { api } from "../api"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ResumeForm from "../components/ResumeForm"

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
  city: string
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null)
  const [createdTasks, setCreatedTasks] = useState<UserTask[]>([])
  const [acceptedTasks, setAcceptedTasks] = useState<UserTask[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isResumeEditing, setIsResumeEditing] = useState(false)
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"account" | "resume" | "created" | "accepted">("account")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isTasksExpanded, setIsTasksExpanded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([
      api.get("users/me/"),
      api.get("tasks/?owner_id=" + localStorage.getItem("user_id")),
      api.get("tasks/applied/")
    ]).then(([userRes, tasksRes, appliedRes]) => {
      setUser(userRes.data)
      setUsername(userRes.data.username)
      setBio(userRes.data.bio || "")
      setCreatedTasks(tasksRes.data.results || tasksRes.data || [])
      setAcceptedTasks(appliedRes.data || [])
    }).catch(() => {
      setMessage("Ошибка при загрузке профиля")
    }).finally(() => setLoading(false))
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      const formData = new FormData()
      formData.append("username", username)
      formData.append("bio", bio)
      if (password) {
        if (password.length < 6) {
          setMessage("Пароль должен быть не менее 6 символов")
          return
        }
        formData.append("password", password)
      }
      if (avatarFile) {
        formData.append("avatar", avatarFile)
      }

      const res = await api.put("users/me/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setMessage("Профиль успешно обновлён!")
      setPassword("")
      setAvatarFile(null)
      setAvatarPreview(null)
      setIsEditing(false)
      setUser(res.data)
      setBio(res.data.bio || "")
      setUsername(res.data.username)
    } catch (err: any) {
      setMessage((err.response?.data?.detail || "Ошибка при сохранении"))
    }
  }

  const getAvatarInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase()
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      "open": "bg-green-100 text-green-700",
      "completed": "bg-blue-100 text-blue-700",
      "in_progress": "bg-yellow-100 text-yellow-700",
      "cancelled": "bg-red-100 text-red-700",
    }
    return colors[status] || colors["open"]
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar - GitHub style */}
          <div className="md:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 sticky top-20">
              {/* Avatar */}
              <div className="relative mb-4">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={user?.username}
                    className="w-full rounded-lg border border-gray-300 shadow-sm object-cover"
                  />
                ) : user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full rounded-lg border border-gray-300 shadow-sm object-cover"
                  />
                ) : (
                  <div className="w-full aspect-square rounded-lg border border-gray-300 shadow-sm bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-5xl">
                    {getAvatarInitials(user?.username || "")}
                  </div>
                )}
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg transition-colors text-lg"
                  >
                    📷
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {/* User Info */}
              <h1 className="text-lg font-bold text-gray-900 mb-1">{user?.username}</h1>
              <p className="text-xs text-gray-600 mb-3">{user?.email}</p>

              {!isEditing && user?.bio && (
                <p className="text-xs text-gray-700 mb-4 leading-relaxed">{user.bio}</p>
              )}

              {isEditing && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Краткое описание
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="О себе..."
                      rows={2}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Edit Button */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex-1 py-2 px-3 rounded font-semibold text-xs transition-colors duration-200 ${
                    isEditing
                      ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isEditing ? "Отмена" : "Изменить"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            {message && (
              <div
                className={`mb-4 p-3 rounded-lg text-xs border transition-all ${
                  !message.toLowerCase().includes("ошиб")
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                {message}
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("account")}
                  className={`flex-1 px-4 py-2 text-center text-xs font-semibold transition-colors duration-200 ${
                    activeTab === "account"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Личные данные
                </button>
                <button
                  onClick={() => setActiveTab("created")}
                  className={`flex-1 px-4 py-2 text-center text-xs font-semibold transition-colors duration-200 ${
                    activeTab === "created"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Созданы ({createdTasks.length})
                </button>
                <button
                  onClick={() => setActiveTab("accepted")}
                  className={`flex-1 px-4 py-2 text-center text-xs font-semibold transition-colors duration-200 ${
                    activeTab === "accepted"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Приняты ({acceptedTasks.length})
                </button>
                <button
                  onClick={() => setActiveTab("resume")}
                  className={`flex-1 px-4 py-2 text-center text-xs font-semibold transition-colors duration-200 ${
                    activeTab === "resume"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Резюме
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-4">
                {activeTab === "account" && (
                  <div>
                    {user && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Имя пользователя
                          </label>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={!isEditing}
                            className={`w-full border rounded px-3 py-2 text-xs transition-colors ${
                              isEditing
                                ? "bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                : "bg-gray-50 text-gray-600 border-gray-200 cursor-not-allowed"
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full border rounded px-3 py-2 text-xs bg-gray-50 text-gray-600 border-gray-200 cursor-not-allowed"
                          />
                        </div>

                        {isEditing && (
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              Новый пароль
                            </label>
                            <p className="text-xs text-gray-500 mb-2">Оставьте пусто для сохранения текущего</p>
                            <input
                              type="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full border rounded px-3 py-2 text-xs border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}

                        {isEditing && (
                          <button
                            onClick={handleSave}
                            className="w-full bg-green-600 text-white py-2 rounded font-semibold text-xs hover:bg-green-700 transition-colors mt-4"
                          >
                            Сохранить изменения
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "created" && (
                  <div>
                    {createdTasks.length === 0 ? (
                      <p className="text-xs text-gray-600">Вы ещё не создали ни одной вакансии</p>
                    ) : (
                      <div>
                        <div className="mb-3 flex justify-between items-center">
                          <p className="text-xs text-gray-600">
                            {createdTasks.length} вакансий создано
                          </p>
                          <button
                            onClick={() => setIsTasksExpanded(!isTasksExpanded)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                          >
                            {isTasksExpanded ? "Свернуть" : "Развернуть"}
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(isTasksExpanded ? createdTasks : createdTasks.slice(0, 3)).map((task) => (
                            <a
                              key={task.id}
                              href={`/tasks/${task.id}`}
                              className="block p-3 bg-gray-50 border border-gray-200 rounded hover:border-blue-300 transition-colors group"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <h3 className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {task.title}
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 font-medium ${getStatusBadge(task.status)}`}>
                                  {task.status === "open" ? "Открыто" : task.status === "completed" ? "Завершено" : task.status === "in_progress" ? "В процессе" : "Отменено"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
                                <span>{task.city}</span>
                                <span className="font-semibold text-gray-900">{task.price}₽</span>
                              </div>
                            </a>
                          ))}
                        </div>

                        {!isTasksExpanded && createdTasks.length > 3 && (
                          <p className="text-xs text-gray-600 mt-3 text-center">
                            Показаны первые 3 из {createdTasks.length} вакансий
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "accepted" && (
                  <div>
                    {acceptedTasks.length === 0 ? (
                      <p className="text-xs text-gray-600">Вы ещё не приняли ни одной вакансии</p>
                    ) : (
                      <div className="space-y-2">
                        {acceptedTasks.map((task) => (
                          <a
                            key={task.id}
                            href={`/tasks/${task.id}`}
                            className="block p-3 bg-gray-50 border border-gray-200 rounded hover:border-blue-300 transition-colors group"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {task.title}
                              </h3>
                              <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 font-medium ${getStatusBadge(task.status)}`}>
                                {task.status === "open" ? "Открыто" : task.status === "completed" ? "Завершено" : task.status === "in_progress" ? "В процессе" : "Отменено"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
                              <span>{task.city}</span>
                              <span className="font-semibold text-gray-900">{task.price}₽</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "resume" && (
                  <div>
                    <ResumeForm isEditing={isResumeEditing} setIsEditing={setIsResumeEditing} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

