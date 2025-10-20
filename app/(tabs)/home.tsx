import React from "react"
import { Text, View, ScrollView } from "react-native"
import { router, Tabs } from "expo-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Shield, Leaf, BarChart3, ArrowRight, CheckCircle, Users, Globe } from "lucide-react-native"

export default function Home() {
	return (
		<ScrollView className="flex-1 bg-background pt-10">
			<View className="px-4">
				{/* Hero Section */}
				<View className="items-center mb-8 pt-4">
					<View className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4">
						<TrendingUp
							size={40}
							color="#3B82F6"
						/>
					</View>
					<Text className="text-white font-bold text-2xl text-center mb-3">
						Descubra Seu Perfil de Investidor
					</Text>
					<Text className="text-gray-400 text-center leading-relaxed px-4">
						Receba recomendações personalizadas de investimentos baseadas em suas preferências e objetivos
						financeiros
					</Text>
				</View>

				{/* Features Section */}
				<View className="mb-8">
					<Text className="text-white font-semibold text-lg mb-4">Como Funciona</Text>

					<View className="gap-4">
						{/* Feature 1 - Análise Completa */}
						<Card className="bg-gray-900/50 border-gray-800">
							<CardHeader className="pb-3">
								<View className="flex-row items-center gap-3">
									<View className="p-2 bg-emerald-500/10 rounded-lg">
										<BarChart3
											size={20}
											color="#10B981"
										/>
									</View>
									<CardTitle className="text-white text-base">Análise Completa</CardTitle>
								</View>
							</CardHeader>
							<CardContent>
								<Text className="text-gray-400 text-sm leading-relaxed">
									Avaliamos seu perfil de risco, horizonte de investimento e preferências ESG para
									recomendações precisas
								</Text>
							</CardContent>
						</Card>

						{/* Feature 2 - Recomendações Personalizadas */}
						<Card className="bg-gray-900/50 border-gray-800">
							<CardHeader className="pb-3">
								<View className="flex-row items-center gap-3">
									<View className="p-2 bg-blue-500/10 rounded-lg">
										<Target
											size={20}
											color="#3B82F6"
										/>
									</View>
									<CardTitle className="text-white text-base">Recomendações Personalizadas</CardTitle>
								</View>
							</CardHeader>
							<CardContent>
								<Text className="text-gray-400 text-sm leading-relaxed">
									Receba sugestões específicas de ativos e estratégias alinhadas com seus objetivos e
									valores
								</Text>
							</CardContent>
						</Card>

						{/* Feature 3 - Cenários Macroeconômicos */}
						<Card className="bg-gray-900/50 border-gray-800">
							<CardHeader className="pb-3">
								<View className="flex-row items-center gap-3">
									<View className="p-2 bg-purple-500/10 rounded-lg">
										<Globe
											size={20}
											color="#8B5CF6"
										/>
									</View>
									<CardTitle className="text-white text-base">Cenários Macroeconômicos</CardTitle>
								</View>
							</CardHeader>
							<CardContent>
								<Text className="text-gray-400 text-sm leading-relaxed">
									Consideramos o ambiente econômico atual e suas preocupações sobre inflação e juros
								</Text>
							</CardContent>
						</Card>
					</View>
				</View>

				{/* Process Steps */}
				<View className="mb-8">
					<Text className="text-white font-semibold text-lg mb-4">Processo em 3 Passos</Text>

					<View className="gap-3">
						<View className="flex-row items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
							<View className="h-8 w-8 bg-blue-600 rounded-full items-center justify-center">
								<Text className="text-white font-bold text-sm">1</Text>
							</View>
							<View className="flex-1">
								<Text className="text-white font-medium">Responda o Questionário</Text>
								<Text className="text-gray-400 text-sm">
									8 perguntas sobre seus objetivos e tolerância ao risco
								</Text>
							</View>
						</View>

						<View className="flex-row items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
							<View className="h-8 w-8 bg-blue-600 rounded-full items-center justify-center">
								<Text className="text-white font-bold text-sm">2</Text>
							</View>
							<View className="flex-1">
								<Text className="text-white font-medium">Descubra Seu Perfil</Text>
								<Text className="text-gray-400 text-sm">
									Análise personalizada do seu perfil de investidor
								</Text>
							</View>
						</View>

						<View className="flex-row items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
							<View className="h-8 w-8 bg-blue-600 rounded-full items-center justify-center">
								<Text className="text-white font-bold text-sm">3</Text>
							</View>
							<View className="flex-1">
								<Text className="text-white font-medium">Receba Recomendações</Text>
								<Text className="text-gray-400 text-sm">
									Sugestões de investimentos alinhadas ao seu perfil
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Highlights */}
				<View className="mb-8">
					<Text className="text-white font-semibold text-lg mb-4">Por Que Escolher Nossa Análise?</Text>

					<View className="gap-3">
						<View className="flex-row items-center gap-3">
							<CheckCircle
								size={16}
								color="#10B981"
							/>
							<Text className="text-gray-300 text-sm flex-1">Questionário dinâmico e intuitivo</Text>
						</View>

						<View className="flex-row items-center gap-3">
							<CheckCircle
								size={16}
								color="#10B981"
							/>
							<Text className="text-gray-300 text-sm flex-1">
								Considera valores ESG e sustentabilidade
							</Text>
						</View>

						<View className="flex-row items-center gap-3">
							<CheckCircle
								size={16}
								color="#10B981"
							/>
							<Text className="text-gray-300 text-sm flex-1">Análise de cenário macroeconômico</Text>
						</View>

						<View className="flex-row items-center gap-3">
							<CheckCircle
								size={16}
								color="#10B981"
							/>
							<Text className="text-gray-300 text-sm flex-1">Recomendações específicas de ativos</Text>
						</View>
					</View>
				</View>

				{/* CTA Section */}
				<Card className="bg-gray-800/30 border-blue-500/20 mb-20">
					<CardHeader className="text-center">
						<CardTitle className="text-white text-lg">Pronto para Começar?</CardTitle>
						<CardDescription className="text-gray-300">
							Descubra seu perfil de investidor em apenas 2-3 minutos
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							size="lg"
							className="w-full bg-blue-600"
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
			</View>
		</ScrollView>
	)
}
