import {
  Bar,
  BarChart,
  BarStack,
  CartesianGrid,
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Button } from '../ui/button'
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
  const [date, setDate] = useState(new Date())
  const { from, to } = getWeekRange(date)
  const { data } = useQuery({
    queryKey: ['weekly-chart', 'bar', from, to],
    queryFn: async () => {
      const { data } = await api.get<Array<StudySessionResponse>>(
        `/user/chart-data?from=${from.toISOString()}&to=${to.toISOString()}`,
      )
      return data
    },
  })
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get<UserSettings>('/user/settings')
      return data
    },
  })

  const { chartData, chartConfig, usedTags } = buildWeeklyChart(data || [])
  const totalDuration = data?.reduce((acc, s) => acc + s.duration, 0) ?? 0
  const avgDuration = totalDuration ? totalDuration / (data?.length ?? 1) : 0
  return (
    <Card className="w-full py-3">
      <CardContent className="h-full flex flex-col gap-3 justify-between">
        <CardHeader className="flex flex-row justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDate(new Date(date.setDate(date.getDate() - 7)))}
          >
            <ArrowLeft />
          </Button>
          <div className="text-center font-medium">
            {from.toLocaleDateString()} - {to.toLocaleDateString()}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDate(new Date(date.setDate(date.getDate() + 7)))}
          >
            <ArrowRight />
          </Button>
        </CardHeader>
        <div className="flex flex-col gap-1">
          <ChartContainer
            config={chartConfig}
            className="min-h-[150px] xl:min-h-[240px] xl:max-h-[310px]"
          >
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
                  />
                ))}
              </BarStack>
              <ReferenceLine
                y={settings?.dailyStudyGoal}
                stroke="#000"
                strokeDasharray="3 4"
              />
            </BarChart>
          </ChartContainer>
          <div className="flex flex-row w-full justify-between gap-2 items-center flex-wrap">
            <Label
              icon={<CircleSlash2 size={16} className="mr-1" />}
              value={Number(avgDuration).toFixed(2)}
              label="min"
            />
            <Label
              icon={<ListOrdered size={16} className="mr-1" />}
              value={data?.length ?? 0}
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
        <span className="text-xs text-gray-500 font-normal mx-0.25">{label}</span>
      </div>
    </div>
  )
}
