"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import { API_ENDPOINTS } from "@/lib/api-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Book, ArrowLeft, Search } from "lucide-react"

interface LawsAndPunishments {
  lawID: number
  crime_type: string
  section_name: string
  punishment: string
}

export default function LawsAndPunishmentsPage() {
  const [laws, setLaws] = useState<LawsAndPunishments[]>([])
  const [filteredLaws, setFilteredLaws] = useState<LawsAndPunishments[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchLaws = async () => {
      try {
        setLoading(true)
        const response = await axios.get(API_ENDPOINTS.LAWS.GET_ALL)
        setLaws(response.data)
        setFilteredLaws(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching laws:", err)
        setError("Failed to load laws and punishments. Please try again later.")
        setLoading(false)
      }
    }

    fetchLaws()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLaws(laws)
    } else {
      const filtered = laws.filter(
        (law) =>
          law.crime_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          law.section_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          law.punishment.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredLaws(filtered)
    }
  }, [searchTerm, laws])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-800 text-white py-8">
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
            <Book className="mr-3 h-8 w-8" />
            Laws and Punishments
          </h1>
          <p className="mt-2">Comprehensive information about legal frameworks and consequences</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="relative mb-8 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by crime type, law section, or punishment..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Laws List */}
        {loading ? (
          <div className="text-center py-8">
            <p>Loading laws and punishments...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredLaws.length === 0 ? (
          <div className="text-center py-8">
            <p>No laws and punishments found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLaws.map((law) => (
              <Card key={law.lawID} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-blue-800">{law.crime_type}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Law Section</h3>
                  <p className="text-gray-600 mb-4">{law.section_name}</p>

                  <h3 className="font-semibold text-gray-800 mb-2">Punishment</h3>
                  <p className="text-gray-600">{law.punishment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
