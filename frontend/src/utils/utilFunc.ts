export function hexToRgba(hex: string, alpha = 0.1) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return hex
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const getColor = (percent: number) => {
  if (percent >= 80) return 'oklch(72.3% 0.219 149.579)' // zielony
  if (percent >= 50) return 'oklch(90.5% 0.182 98.111)' // żółty
  return 'oklch(57.7% 0.245 27.325)' // czerwony
}