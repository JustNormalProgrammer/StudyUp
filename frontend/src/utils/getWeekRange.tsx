export function getWeekRange(date: Date) {
  const day = date.getDay()
  const diffToMonday = (day + 6) % 7

  const monday = new Date(date)
  monday.setDate(date.getDate() - diffToMonday)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  return {
    from: monday,
    to: sunday,
  }
}
