import { ErrorBoundary } from 'react-error-boundary'
import { CircleX, RefreshCcw } from 'lucide-react'
import { WeeklyChartStack } from '@/components/charts/MonthStack'
import ProgressGoal from '@/components/home/ProgressGoal'
import ActionButtons from '@/components/home/ActionButtons'
import StatCards from '@/components/home/StatCards'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col gap-3 items-center justify-center mt-50 text-center">
          <CircleX className="size-20 md:size-40 text-red-500" />
          <div className="text-2xl md:text-2xl font-semibold">
            Oops... Something went wrong!
          </div>
          <div className="text-md text-muted-foreground">
            An error occurred while loading this page. Please try again.
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCcw className="size-4" />
            Reload
          </Button>
        </div>
      }
    >
      <main className="grid grid-cols-1 justify-items-center xl:grid-cols-2 gap-5.5 max-w-7xl mx-auto">
        <WeeklyChartStack />
        <div className="flex flex-col gap-5.5 w-full">
          <ActionButtons />
          <ProgressGoal />
        </div>
        <div className="flex flex-row gap-5.5 w-full xl:col-span-2">
          <StatCards />
        </div>
      </main>
    </ErrorBoundary>
  )
}
