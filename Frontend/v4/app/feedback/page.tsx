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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, MessageSquare } from "lucide-react"

// Form validation schema
const feedbackSchema = yup.object({
  caseId: yup.string().required("Case ID is required"),
  comments: yup.string().required("Comments are required").min(10, "Comments must be at least 10 characters"),
  rating: yup.string().required("Rating is required"),
})

type FeedbackFormData = yup.InferType<typeof feedbackSchema>

export default function FeedbackPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FeedbackFormData>({
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      rating: "",
    },
  })

  // Fix: Use request body as expected by the backend
  // @PostMapping("/{id}")
  // public Feedback addFeedback(@RequestBody Feedback feedback)
  const onSubmit = async (data: FeedbackFormData) => {
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

      // Prepare request body as Feedback
      const requestBody = {
        caseId: data.caseId,
        comments: data.comments,
        rating: Number.parseInt(data.rating),
        userEmail: userEmail,
      }

      // Make API request with POST method and request body
      // Note the endpoint structure with the ID in the path
      await axios.post(`${API_ENDPOINTS.FEEDBACK.ADD}/${data.caseId}`, requestBody)

      setSuccess(true)
      setIsLoading(false)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/user")
      }, 2000)
    } catch (err) {
      console.error("Error submitting feedback:", err)
      setError("Failed to submit feedback. Please try again.")
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
              <MessageSquare className="mr-2 h-5 w-5 text-green-600" />
              Provide Feedback
            </CardTitle>
            <CardDescription>Share your experience and help us improve our services</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="caseId">Case ID</Label>
                <Input id="caseId" placeholder="Enter the case ID" {...register("caseId")} />
                {errors.caseId && <p className="text-sm text-red-500">{errors.caseId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <RadioGroup
                  onValueChange={(value) => setValue("rating", value)}
                  defaultValue={watch("rating")}
                  className="flex space-x-4"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                      <Label htmlFor={`rating-${value}`}>{value}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.rating && <p className="text-sm text-red-500">{errors.rating.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  placeholder="Share your experience and suggestions"
                  rows={5}
                  {...register("comments")}
                />
                {errors.comments && <p className="text-sm text-red-500">{errors.comments.message}</p>}
              </div>

              {error && (
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <p className="text-sm text-green-600">Feedback submitted successfully! Redirecting to dashboard...</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-sm text-gray-500 text-center">
            <p>Your feedback is valuable to us and helps improve our services.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
