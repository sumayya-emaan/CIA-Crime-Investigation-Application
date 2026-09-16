"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import { API_ENDPOINTS } from "@/lib/api-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Phone, Book, User, Shield } from "lucide-react"

// Types
interface LawsAndPunishments {
  lawID: number
  crime_type: string
  section_name: string
  punishment: string
}

interface Helpline {
  helplineID: number
  region_area: string
  helplinenumber: string
  helplinetype: string
}

interface AmberAlert {
  caseId: number
  crimeType: string
  location: string
  description: string
  reportedByName: string
  age: number
  dateTime: string
  caseStatus: string
}

interface Criminal {
  personid?: number
  firstName?: string
  lastName?: string
  crimetypes?: string
  gender?: string
  currentStatus?: string
  reputation?: string
  nationality?: string
}

export default function Home() {
  const [laws, setLaws] = useState<LawsAndPunishments[]>([])
  const [helplines, setHelplines] = useState<Helpline[]>([])
  const [amberAlerts, setAmberAlerts] = useState<AmberAlert[]>([])
  const [criminals, setCriminals] = useState<Criminal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch laws and punishments
        try {
          console.log('Fetching laws from:', API_ENDPOINTS.LAWS.GET_ALL)
          const lawsResponse = await axios.get(API_ENDPOINTS.LAWS.GET_ALL)
          console.log('Laws response:', lawsResponse.data)
          setLaws(Array.isArray(lawsResponse.data) ? lawsResponse.data : [])
        } catch (err) {
          console.error("Error fetching laws:", err)
          if (axios.isAxiosError(err)) {
            console.error("Axios error details:", {
              status: err.response?.status,
              statusText: err.response?.statusText,
              data: err.response?.data
            })
          }
          setLaws([])
        }

        // Fetch helplines
        try {
          console.log('Fetching helplines from:', API_ENDPOINTS.HELPLINES.GET_ALL)
          const helplinesResponse = await axios.get(API_ENDPOINTS.HELPLINES.GET_ALL)
          console.log('Helplines response:', helplinesResponse.data)
          setHelplines(Array.isArray(helplinesResponse.data) ? helplinesResponse.data : [])
        } catch (err) {
          console.error("Error fetching helplines:", err)
          if (axios.isAxiosError(err)) {
            console.error("Axios error details:", {
              status: err.response?.status,
              statusText: err.response?.statusText,
              data: err.response?.data
            })
          }
          setHelplines([])
        }

        // Fetch amber alerts
        try {
          console.log('Fetching amber alerts from:', API_ENDPOINTS.CASES.AMBER_ALERTS)
          const amberAlertsResponse = await axios.get(API_ENDPOINTS.CASES.AMBER_ALERTS)
          console.log('Amber alerts response:', amberAlertsResponse.data)
          setAmberAlerts(Array.isArray(amberAlertsResponse.data) ? amberAlertsResponse.data : [])
        } catch (err) {
          console.error("Error fetching amber alerts:", err)
          if (axios.isAxiosError(err)) {
            console.error("Axios error details:", {
              status: err.response?.status,
              statusText: err.response?.statusText,
              data: err.response?.data
            })
          }
          setAmberAlerts([])
        }

        // Fetch amber alerts
        try {
          console.log('Fetching criminals from:', API_ENDPOINTS.CRIMINALS.GET_ALL)
          const criminalsResponse = await axios.get(API_ENDPOINTS.CRIMINALS.GET_ALL)
          console.log('Criminals response:', criminalsResponse.data)
          setCriminals(Array.isArray(criminalsResponse.data) ? criminalsResponse.data : [])
        } catch (err) {
          console.error("Error fetching criminals:", err)
          if (axios.isAxiosError(err)) {
            console.error("Axios error details:", {
              status: err.response?.status,
              statusText: err.response?.statusText,
              data: err.response?.data
            })
          }
          setCriminals([])
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again later.")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Crime Investigation System</h1>
          <p className="text-xl mb-8">Empowering communities through justice and safety</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/login/user">
              <Button size="lg" className="bg-white text-blue-800 hover:bg-gray-100">
                <User className="mr-2 h-5 w-5" />
                User Login
              </Button>
            </Link>
            <Link href="/login/investigator">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Shield className="mr-2 h-5 w-5" />
                Investigator Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Laws and Punishments Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="mr-2 h-5 w-5 text-blue-600" />
                Laws and Punishments
              </CardTitle>
              <CardDescription>Learn about legal frameworks and consequences</CardDescription>
            </CardHeader>
            <CardContent className="max-h-80 overflow-y-auto">
              {loading ? (
                <p>Loading laws and punishments...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : laws.length === 0 ? (
                <p>No laws and punishments found.</p>
              ) : (
                <div className="space-y-4">
                  {laws.slice(0, 5).map((law) => (
                    <div key={law?.lawID || Math.random()} className="border-b pb-3">
                      <h3 className="font-semibold text-blue-700">{law?.crime_type || "Unknown Crime"}</h3>
                      <p className="text-sm text-gray-600">{law?.section_name || "No section name available"}</p>
                      <p className="text-sm mt-1">{law?.punishment || "No punishment details available"}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/laws-and-punishments">
                <Button variant="outline" className="w-full">
                  View All Laws
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Helplines Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-green-600" />
                Emergency Helplines
              </CardTitle>
              <CardDescription>Important contacts for emergency situations</CardDescription>
            </CardHeader>
            <CardContent className="max-h-80 overflow-y-auto">
              {loading ? (
                <p>Loading helplines...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : helplines.length === 0 ? (
                <p>No helplines found.</p>
              ) : (
                <div className="space-y-4">
                  {helplines.map((helpline) => (
                    <div key={helpline?.helplineID || Math.random()} className="border-b pb-3">
                      <h3 className="font-semibold text-green-700">{helpline?.helplinetype || "General Helpline"}</h3>
                      <p className="text-sm text-gray-600">{helpline?.region_area || "National"}</p>
                      <p className="text-sm font-medium mt-1">{helpline?.helplinenumber || "No number available"}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/helplines">
                <Button variant="outline" className="w-full">
                  View All Helplines
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Amber Alerts Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                Amber Alerts
              </CardTitle>
              <CardDescription>Critical missing person notifications</CardDescription>
            </CardHeader>
            <CardContent className="max-h-80 overflow-y-auto">
              {loading ? (
                <p>Loading amber alerts...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : amberAlerts.length === 0 ? (
                <p>No amber alerts at this time.</p>
              ) : (
                <div className="space-y-4">
                  {amberAlerts.map((alert) => (
                    <div key={alert?.caseId || Math.random()} className="border-b pb-3 bg-red-50 p-3 rounded">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-red-700">Case #{alert?.caseId || "Unknown"}</h3>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          {alert?.caseStatus || "Unknown"}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{alert?.crimeType || "Unknown Crime"}</p>
                      <p className="text-sm text-gray-600">Location: {alert?.location || "Unknown"}</p>
                      <p className="text-sm text-gray-600">Age: {alert?.age || "Unknown"}</p>
                      <p className="text-sm mt-1">{alert?.description || "No description available"}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Reported by: {alert?.reportedByName || "Anonymous"} on{" "}
                        {alert?.dateTime ? new Date(alert.dateTime).toLocaleDateString() : "Unknown date"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/amber-alerts">
                <Button variant="outline" className="w-full">
                  View All Alerts
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Hall of Shame Section */}
        <section className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Hall of Shame</h2>
            <Link href="/hall-of-shame">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <div className="flex gap-6 p-2 min-w-max">
              {criminals.map((criminal) => (
                <Card key={criminal.personid} className="w-64 flex-shrink-0 overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    <img
                      src={criminal?.gender === "FEMALE" ? "/female.jpg" : criminal?.gender === "MALE" ? "/male.jpg": `/placeholder.svg?height=256&width=384&text=${criminal?.firstName || ""}+${criminal?.lastName || ""}`}
                      alt={`Criminal ${criminal.personid}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold">{criminal.firstName} #{criminal.personid}</h3>
                    <p className="text-sm text-gray-600">Wanted for: {criminal.reputation}</p>
                    <p className="text-sm text-gray-600">Status: {criminal.currentStatus}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Crime Investigation System</h3>
              <p className="text-gray-300">
                A comprehensive platform for crime reporting, investigation, and management.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/laws-and-punishments" className="text-gray-300 hover:text-white">
                    Laws & Punishments
                  </Link>
                </li>
                <li>
                  <Link href="/helplines" className="text-gray-300 hover:text-white">
                    Helplines
                  </Link>
                </li>
                <li>
                  <Link href="/amber-alerts" className="text-gray-300 hover:text-white">
                    Amber Alerts
                  </Link>
                </li>
                <li>
                  <Link href="/hall-of-shame" className="text-gray-300 hover:text-white">
                    Hall of Shame
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-300">Emergency: 911</p>
              <p className="text-gray-300">Non-Emergency: 311</p>
              <p className="text-gray-300">Email: info@crimeinvestigation.org</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Crime Investigation System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
