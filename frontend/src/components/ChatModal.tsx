import { useEffect, useRef, useState } from "react"

export default function ChatModal({ taskId, onClose }: { taskId: number; onClose: () => void }) {
  // список сообщений чата
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([])
  // текст нового сообщения
  const [text, setText] = useState("")
  // состояние загрузки
  const [loading, setLoading] = useState(true)
  // WebSocket соединение
  const ws = useRef<WebSocket | null>(null)
  // ссылка на конец списка сообщений для скролла
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // загружаем историю сообщений
    (async () => {
      try {
        const { api } = await import("../api")
        // получаем историю чата
        const historyRes = await api.get(`tasks/${taskId}/messages/`)
        const historyMessages = Array.isArray(historyRes.data) ? historyRes.data : historyRes.data.results || []
        setMessages(historyMessages.map((m: any) => ({
          sender: m.sender || "unknown",
          message: m.message || m.text || ""
        })))
        
        // отмечаем как прочитанные
        try {
          await api.post(`tasks/${taskId}/apply/mark_read/`)
          window.dispatchEvent(new CustomEvent("applied_changed"))
        } catch (e) {}
        
        setLoading(false)
      } catch (e) {
        console.error("Ошибка загрузки истории:", e)
        setLoading(false)
      }
    })()

    // подключаемся к WebSocket
    ws.current = new WebSocket(`ws://localhost:8000/ws/chat/${taskId}/`)
    ws.current.onmessage = (e) => {
      const d = JSON.parse(e.data)
      setMessages((m) => [...m, { sender: d.sender, message: d.message }])
    }
    ws.current.onerror = (e) => {
      console.error("Ошибка WebSocket:", e)
    }
    
    return () => ws.current?.close()
  }, [taskId])

  // автоскролл в конец списка
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = () => {
    if (!text) return
    ws.current?.send(JSON.stringify({ message: text }))
    setMessages((m) => [...m, { sender: "me", message: text }])
    setText("")
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 bg-white rounded-lg shadow-lg flex flex-col border border-gray-200">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="font-semibold text-sm">Чат #{taskId}</div>
        <button onClick={onClose} className="text-lg font-bold hover:text-gray-200">×</button>
      </div>

      <div className="p-3 flex-1 overflow-y-auto bg-gray-50">
        {loading ? (
          <div className="text-center text-gray-500 text-xs py-4">Загрузка сообщений...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 text-xs py-4">Нет сообщений</div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`mb-3 ${m.sender === "me" ? "text-right" : "text-left"}`}>
              <div className={`inline-block px-3 py-2 rounded-lg text-xs max-w-xs break-words ${
                m.sender === "me" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white border border-gray-300 text-gray-900"
              }`}>
                {m.message}
              </div>
              <div className="text-xs text-gray-500 mt-1">{m.sender === "me" ? "Вы" : m.sender}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-200 flex gap-2 bg-white rounded-b-lg">
        <input 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && send()}
          placeholder="Сообщение..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={send} 
          className="bg-blue-600 text-white px-3 py-2 rounded text-xs font-semibold hover:bg-blue-700 transition-colors"
        >
          Отправить
        </button>
      </div>
    </div>
  )
}
