'use client'

import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronUp,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarFooter,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchForm } from "../search-form"
import { useSession } from "next-auth/react"
import { CldImage } from 'next-cloudinary';
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import Link from "next/link"
import  AppSidebarSkeleton  from "../skeletonSideBar"
import { SignOut } from "../auth/signout-button"

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"]
}

const items = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Delivery Note", url: "/dashboard/deliverynote", icon: Inbox },
  { title: "Requisition", url: "/dashboard/requisition", icon: Calendar },
  { title: "History", url: "#", icon: Search },
  { title: "Settings", url: "#", icon: Settings },
]

type AppSidebarProps = {
  isLoggedIn: boolean;
};


export function AppSidebar({ isLoggedIn }: AppSidebarProps) {
  const { data: session, status } = useSession()
  const [hasToasted, setHasToasted] = useState(false)
  const pathname = usePathname()

    useEffect(() => {
    if (session && !hasToasted && pathname === '/dashboard') {
      toast.success("Account Login successful!", {
        description: `Welcome ${session.user?.name}!`,
        duration: 5000,
      })
      setHasToasted(true)
    }
  }, [session, hasToasted, pathname])



  return (
      <Sidebar className={isLoggedIn ? 'hidden md:flex rounded-2xl ml-1.5 m-1.5 shadow-2xl border border-border' : 'hidden'}> 
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span className={clsx('text-black', pathname === item.url && 'text-cyan-500')}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {session?.user?.image ? (
                    <CldImage
                      src={session?.user.image}
                      width="32"
                      height="32"
                      alt="User profile"
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-xs italic text-muted">No image</span>
                  )}
                  {session?.user?.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top">
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SignOut />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
