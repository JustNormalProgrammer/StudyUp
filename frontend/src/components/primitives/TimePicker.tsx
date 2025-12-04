import { Input } from "../ui/input"

export function TimePicker({value, onChange, id}: {value: string, onChange: (time: string) => void, id: string}) {
  return (
    <Input
      type="time"
      id={id}
      step="HH:mm"
      value={value}
      onChange={(e) => {
        console.log(e.target.value)
        onChange(e.target.value)
      }}
      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
    />
  )
}
