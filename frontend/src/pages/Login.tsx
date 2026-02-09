import { useState } from "react"
import { login, getMe } from "../auth"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      const data = await getMe()
      setUser(data)
      setError("")
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error logging in")
    }
  }

  if (user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          Logged in as <b>{user.email}</b>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          Login
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
    </div>
  )
}
