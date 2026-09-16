/**
 * Safely access nested properties of an object without throwing errors
 * @param obj The object to access
 * @param path The path to the property, e.g. 'user.address.street'
 * @param defaultValue The default value to return if the property is null/undefined
 */
export function safelyAccessNestedProperty(obj: any, path: string, defaultValue: any = ""): any {
  if (!obj) return defaultValue

  const keys = path.split(".")
  let result = obj

  for (const key of keys) {
    if (result === null || result === undefined || typeof result !== "object") {
      return defaultValue
    }
    result = result[key]
  }

  return result !== null && result !== undefined ? result : defaultValue
}

/**
 * Format a date safely, handling null values
 * @param dateString The date string to format
 * @param defaultValue The default value to return if the date is invalid
 */
export function safelyFormatDate(dateString: string | null | undefined, defaultValue = "N/A"): string {
  if (!dateString) return defaultValue

  try {
    return new Date(dateString).toLocaleString()
  } catch (error) {
    return defaultValue
  }
}

/**
 * Safely get a status color, handling null values
 * @param status The status string
 * @param defaultColor The default color to return if the status is null/undefined
 */
export function safelyGetStatusColor(
  status: string | null | undefined,
  defaultColor = "bg-gray-100 text-gray-800",
): string {
  if (!status) return defaultColor

  switch (status) {
    case "OPEN":
      return "bg-blue-100 text-blue-800"
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-800"
    case "CLOSED":
      return "bg-green-100 text-green-800"
    case "PENDING":
      return "bg-orange-100 text-orange-800"
    case "AT_LARGE":
      return "bg-red-100 text-red-800"
    case "CAPTURED":
      return "bg-green-100 text-green-800"
    case "UNDER_TRIAL":
      return "bg-yellow-100 text-yellow-800"
    default:
      return defaultColor
  }
}
