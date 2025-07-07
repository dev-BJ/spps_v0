"use server"

import { cookies } from "next/headers"

// Mock user database - in a real app, this would be in a database
const users = [
  {
    id: "1",
    email: "student@demo.com",
    password: "password123",
    role: "student",
    firstName: "John",
    lastName: "Doe",
    grade: "11",
  },
  {
    id: "2",
    email: "lecturer@demo.com",
    password: "password123",
    role: "lecturer",
    firstName: "Jane",
    lastName: "Smith",
    department: "mathematics",
  },
]

export interface User {
  id: string
  email: string
  role: "student" | "lecturer"
  firstName: string
  lastName: string
  grade?: string
  userId: string
  department?: string
}

export async function login(user_id: string, password: string ) {
  
  let user: User | null = null

  try{
    user = await fetch(`${process.env.API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id, password}),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.log(data.error)
        return null
      }
      return {
        id: data.id,
        email: data.email, // Assuming username is the email
        role: data.role,
        firstName: data.first_name,
        lastName: data.last_name,
        userId: data.user_id,
        // grade: data.grade, // Optional for students
        department: data.department, // Optional for lecturers
      }
      
    })
    .catch((error) => {
      console.error("Login error:", error)
      return null
    })
  }catch(e){
    console.log("Login error", e)
  }

    console.log(user)

    if (!user) {
    return { success: false, error: "Invalid credentials" }
  }

    // Create session token (in a real app, use proper JWT or session management)
  const sessionToken = btoa(
    JSON.stringify({
      id: user.id,
      userId: user.userId,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      // grade: user.grade,
      department: user.department,
    }),
  )

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return { success: true, role: user.role }
}

export async function signup(
  email: string,
  password: string,
  role: "student" | "lecturer",
  firstName: string,
  lastName: string,
  additionalData: { grade?: string; department?: string },
) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if user already exists
  const existingUser = users.find((u) => u.email === email)
  if (existingUser) {
    return { success: false, error: "User already exists" }
  }

  // Create new user
  const newUser = {
    id: (users.length + 1).toString(),
    email,
    password,
    role,
    firstName,
    lastName,
    ...additionalData,
  }

  users.push(newUser)

  return { success: true }
}

export async function getUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value

    if (!sessionToken) {
      return null
    }

    const userData = JSON.parse(atob(sessionToken))
    return userData
  } catch (error) {
    return null
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function requireAuth(requiredRole?: "student" | "lecturer") {
  const user = await getUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  if (requiredRole && user.role !== requiredRole) {
    throw new Error("Insufficient permissions")
  }

  return user
}
