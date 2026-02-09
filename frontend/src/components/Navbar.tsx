import { useState } from "react"
import { Link } from "react-router-dom"
import AuthModal from "./AuthModal"

function AvatarButton({ email, avatar }: { email?: string; avatar?: string }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={email || "User"}
        className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110"
      />
    )
  }
  return (
    <div className="flex items-center gap-2">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold cursor-pointer hover:shadow-lg transition-all duration-300 text-sm hover:scale-110">
        {email ? email[0].toUpperCase() : "U"}
      </div>
    </div>
  )
}

export default function Navbar() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const token = localStorage.getItem("access")
  const user = token ? localStorage.getItem("user_email") : null
  const avatar = token ? localStorage.getItem("avatar") : null

  const handleLogout = () => {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("user_email")
    localStorage.removeItem("avatar")
    localStorage.removeItem("user_id")
    window.location.href = "/tasks"
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-3 sm:px-6 lg:px-8">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-6">
            <Link to="/tasks" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105">
              SSH
            </Link>
            <nav className="hidden md:flex gap-5 text-sm">
              <Link to="/tasks" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                Задачи
              </Link>
              <a href="/users/search" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                Специалисты
              </a>
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {token ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:bg-gray-100 px-2.5 py-2 rounded-lg transition-colors duration-200"
                  title="Профиль"
                >
                  <AvatarButton email={user || undefined} avatar={avatar || undefined} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 hidden sm:block"
                >
                  Выход
                </button>
              </>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="text-xs text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </header>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  )
}
