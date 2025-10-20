import { Text, View, ScrollView, ActivityIndicator } from "react-native"
import React, { useState, useEffect } from "react"
import { router } from "expo-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	TrendingUp,
	ArrowRight,
	Shield,
	Calendar,
	DollarSign,
	TrendingDown,
	AlertTriangle,
} from "lucide-react-native"
import { ProfileService, type RecommendationData, type ProfileAnalysis } from "@/lib/profile-service"
import type { FixedIncomeItem, VariableIncomeItem } from "@/api/investment-api"
import { StockLogo } from "@/components/stock-logo"

// Helper functions
const formatCurrency = (value: number) => {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value)
}

const formatPercentage = (value: number) => {
	return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
}

const formatDate = (dateString: string) => {
	try {
		return new Date(dateString).toLocaleDateString("pt-BR")
	} catch {
		return dateString
	}
}

export default function Recommendations() {
	const [loading, setLoading] = useState(true)
	const [recommendationsLoading, setRecommendationsLoading] = useState(false)
	const [profileData, setProfileData] = useState<ProfileAnalysis | null>(null)
	const [recommendationData, setRecommendationData] = useState<RecommendationData | null>(null)
	const [hasRecommendations, setHasRecommendations] = useState(false)

	useEffect(() => {
		checkRecommendationsStatus()
	}, [])

	const checkRecommendationsStatus = async () => {
		try {
			const hasRecs = await ProfileService.hasRecommendations()
			setHasRecommendations(hasRecs)

			if (hasRecs) {
				const profile = await ProfileService.getProfileAnalysis()
				const recommendations = await ProfileService.getRecommendations()

				setProfileData(profile)
				setRecommendationData(recommendations)
			}
		} catch (error) {
			console.error("Error checking recommendations status:", error)
		} finally {
			setLoading(false)
		}
	}

	const loadRecommendations = async () => {
		setRecommendationsLoading(true)

		try {
			// Carregar recomendações da API
			const recommendations = await ProfileService.loadRecommendations()
			const profile = await ProfileService.getProfileAnalysis()

			setRecommendationData(recommendations)
			setProfileData(profile)
			setHasRecommendations(true)
		} catch (error) {
			console.error("Error loading recommendations:", error)
		} finally {
			setRecommendationsLoading(false)
		}
	}

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center bg-background">
				<ActivityIndicator
					size="large"
					color="#3B82F6"
				/>
				<Text className="text-gray-400 mt-4">Carregando recomendações...</Text>
			</View>
		)
	}
	return (
		<ScrollView className="flex-1 bg-background pt-20">
			<View className="px-4">
				{/* Header */}
				<Text className="text-gray-400 text-base mb-6">
					{hasRecommendations
						? "Suas recomendações personalizadas de investimento"
						: "Descubra seu perfil de investidor através do nosso questionário"}
				</Text>

				{!hasRecommendations ? (
					<>
						{/* Main Card - Questionário */}
						<Card className="bg-gray-900/50 border-gray-800">
							<CardHeader className="items-center">
								<View className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4">
									<TrendingUp
										size={32}
										color="#3B82F6"
									/>
								</View>
								<CardTitle className="text-xl text-white text-center mb-3">
									Questionário de Perfil
								</CardTitle>
								<CardDescription className="text-gray-300 text-center leading-relaxed px-2">
									Responda algumas perguntas para descobrir seu perfil de investidor e receber
									recomendações personalizadas baseadas em seus objetivos.
								</CardDescription>
							</CardHeader>

							<CardContent>
								<Button
									size="lg"
									className="w-full mb-4"
									onPress={() => router.push("/questionnaire")}
								>
									<Text className="text-white font-medium mr-2">Iniciar Questionário</Text>
									<ArrowRight
										size={20}
										color="#FFFFFF"
									/>
								</Button>
							</CardContent>
						</Card>
					</>
				) : (
					<>
						{/* Loading Recommendations */}
						{recommendationsLoading && (
							<Card className="mb-6 bg-gray-900/50 border-blue-500/20">
								<CardHeader className="text-center py-8">
									<View className="items-center mb-4">
										<ActivityIndicator
											size="large"
											color="#3B82F6"
										/>
									</View>
									<CardTitle className="text-blue-300 text-lg">Carregando Recomendações</CardTitle>
									<CardDescription className="text-gray-400">
										Analisando o mercado e selecionando os melhores investimentos...
									</CardDescription>
								</CardHeader>
							</Card>
						)}

						{/* Fixed Income Recommendations */}
						{!recommendationsLoading &&
							recommendationData &&
							recommendationData.FixedIncomesList.length > 0 && (
								<Card className="mb-6 bg-gray-900/50 border-gray-800">
									<CardHeader className="pb-4">
										<CardTitle className="flex-1 items-center text-white">
											<View className="p-3 bg-emerald-500/10 rounded-lg">
												<Shield
													size={20}
													color="#10B981"
												/>
											</View>
											<Text className="text-white text-lg">Renda Fixa Recomendada</Text>
										</CardTitle>
										<CardDescription className="text-gray-400">
											Investimentos de baixo risco para sua carteira
										</CardDescription>
									</CardHeader>
									<CardContent>
										<View className="gap-4">
											{recommendationData.FixedIncomesList.map(
												(item: FixedIncomeItem, index: number) => (
													<View
														key={index}
														className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50"
													>
														<View className="flex-row justify-between items-start mb-3">
															<View className="flex-1 mr-3">
																<Text className="font-semibold text-white text-base">
																	{item.name}
																</Text>
																<Text className="text-sm text-gray-400">
																	{item.type}
																</Text>
															</View>
															<View className="items-end">
																<Text className="text-lg font-bold text-emerald-400">
																	{item.indexerRate.toFixed(2)}% a.a.
																</Text>
																<Text className="text-xs text-gray-400">
																	{item.indexer}
																</Text>
															</View>
														</View>

														<View className="gap-2">
															<View className="flex-row items-center gap-2">
																<Calendar
																	size={14}
																	color="#6B7280"
																/>
																<Text className="text-sm text-gray-300">
																	Vencimento: {formatDate(item.maturityDate)}
																</Text>
															</View>
															<View className="flex-row items-center gap-2">
																<DollarSign
																	size={14}
																	color="#6B7280"
																/>
																<Text className="text-sm text-gray-300">
																	Mín: {formatCurrency(item.minimumInvestmentAmount)}
																</Text>
															</View>
															<View className="flex-row items-center gap-2">
																<View
																	className={`h-2 w-2 rounded-full ${item.dailyLiquidity ? "bg-emerald-500" : "bg-red-500"}`}
																/>
																<Text className="text-sm text-gray-300">
																	{item.dailyLiquidity
																		? "Liquidez diária"
																		: "Sem liquidez diária"}
																</Text>
															</View>
														</View>

														<View className="mt-3 pt-3 border-t border-gray-700/50">
															<View className="flex-row justify-between">
																<Text className="text-xs text-gray-400">
																	<Text className="text-gray-300 font-medium">
																		Emissor:
																	</Text>{" "}
																	{item.issuer}
																</Text>
															</View>
														</View>
													</View>
												)
											)}
										</View>
									</CardContent>
								</Card>
							)}

						{/* Variable Income Recommendations */}
						{!recommendationsLoading &&
							recommendationData &&
							recommendationData.VariableIncomesList.length > 0 && (
								<Card className="mb-6 bg-gray-900/50 border-gray-800">
									<CardHeader className="pb-4">
										<CardTitle className="flex-row items-center gap-3 text-white">
											<View className="p-2 bg-blue-500/10 rounded-lg">
												<TrendingUp
													size={20}
													color="#3B82F6"
												/>
											</View>
											<Text className="text-white text-lg">Ações Recomendadas</Text>
										</CardTitle>
										<CardDescription className="text-gray-400">
											Ações selecionadas para seu perfil de investimento
										</CardDescription>
									</CardHeader>
									<CardContent>
										<View className="gap-4">
											{recommendationData.VariableIncomesList.map(
												(stock: VariableIncomeItem, index: number) => (
													<View
														key={index}
														className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50"
													>
														<View className="flex-row items-center gap-3 mb-3">
															<StockLogo 
																logoUrl={stock.logoUrl} 
																ticker={stock.ticket} 
															/>
															<View className="flex-1">
																<Text className="font-semibold text-white">
																	{stock.ticket}
																</Text>
																{stock.longName && (
																	<Text
																		className="text-xs text-gray-400"
																		numberOfLines={1}
																	>
																		{stock.longName}
																	</Text>
																)}
															</View>
														</View>

														<View className="gap-2">
															<View className="flex-row justify-between items-center">
																<Text className="text-sm text-gray-400">
																	Preço Atual
																</Text>
																<Text className="font-semibold text-white">
																	{formatCurrency(stock.regularMarketPrice)}
																</Text>
															</View>
															<View className="flex-row justify-between items-center">
																<Text className="text-sm text-gray-400">Variação</Text>
																<View className="flex-row items-center gap-1">
																	{stock.regularMarketChange >= 0 ? (
																		<TrendingUp
																			size={12}
																			color="#10B981"
																		/>
																	) : (
																		<TrendingDown
																			size={12}
																			color="#EF4444"
																		/>
																	)}
																	<Text
																		className={`text-sm font-medium ${
																			stock.regularMarketChange >= 0
																				? "text-emerald-400"
																				: "text-red-400"
																		}`}
																	>
																		{formatPercentage(
																			stock.regularMarketChancePercent
																		)}
																	</Text>
																</View>
															</View>
														</View>
													</View>
												)
											)}
										</View>
									</CardContent>
								</Card>
							)}

						{/* Important Notes */}
						<Card className="mb-6 bg-amber-500/5 border-amber-500/20">
							<CardHeader className="pb-4">
								<CardTitle className="flex-row items-center gap-3">
									<AlertTriangle
										size={20}
										color="#F59E0B"
									/>
									<Text className="text-amber-300 text-lg">Avisos Importantes</Text>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<View className="gap-2">
									<Text className="text-sm text-amber-200/80">
										• Esta análise é baseada em algoritmos e suas respostas
									</Text>
									<Text className="text-sm text-amber-200/80">
										• Sempre consulte um assessor qualificado
									</Text>
									<Text className="text-sm text-amber-200/80">• Diversifique seus investimentos</Text>
									<Text className="text-sm text-amber-200/80">
										• Rentabilidade passada não garante resultados futuros
									</Text>
								</View>
							</CardContent>
						</Card>

						{/* Action Button */}
						<Button
							size="lg"
							className="w-full mb-4"
							onPress={() => setHasRecommendations(false)}
						>
							<Text className="text-white font-medium">Refazer Questionário</Text>
						</Button>
					</>
				)}
			</View>
		</ScrollView>
	)
}
