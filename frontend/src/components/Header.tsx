import { LogOut, PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
        <DropdownMenuTrigger asChild>
          <div className="rounded-full bg-primary/80 h-12 w-12 flex items-center justify-center font-semibold text-xl cursor-pointer">
            {user?.username.split('').slice(0, 2).join('').toUpperCase()}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuItem asChild>
            <Link to="/dashboard/settings" className="w-full cursor-default">
              <Settings size={16} />
              Settings
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
