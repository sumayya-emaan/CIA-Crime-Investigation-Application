"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { API_ENDPOINTS } from "@/lib/api-config"
import { isLoggedIn, getUserType } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, FileText } from "lucide-react"

interface CaseStatusUpdateDTO {
  caseId: number
  newStatus: string
}

export default function UpdateCaseStatusPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [caseStatus, setCaseStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Check if user is logged in and is an investigator
    if (!isLoggedIn() || getUserType() !== "investigator") {
      router.push("/login/investigator")
    }
  }, [router])

  // Fix: Use request body as expected by the backend
  // @PutMapping("/update-status")
  // public ResponseEntity<String> updateCaseStatus(@RequestBody CaseStatusUpdateDTO statusUpdateDTO)
  const handleUpdateStatus = async () => {
    if (!caseStatus) {
      setError("Please select a status")
      return
    }

    try {
      setIsLoading(true)
      setError("")
      setSuccess(false)

      // Prepare request body as CaseStatusUpdateDTO
      const updateData: CaseStatusUpdateDTO = {
        caseId: Number.parseInt(params.id),
        newStatus: caseStatus,
      }

      // Make API request with PUT method and request body
      await axios.put(API_ENDPOINTS.INVESTIGATOR.UPDATE_CASE_STATUS, updateData)

      setSuccess(true)
      setIsLoading(false)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/investigator")
      }, 2000)
    } catch (err) {
      console.error("Error updating case status:", err)
      setError("Failed to update case status. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link href="/dashboard/investigator" className="inline-block mb-6">
          <Button variant="ghost" className="p-0">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-600" />
              Update Case Status
            </CardTitle>
            <CardDescription>Case #{params.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Status</label>
                <Select onValueChange={setCaseStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <p className="text-sm text-green-600">Case status updated successfully! Redirecting...</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleUpdateStatus} disabled={isLoading || !caseStatus}>
              {isLoading ? "Updating..." : "Update Status"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
