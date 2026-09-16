// Replace with your actual backend URL
export const API_BASE_URL = "http://localhost:8080"

export const API_ENDPOINTS = {
  // Auth endpoints - match exactly with @RequestMapping("/auth")
  AUTH: {
    LOGIN_USER: `${API_BASE_URL}/auth/login/user`,
    LOGIN_INVESTIGATOR: `${API_BASE_URL}/auth/login/investigator`,
    REGISTER_USER: `${API_BASE_URL}/auth/register/user`,
    REGISTER_INVESTIGATOR: `${API_BASE_URL}/auth/register/investigator`,
  },
  // Laws endpoints - match exactly with @RequestMapping("/api/laws")
  LAWS: {
    GET_ALL: `${API_BASE_URL}/api/laws`,
  },
  // Helplines endpoints - match exactly with @RequestMapping("/api/helplines")
  HELPLINES: {
    GET_ALL: `${API_BASE_URL}/api/helplines`,
  },
  // Cases endpoints - match exactly with @RequestMapping("/cases")
  CASES: {
    AMBER_ALERTS: `${API_BASE_URL}/cases/amber-alerts`,
    REPORT_CRIME: `${API_BASE_URL}/cases/report`,
    GET_CURRENT_CASES: `${API_BASE_URL}/cases/current`,
    GET_CLOSED_CASES: `${API_BASE_URL}/cases/closed`,
  },
  // Tracking status endpoints - match exactly with @RequestMapping("/trackingstatus")
  TRACKING: {
    GET_CASE_BY_ID: `${API_BASE_URL}/trackingstatus`,
  },
  // Feedback endpoints - match exactly with @RequestMapping("/api/feedback")
  FEEDBACK: {
    ADD: `${API_BASE_URL}/api/feedback`,
  },
  // Criminals endpoints - match exactly with @RequestMapping("/criminals")
  CRIMINALS: {
    GET_ALL: `${API_BASE_URL}/criminals/all`,
    GET_BY_ID: `${API_BASE_URL}/criminals`,
  },
  // Investigator endpoints - match exactly with @RequestMapping("/investigator")
  INVESTIGATOR: {
    UPDATE_CASE_STATUS: `${API_BASE_URL}/investigator/update-status`,
  },
}
