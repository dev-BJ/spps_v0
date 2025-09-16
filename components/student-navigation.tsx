"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, TrendingUp, User, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function StudentNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/student/dashboard", label: "Dashboard", icon: <TrendingUp className="h-4 w-4" /> },
    { href: "/student/grades", label: "Grades", icon: <BookOpen className="h-4 w-4" /> },
    // { href: "/student/schedule", label: "Schedule", icon: <Calendar className="h-4 w-4" /> },
    // { href: "/student/assignments", label: "Assignments", icon: <FileText className="h-4 w-4" /> },
    { href: "/student/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
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
