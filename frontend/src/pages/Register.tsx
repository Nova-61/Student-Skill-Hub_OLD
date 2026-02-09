import { useState } from "react"
import { register } from "../auth"

export default function Register() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await register(email, username, password)
      setMessage(`Registered ${res.email}`)
    } catch (err: any) {
      const data = err.response?.data
      if (data) {
        if (typeof data === "string") {
          setMessage(data)
        } else if (typeof data === "object") {
          // collect all error messages from serializer
          const parts: string[] = []
          Object.values(data).forEach((v: any) => {
            if (Array.isArray(v)) parts.push(...v.map((x) => String(x)))
            else parts.push(String(v))
          })
          setMessage(parts.join(" ") || "Error")
        } else {
          setMessage("Error")
        }
      } else {
        setMessage("Error")
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />

        <button className="w-full bg-blue-500 text-white py-2 rounded mt-2">
          Register
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  )
}
