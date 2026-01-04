import { useAuth } from '@/contexts/AuthProvider'
import { cn } from '@/lib/utils'

export default function Avatar({ className }: { className?: string }) {
  const { user } = useAuth()
  return (
    <div className={cn("rounded-full bg-primary/80 h-12 w-12 flex items-center justify-center font-semibold select-none text-xl", className)}>
      {user?.username.split('').slice(0, 2).join('').toUpperCase()}
    </div>
  )
}
