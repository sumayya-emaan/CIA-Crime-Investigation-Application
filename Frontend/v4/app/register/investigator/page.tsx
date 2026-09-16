"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { API_ENDPOINTS } from "@/lib/api-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Shield } from "lucide-react"

// Form validation schema
const registerSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  midName: yup.string(),
  lastName: yup.string().required("Last name is required"),
  fatherName: yup.string().required("Father name is required"),
  contactNumber: yup.string().required("Contact number is required"),
  dob: yup.string().required("Date of birth is required"),
  occupation: yup.string().required("Occupation is required"),
  cnic: yup.string().required("CNIC is required"),
  gender: yup.string().required("Gender is required"),
  role: yup.string().required("Role is required"),
  rank: yup.string().required("Rank is required"),
  specialization: yup.string().required("Specialization is required"),
  email: yup.string().email("Must be a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})

type RegisterFormData = yup.InferType<typeof registerSchema>

export default function InvestigatorRegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      gender: "",
      role: "",
      specialization: "",
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError("")

      // Prepare request body as InvestigatorSignupRequest
      const requestBody = {
        firstName: data.firstName,
        midName: data.midName || "",
        lastName: data.lastName,
        fatherName: data.fatherName,
        contactNumber: data.contactNumber,
        dob: data.dob,
        occupation: data.occupation,
        cnic: data.cnic,
        personId: 0, // This will be assigned by the backend
        gender: data.gender,
        role: data.role,
        rank: data.rank,
        noOfCurrentCases: 0,
        solvedCases: 0,
        email: data.email,
        password: data.password,
        specialization: data.specialization,
      }

      // Make API request
      await axios.post(API_ENDPOINTS.AUTH.REGISTER_INVESTIGATOR, requestBody)

      // Redirect to login page on success
      router.push("/login/investigator?registered=true")
    } catch (err) {
      console.error("Registration error:", err)
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-block mb-6">
          <Button variant="ghost" className="p-0">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="bg-blue-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Investigator Registration</CardTitle>
            <CardDescription className="text-center">
              Create a new account to manage and investigate cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter your first name" {...register("firstName")} />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="midName">Middle Name (Optional)</Label>
                  <Input id="midName" placeholder="Enter your middle name" {...register("midName")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter your last name" {...register("lastName")} />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Name</Label>
                  <Input id="fatherName" placeholder="Enter your father's name" {...register("fatherName")} />
                  {errors.fatherName && <p className="text-sm text-red-500">{errors.fatherName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input id="contactNumber" placeholder="Enter your contact number" {...register("contactNumber")} />
                  {errors.contactNumber && <p className="text-sm text-red-500">{errors.contactNumber.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" {...register("dob")} />
                  {errors.dob && <p className="text-sm text-red-500">{errors.dob.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input id="occupation" placeholder="Enter your occupation" {...register("occupation")} />
                  {errors.occupation && <p className="text-sm text-red-500">{errors.occupation.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnic">CNIC</Label>
                  <Input id="cnic" placeholder="Enter your CNIC" {...register("cnic")} />
                  {errors.cnic && <p className="text-sm text-red-500">{errors.cnic.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={(value) => setValue("gender", value)} defaultValue={watch("gender")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
                </div>

                {/* Professional Information */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={(value) => setValue("role", value)} defaultValue={watch("role")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DETECTIVE">Detective</SelectItem>
                      <SelectItem value="OFFICER">Officer</SelectItem>
                      <SelectItem value="FORENSIC_EXPERT">Forensic Expert</SelectItem>
                      <SelectItem value="ANALYST">Analyst</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rank">Rank</Label>
                  <Input id="rank" placeholder="Enter your rank" {...register("rank")} />
                  {errors.rank && <p className="text-sm text-red-500">{errors.rank.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Select
                    onValueChange={(value) => setValue("specialization", value)}
                    defaultValue={watch("specialization")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOMICIDE">Homicide</SelectItem>
                      <SelectItem value="THEFT">Theft</SelectItem>
                      <SelectItem value="CYBERCRIME">Cybercrime</SelectItem>
                      <SelectItem value="NARCOTICS">Narcotics</SelectItem>
                      <SelectItem value="FRAUD">Fraud</SelectItem>
                      <SelectItem value="ASSAULT">Assault</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.specialization && <p className="text-sm text-red-500">{errors.specialization.message}</p>}
                </div>

                {/* Account Information */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" {...register("email")} />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" {...register("password")} />
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-center text-gray-500">
              Already have an account?{" "}
              <Link href="/login/investigator" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
