
import { useEffect, useState } from "react"
import { api } from "../api"

export function useEscrowNotifications() {
  const [escrows, setEscrows] = useState<any[]>([])

  useEffect(() => {
    const fetchEscrows = async () => {
      const res = await api.get("payments/")
      setEscrows(res.data)
    }
    fetchEscrows()
    const interval = setInterval(fetchEscrows, 5000) // обновляем каждые 5 сек
    return () => clearInterval(interval)
  }, [])

  return escrows
}
