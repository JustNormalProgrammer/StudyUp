import { Link } from 'lucide-react'
import type { ReactNode } from 'react'

export default function IconLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center gap-1">
      <Link size={16} />
      <a href={href} target="_blank" className="text-sm wrap-anywhere text-primary underline-offset-4 hover:underline visited:text-primary/80 truncate">{children}</a>
    </div>
  )
}
