"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { API_ENDPOINTS } from "@/lib/api-config"
import { getUserEmail, isLoggedIn } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, AlertTriangle } from "lucide-react"

// Form validation schema
const reportSchema = yup.object({
  location: yup.string().required("Location is required"),
  description: yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
  crimeTypeId: yup.number().required("Crime type is required"),
})

type ReportFormData = yup.InferType<typeof reportSchema>

export default function ReportCrimePage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock crime types - replace with actual API data
  const crimeTypes = [
    { id: 1, name: "Murder" },
    { id: 2, name: "Theft" },
    { id: 3, name: "Cybercrime" },
    { id: 4, name: "Kidnapping" },
    { id: 5, name: "Harassment" },
    { id: 6, name: "Drugtrafficking" },
    { id: 6, name: "Rape" }
  ]

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReportFormData>({
    resolver: yupResolver(reportSchema),
    defaultValues: {
      crimeTypeId: undefined,
    },
  })

  function getCrimeNameById(id: number): string {
    const crime = crimeTypes.find(c => c.id === id);
    return crime ? crime.name : "Unknown Crime";
  }
  
  // Fix: Use request body as expected by the backend
  // @PostMapping("/report")
  // public ResponseEntity<String> reportCrime(@RequestBody CrimeCase crimeCase)
  const onSubmit = async (data: ReportFormData) => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      router.push("/login/user")
      return
    }

    try {
      setIsLoading(true)
      setError("")
      setSuccess(false)

      // Get user email from local storage
      const userEmail = getUserEmail()

      // Prepare request body as CrimeCase - old payload
      /* const requestBody = {
        dateTime: new Date().toISOString(),
        location: data.location,
        description: data.description,
        crimeType: {
          id: data.crimeTypeId,
        },
        caseStatus: "OPEN",
        reportedByUserEmail: {
          email: userEmail,
        },
      }*/

      const requestBody = {
        location: data.location,
        description: data.description,
        crimeType: getCrimeNameById(data.crimeTypeId),
        cctvPresence: true,
        reportedByUserEmail: userEmail
      }

      // Make API request with POST method and request body
      await axios.post(API_ENDPOINTS.CASES.REPORT_CRIME, requestBody)

      setSuccess(true)
      setIsLoading(false)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/user")
      }, 2000)
    } catch (err) {
      console.error("Error reporting crime:", err)
      setError("Failed to report crime. Please try again.")
      setIsLoading(false)
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

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
              Report a Crime
            </CardTitle>
            <CardDescription>Provide details about the crime you've witnessed or experienced</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="crimeTypeId">Crime Type</Label>
                <Select
                  onValueChange={(value) => setValue("crimeTypeId", Number.parseInt(value))}
                  defaultValue={watch("crimeTypeId")?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crime type" />
                  </SelectTrigger>
                  <SelectContent>
                    {crimeTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.crimeTypeId && <p className="text-sm text-red-500">{errors.crimeTypeId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter the location where the crime occurred"
                  {...register("location")}
                />
                {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of what happened"
                  rows={5}
                  {...register("description")}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>

              {error && (
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <p className="text-sm text-green-600">Crime reported successfully! Redirecting to dashboard...</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-sm text-gray-500 text-center">
            <p>
              Your report will be reviewed by our investigators. You can track the status of your case from your
              dashboard.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
