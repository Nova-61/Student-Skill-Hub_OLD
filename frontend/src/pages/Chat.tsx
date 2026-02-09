import { useEffect, useState, useRef } from "react"
import Navbar from "../components/Navbar"
import MessageCard from "../components/MessageCard"

interface Message {
  sender: string
  message: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8000/ws/chat/`)

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setMessages((prev) => [...prev, data])
    }

    return () => ws.current?.close()
  }, [])

  const sendMessage = () => {
    if (!text) return
    ws.current?.send(JSON.stringify({ message: text }))
    setText("")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-4 flex flex-col h-screen">
        <h1 className="text-3xl font-bold mb-4">Chat</h1>
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((m, i) => (
            <MessageCard key={i} sender={m.sender} text={m.message} isMe={m.sender === "me"} />
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
