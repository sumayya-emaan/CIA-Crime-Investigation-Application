"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { API_ENDPOINTS } from "@/lib/api-config"
import { getUserEmail, isLoggedIn } from "@/lib/auth-utils"
import { safelyAccessNestedProperty, safelyFormatDate, safelyGetStatusColor } from "@/lib/utils-null-check"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle, Search, User, LogOut } from "lucide-react"

interface CrimeCase {
  caseID?: number
  dateTime?: string
  location?: string
  description?: string
  crimeType?: {
    id?: number
    name?: string
  }
  caseStatus?: string
  reportedBy?: {
    email?: string
    firstName?: string
    lastName?: string
  }
}

export default function InvestigatorDashboard() {
  const router = useRouter()
  const [currentCases, setCurrentCases] = useState<CrimeCase[]>([])
  const [closedCases, setClosedCases] = useState<any[]>([])
  const [criminalId, setCriminalId] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [investigatorId, setInvestigatorId] = useState<number | null>(null)

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      router.push("/login/investigator")
      return
    }

    // First get the investigator ID, then fetch cases
    const fetchInvestigatorData = async () => {
      try {
        const email = getUserEmail()

        // In a real application, you would have an endpoint to get investigator by email
        // For now, we'll use a mock ID
        // This is a placeholder - you should implement a proper endpoint
        setInvestigatorId(1) // Mock ID

        return 1 // Return mock ID for now
      } catch (err) {
        console.error("Error fetching investigator data:", err)
        throw err
      }
    }

    const fetchCases = async () => {
      try {
        setLoading(true)

        // Get investigator ID first
        const id = await fetchInvestigatorData()

        // Fetch current cases
        try {
          const currentCasesResponse = await axios.get(`${API_ENDPOINTS.CASES.GET_CURRENT_CASES}`)
          setCurrentCases(Array.isArray(currentCasesResponse.data) ? currentCasesResponse.data : [])
        } catch (err) {
          console.error("Error fetching current cases:", err)
          setCurrentCases([])
        }

        // Fetch closed cases
        try {
          const closedCasesResponse = await axios.get(API_ENDPOINTS.CASES.GET_CLOSED_CASES)
          setClosedCases(Array.isArray(closedCasesResponse.data) ? closedCasesResponse.data : [])
        } catch (err) {
          console.error("Error fetching closed cases:", err)
          setClosedCases([])
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again later.")
        setLoading(false)
      }
    }

    fetchCases()
  }, [router])

  const handleSearchCriminal = () => {
    if (criminalId.trim()) {
      router.push(`/criminals/${criminalId}`)
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
                <span>{getUserEmail() || "Investigator"}</span>
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
        <h2 className="text-2xl font-bold mb-6">Investigator Dashboard</h2>

        {/* Search Criminal Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5 text-blue-600" />
              Search Criminal
            </CardTitle>
            <CardDescription>Enter criminal ID to view their details and history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter Criminal ID"
                value={criminalId}
                onChange={(e) => setCriminalId(e.target.value)}
              />
              <Button onClick={handleSearchCriminal}>Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Cases Tabs */}
        <Tabs defaultValue="current" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current" className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Current Cases
            </TabsTrigger>
            <TabsTrigger value="closed" className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Closed Cases
            </TabsTrigger>
          </TabsList>

          {/* Current Cases Tab */}
          <TabsContent value="current">
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            ) : currentCases.length === 0 ? (
              <div className="text-center py-8">
                <p>No current cases assigned to you.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentCases.map((caseItem, index) => (
                  <Card key={caseItem?.caseID || index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>Case #{caseItem?.caseID || "Unknown"}</CardTitle>
                        <Badge className={safelyGetStatusColor(caseItem?.caseStatus)}>
                          {caseItem?.caseStatus?.replace("_", " ") || "Unknown Status"}
                        </Badge>
                      </div>
                      <CardDescription>{safelyFormatDate(caseItem?.dateTime, "Unknown date")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="font-semibold">Crime Type:</span>{" "}
                          {safelyAccessNestedProperty(caseItem, "crimeType.name", "Unknown")}
                        </div>
                        <div>
                          <span className="font-semibold">Location:</span> {caseItem?.location || "Unknown location"}
                        </div>
                        <div>
                          <span className="font-semibold">Description:</span>
                          <p className="text-gray-600 mt-1">{caseItem?.description || "No description available"}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Reported By:</span>{" "}
                          {safelyAccessNestedProperty(caseItem, "reportedBy.firstName", "")}{" "}
                          {safelyAccessNestedProperty(caseItem, "reportedBy.lastName", "")}
                          {!safelyAccessNestedProperty(caseItem, "reportedBy.firstName", "") &&
                            !safelyAccessNestedProperty(caseItem, "reportedBy.lastName", "") &&
                            "Unknown"}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Link href={`/cases/${caseItem?.caseID || 0}`}>
                        <Button variant="outline">View Details</Button>
                      </Link>
                      <Link href={`/update-case/${caseItem?.caseID || 0}`}>
                        <Button>Update Status</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Closed Cases Tab */}
          <TabsContent value="closed">
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            ) : closedCases.length === 0 ? (
              <div className="text-center py-8">
                <p>No closed cases found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {closedCases.map((caseItem, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>Case #{caseItem?.caseID || caseItem?.id || "Unknown"}</CardTitle>
                        <Badge className="bg-green-100 text-green-800">CLOSED</Badge>
                      </div>
                      <CardDescription>
                        {safelyFormatDate(caseItem?.dateTime || caseItem?.date, "Unknown date")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="font-semibold">Crime Type:</span>{" "}
                          {safelyAccessNestedProperty(caseItem, "crimeType.name", "") ||
                            caseItem?.crimeTypeName ||
                            "Unknown"}
                        </div>
                        <div>
                          <span className="font-semibold">Location:</span> {caseItem?.location || "Unknown location"}
                        </div>
                        <div>
                          <span className="font-semibold">Description:</span>
                          <p className="text-gray-600 mt-1">{caseItem?.description || "No description available"}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/cases/${caseItem?.caseID || caseItem?.id || 0}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
