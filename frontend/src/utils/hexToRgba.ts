export function hexToRgba(hex: string, alpha = 0.1) {
  const r = parseInt(hex.slice(1, 3)) 
  const g = parseInt(hex.slice(3, 5))
  const b = parseInt(hex.slice(5, 7))
  if(isNaN(r) || isNaN(g) || isNaN(b)) {
    return hex;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
