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
import { SearchForm } from "./search-form"
import { useSession } from "next-auth/react"
import { CldImage } from 'next-cloudinary';
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import Link from "next/link"



export default function AppSidebarSkeleton() {
  return (
    <Sidebar>
      <SidebarHeader>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
             
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    
    
                      
                    
                  </SidebarMenuButton>
                </SidebarMenuItem>
             
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
                  
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top">
                <DropdownMenuItem>
               
                </DropdownMenuItem>
                <DropdownMenuItem>
           
                </DropdownMenuItem>
                <DropdownMenuItem>
                  
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
