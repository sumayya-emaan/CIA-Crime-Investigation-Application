"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { API_ENDPOINTS } from "@/lib/api-config"
import { isLoggedIn } from "@/lib/auth-utils"
import { safelyAccessNestedProperty, safelyFormatDate, safelyGetStatusColor } from "@/lib/utils-null-check"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Clock, MapPin, Shield } from "lucide-react"

interface CrimeCase {
  caseID: number
  dateTime: string
  location: string
  description: string
  crimeType: {
    id: number
    name: string
  }
  caseStatus: string
  investigatorID: {
    firstName: string
    lastName: string
    email: string
    rank: string
  }
  reportedBy: {
    email: string
    firstName: string
    lastName: string
  }
}

export default function TrackCasePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [caseData, setCaseData] = useState<CrimeCase | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      router.push("/login/user")
      return
    }

    // Fix: Use GET request with path parameter as expected by the backend
    // @GetMapping("/{caseId}")
    // public ResponseEntity<CrimeCase> trackCaseById(@PathVariable Long caseId)
    const fetchCaseData = async () => {
      try {
        setLoading(true)
        // Make API request with GET method and path parameter
        const response = await axios.get(`${API_ENDPOINTS.TRACKING.GET_CASE_BY_ID}/${params.id}`)
        setCaseData(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching case data:", err)
        setError("Failed to load case data. Please check the case ID and try again.")
        setLoading(false)
      }
    }

    fetchCaseData()
  }, [params.id, router])

  const getStatusStep = (status: string | null | undefined) => {
    if (!status) return 0

    switch (status) {
      case "OPEN":
        return 1
      case "IN_PROGRESS":
        return 2
      case "PENDING":
        return 3
      case "CLOSED":
        return 4
      default:
        return 0
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link href="/dashboard/user" className="inline-block mb-6">
          <Button variant="ghost" className="p-0">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <h2 className="text-2xl font-bold mb-6">Track Case #{params.id}</h2>

        {loading ? (
          <div className="text-center py-8">
            <p>Loading case data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : !caseData ? (
          <div className="text-center py-8">
            <p>No case found with ID #{params.id}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Case Details */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-600" />
                    Case Details
                  </CardTitle>
                  <Badge className={safelyGetStatusColor(caseData.caseStatus)}>
                    {safelyAccessNestedProperty(caseData, "caseStatus", "Unknown").replace("_", " ")}
                  </Badge>
                </div>
                <CardDescription>
                  Reported on {safelyFormatDate(caseData.dateTime, "Date not available")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Crime Type</h3>
                  <p className="text-lg font-medium">
                    {safelyAccessNestedProperty(caseData, "crimeType.name", "Not specified")}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    Location
                  </h3>
                  <p>{safelyAccessNestedProperty(caseData, "location", "Location not specified")}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="text-gray-700">
                    {safelyAccessNestedProperty(caseData, "description", "No description available")}
                  </p>
                </div>

                {caseData.investigatorID && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800 flex items-center mb-2">
                      <Shield className="mr-1 h-4 w-4" />
                      Assigned Investigator
                    </h3>
                    <p className="font-medium">
                      {safelyAccessNestedProperty(caseData, "investigatorID.rank", "")}{" "}
                      {safelyAccessNestedProperty(caseData, "investigatorID.firstName", "")}{" "}
                      {safelyAccessNestedProperty(caseData, "investigatorID.lastName", "")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {safelyAccessNestedProperty(caseData, "investigatorID.email", "No email available")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Case Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-600" />
                  Case Status
                </CardTitle>
                <CardDescription>Current progress of your case</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="relative">
                    {/* Progress Bar */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    {/* Status Steps */}
                    <div className="space-y-8">
                      {/* Open */}
                      <div className="relative flex items-start">
                        <div
                          className={`absolute left-4 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${
                            getStatusStep(caseData.caseStatus) >= 1
                              ? "bg-blue-600 border-blue-600"
                              : "bg-white border-gray-300"
                          }`}
                        ></div>
                        <div className="ml-8">
                          <h4 className="font-medium">Open</h4>
                          <p className="text-sm text-gray-500">Case has been reported and is awaiting review</p>
                        </div>
                      </div>

                      {/* In Progress */}
                      <div className="relative flex items-start">
                        <div
                          className={`absolute left-4 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${
                            getStatusStep(caseData.caseStatus) >= 2
                              ? "bg-blue-600 border-blue-600"
                              : "bg-white border-gray-300"
                          }`}
                        ></div>
                        <div className="ml-8">
                          <h4 className="font-medium">In Progress</h4>
                          <p className="text-sm text-gray-500">Investigation is actively underway</p>
                        </div>
                      </div>

                      {/* Pending */}
                      <div className="relative flex items-start">
                        <div
                          className={`absolute left-4 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${
                            getStatusStep(caseData.caseStatus) >= 3
                              ? "bg-blue-600 border-blue-600"
                              : "bg-white border-gray-300"
                          }`}
                        ></div>
                        <div className="ml-8">
                          <h4 className="font-medium">Pending</h4>
                          <p className="text-sm text-gray-500">Awaiting additional information or resources</p>
                        </div>
                      </div>

                      {/* Closed */}
                      <div className="relative flex items-start">
                        <div
                          className={`absolute left-4 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${
                            getStatusStep(caseData.caseStatus) >= 4
                              ? "bg-blue-600 border-blue-600"
                              : "bg-white border-gray-300"
                          }`}
                        ></div>
                        <div className="ml-8">
                          <h4 className="font-medium">Closed</h4>
                          <p className="text-sm text-gray-500">Investigation has been completed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        {caseData && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/feedback">
              <Button variant="outline" className="w-full sm:w-auto">
                Provide Feedback
              </Button>
            </Link>
            <Link href="/report-crime">
              <Button className="w-full sm:w-auto">Report Another Crime</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
