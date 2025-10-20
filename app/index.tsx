import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { TrendingUp } from "lucide-react-native"
import { Stack, router } from "expo-router"
import * as React from "react"
import { useEffect } from "react"
import { View, ActivityIndicator } from "react-native"
import { AuthService } from "@/lib/auth-service"

export default function WelcomeScreen() {
	const [isLoading, setIsLoading] = React.useState(true)

	useEffect(() => {
		checkAuthStatus()
	}, [])

	const checkAuthStatus = async () => {
		try {
			const isAuthenticated = await AuthService.isAuthenticated()

			if (isAuthenticated) {
				// Se já está logado, redirecionar para o app principal
				router.replace("/(tabs)/home")
				return // Importante: return para não mostrar a tela
			}
		} catch (error) {
			console.error("Error checking auth status:", error)
		} finally {
			setIsLoading(false)
		}
	}

	// Se está carregando, mostrar loading
	if (isLoading) {
		return (
			<>
				<Stack.Screen options={{ headerShown: false }} />
				<View className="flex-1 items-center justify-center bg-background">
					<ActivityIndicator
						size="large"
						color="#4F46E5"
					/>
					<Text className="text-gray-400 mt-4">Verificando autenticação...</Text>
				</View>
			</>
		)
	}

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<View className="flex-1 items-center justify-center gap-8 p-4 bg-background">
				<View className="gap-2 p-4 items-center">
					<View className="p-3 items-center justify-center bg-blue-500/10 rounded-2xl border border-blue-500/20">
						<TrendingUp
							size={32}
							color="#4F46E5"
						/>
					</View>
					<Text className="text-4xl font-bold text-center text-foreground">Invest Profile</Text>
					<Text className="text-lg text-center text-muted-foreground">
						Descubra seu perfil de investidor e receba recomendações personalizadas baseadas em suas
						preferências e objetivos financeiros.
					</Text>
				</View>
				<View className="flex-row gap-2">
					<Button onPress={() => router.push("/(auth)/login")}>
						<Text>Login</Text>
					</Button>
					<Button
						variant="outline"
						onPress={() => router.push("/(auth)/register")}
					>
						<Text>Criar conta</Text>
					</Button>
				</View>
			</View>
		</>
	)
}
