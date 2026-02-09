import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Tasks from "./pages/Tasks"
import CreateTask from "./pages/CreateTask"
import Profile from "./pages/Profile"
import UserSearch from "./pages/UserSearch"
import UserPublicProfile from "./pages/UserPublicProfile"
import TaskDetail from "./pages/TaskDetail"
import EscrowPage from "./pages/Escrow"
import ChatPage from "./pages/Chat"
import ReviewsPage from "./pages/Reviews"
import DisputesPage from "./pages/Disputes"
import ProtectedRoute from "./components/ProtectedRoute"
import ChatWidget from "./components/ChatWidget"

function App() {

  return (
    <Router>
      <ChatWidget />
      <Routes>
        <Route path="/tasks" element={<Tasks />} />

        <Route
          path="/create-task"
          element={
            <ProtectedRoute>
              <CreateTask />
            </ProtectedRoute>
          }
        />

        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<UserPublicProfile />} />
        <Route path="/users/search" element={<UserSearch />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />

        <Route
          path="/escrow"
          element={
            <ProtectedRoute>
              <EscrowPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <ReviewsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/disputes"
          element={
            <ProtectedRoute>
              <DisputesPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </Router>
  )
}

export default App
