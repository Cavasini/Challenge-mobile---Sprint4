import { View, ScrollView, Alert, ActivityIndicator } from "react-native"
import React, { useState, useEffect } from "react"
import { router } from "expo-router"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {
	Shield,
	Droplets,
	ArrowRight,
	User,
	LogOut,
	PieChart,
	Target,
	MoreVertical,
	Edit,
	Trash2,
	Camera,
} from "lucide-react-native"
import { AuthService } from "@/lib/auth-service"
import { ProfileService, type ProfileAnalysis, type QuestionnaireData } from "@/lib/profile-service"
import { AvatarService } from "@/lib/avatar-service"

// Helper functions (seguindo padrão do Next.js)
const getProfileIcon = (classification: string) => {
	switch (classification.toLowerCase()) {
		case "conservador":
			return {
				icon: Shield,
				color: "#10B981",
				bgColor: "bg-emerald-500/10",
				borderColor: "border-emerald-500/20",
			}
		case "moderado":
			return {
				icon: PieChart,
				color: "#F59E0B",
				bgColor: "bg-amber-500/10",
				borderColor: "border-amber-500/20",
			}
		case "sofisticado":
			return {
				icon: Target,
				color: "#EF4444",
				bgColor: "bg-red-500/10",
				borderColor: "border-red-500/20",
			}
		default:
			return {
				icon: PieChart,
				color: "#6B7280",
				bgColor: "bg-gray-500/10",
				borderColor: "border-gray-500/20",
			}
	}
}

const getRiskLevel = (classification: string) => {
	switch (classification.toLowerCase()) {
		case "conservador":
			return 1
		case "moderado":
			return 2
		case "sofisticado":
			return 3
		default:
			return 2
	}
}

const getRiskGradient = (classification: string) => {
	switch (classification.toLowerCase()) {
		case "conservador":
			return "from-emerald-500 to-green-600"
		case "moderado":
			return "from-amber-500 to-orange-600"
		case "sofisticado":
			return "from-red-500 to-pink-600"
		default:
			return "from-blue-500 to-indigo-600"
	}
}

const getProfileDescription = (classification: string) => {
	switch (classification.toLowerCase()) {
		case "conservador":
			return "Você prioriza a segurança do seu capital e prefere investimentos com menor volatilidade. Seu foco está na preservação do patrimônio com rentabilidade consistente."
		case "moderado":
			return "Você busca equilibrar segurança e crescimento, aceitando oscilações moderadas em busca de melhores retornos no médio a longo prazo."
		case "sofisticado":
			return "Você possui alta tolerância ao risco e conhecimento avançado do mercado. Busca maximizar retornos através de estratégias complexas e está confortável com alta volatilidade."
		default:
			return "Perfil de investimento baseado em suas respostas ao questionário."
	}
}

export default function Profile() {
	const [hasProfile, setHasProfile] = useState(false)
	const [loading, setLoading] = useState(true)
	const [profileData, setProfileData] = useState<ProfileAnalysis | null>(null)
	const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null)
	const [userSession, setUserSession] = useState<any>(null)
	const [avatarUri, setAvatarUri] = useState<string | null>(null)

	useEffect(() => {
		loadUserData()
	}, [])

	const loadUserData = async () => {
		try {
			// Carregar dados do usuário
			const session = await AuthService.getSession()
			setUserSession(session)

			// Carregar avatar
			const avatar = await AvatarService.getAvatar()
			setAvatarUri(avatar)

			// Verificar status do perfil
			await checkProfileStatus()
		} catch (error) {
			console.error("Error loading user data:", error)
		}
	}

	const checkProfileStatus = async () => {
		try {
			const status = await ProfileService.getProfileStatus()
			setHasProfile(status.hasAnalysis)

			if (status.hasAnalysis) {
				const profile = await ProfileService.getProfileAnalysis()
				const questionnaire = await ProfileService.getQuestionnaireData()

				setProfileData(profile)
				setQuestionnaireData(questionnaire)
			}
		} catch (error) {
			console.error("Error checking profile status:", error)
		} finally {
			setLoading(false)
		}
	}

	const handleAvatarPress = async () => {
		try {
			// Usar seletor nativo que já inclui galeria + câmera
			const uri = await AvatarService.selectImageWithOptions()
			if (uri) {
				await AvatarService.saveAvatar(uri)
				setAvatarUri(uri)
			}
		} catch (error) {
			Alert.alert("Erro", "Não foi possível selecionar a imagem.")
		}
	}

	const removeAvatar = async () => {
		try {
			await AvatarService.removeAvatar()
			setAvatarUri(null)
		} catch (error) {
			Alert.alert("Erro", "Não foi possível remover a foto.")
		}
	}

	const handleDeleteAnalysis = () => {
		Alert.alert(
			"Excluir Análise",
			"Tem certeza que deseja excluir sua análise de perfil? Você precisará refazer o questionário.",
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Excluir",
					style: "destructive",
					onPress: async () => {
						try {
							await ProfileService.clearAllData()
							setHasProfile(false)
							setProfileData(null)
							setQuestionnaireData(null)
						} catch (error) {
							Alert.alert("Erro", "Não foi possível excluir a análise.")
						}
					},
				},
			]
		)
	}

	const handleLogout = () => {
		Alert.alert("Sair da conta", "Tem certeza que deseja sair da sua conta?", [
			{
				text: "Cancelar",
				style: "cancel",
			},
			{
				text: "Sair",
				style: "destructive",
				onPress: async () => {
					try {
						await AuthService.logout()
						await ProfileService.clearAllData()
						router.replace("/")
					} catch (error) {
						Alert.alert("Erro", "Não foi possível sair da conta. Tente novamente.")
					}
				},
			},
		])
	}

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center bg-background">
				<ActivityIndicator
					size="large"
					color="#3B82F6"
				/>
				<Text className="text-gray-400 mt-4">Carregando perfil...</Text>
			</View>
		)
	}

	return (
		<ScrollView className="flex-1 bg-background">
			{/* Header */}
			<View className="flex-row justify-between items-center px-4 pt-16 pb-6">
				<Text className="text-2xl font-bold text-white">Perfil</Text>
				<DropdownMenu
					trigger={
						<View className="p-2">
							<MoreVertical
								size={24}
								color="#FFFFFF"
							/>
						</View>
					}
				>
					<DropdownMenuItem
						onPress={handleLogout}
						destructive
					>
						Sair da conta
					</DropdownMenuItem>
				</DropdownMenu>
			</View>

			<View className="px-4">
				{/* User Info Section */}
				<View className="flex-row items-center mb-8">
					{/* Avatar with Edit Icon */}
					<View className="relative">
						<Avatar
							size="md"
							src={avatarUri || undefined}
							fallback={userSession?.username?.substring(0, 2).toUpperCase() || "U"}
							onPress={handleAvatarPress}
						/>
						{/* Edit Icon */}
						<View className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-1">
							<Edit
								size={12}
								color="#FFFFFF"
							/>
						</View>
					</View>

					{/* User Details */}
					<View className="flex-1 ml-4">
						<Text className="text-xl font-semibold text-white">{userSession?.username || "Usuário"}</Text>
						<Text className="text-sm text-gray-400 mt-1">{userSession?.email || "email@exemplo.com"}</Text>
					</View>
				</View>

				{/* Profile Content */}
				{!hasProfile ? (
					/* Questionário Card */
					<Card className="bg-gray-900/50 border-gray-800 mb-6">
						<CardHeader className="items-center">
							<View className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 mb-4">
								<User
									size={32}
									color="#10B981"
								/>
							</View>
							<CardTitle className="text-xl text-white text-center mb-3">Perfil de Investidor</CardTitle>
							<CardDescription className="text-gray-300 text-center leading-relaxed px-2">
								Complete o questionário para descobrir seu perfil de investidor e acessar análises
								personalizadas sobre sua tolerância ao risco e objetivos.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								size="lg"
								className="w-full mb-4"
								onPress={() => router.push("/questionnaire")}
							>
								<Text className="text-white font-medium mr-2">Fazer Questionário</Text>
								<ArrowRight
									size={20}
									color="#FFFFFF"
								/>
							</Button>
						</CardContent>
					</Card>
				) : (
					/* Profile Analysis Results */
					<>
						{/* Profile Classification Card */}
						{profileData && (
							<Card className="mb-6 bg-gray-900/50 border-gray-800">
								<CardHeader className="items-start flex-row">
									<View
										className={`p-3 rounded-2xl ${getProfileIcon(profileData.profileClassification).bgColor} border ${getProfileIcon(profileData.profileClassification).borderColor}`}
									>
										{React.createElement(getProfileIcon(profileData.profileClassification).icon, {
											size: 28,
											color: getProfileIcon(profileData.profileClassification).color,
										})}
									</View>
									<View className="flex-1 gap-2 ml-3">
										<CardTitle className="text-xl text-white text-left">
											{profileData.profileClassification}
										</CardTitle>
										<CardDescription className="text-gray-300 text-left">
											{getProfileDescription(profileData.profileClassification)}
										</CardDescription>
									</View>
								</CardHeader>
							</Card>
						)}

						{/* Risk Level */}
						{profileData && (
							<View className="mb-6">
								<View className="flex-row justify-between items-center mb-3">
									<Text className="text-sm font-medium text-gray-300">Nível de Risco</Text>
									<Text className="text-sm text-gray-400">
										{getRiskLevel(profileData.profileClassification)}/3
									</Text>
								</View>
								<View className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
									<View
										className={`h-full bg-gradient-to-r ${getRiskGradient(profileData.profileClassification)} rounded-full`}
										style={{
											width: `${(getRiskLevel(profileData.profileClassification) / 3) * 100}%`,
										}}
									/>
								</View>
							</View>
						)}

						{/* High Liquidity Badge */}
						{profileData?.identifiedInterests?.liquidityNeeded && (
							<View className="items-start mb-6">
								<Badge className="bg-blue-500/10 border-blue-500/20 flex-row items-center px-4 py-2">
									<Droplets
										size={16}
										color="#60A5FA"
									/>
									<Text className="text-blue-400 ml-2">Alta Necessidade de Liquidez</Text>
								</Badge>
							</View>
						)}

						{/* Risk Notes */}
						{profileData && (
							<View className="mb-6">
								<Text className="font-medium mb-2 text-gray-200 text-left">
									Observações sobre Tolerância ao Risco
								</Text>
								<Text className="text-gray-400 text-left leading-relaxed">
									{profileData.identifiedInterests?.riskToleranceNotes ||
										"Nenhuma observação específica sobre tolerância ao risco."}
								</Text>
							</View>
						)}

						{/* Investment Value */}
						{questionnaireData && (
							<Card className="mb-6 bg-gray-900/50 border-gray-800">
								<CardHeader>
									<CardTitle className="text-white">Valor Mensal para Investimento</CardTitle>
								</CardHeader>
								<CardContent>
									<Text className="text-2xl font-bold text-blue-400">
										{new Intl.NumberFormat("pt-BR", {
											style: "currency",
											currency: "BRL",
										}).format(questionnaireData.monthlyInvestmentValue)}
									</Text>
								</CardContent>
							</Card>
						)}

						{/* Delete Analysis Button */}
						<Button
							size="lg"
							variant="outline"
							className="w-full border-red-500/20 bg-red-500/10 mb-6"
							onPress={handleDeleteAnalysis}
						>
							<Trash2
								size={16}
								color="#EF4444"
							/>
							<Text className="text-red-400 font-medium ml-2">Excluir Análise</Text>
						</Button>
					</>
				)}
			</View>
		</ScrollView>
	)
}
