import {
  BookOpen,
  BoxIcon,
  Calendar,
  Home,
  MessageCircleQuestionMark,
  Settings,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/dashboard/home',
    icon: Home,
  },
  {
    title: 'Calendar',
    url: '/dashboard/calendar',
    icon: Calendar,
  },
  {
    title: 'Study Sessions',
    url: '/dashboard/study-sessions',
    icon: BookOpen,
  },
  {
    title: 'Resources',
    url: '/dashboard/resources',
    icon: BoxIcon,
  },
  {
    title: 'Quizzes',
    url: '/dashboard/quizzes',
    icon: MessageCircleQuestionMark,
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
  },
]

export function AppSidebar() {
  const { open, setOpen } = useSidebar()
  return (
    <Sidebar
      collapsible="icon"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="overflow-hidden"
    >
      <SidebarHeader>
        <div className="flex items-center">
          <img src="/favicon.png" width="64px" height="64px" />
          <div
            className={`text-4xl font-semibold ${open ? 'opacity-100 w-full transition-all duration-300 delay-100' : 'opacity-0 w-0'} `}
          >
            Study
            <span
              className={`text-green-500 font-bold transition-all duration-300`}
            >
              Up
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
