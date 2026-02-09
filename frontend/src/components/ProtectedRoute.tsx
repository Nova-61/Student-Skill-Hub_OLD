import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

interface Props {
  children: ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem("access")
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}
