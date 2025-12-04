import type { ReactNode } from 'react'

export default function ConditionalWrapper({
  condition,
  wrapper,
  children,
}: {
  condition: boolean
  wrapper: (children: ReactNode) => ReactNode
  children: ReactNode
}) {
  return condition ? wrapper(children) : children
}
