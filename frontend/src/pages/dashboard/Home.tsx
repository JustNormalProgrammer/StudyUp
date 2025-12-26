import { CirclePlus } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { SessionFormData } from '@/components/sessions/SessionForm'
import { WeeklyChartStack } from '@/components/charts/MonthStack'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthProvider'
import SessionForm from '@/components/sessions/SessionForm'
import { api } from '@/api/api'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'

export default function Home() {
  const { user } = useAuth()
  const [showCreateSessionDialog, setShowCreateSessionDialog] = useState(false)
  const api = useAuthenticatedRequest()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (sessionData: SessionFormData) => {
      return api.post('/sessions', sessionData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      setShowCreateSessionDialog(false)
      toast.success('Session created successfully')
    },
    onError: (error) => {
      console.log(error)
      toast.error('Failed to create session')
    },
  })
  return (
    <main className="grid grid-cols-1 justify-items-center md:grid-cols-2 gap-0 max-w-7xl mx-auto">
      <WeeklyChartStack />
      <Card className="w-full">
        <CardHeader>What did you learn today?</CardHeader>
        <CardContent>
          <Button onClick={() => setShowCreateSessionDialog(true)}>
            <CirclePlus />
            Add new session
          </Button>
        </CardContent>
      </Card>
      <div>
        <div>Dashboard</div>
        <div>{user?.username}</div>
        <div>{user?.userId}</div>
        <div>{user?.email}</div>
      </div>
      <SessionForm
        open={showCreateSessionDialog}
        setOpen={setShowCreateSessionDialog}
        onSubmit={(data) => mutation.mutate(data)}
      />
    </main>
  )
}
