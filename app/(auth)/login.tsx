import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Input } from "@/components/ui/input"
import { router } from "expo-router"
import * as React from "react"
import {
	View,
	Alert,
	ActivityIndicator,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableWithoutFeedback,
} from "react-native"
import { AuthService } from "@/lib/auth-service"
import { ApiError } from "@/api/investment-api"
import { ArrowLeft } from "lucide-react-native"

export default function LoginScreen() {
	const [email, setEmail] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [loading, setLoading] = React.useState(false)
	const [errors, setErrors] = React.useState<{
		email?: string
		password?: string
	}>({})

	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(email)
	}

	const validateForm = () => {
		const newErrors: { email?: string; password?: string } = {}

		// Validação do email
		if (!email.trim()) {
			newErrors.email = "Email é obrigatório"
		} else if (!validateEmail(email.trim())) {
			newErrors.email = "Email inválido"
		}

		// Validação da senha
		if (!password.trim()) {
			newErrors.password = "Senha é obrigatória"
		} else if (password.length < 6) {
			newErrors.password = "Senha deve ter pelo menos 6 caracteres"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	// Função simples para limpar erro quando usuário digita
	const clearError = (field: keyof typeof errors) => {
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }))
		}
	}

	const handleLogin = async () => {
		// Fechar teclado
		Keyboard.dismiss()

		if (!validateForm()) {
			return
		}

		setLoading(true)
		try {
			await AuthService.login(email.trim(), password)
			router.replace("/(tabs)/home")
		} catch (error) {
			console.error("Login error:", error)

			// Tratamento específico de erros da API
			let errorMessage = "Falha ao fazer login. Tente novamente."

			if (error instanceof ApiError) {
				switch (error.status) {
					case 401:
					case 403:
						errorMessage = "Email ou senha incorretos."
						break
					case 404:
						errorMessage = "Usuário não encontrado."
						break
					case 409:
						errorMessage = "Conflito na autenticação. Tente novamente."
						break
					case 500:
						errorMessage = "Erro interno do servidor. Tente novamente mais tarde."
						break
					default:
						errorMessage = error.message || "Erro desconhecido na autenticação."
				}
			} else if (error instanceof Error) {
				if (error.message.includes("Network")) {
					errorMessage = "Erro de conexão. Verifique sua internet."
				} else if (error.message.includes("timeout")) {
					errorMessage = "Tempo limite excedido. Tente novamente."
				} else {
					errorMessage = "Erro de rede. Verifique sua conexão."
				}
			}

			Alert.alert("Erro no Login", errorMessage)
		} finally {
			setLoading(false)
		}
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			className="flex-1 bg-background"
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<ScrollView
					keyboardShouldPersistTaps="handled"
					className="flex-1"
				>
					<View className="flex-1 p-4">
						{/* Header */}
						<View className="items-start mb-8 pt-12">
							<Button
								variant="link"
								onPress={() => router.back()}
								className="p-0"
							>
								<ArrowLeft
									size={24}
									color="#FFFFFF"
								/>
								<Text className="text-white ml-2">Voltar</Text>
							</Button>
						</View>

						{/* Content */}
						<View className="flex-1 justify-center">
							<View className="mb-8">
								<Text className="text-3xl font-bold text-white text-center mb-2">
									Bem-vindo de volta
								</Text>
								<Text className="text-gray-400 text-center">
									Entre com suas credenciais para continuar
								</Text>
							</View>

							<View className="gap-4 mb-6">
								<Input
									label="Email"
									placeholder="seu@email.com"
									value={email}
									onChangeText={(text) => {
										setEmail(text)
										clearError("email")
									}}
									keyboardType="email-address"
									autoCapitalize="none"
									error={errors.email}
									className="bg-gray-800/50 border-gray-600 text-white"
								/>

								<Input
									label="Senha"
									placeholder="Sua senha"
									value={password}
									onChangeText={(text) => {
										setPassword(text)
										clearError("password")
									}}
									secureTextEntry
									showPasswordToggle
									error={errors.password}
									className="bg-gray-800/50 border-gray-600 text-white"
								/>
							</View>

							<Button
								onPress={handleLogin}
								disabled={loading}
								className="w-full bg-blue-600 mb-4"
								size="lg"
							>
								{loading ? (
									<ActivityIndicator
										size="small"
										color="#FFFFFF"
									/>
								) : (
									<Text className="text-white font-medium">Entrar</Text>
								)}
							</Button>

							<View className="flex-row justify-center items-center">
								<Text className="text-gray-400">Não tem uma conta? </Text>
								<Button
									variant="link"
									onPress={() => router.push("/(auth)/register")}
									className="p-0"
								>
									<Text className="text-blue-400">Criar conta</Text>
								</Button>
							</View>
						</View>
					</View>
				</ScrollView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)
}
