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
import { ArrowLeft, User } from "lucide-react"

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
  address: yup.string().required("Address is required"),
  gender: yup.string().required("Gender is required"),
  email: yup.string().email("Must be a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  userType: yup.string().required("User type is required"),
})

type RegisterFormData = yup.InferType<typeof registerSchema>

export default function UserRegisterPage() {
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
      userType: "",
    },
  })

  // Fix: Use request body as expected by the backend
  // @PostMapping("/register/user")
  // public User registerUser(@RequestBody UserSignupRequest request)
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError("")

      // Prepare request body as UserSignupRequest
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
        address: data.address,
        gender: data.gender,
        email: data.email,
        password: data.password,
        userType: data.userType,
      }

      // Make API request with POST method and request body
      await axios.post(API_ENDPOINTS.AUTH.REGISTER_USER, requestBody)

      // Redirect to login page on success
      router.push("/login/user?registered=true")
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
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">User Registration</CardTitle>
            <CardDescription className="text-center">
              Create a new account to report crimes and track cases
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

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Enter your address" {...register("address")} />
                  {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
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

                <div className="space-y-2">
                  <Label htmlFor="userType">User Type</Label>
                  <Select onValueChange={(value) => setValue("userType", value)} defaultValue={watch("userType")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VICTIM">Victim</SelectItem>
                      <SelectItem value="EYEWITNESS">Eyewitness</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.userType && <p className="text-sm text-red-500">{errors.userType.message}</p>}
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
              <Link href="/login/user" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
