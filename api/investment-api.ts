// API Configuration
const API_BASE_URL_PROFILE = "http://52.207.230.152:8080/api/v1"
const API_BASE_URL_RECOMMENDER = "http://3.88.201.1:8081/api/v1"
const API_BASE_URL_AUTH = "http://52.207.230.152:8082"

// Types and Interfaces
export interface AuthRequest {
	email: string
	password: string
	username: string
}

export interface AuthResponse {
	user: {
		id: string
		username: string
		email: string
	}
	auth: {
		accessToken: string
		tokenType: string
		expiresIn: number
	}
}

export interface RegisterResponse {
	id: string
	email: string
	username: string
}

export interface AnalyzeProfileRequest {
	userId: string
	answers: Record<string, string>
	monthlyInvestmentValue: number
}

export interface AnalyzeProfileResponse {
	userId: string
	totalScore: number
	profileClassification: string
	identifiedInterests: {
		liquidityNeeded: boolean
		esgInterest: string
		macroeconomicConcerns: string[]
		riskToleranceNotes: string
	}
}

export interface FixedIncomeItem {
	name: string
	type: string
	indexerRate: number
	indexer: string
	isTaxExempt: boolean
	dailyLiquidity: boolean
	maturityDate: string
	minimumInvestmentAmount: number
	issuer: string
	issuerRiskScore: number
	source: string
}

export interface VariableIncomeItem {
	ticket: string
	longName: string | null
	currency: string
	logoUrl: string
	regularMarketPrice: number
	regularMarketChange: number
	regularMarketChancePercent: number
	score: number
}

export interface RecommendationResponse {
	FixedIncomesList: FixedIncomeItem[]
	VariableIncomesList: VariableIncomeItem[]
}

// Custom error class to preserve HTTP status
export class ApiError extends Error {
	constructor(
		public status: number,
		public statusText: string,
		message?: string
	) {
		super(message || `${status} - ${statusText}`)
		this.name = "ApiError"
	}
}

// Utility function for API requests
async function apiRequest<T>(url: string, options: RequestInit): Promise<T> {
	try {
		console.log("Request body:", options.body)

		const response = await fetch(url, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
		})

		if (!response.ok) {
			// Try to get error message from response body
			let errorMessage = response.statusText
			try {
				const errorBody = await response.text()
				if (errorBody) {
					const errorData = JSON.parse(errorBody)
					errorMessage = errorData.message || errorData.error || errorMessage
				}
			} catch {
				// If can't parse error body, use statusText
			}

			throw new ApiError(response.status, response.statusText, errorMessage)
		}

		const text = await response.text()

		if (!text) {
			return {} as T
		}

		return JSON.parse(text)
	} catch (error) {
		if (error instanceof ApiError) {
			throw error // Re-throw ApiError as is
		}
		if (error instanceof Error) {
			throw new Error(`Network error: ${error.message}`)
		}
		throw new Error("Unknown network error")
	}
}

// Authentication API Functions
export async function register(email: string, password: string, username: string): Promise<RegisterResponse> {
	return apiRequest<RegisterResponse>(`${API_BASE_URL_AUTH}/auth/register`, {
		method: "POST",
		body: JSON.stringify({ email, password, username }),
	})
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
	return apiRequest<AuthResponse>(`${API_BASE_URL_AUTH}/auth/login`, {
		method: "POST",
		body: JSON.stringify({ email, password }),
	})
}

// Authenticated API request function
async function authenticatedApiRequest<T>(url: string, options: RequestInit): Promise<T> {
	const { AuthService } = await import("@/lib/auth-service")
	const authHeaders = await AuthService.getAuthHeaders()

	return apiRequest<T>(url, {
		...options,
		headers: {
			...authHeaders,
			...options.headers,
		},
	})
}

// Profile Analysis API Functions
export async function analyzeProfile(data: AnalyzeProfileRequest): Promise<AnalyzeProfileResponse> {
	return authenticatedApiRequest<AnalyzeProfileResponse>(`${API_BASE_URL_PROFILE}/profile/analyze`, {
		method: "POST",
		body: JSON.stringify(data),
	})
}

// Recommendations API Functions
export async function getRecommendations(profileData: AnalyzeProfileResponse): Promise<RecommendationResponse> {
	// Add timeout for long-running recommendations
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 seconds

	try {
		const result = await authenticatedApiRequest<RecommendationResponse>(
			`${API_BASE_URL_RECOMMENDER}/recommender`,
			{
				method: "POST",
				body: JSON.stringify(profileData),
				signal: controller.signal,
			}
		)

		clearTimeout(timeoutId)
		return result
	} catch (error) {
		clearTimeout(timeoutId)

		if (error instanceof Error && error.name === "AbortError") {
			throw new Error("Request timeout: The recommendation service took too long to respond")
		}

		throw error
	}
}
