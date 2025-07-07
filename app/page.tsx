import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"

export default async function HomePage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  // Redirect based on user role
  if (user.role === "student") {
    redirect("/student/dashboard")
  } else if (user.role === "lecturer") {
    redirect("/lecturer/dashboard")
  } else {
    redirect("/login")
  }
}
