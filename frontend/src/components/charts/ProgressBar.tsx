import {
  Bar,
  BarChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

export default function ProgressBar({
  value,
  maxValue,
  label,
  showReferenceLines = false,
}: {
  value: number
  maxValue: number
  label: string
  showReferenceLines?: boolean
}) {
  const referenceLines = showReferenceLines
    ? Array.from({ length: maxValue - 1 }, (_, i) => i + 1)
    : []
  return (
    <div className="flex flex-row gap-2 items-center">
      <ResponsiveContainer width="100%" height={15}>
        <BarChart
          data={[
            {
              name: 'today',
              value: Math.min(value, maxValue),
            },
          ]}
          layout="vertical"
          margin={{ top: -2, right: 0, left: 0, bottom: -2 }}
        >
          <XAxis type="number" domain={[0, maxValue]} hide />
          <YAxis type="category" dataKey="name" domain={[0, 1]} hide />
          <Bar
            dataKey="value"
            fill="#8DE8BC"
            radius={10}
            background={{ fill: '#eee', radius: 10 }}
            isAnimationActive
          />
          {referenceLines.map((line) => (
            <ReferenceLine
              key={line}
              x={line}
              stroke="#888"
              ifOverflow="hidden"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <div className="text-xs text-muted-foreground font-semibold text-nowrap tracking-wide w-25">
        {value} / {maxValue}{' '}
        <span className="text-xs text-gray-600 ">{label}</span>
      </div>
    </div>
  )
}
