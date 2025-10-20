import AsyncStorage from "@react-native-async-storage/async-storage"
import {
	analyzeProfile,
	getRecommendations,
	type AnalyzeProfileResponse,
	type RecommendationResponse,
} from "../api/investment-api"
import { AuthService } from "./auth-service"

// Keys para AsyncStorage
const QUESTIONNAIRE_DATA_KEY = "@questionnaire_data"
const PROFILE_ANALYSIS_KEY = "@profile_analysis"
const RECOMMENDATIONS_KEY = "@recommendations"

// Interface para dados do questionário (seguindo padrão do Next.js)
export interface QuestionnaireData {
	userId: string
	answers: Record<string, string>
	monthlyInvestmentValue: number
	completedAt: number // timestamp
}

// Interface para análise do perfil (adaptada da API)
export interface ProfileAnalysis extends AnalyzeProfileResponse {
	analyzedAt: number // timestamp
}

// Interface para recomendações (adaptada da API)
export interface RecommendationData extends RecommendationResponse {
	loadedAt: number // timestamp
}

export class ProfileService {
	// Salvar dados do questionário
	static async saveQuestionnaireData(data: Omit<QuestionnaireData, "userId" | "completedAt">): Promise<void> {
		try {
			console.log("Saving questionnaire data:", data)

			const userId = await AuthService.getUserId()
			console.log("Got userId from AuthService:", userId)

			if (!userId) {
				throw new Error("Usuário não autenticado")
			}

			const questionnaireData: QuestionnaireData = {
				...data,
				userId,
				completedAt: Date.now(),
			}

			console.log("Final questionnaire data to save:", questionnaireData)
			await AsyncStorage.setItem(QUESTIONNAIRE_DATA_KEY, JSON.stringify(questionnaireData))
			console.log("Questionnaire data saved successfully")
		} catch (error) {
			console.error("Error saving questionnaire data:", error)
			throw new Error("Failed to save questionnaire data")
		}
	}

	// Obter dados do questionário
	static async getQuestionnaireData(): Promise<QuestionnaireData | null> {
		try {
			const data = await AsyncStorage.getItem(QUESTIONNAIRE_DATA_KEY)
			return data ? JSON.parse(data) : null
		} catch (error) {
			console.error("Error getting questionnaire data:", error)
			return null
		}
	}

	// Verificar se questionário foi completado
	static async isQuestionnaireCompleted(): Promise<boolean> {
		const data = await this.getQuestionnaireData()
		return data !== null
	}

	// Analisar perfil (chamar API e salvar resultado)
	static async analyzeUserProfile(): Promise<ProfileAnalysis> {
		try {
			const questionnaireData = await this.getQuestionnaireData()

			if (!questionnaireData) {
				throw new Error("Questionário não encontrado. Complete o questionário primeiro.")
			}

			// Usar dados exatamente como no Next.js
			const analyzeRequest = {
				userId: questionnaireData.userId,
				answers: questionnaireData.answers,
				monthlyInvestmentValue: questionnaireData.monthlyInvestmentValue,
			}

			// Chamar API de análise
			const analysisResult = await analyzeProfile(analyzeRequest)

			const profileAnalysis: ProfileAnalysis = {
				...analysisResult,
				analyzedAt: Date.now(),
			}

			// Salvar resultado
			await AsyncStorage.setItem(PROFILE_ANALYSIS_KEY, JSON.stringify(profileAnalysis))

			return profileAnalysis
		} catch (error) {
			console.error("Error analyzing profile:", error)
			throw error
		}
	}

	// Obter análise do perfil
	static async getProfileAnalysis(): Promise<ProfileAnalysis | null> {
		try {
			const data = await AsyncStorage.getItem(PROFILE_ANALYSIS_KEY)
			return data ? JSON.parse(data) : null
		} catch (error) {
			console.error("Error getting profile analysis:", error)
			return null
		}
	}

	// Carregar recomendações (chamar API e salvar resultado)
	static async loadRecommendations(): Promise<RecommendationData> {
		try {
			const profileAnalysis = await this.getProfileAnalysis()

			if (!profileAnalysis) {
				throw new Error("Análise de perfil não encontrada. Analise o perfil primeiro.")
			}

			// Chamar API de recomendações
			const recommendations = await getRecommendations(profileAnalysis)

			const recommendationData: RecommendationData = {
				...recommendations,
				loadedAt: Date.now(),
			}

			// Salvar recomendações
			await AsyncStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(recommendationData))

			return recommendationData
		} catch (error) {
			console.error("Error loading recommendations:", error)
			throw error
		}
	}

	// Obter recomendações
	static async getRecommendations(): Promise<RecommendationData | null> {
		try {
			const data = await AsyncStorage.getItem(RECOMMENDATIONS_KEY)
			return data ? JSON.parse(data) : null
		} catch (error) {
			console.error("Error getting recommendations:", error)
			return null
		}
	}

	// Verificar se tem recomendações
	static async hasRecommendations(): Promise<boolean> {
		const data = await this.getRecommendations()
		return data !== null
	}

	// Limpar todos os dados (para logout ou reset)
	static async clearAllData(): Promise<void> {
		try {
			await AsyncStorage.multiRemove([QUESTIONNAIRE_DATA_KEY, PROFILE_ANALYSIS_KEY, RECOMMENDATIONS_KEY])
		} catch (error) {
			console.error("Error clearing profile data:", error)
			throw new Error("Failed to clear profile data")
		}
	}

	// Obter status completo do perfil
	static async getProfileStatus(): Promise<{
		hasQuestionnaire: boolean
		hasAnalysis: boolean
		hasRecommendations: boolean
	}> {
		const [hasQuestionnaire, hasAnalysis, hasRecommendations] = await Promise.all([
			this.isQuestionnaireCompleted(),
			this.getProfileAnalysis().then((data) => data !== null),
			this.hasRecommendations(),
		])

		return {
			hasQuestionnaire,
			hasAnalysis,
			hasRecommendations,
		}
	}
}
