import { useEffect, useState } from "react"
import { api } from "../api"
import TaskCard from "../components/TaskCard"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import TaskForm from "../components/TaskForm"

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

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [selectedImportance, setSelectedImportance] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [priceMin, setPriceMin] = useState<number | "">("")
  const [priceMax, setPriceMax] = useState<number | "">("")

  useEffect(() => {
    loadCurrentUser()
    loadTasks()
  }, [])

  const loadCurrentUser = async () => {
    try {
      const res = await api.get("users/me/")
      setCurrentUserId(res.data.id)
    } catch (err) {
      console.error("Ошибка при загрузке текущего пользователя:", err)
    }
  }

  const loadTasks = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      if (selectedStatus) params.append("status", selectedStatus)
      if (selectedImportance) params.append("importance", selectedImportance)
      if (selectedCity) params.append("city", selectedCity)
      if (priceMin !== "") params.append("price_min", String(priceMin))
      if (priceMax !== "") params.append("price_max", String(priceMax))
      
      const res = await api.get(`tasks/?${params.toString()}`)
      setTasks(res.data)
      setFilteredTasks(res.data)
    } catch (err) {
      console.error("Ошибка при загрузке задач:", err)
    } finally {
      setLoading(false)
    }
  }

  // Reload tasks when filters change
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(loadTasks, 300) // debounce
    return () => clearTimeout(timer)
  }, [searchQuery, selectedStatus, selectedImportance, selectedCity, priceMin, priceMax])

  const handleTaskCreated = () => {
    setShowCreateForm(false)
    loadTasks()
  }

  const handleTaskUpdated = () => {
    loadTasks()
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedStatus("")
    setSelectedImportance("")
    setSelectedCity("")
    setPriceMin("")
    setPriceMax("")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto p-3 sm:p-4 grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 flex-1 w-full">
        {/* Sidebar - Responsive */}
        <aside className="col-span-1 bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 h-fit md:sticky md:top-20 order-2 md:order-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-sm text-gray-900">Фильтры</h3>
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Очистить
            </button>
          </div>

          {/* Search filter */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Поиск
            </label>
            <input
              type="text"
              placeholder="Название, навыки..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* City filter */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Город
            </label>
            <input
              type="text"
              placeholder="Москva, СПБ..."
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Status filter */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Статус
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="">Все статусы</option>
              <option value="open">Открыта</option>
              <option value="in_progress">В процессе</option>
              <option value="completed">Завершена</option>
              <option value="disputed">В споре</option>
            </select>
          </div>

          {/* Importance filter */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Важность
            </label>
            <select
              value={selectedImportance}
              onChange={(e) => setSelectedImportance(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="">Все уровни</option>
              <option value="critical">Критическая</option>
              <option value="high">Высокая</option>
              <option value="medium">Средняя</option>
              <option value="low">Низкая</option>
            </select>
          </div>

          {/* Price range filter */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Бюджет (₽)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="От"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value ? Number(e.target.value) : "")}
                className="w-1/2 border border-gray-300 rounded px-3 py-2 text-xs bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <input
                type="number"
                placeholder="До"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : "")}
                className="w-1/2 border border-gray-300 rounded px-3 py-2 text-xs bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </aside>

        <main className="col-span-1 md:col-span-3 order-1 md:order-2">
          <div className="flex justify-between items-center mb-4 gap-4 flex-col sm:flex-row">
            <h1 className="text-lg font-bold text-gray-900">Вакансии</h1>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded text-xs font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              {showCreateForm ? "Отмена" : "+ Создать"}
            </button>
          </div>

          {showCreateForm && (
            <div className="mb-6">
              <TaskForm onSuccess={handleTaskCreated} onCancel={() => setShowCreateForm(false)} />
            </div>
          )}

          {loading ? (
            <div className="text-gray-500 text-sm">Загрузка...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-gray-500 text-sm">
              {tasks.length === 0
                ? "Нет вакансий"
                : "По вашим фильтрам не найдено вакансий"}
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-600 mb-4">
                Показано {filteredTasks.length} из {tasks.length} вакансий
              </p>
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  price={task.price}
                  status={task.status}
                  city={task.city}
                  deadline={task.deadline}
                  importance={task.importance}
                  skills_required={task.skills_required}
                  owner_id={task.owner_id}
                  owner_name={task.owner_name}
                  currentUserId={currentUserId}
                  onTaskUpdated={handleTaskUpdated}
                />
              ))}
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}
