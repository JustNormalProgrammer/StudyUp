import { useAuth } from '@/contexts/AuthProvider'

function Dashboard() {
  const { user } = useAuth()
  return (
    <>
      <div>Dashboard</div>
      <div>{user?.username}</div>
      <div>{user?.userId}</div>
      <div>{user?.email}</div>
    </>
  )
}

export default Dashboard
