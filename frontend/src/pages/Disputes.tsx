import { useEffect, useState } from "react"
import { api } from "../api"
import Navbar from "../components/Navbar"

interface Dispute {
  id: number
  task: string
  reason: string
  status: string
}

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([])

  useEffect(() => {
    api.get("disputes/").then((res) => setDisputes(res.data))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Disputes</h1>
        {disputes.map((d) => (
          <div key={d.id} className="bg-white p-4 rounded shadow mb-3 hover:shadow-lg transition">
            <div className="flex justify-between">
              <span>{d.task}</span>
              <span>{d.status}</span>
            </div>
            <div className="mt-2">{d.reason}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
