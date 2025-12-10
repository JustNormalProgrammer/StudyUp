export function hexToRgba(hex: string, alpha = 0.1) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return hex
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function getLast7DaysLabels() {
  const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' })
  const today = new Date()

  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return formatter.format(d)
  })
}
