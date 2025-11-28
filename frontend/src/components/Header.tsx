import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Button } from './ui/button'
import { useSidebar } from '@/components/ui/sidebar'

export default function Header() {
  return (
    <nav className="flex border-b h-[65px] items-center justify-between md:justify-end p-5">
      <SidebarToggle />
      <div className="rounded-full border-2 border-red-200 h-12 w-12"></div>
    </nav>
  )
}

function SidebarToggle() {
  const { openMobile, setOpenMobile } = useSidebar()
  return (
    <Button
      variant="ghost"
      className="md:hidden"
      onClick={() => setOpenMobile(!openMobile)}
    >
      {openMobile ? <PanelLeftClose /> : <PanelLeftOpen/>}
    </Button>
  )
}
