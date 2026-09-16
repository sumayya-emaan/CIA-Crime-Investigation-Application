// Function to store user email in local storage
export const storeUserEmail = (email: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userEmail", email)
  }
}

// Function to get user email from local storage
export const getUserEmail = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userEmail")
  }
  return null
}

// Function to clear user email from local storage (logout)
export const clearUserEmail = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userEmail")
  }
}

// Function to store user type (user or investigator)
export const storeUserType = (type: "user" | "investigator") => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userType", type)
  }
}

// Function to get user type from local storage
export const getUserType = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userType") as "user" | "investigator" | null
  }
  return null
}

// Function to check if user is logged in
export const isLoggedIn = () => {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("userEmail")
  }
  return false
}
