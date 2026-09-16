"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { API_ENDPOINTS } from "@/lib/api-config"
import { safelyAccessNestedProperty, safelyFormatDate, safelyGetStatusColor } from "@/lib/utils-null-check"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Calendar, Briefcase, Flag } from "lucide-react"

interface Criminal {
  personid: number
  firstName: string
  midName?: string
  lastName: string
  fatherName: string
  contactNumber: string
  dob: string
  occupation: string
  cnic: string
  address: string
  gender: string
  crimetypes: string
  currentStatus: string
  reputation: string
  nationality: string
}

export default function CriminalDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [criminal, setCriminal] = useState<Criminal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Fix: Use GET request with path parameter as expected by the backend
    // @GetMapping("/{id}")
    // public Optional<Criminal> getCriminalById(@PathVariable int id)
    const fetchCriminal = async () => {
      try {
        setLoading(true)
        // Make API request with GET method and path parameter
        const response = await axios.get(`${API_ENDPOINTS.CRIMINALS.GET_BY_ID}/${params.id}`)
        setCriminal(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching criminal details:", err)
        setError("Failed to load criminal details. Please try again later.")
        setLoading(false)

        // Use mock data if API fails - for development purposes only
        const mockCriminal = {
          personid: Number.parseInt(params.id),
          firstName: "John",
          midName: "",
          lastName: "Doe",
          fatherName: "Richard Doe",
          contactNumber: "123-456-7890",
          dob: "1985-05-15",
          occupation: "Unknown",
          cnic: "12345-6789012-3",
          address: "Unknown",
          gender: "MALE",
          crimetypes: "THEFT",
          currentStatus: "AT_LARGE",
          reputation: "Notorious thief with multiple convictions",
          nationality: "American",
        }

        setCriminal(mockCriminal)
        setLoading(false)
      }
    }

    fetchCriminal()
  }, [params.id])

  const getCrimeTypeColor = (crimeType: string | null | undefined) => {
    if (!crimeType) return "bg-gray-100 text-gray-800"

    switch (crimeType) {
      case "THEFT":
        return "bg-blue-100 text-blue-800"
      case "FRAUD":
        return "bg-purple-100 text-purple-800"
      case "ASSAULT":
        return "bg-orange-100 text-orange-800"
      case "CYBERCRIME":
        return "bg-indigo-100 text-indigo-800"
      case "NARCOTICS":
        return "bg-green-100 text-green-800"
      case "HOMICIDE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link href="/hall-of-shame" className="inline-block mb-6">
          <Button variant="ghost" className="p-0">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Hall of Shame
          </Button>
        </Link>

        {loading ? (
          <div className="text-center py-8">
            <p>Loading criminal details...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : !criminal ? (
          <div className="text-center py-8">
            <p>No criminal found with ID #{params.id}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Criminal Photo and Status */}
            <Card className="md:col-span-1">
              <div className="h-80 bg-gray-200 relative">
                <img
                  src={criminal?.gender === "FEMALE" ? "/female.jpg" : criminal?.gender === "MALE" ? "/male.jpg": `/placeholder.svg?height=256&width=384&text=${criminal?.firstName || ""}+${criminal?.lastName || ""}`}alt={`${safelyAccessNestedProperty(criminal, "firstName", "")} ${safelyAccessNestedProperty(criminal, "lastName", "")}`}
                  className="w-full h-full object-cover"
                />
                <Badge className={`absolute top-2 right-2 ${safelyGetStatusColor(criminal.currentStatus)}`}>
                  {safelyAccessNestedProperty(criminal, "currentStatus", "Unknown").replace("_", " ")}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h2 className="text-2xl font-bold mb-2">
                  {safelyAccessNestedProperty(criminal, "firstName", "")}{" "}
                  {criminal.midName ? criminal.midName + " " : ""}
                  {safelyAccessNestedProperty(criminal, "lastName", "")}
                </h2>
                <Badge className={`mb-4 ${getCrimeTypeColor(criminal.crimetypes)}`}>
                  {safelyAccessNestedProperty(criminal, "crimetypes", "Unknown")}
                </Badge>

                <p className="text-gray-700 mt-4">
                  {safelyAccessNestedProperty(criminal, "reputation", "No information available")}
                </p>
              </CardContent>
            </Card>

            {/* Criminal Details */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Criminal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Father's Name</p>
                    <p className="font-medium">{safelyAccessNestedProperty(criminal, "fatherName", "Not available")}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center">
                      <Flag className="h-4 w-4 mr-1" />
                      Nationality
                    </p>
                    <p className="font-medium">
                      {safelyAccessNestedProperty(criminal, "nationality", "Not available")}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Date of Birth
                    </p>
                    <p className="font-medium">{safelyFormatDate(criminal.dob, "Not available")}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{safelyAccessNestedProperty(criminal, "gender", "Not specified")}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      Occupation
                    </p>
                    <p className="font-medium">{safelyAccessNestedProperty(criminal, "occupation", "Not available")}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">CNIC</p>
                    <p className="font-medium">{safelyAccessNestedProperty(criminal, "cnic", "Not available")}</p>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Last Known Address
                    </p>
                    <p className="font-medium">{safelyAccessNestedProperty(criminal, "address", "Not available")}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <p className="text-gray-700">
                    {safelyAccessNestedProperty(criminal, "contactNumber", "Not available")}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Warning</h3>
                  <p className="text-red-600">
                    This individual is considered dangerous. If you have information about their whereabouts, please
                    contact the authorities immediately. Do not approach.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        {criminal && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="w-full sm:w-auto">
              Report Sighting
            </Button>
            <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700">Contact Authorities</Button>
          </div>
        )}
      </div>
    </div>
  )
}
