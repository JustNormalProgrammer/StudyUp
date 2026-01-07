import {
  Bar,
  BarChart,
  BarStack,
  CartesianGrid,
  Label as RechartsLabel,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  ArrowRight,
  CircleSlash2,
  ListOrdered,
  Sigma,
} from 'lucide-react'
import { useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { Skeleton } from '../ui/skeleton'
import type { ChartConfig } from '@/components/ui/chart'
import type { UserSettings } from '@/api/types'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import { getWeekRange } from '@/utils/getWeekRange'

type StudySessionResponse = {
  tag: string
  tagColor: string
  duration: number
  startedAt: string
}

const WEEK_DAYS = [
  { key: 'Monday', index: 1 },
  { key: 'Tuesday', index: 2 },
  { key: 'Wednesday', index: 3 },
  { key: 'Thursday', index: 4 },
  { key: 'Friday', index: 5 },
  { key: 'Saturday', index: 6 },
  { key: 'Sunday', index: 0 },
]

function buildWeeklyChart(sessions: Array<StudySessionResponse>) {
  const usedTags = Array.from(new Set(sessions.map((s) => s.tag)))
  const chartConfig: ChartConfig = Object.fromEntries(
    usedTags.map((tag) => {
      const color = sessions.find((s) => s.tag === tag)?.tagColor ?? '#888'
      return [
        tag,
        {
          label: tag,
          color,
        },
      ]
    }),
  )

  const chartData = WEEK_DAYS.map(({ key }) => {
    const row: Record<string, number | string> = { day: key }
    usedTags.forEach((tag) => (row[tag] = 0))
    return row
  })

  sessions.forEach((session) => {
    const date = new Date(session.startedAt)

    const dayIndex = date.getDay()
    const dayKey = WEEK_DAYS.find((d) => d.index === dayIndex)?.key
    if (!dayKey) return

    const dayRow = chartData.find((d) => d.day === dayKey)
    if (!dayRow) return

    dayRow[session.tag] = (dayRow[session.tag] as number) + session.duration
  })

  return { chartData, chartConfig, usedTags }
}

export function WeeklyChartStack() {
  const api = useAuthenticatedRequest()
  const { showBoundary } = useErrorBoundary()
  const [date, setDate] = useState(new Date())
  const { from, to } = getWeekRange(date)
  const chartDataQuery = useQuery({
    queryKey: ['chart', 'weekly', from, to],
    queryFn: async () => {
      const { data } = await api.get<Array<StudySessionResponse>>(
        `/user/chart-data/sessions-duration?from=${from.toISOString()}&to=${to.toISOString()}`,
      )
      return data
    },
    placeholderData: (prev) => prev,
  })
  const settingsQuery = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get<UserSettings>('/user/settings')
      return data
    },
  })
  if (chartDataQuery.data && settingsQuery.data) {
    const { chartData, chartConfig, usedTags } = buildWeeklyChart(
      chartDataQuery.data,
    )
    const totalDuration = chartDataQuery.data.reduce(
      (acc, s) => acc + s.duration,
      0,
    )
    const avgDuration = totalDuration
      ? totalDuration / chartDataQuery.data.length
      : 0
    return (
      <Card className="w-full py-3">
        <CardContent className="h-full flex flex-col gap-3 justify-between">
          <CardHeader className="flex flex-row justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setDate(new Date(date.setDate(date.getDate() - 7)))
              }
            >
              <ArrowLeft />
            </Button>
            <div className="text-center font-medium">
              {from.toLocaleDateString()} - {to.toLocaleDateString()}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setDate(new Date(date.setDate(date.getDate() + 7)))
              }
            >
              <ArrowRight />
            </Button>
          </CardHeader>
          <div className="flex flex-col gap-1">
            <ChartContainer
              config={chartConfig}
              className="min-h-[150px] xl:min-h-[240px] xl:max-h-[310px] relative"
            >
              {chartDataQuery.isFetching && (
                <div className="absolute w-full h-full flex justify-center items-center z-999">
                  <Spinner className="h-10 w-full" />
                </div>
              )}
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <YAxis hide={true} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={5}
                  tickFormatter={(v) => v.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                <BarStack radius={[12, 12, 0, 0]} stackId="a">
                  {usedTags.map((tag) => (
                    <Bar
                      key={tag}
                      dataKey={tag}
                      fill={chartConfig[tag].color}
                      fillOpacity={0.85}
                      barSize={30}
                      opacity={chartDataQuery.isFetching ? 0.5 : 1}
                    />
                  ))}
                </BarStack>
                <ReferenceLine
                  y={settingsQuery.data.dailyStudyGoal}
                  stroke="#000"
                  strokeDasharray="3 4"
                >
                  <RechartsLabel
                    value={settingsQuery.data.dailyStudyGoal}
                    position="insideTopRight"
                  />
                </ReferenceLine>
              </BarChart>
            </ChartContainer>
            <div className="flex flex-row w-full justify-between gap-2 items-center flex-wrap">
              <Label
                icon={<CircleSlash2 size={16} className="mr-1" />}
                value={Number(avgDuration).toFixed(2)}
                label="min/day"
              />
              <Label
                icon={<ListOrdered size={16} className="mr-1" />}
                value={chartDataQuery.data.length}
                label="sessions"
              />
              <Label
                icon={<Sigma size={16} className="mr-1" />}
                value={Number(totalDuration).toFixed(2)}
                label="min"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  if (chartDataQuery.error) {
    toast.error('Failed to load weekly data')
  }
  if (settingsQuery.error) {
    showBoundary(settingsQuery.error)
  }
  return (
    <Card className="w-full py-3">
      <CardContent className="h-full flex gap-3 justify-between items-center">
        <Spinner className="h-10 md:h-20 w-full" />
      </CardContent>
    </Card>
  )
}

function Label({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string | number
  label: string
}) {
  return (
    <div className="text-gray-600 font-semibold flex flex-row items-center gap-0">
      {icon}
      <div>
        {value}
        <span className="text-xs text-gray-500 font-normal mx-0.25">
          {label}
        </span>
      </div>
    </div>
  )
}
