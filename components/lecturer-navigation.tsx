"use client"

import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Calendar, BookOpen, Settings, Upload } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function LecturerNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/lecturer/dashboard", label: "Dashboard", icon: <TrendingUp className="h-4 w-4" /> },
    { href: "/lecturer/students", label: "Students", icon: <Users className="h-4 w-4" /> },
    { href: "/lecturer/analytics", label: "Analytics", icon: <TrendingUp className="h-4 w-4" /> },
    // { href: "/lecturer/advisory", label: "Advisory", icon: <TrendingUp className="h-4 w-4" /> },
    { href: "/lecturer/classes", label: "Classes", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/lecturer/upload-results", label: "Upload Results", icon: <Upload className="h-4 w-4" /> },
    { href: "/lecturer/schedule", label: "Schedule", icon: <Calendar className="h-4 w-4" /> },
    { href: "/lecturer/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ]

  return (
    <nav className="flex flex-wrap space-x-1 mb-8 bg-white p-1 rounded-lg border">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant={pathname === item.href ? "default" : "ghost"}
            size="sm"
            className="flex items-center space-x-2"
          >
            {item.icon}
            <span>{item.label}</span>
          </Button>
        </Link>
      ))}
    </nav>
  )
}
