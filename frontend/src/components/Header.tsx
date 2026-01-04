import { LogOut, PanelLeftClose, PanelLeftOpen, UserPen } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from './ui/button'
import Avatar from './primitives/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSidebar } from '@/components/ui/sidebar'
import { useAuth } from '@/contexts/AuthProvider'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <nav className="flex border-b h-[65px] items-center justify-between md:justify-end p-5">
      <SidebarToggle />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Avatar className="cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuItem asChild>
            <Link to="/dashboard/profile" className="w-full cursor-default">
              <UserPen size={16} />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <div
              className="w-full"
              onClick={() => {
                logout()
                navigate({ to: '/login' })
              }}
            >
              <LogOut size={16} />
              Logout
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}

function SidebarToggle() {
  const { openMobile, setOpenMobile } = useSidebar()
  return (
    <Button
      variant="ghost"
      onClick={() => setOpenMobile(!openMobile)}
      className="md:hidden"
    >
      {openMobile ? <PanelLeftClose /> : <PanelLeftOpen />}
    </Button>
  )
}
