import { useState } from "react"
import { login, register } from "../auth"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setMessage("Заполните все поля")
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      localStorage.setItem("user_email", email)
      setMessage("Вход выполнен успешно!")
      setTimeout(() => {
        window.location.href = "/tasks"
      }, 500)
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Ошибка входа")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !username || !password || !confirmPassword) {
      setMessage("Заполните все поля")
      return
    }
    if (password !== confirmPassword) {
      setMessage("Пароли не совпадают")
      return
    }

    setLoading(true)
    try {
      const res = await register(email, username, password)
      setMessage(`Успешно! Зарегистрирован ${res.email}`)
      setTimeout(() => {
        setTab("login")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
      }, 500)
    } catch (err: any) {
      const data = err.response?.data
      if (data) {
        const parts: string[] = []
        Object.values(data).forEach((v: any) => {
          if (Array.isArray(v)) parts.push(...v.map((x) => String(x)))
          else parts.push(String(v))
        })
        setMessage(parts.join(" ") || "Ошибка регистрации")
      } else {
        setMessage("Ошибка регистрации")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => {
              setTab("login")
              setMessage("")
            }}
            className={`flex-1 py-3 text-center font-semibold border-b-2 transition ${
              tab === "login"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Войти
          </button>
          <button
            onClick={() => {
              setTab("register")
              setMessage("")
            }}
            className={`flex-1 py-3 text-center font-semibold border-b-2 transition ${
              tab === "register"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Регистрация
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded text-sm ${
              !message.toLowerCase().includes("ошибка")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Login Form */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Загрузка..." : "Войти"}
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя пользователя
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Подтвердите пароль
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Загрузка..." : "Зарегистрироваться"}
            </button>
          </form>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
