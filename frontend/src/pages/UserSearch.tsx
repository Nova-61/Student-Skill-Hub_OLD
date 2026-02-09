import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import UserSearch from "../components/UserSearch"

export default function UserSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <UserSearch />
      <Footer />
    </div>
  )
}
