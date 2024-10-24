"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useContext, useEffect, useState } from "react";
import {
  HomeIcon,
  Search,
  CalendarClock,
  BadgeInfo,
  LayoutGrid,
} from "lucide-react";
import { MyContext } from "@/context/MyContext";
import Link from "next/link";
// Menu items.
const items = [
  {
    title: "Inicio",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Sobre",
    url: "/about",
    icon: BadgeInfo,
  },
  {
    title: "Reservas",
    url: "/reservation",
    icon: CalendarClock,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
];

export function AppSidebar({ openChange, setOpenChange }) {
  const { store, dispatchStore } = useContext(MyContext);
  const [open, setOpen] = useState(false); // Sidebar en escritorio
  useEffect(() => {
    setOpen(openChange);
  }, [openChange]);
  useEffect(() => {
    setOpenChange(open);
  }, [open, setOpenChange]);

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/${store.variable}/${store.sitioweb}${item.url}`}
                      onClick={() => setOpen(false)}
                    >
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
  );
}
