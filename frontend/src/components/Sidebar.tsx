import {
  BookOpen,
  BoxIcon,
  Calendar,
  Home,
  MessageCircleQuestionMark,
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
]

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden"
    >
      <SidebarHeader>
        <div className="flex items-center">
          <img src="/favicon.png" width="64px" height="64px" />
          <div
            className={`text-4xl font-semibold `}
          >
            Study
            <span
              className={`text-[#49C17A] font-bold transition-all duration-300`}
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
