import AsyncStorage from "@react-native-async-storage/async-storage"
import { AuthResponse, RegisterResponse, register as apiRegister, loginUser as apiLogin } from "../api/investment-api"

// Storage keys
const AUTH_TOKEN_KEY = "@invest_profile_token"
const USER_DATA_KEY = "@invest_profile_user"

// Types
export interface UserSession {
	token: string
	userId: string
	email: string
	username: string
	loginTime: number
}

// Authentication service
export class AuthService {
	// Save user session to AsyncStorage
	static async saveSession(token: string, userId: string, email: string, username: string): Promise<void> {
		try {
			const session: UserSession = {
				token,
				userId,
				email,
				username,
				loginTime: Date.now(),
			}

			await AsyncStorage.setItem(AUTH_TOKEN_KEY, token)
			await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(session))
		} catch (error) {
			console.error("Error saving session:", error)
			throw new Error("Failed to save session")
		}
	}

	// Get current session from AsyncStorage
	static async getSession(): Promise<UserSession | null> {
		try {
			const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY)
			const userData = await AsyncStorage.getItem(USER_DATA_KEY)

			if (!token || !userData) {
				return null
			}

			return JSON.parse(userData)
		} catch (error) {
			console.error("Error getting session:", error)
			return null
		}
	}

	// Check if user is authenticated
	static async isAuthenticated(): Promise<boolean> {
		const session = await this.getSession()
		return session !== null
	}

	// Get current token
	static async getToken(): Promise<string | null> {
		try {
			return await AsyncStorage.getItem(AUTH_TOKEN_KEY)
		} catch (error) {
			console.error("Error getting token:", error)
			return null
		}
	}

	// Get current user ID
	static async getUserId(): Promise<string | null> {
		try {
			const session = await this.getSession()
			return session?.userId || null
		} catch (error) {
			console.error("Error getting user ID:", error)
			return null
		}
	}

	// Get authenticated headers for API requests
	static async getAuthHeaders(): Promise<Record<string, string>> {
		const token = await this.getToken()
		return {
			"Content-Type": "application/json",
			...(token && { Authorization: `Bearer ${token}` }),
		}
	}

	// Clear session (logout)
	static async clearSession(): Promise<void> {
		try {
			await AsyncStorage.removeItem(AUTH_TOKEN_KEY)
			await AsyncStorage.removeItem(USER_DATA_KEY)
		} catch (error) {
			console.error("Error clearing session:", error)
			throw new Error("Failed to clear session")
		}
	}

	// Login user
	static async login(email: string, password: string): Promise<UserSession> {
		try {
			const response: AuthResponse = await apiLogin(email, password)

			await this.saveSession(
				response.auth.accessToken,
				response.user.id,
				response.user.email,
				response.user.username
			)

			return {
				token: response.auth.accessToken,
				userId: response.user.id,
				email: response.user.email,
				username: response.user.username,
				loginTime: Date.now(),
			}
		} catch (error) {
			console.error("Login error:", error)
			throw error
		}
	}

	// Register user - apenas cria a conta, não faz login
	static async register(email: string, password: string, username: string): Promise<RegisterResponse> {
		try {
			const response: RegisterResponse = await apiRegister(email, password, username)

			// Não salva sessão no registro, apenas retorna os dados da conta criada
			return response
		} catch (error) {
			console.error("Register error:", error)
			throw error
		}
	}

	// Logout user
	static async logout(): Promise<void> {
		await this.clearSession()
	}
}
