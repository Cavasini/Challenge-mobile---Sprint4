import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Input } from "@/components/ui/input"
import { router } from "expo-router"
import * as React from "react"
import { View, Alert, ActivityIndicator, Keyboard } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { AuthService } from "@/lib/auth-service"
import { ApiError } from "@/api/investment-api"
import { ArrowLeft } from "lucide-react-native"

export default function RegisterScreen() {
	const [email, setEmail] = React.useState("")
	const [username, setUsername] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [confirmPassword, setConfirmPassword] = React.useState("")
	const [loading, setLoading] = React.useState(false)
	const [errors, setErrors] = React.useState<{
		email?: string
		username?: string
		password?: string
		confirmPassword?: string
	}>({})

	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(email)
	}

	const validateUsername = (username: string) => {
		const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
		return usernameRegex.test(username)
	}

	const validateForm = () => {
		const newErrors: {
			email?: string
			username?: string
			password?: string
			confirmPassword?: string
		} = {}

		// Validação do email
		if (!email.trim()) {
			newErrors.email = "Email é obrigatório"
		} else if (!validateEmail(email.trim())) {
			newErrors.email = "Email inválido"
		}

		// Validação do username
		if (!username.trim()) {
			newErrors.username = "Nome de usuário é obrigatório"
		} else if (username.trim().length < 3) {
			newErrors.username = "Deve ter pelo menos 3 caracteres"
		} else if (username.trim().length > 20) {
			newErrors.username = "Deve ter no máximo 20 caracteres"
		} else if (!validateUsername(username.trim())) {
			newErrors.username = "Apenas letras, números e _ são permitidos"
		}

		// Validação da senha
		if (!password.trim()) {
			newErrors.password = "Senha é obrigatória"
		} else if (password.length < 6) {
			newErrors.password = "Deve ter pelo menos 6 caracteres"
		} else if (password.length > 50) {
			newErrors.password = "Deve ter no máximo 50 caracteres"
		}

		// Validação da confirmação de senha
		if (!confirmPassword.trim()) {
			newErrors.confirmPassword = "Confirmação de senha é obrigatória"
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = "As senhas não coincidem"
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

	const handleRegister = async () => {
		// Fechar teclado
		Keyboard.dismiss()

		if (!validateForm()) {
			return
		}

		setLoading(true)
		try {
			console.log("Registering with:", { email: email.trim(), username: username.trim(), password: "***" })
			const registerResponse = await AuthService.register(email.trim(), password, username.trim())

			Alert.alert(
				"Conta Criada com Sucesso!",
				`Olá ${registerResponse.username}! Sua conta foi criada. Agora faça login para continuar.`,
				[
					{
						text: "Fazer Login",
						onPress: () => router.replace("/(auth)/login"),
					},
				]
			)
		} catch (error) {
			console.error("Register error:", error)

			// Tratamento específico de erros da API
			let errorMessage = "Falha ao criar conta. Tente novamente."

			if (error instanceof ApiError) {
				switch (error.status) {
					case 400:
						errorMessage = "Dados inválidos. Verifique as informações preenchidas."
						break
					case 409:
						errorMessage = "Este email já está em uso. Tente outro email."
						break
					case 422:
						errorMessage = "Dados não atenderam aos critérios. Verifique os campos."
						break
					case 500:
						errorMessage = "Erro interno do servidor. Tente novamente mais tarde."
						break
					default:
						errorMessage = error.message || "Erro desconhecido no cadastro."
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

			Alert.alert("Erro no Cadastro", errorMessage)
		} finally {
			setLoading(false)
		}
	}

	return (
		<KeyboardAwareScrollView
			keyboardShouldPersistTaps="handled"
			className="flex-1 bg-background p-4"
		>
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
			<View>
				<View className="mb-8">
					<Text className="text-3xl font-bold text-white text-center mb-2">Criar sua conta</Text>
					<Text className="text-gray-400 text-center">Preencha os dados para começar</Text>
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
						label="Nome de Usuário"
						placeholder="3-20 caracteres, letras, números e _"
						value={username}
						onChangeText={(text) => {
							setUsername(text)
							clearError("username")
						}}
						autoCapitalize="none"
						error={errors.username}
						className="bg-gray-800/50 border-gray-600 text-white"
					/>

					<Input
						label="Senha"
						placeholder="Mínimo 6 caracteres"
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

					<Input
						label="Confirmar Senha"
						placeholder="Digite a senha novamente"
						value={confirmPassword}
						onChangeText={(text) => {
							setConfirmPassword(text)
							clearError("confirmPassword")
						}}
						secureTextEntry
						showPasswordToggle
						error={errors.confirmPassword}
						className="bg-gray-800/50 border-gray-600 text-white"
					/>
				</View>

				<Button
					onPress={handleRegister}
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
						<Text className="text-white font-medium">Criar Conta</Text>
					)}
				</Button>

				<View className="flex-row justify-center items-center">
					<Text className="text-gray-400">Já tem uma conta? </Text>
					<Button
						variant="link"
						onPress={() => router.push("/(auth)/login")}
						className="p-0"
					>
						<Text className="text-blue-400">Fazer login</Text>
					</Button>
				</View>
			</View>
		</KeyboardAwareScrollView>
	)
}
