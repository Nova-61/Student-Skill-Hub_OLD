export default function Footer() {
  // основной футер с информацией и ссылками
  return (
    <footer className="bg-gray-50 text-gray-600 border-t border-gray-200 transition-colors duration-300">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center">
        <div className="w-full max-w-6xl">
        {/* блоки информации */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
          {/* информация о платформе */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2 text-sm">SSH</h4>
            <p className="text-xs text-gray-600">Платформа поиска специалистов</p>
          </div>
          {/* навигация */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-2 text-xs">Платформа</h5>
            <ul className="space-y-1 text-xs">
              <li><a href="/tasks" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Задачи</a></li>
              <li><a href="/users/search" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Специалисты</a></li>
            </ul>
          </div>
          {/* api документация */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-2 text-xs">API</h5>
            <ul className="space-y-1 text-xs">
              <li><a href="http://localhost:8000/api/docs/" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Документация</a></li>
            </ul>
          </div>
        </div>
        {/* копирайт */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-center text-xs text-gray-500">
            © 2026 Student Skill Hub. Все права защищены.
          </p>
        </div>
        </div>
      </div>
    </footer>
  )
}