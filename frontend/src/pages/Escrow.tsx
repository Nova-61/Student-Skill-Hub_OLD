import Navbar from "../components/Navbar"
import { useEscrowNotifications } from "../hooks/useEscrowNotifications.tsx"

export default function EscrowPage() {
  const escrows = useEscrowNotifications()

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Escrow Payments</h1>
        {escrows.map((e) => (
          <div
            key={e.id}
            className={`bg-white p-4 rounded shadow mb-3 transition ${
              e.status === "pending" ? "border-l-4 border-yellow-500" : ""
            }`}
          >
            <div className="flex justify-between">
              <span>{e.task}</span>
              <span>{e.status}</span>
            </div>
            <div className="mt-2">${e.amount}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
