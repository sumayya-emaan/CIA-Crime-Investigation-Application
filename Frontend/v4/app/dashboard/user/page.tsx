"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getUserEmail, isLoggedIn } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Search, User, MessageSquare, LogOut } from "lucide-react"

export default function UserDashboard() {
  const router = useRouter()
  const [caseId, setCaseId] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      router.push("/login/user")
    } else {
      setLoading(false)
    }
  }, [router])

  const handleTrackCase = () => {
    if (caseId.trim()) {
      router.push(`/track-case/${caseId}`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userType")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-800 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <h1 className="text-xl font-bold">Crime Investigation System</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>{getUserEmail()}</span>
              </div>
              <Button variant="ghost" className="text-white" onClick={handleLogout}>
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>

        {/* Track Case Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5 text-blue-600" />
              Track Your Case
            </CardTitle>
            <CardDescription>Enter your case ID to track the status of your reported crime</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input placeholder="Enter Case ID" value={caseId} onChange={(e) => setCaseId(e.target.value)} />
              <Button onClick={handleTrackCase}>Track</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Report Crime */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center text-red-700">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Report a Crime
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600 mb-4">Submit information about a crime you've witnessed or experienced</p>
            </CardContent>
            <CardFooter>
              <Link href="/report-crime" className="w-full">
                <Button className="w-full bg-red-600 hover:bg-red-700">Submit a Tip</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Missing People */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-amber-50">
              <CardTitle className="flex items-center text-amber-700">
                <User className="mr-2 h-5 w-5" />
                Missing People
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600 mb-4">View information about missing people and help locate them</p>
            </CardContent>
            <CardFooter>
              <Link href="/missing-people" className="w-full">
                <Button className="w-full bg-amber-600 hover:bg-amber-700">View Missing People</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Provide Feedback */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center text-green-700">
                <MessageSquare className="mr-2 h-5 w-5" />
                Provide Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600 mb-4">Share your experience and help us improve our services</p>
            </CardContent>
            <CardFooter>
              <Link href="/feedback" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">Give Feedback</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
