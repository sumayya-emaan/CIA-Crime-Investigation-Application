"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { API_ENDPOINTS } from "@/lib/api-config"
import { safelyGetStatusColor } from "@/lib/utils-null-check"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, AlertTriangle } from "lucide-react"

interface Criminal {
  personid?: number
  firstName?: string
  lastName?: string
  crimetypes?: string
  currentStatus?: string
  gender?: string
  reputation?: string
  nationality?: string
}

export default function HallOfShamePage() {
  const [criminals, setCriminals] = useState<Criminal[]>([])
  const [filteredCriminals, setFilteredCriminals] = useState<Criminal[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCriminals = async () => {
      try {
        setLoading(true)
        const response = await axios.get(API_ENDPOINTS.CRIMINALS.GET_ALL)
        const data = Array.isArray(response.data) ? response.data : []
        setCriminals(data)
        setFilteredCriminals(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching criminals:", err)
        setError("Failed to load criminals. Please try again later.")
        setLoading(false)

        // Use mock data if API fails - for development purposes only
        const mockCriminals = [
          {
            personid: 1,
            firstName: "John",
            lastName: "Doe",
            crimetypes: "THEFT",
            currentStatus: "AT_LARGE",
            reputation: "Notorious thief",
            nationality: "American",
          },
          {
            personid: 2,
            firstName: "Jane",
            lastName: "Smith",
            crimetypes: "FRAUD",
            currentStatus: "CAPTURED",
            reputation: "Financial fraudster",
            nationality: "Canadian",
          },
          {
            personid: 3,
            firstName: "Michael",
            lastName: "Johnson",
            crimetypes: "ASSAULT",
            currentStatus: "AT_LARGE",
            reputation: "Violent offender",
            nationality: "British",
          },
          {
            personid: 4,
            firstName: "Robert",
            lastName: "Williams",
            crimetypes: "CYBERCRIME",
            currentStatus: "CAPTURED",
            reputation: "Hacker",
            nationality: "Australian",
          },
          {
            personid: 5,
            firstName: "Sarah",
            lastName: "Brown",
            crimetypes: "NARCOTICS",
            currentStatus: "AT_LARGE",
            reputation: "Drug dealer",
            nationality: "Mexican",
          },
          {
            personid: 6,
            firstName: "David",
            lastName: "Miller",
            crimetypes: "HOMICIDE",
            currentStatus: "CAPTURED",
            reputation: "Dangerous criminal",
            nationality: "Russian",
          },
        ]

        setCriminals(mockCriminals)
        setFilteredCriminals(mockCriminals)
        setLoading(false)
      }
    }

    fetchCriminals()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCriminals(criminals)
    } else {
      const filtered = criminals.filter(
        (criminal) =>
          `${criminal?.firstName || ""} ${criminal?.lastName || ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (criminal?.crimetypes || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (criminal?.nationality || "").toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCriminals(filtered)
    }
  }, [searchTerm, criminals])

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-4">
            <Link href="/">
              <Button variant="ghost" className="text-white p-0 mr-4">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold flex items-center">
            <AlertTriangle className="mr-3 h-8 w-8" />
            Hall of Shame
          </h1>
          <p className="mt-2">Criminals who have been identified and are wanted or captured</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="relative mb-8 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, crime type, or nationality..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Criminals Grid */}
        {loading ? (
          <div className="text-center py-8">
            <p>Loading criminals...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredCriminals.length === 0 ? (
          <div className="text-center py-8">
            <p>No criminals found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCriminals.map((criminal, index) => (
              <Card key={criminal?.personid || index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gray-200 relative">
                  <img
                    src={criminal?.gender === "FEMALE" ? "/female.jpg" : criminal?.gender === "MALE" ? "/male.jpg": `/placeholder.svg?height=256&width=384&text=${criminal?.firstName || ""}+${criminal?.lastName || ""}`}
                    alt={`${criminal?.firstName || ""} ${criminal?.lastName || ""}`}
                    className="w-50 h-full object-cover"
                  />
                  <Badge className={`absolute top-2 right-2 ${safelyGetStatusColor(criminal?.currentStatus)}`}>
                    {criminal?.currentStatus?.replace("_", " ") || "Unknown Status"}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">
                      {criminal?.firstName || ""} {criminal?.lastName || ""}
                      {!criminal?.firstName && !criminal?.lastName && "Unknown Person"}
                    </h3>
                    <Badge className={getCrimeTypeColor(criminal?.crimetypes)}>
                      {criminal?.crimetypes || "Unknown"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Nationality:</span> {criminal?.nationality || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    {criminal?.reputation || "No reputation information available"}
                  </p>

                  <div className="mt-4">
                    <Link href={`/criminals/${criminal?.personid || 0}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Warning Notice */}
        <div className="mt-12 bg-red-50 p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-red-800 mb-2">Public Safety Notice</h3>
          <p className="text-gray-700 mb-4">
            If you encounter any of these individuals, do not approach them. Contact the authorities immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-red-600 hover:bg-red-700">Call Emergency Hotline</Button>
            <Link href="/report-crime">
              <Button variant="outline">Report Information</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
