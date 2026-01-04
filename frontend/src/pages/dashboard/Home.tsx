import { WeeklyChartStack } from '@/components/charts/MonthStack'
import ProgressGoal from '@/components/home/ProgressGoal'
import ActionButtons from '@/components/home/ActionButtons'
import StatCards from '@/components/home/StatCards'

export default function Home() {
  return (
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
  )
}
