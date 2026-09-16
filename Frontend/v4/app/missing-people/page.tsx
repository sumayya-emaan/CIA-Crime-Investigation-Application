"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, User } from "lucide-react"

// Mock data for missing people
const MOCK_MISSING_PEOPLE = [
  {
    id: 1,
    name: "John Doe",
    age: 25,
    lastSeen: "2023-05-15",
    location: "Central Park, New York",
    description: "Last seen wearing a blue jacket and jeans. Has a small scar on his left cheek.",
    image: "/placeholder.svg?height=300&width=300&text=John+Doe",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 17,
    lastSeen: "2023-06-20",
    location: "Downtown Chicago",
    description: "Last seen wearing a red t-shirt and black pants. Has long brown hair.",
    image: "/placeholder.svg?height=300&width=300&text=Jane+Smith",
  },
  {
    id: 3,
    name: "Michael Johnson",
    age: 32,
    lastSeen: "2023-07-05",
    location: "Miami Beach",
    description: "Last seen wearing a white shirt and shorts. Has a tattoo on his right arm.",
    image: "/placeholder.svg?height=300&width=300&text=Michael+Johnson",
  },
  {
    id: 4,
    name: "Sarah Williams",
    age: 14,
    lastSeen: "2023-07-10",
    location: "Seattle, Washington",
    description: "Last seen wearing a school uniform. Has braces and short blonde hair.",
    image: "/placeholder.svg?height=300&width=300&text=Sarah+Williams",
  },
  {
    id: 5,
    name: "Robert Brown",
    age: 45,
    lastSeen: "2023-06-30",
    location: "Austin, Texas",
    description: "Last seen wearing a green polo shirt and khaki pants. Has glasses and a beard.",
    image: "/placeholder.svg?height=300&width=300&text=Robert+Brown",
  },
  {
    id: 6,
    name: "Emily Davis",
    age: 22,
    lastSeen: "2023-07-15",
    location: "San Francisco, California",
    description: "Last seen wearing a black dress. Has a nose piercing and red hair.",
    image: "/placeholder.svg?height=300&width=300&text=Emily+Davis",
  },
]

export default function MissingPeoplePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPeople, setFilteredPeople] = useState(MOCK_MISSING_PEOPLE)

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPeople(MOCK_MISSING_PEOPLE)
    } else {
      const filtered = MOCK_MISSING_PEOPLE.filter(
        (person) =>
          person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPeople(filtered)
    }
  }, [searchTerm])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-amber-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-4">
            <Link href="/dashboard/user">
              <Button variant="ghost" className="text-white p-0 mr-4">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold flex items-center">
            <User className="mr-3 h-8 w-8" />
            Missing People
          </h1>
          <p className="mt-2">Help us locate these individuals by sharing any information you may have</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="relative mb-8 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, location, or description..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Missing People Grid */}
        {filteredPeople.length === 0 ? (
          <div className="text-center py-8">
            <p>No missing people found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredPeople.map((person) => (
              <Card key={person.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-64 bg-gray-200 relative">
                  <img
                    src={person.image || "/placeholder.svg"}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{person.name}</h3>
                    <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                      Age: {person.age}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Last Seen:</span> {new Date(person.lastSeen).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Location:</span> {person.location}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">{person.description}</p>

                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">Report Information</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-amber-50 p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-amber-800 mb-2">Have Information?</h3>
          <p className="text-gray-700 mb-4">
            If you have any information about these missing individuals, please contact the authorities immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-amber-600 hover:bg-amber-700">Call Emergency Hotline</Button>
            <Link href="/report-crime">
              <Button variant="outline">Submit Information Online</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
