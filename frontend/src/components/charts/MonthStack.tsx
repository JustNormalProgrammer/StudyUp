import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import type { ChartConfig } from '@/components/ui/chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { TrendingUp } from 'lucide-react'

const chartData = [
  {
    day: 'Monday',
    historia: 0,
    jezykiObce: 0,
    programowanie: 0,
    matematyka: 120,
  },
  {
    day: 'Tuesday',
    historia: 0,
    jezykiObce: 0,
    programowanie: 90,
    matematyka: 0,
  },
  {
    day: 'Wednesday',
    historia: 0,
    jezykiObce: 0,
    programowanie: 150,
    matematyka: 0,
  },
  {
    day: 'Thursday',
    historia: 0,
    jezykiObce: 60,
    programowanie: 0,
    matematyka: 0,
  },
  {
    day: 'Friday',
    historia: 180,
    jezykiObce: 20,
    programowanie: 0,
    matematyka: 0,
  },
  {
    day: 'Saturday',
    historia: 0,
    jezykiObce: 12,
    programowanie: 0,
    matematyka: 0,
  },
  {
    day: 'Sunday',
    historia: 20,
    jezykiObce: 10,
    programowanie: 20,
    matematyka: 60,
  },
]

const chartConfig = {
  historia: {
    label: 'Historia',
    color: '#4F46E5',
  },
  jezykiObce: {
    label: 'Języki obce',
    color: '#10B981',
  },
  programowanie: {
    label: 'Programowanie',
    color: '#F59E0B',
  },
  matematyka: {
    label: 'Matematyka',
    color: '#EC4899',
  },
} satisfies ChartConfig

export function WeeklyChartStack() {
  return (
    <Card >
      <CardHeader>
        <CardTitle>Weekly Chart Stack</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[150px] xl:min-h-[250px]">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="historia" stackId="a" fill="var(--color-historia)" />
            <Bar
              dataKey="matematyka"
              stackId="a"
              fill="var(--color-matematyka)"
            />
            <Bar
              dataKey="jezykiObce"
              stackId="a"
              fill="var(--color-jezykiObce)"
            />
            <Bar
              dataKey="programowanie"
              stackId="a"
              fill="var(--color-programowanie)"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          You've spent 10 hours learning this week, keep it up!
        </div>
      </CardFooter> 
    </Card>
  )
}
