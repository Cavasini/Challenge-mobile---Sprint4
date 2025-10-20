import React, { useState } from "react"
import { View, ActivityIndicator, Alert, ScrollView } from "react-native"
import { Stack, router } from "expo-router"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight } from "lucide-react-native"
import { ProfileService } from "@/lib/profile-service"

const questions = [
	{
		id: 1,
		title: "Prioridade Principal nos Investimentos",
		question:
			"Em relação aos seus investimentos, qual das frases abaixo melhor descreve a sua prioridade principal?",
		options: [
			{ value: "a", label: "Preservar meu capital, mesmo que isso signifique retornos menores.", points: 1 },
			{
				value: "b",
				label: "Equilibrar segurança e potencial de crescimento, aceitando riscos moderados.",
				points: 3,
			},
			{
				value: "c",
				label: "Maximizar meus retornos, estando disposto(a) a assumir riscos significativos e grandes oscilações.",
				points: 5,
			},
			{
				value: "d",
				label: "Meus investimentos devem gerar um impacto social ou ambiental positivo, além de retornos financeiros.",
				points: 2,
				flag: "ESG",
			},
			{
				value: "e",
				label: "Proteger meu capital contra cenários econômicos adversos (como inflação) e buscar oportunidades nesse ambiente.",
				points: 3,
				flag: "MACRO",
			},
		],
	},
	{
		id: 2,
		title: "Necessidade de Liquidez",
		question:
			"Você tem alguma necessidade de resgate do seu dinheiro em um futuro próximo (próximos 12-24 meses) para algum projeto ou despesa planejada?",
		options: [
			{
				value: "a",
				label: "Sim, tenho uma necessidade clara e preciso que parte do meu dinheiro esteja facilmente acessível.",
				points: 1,
			},
			{ value: "b", label: "Talvez, é uma possibilidade, mas não é uma certeza.", points: 2 },
			{
				value: "c",
				label: "Não, meus investimentos são para objetivos de longo prazo sem necessidade de resgate no curto/médio prazo.",
				points: 3,
			},
		],
	},
	{
		id: 3,
		title: "Reação à Volatilidade",
		question:
			"Imagine que seus investimentos tiveram uma queda de 15% em um mês devido a uma crise no mercado. Qual seria sua reação?",
		options: [
			{ value: "a", label: "Entraria em pânico e tentaria resgatar tudo para evitar mais perdas.", points: 1 },
			{
				value: "b",
				label: "Ficaria preocupado(a), mas tentaria entender a situação e aguardar uma recuperação.",
				points: 2,
			},
			{
				value: "c",
				label: "Veria como uma oportunidade para investir mais, pois os ativos estariam 'baratos'.",
				points: 4,
			},
			{
				value: "d",
				label: "Minha reação dependeria se os ativos eram alinhados aos meus valores sociais/ambientais.",
				points: 2,
				flag: "ESG",
			},
		],
	},
	{
		id: 4,
		title: "Interesse em ESG",
		question:
			"Em relação ao impacto social e ambiental, qual o seu grau de interesse em que seus investimentos apoiem empresas com práticas sustentáveis e éticas (ESG)?",
		options: [
			{ value: "a", label: "Sem interesse, foco apenas no retorno financeiro.", points: 0 },
			{ value: "b", label: "Pouco interesse, mas se houver opção equivalente, consideraria.", points: 1 },
			{
				value: "c",
				label: "Moderado interesse, estou disposto(a) a pesquisar e incluir alguns ativos ESG.",
				points: 2,
				flag: "ESG",
			},
			{
				value: "d",
				label: "Forte interesse, busco ativamente investimentos que gerem impacto positivo, mesmo que isso signifique abrir mão de um retorno marginalmente maior.",
				points: 3,
				flag: "ESG",
			},
		],
	},
	{
		id: 5,
		title: "Preocupações Econômicas",
		question: "Qual das seguintes preocupações econômicas mais se alinha com sua visão atual do mercado?",
		options: [
			{
				value: "a",
				label: "Alta inflação e a perda do poder de compra do dinheiro.",
				points: 2,
				flag: "MACRO_INFLACAO",
			},
			{
				value: "b",
				label: "Taxas de juros muito baixas ou muito altas e seu impacto nos rendimentos.",
				points: 2,
				flag: "MACRO_JUROS",
			},
			{ value: "c", label: "Volatilidade do mercado de ações e incertezas políticas/globais.", points: 1 },
			{ value: "d", label: "Nenhuma preocupação específica, confio no longo prazo.", points: 3 },
		],
	},
	{
		id: 6,
		title: "Tolerância à Alocação em Ativos Voláteis",
		question:
			"Considerando o cenário econômico atual, você se sentiria confortável em alocar uma parte maior (ex: acima de 50%) do seu capital em ativos mais voláteis como ações, fundos multimercados ou fundos imobiliários?",
		options: [
			{
				value: "a",
				label: "Não, prefiro manter a maior parte em investimentos mais seguros e de menor volatilidade.",
				points: 1,
			},
			{
				value: "b",
				label: "Sim, se houver um bom potencial de crescimento e a diversificação for bem explicada.",
				points: 3,
			},
			{
				value: "c",
				label: "Sim, estou sempre em busca das melhores oportunidades de crescimento, mesmo que sejam mais arriscadas.",
				points: 5,
			},
		],
	},
	{
		id: 7,
		title: "Horizonte de Investimento",
		question: "Seus objetivos de investimento são principalmente para:",
		options: [
			{
				value: "a",
				label: "Curto prazo (até 2 anos) - ex: reserva de emergência, viagem.",
				points: 1,
				horizon: "CURTO",
			},
			{
				value: "b",
				label: "Médio prazo (2 a 5 anos) - ex: entrada de imóvel, educação dos filhos.",
				points: 2,
				horizon: "MEDIO",
			},
			{
				value: "c",
				label: "Longo prazo (acima de 5 anos) - ex: aposentadoria, construção de patrimônio.",
				points: 3,
				horizon: "LONGO",
			},
		],
	},
]

export default function Questionnaire() {
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [answers, setAnswers] = useState<Record<number, string>>({})
	const [selectedOption, setSelectedOption] = useState<string>("")
	const [monthlyValue, setMonthlyValue] = useState<string>("")
	const [isLoading, setIsLoading] = useState(false)

	const totalSteps = questions.length + 1 // +1 para a pergunta do valor mensal
	const progress = ((currentQuestion + 1) / totalSteps) * 100

	const handleAnswer = (value: string) => {
		setSelectedOption(value)
		setAnswers((prev) => ({ ...prev, [questions[currentQuestion].id]: value }))
	}

	const handleNext = async () => {
		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion((prev) => prev + 1)
			setSelectedOption(answers[questions[currentQuestion + 1]?.id] || "")
		} else if (currentQuestion === questions.length - 1) {
			// Última pergunta do questionário, vai para a tela do valor mensal
			setCurrentQuestion(questions.length)
			setSelectedOption("")
		} else {
			// Está na tela do valor mensal, finaliza o questionário
			await handleSubmit()
		}
	}

	const handleSubmit = async () => {
		setIsLoading(true)

		try {
			// Mapear respostas exatamente como no Next.js
			const mappedAnswers: Record<string, string> = {}
			Object.entries(answers).forEach(([questionId, answerValue]) => {
				mappedAnswers[`q${questionId}`] = answerValue
			})

			// Salvar no ProfileService (userId é pego automaticamente do AuthService)
			await ProfileService.saveQuestionnaireData({
				answers: mappedAnswers,
				monthlyInvestmentValue: parseFloat(monthlyValue) || 0,
			})

			// Analisar perfil direto da API (igual ao Next.js)
			await ProfileService.analyzeUserProfile()

			// Carregar recomendações
			await ProfileService.loadRecommendations()

			// Redirecionar para a tela de perfil
			router.push("/(tabs)/profile")
		} catch (error) {
			console.error("Error submitting questionnaire:", error)

			let errorMessage = "Erro ao processar questionário. Tente novamente."

			if (error instanceof Error) {
				if (error.message.includes("não autenticado")) {
					errorMessage = "Sessão expirada. Faça login novamente."
				} else if (error.message.includes("Failed to save")) {
					errorMessage = "Erro ao salvar dados. Verifique sua conexão."
				} else {
					errorMessage = error.message
				}
			}

			Alert.alert("Erro", errorMessage, [{ text: "OK" }])
		} finally {
			setIsLoading(false)
		}
	}

	const handlePrevious = () => {
		if (currentQuestion > 0) {
			if (currentQuestion === questions.length) {
				// Voltando da tela do valor mensal para a última pergunta
				setCurrentQuestion((prev) => prev - 1)
				setSelectedOption(answers[questions[currentQuestion - 1]?.id] || "")
			} else {
				setCurrentQuestion((prev) => prev - 1)
				setSelectedOption(answers[questions[currentQuestion - 1]?.id] || "")
			}
		}
	}

	const currentQ = currentQuestion < questions.length ? questions[currentQuestion] : null
	const isMonthlyValueStep = currentQuestion === questions.length
	const canProceed = isMonthlyValueStep ? monthlyValue !== "" && parseFloat(monthlyValue) > 0 : selectedOption !== ""

	if (isLoading) {
		return (
			<>
				<View className="flex-1 items-center justify-center bg-background">
					<Text className="text-white text-xl mb-4">Analisando seu perfil...</Text>
					<ActivityIndicator
						size="large"
						color="bg-primary"
					/>
				</View>
			</>
		)
	}

	return (
		<>
			<ScrollView
				className="flex-1 bg-background px-4 py-12"
				contentContainerStyle={{ justifyContent: "center" }}
			>
				<View className="items-start mb-6">
					<Button
						variant="link"
						onPress={() => router.back()}
					>
						<ArrowLeft
							size={16}
							color="#FFFFFF"
						/>
						<Text className="text-white ml-2">Voltar</Text>
					</Button>
				</View>
				{/* Progress */}
				<View className="mb-6">
					<View className="flex-row justify-between items-center mb-3">
						<Text className="text-sm font-medium text-gray-300">
							Pergunta {currentQuestion + 1} de {totalSteps}
						</Text>
						<Text className="text-sm font-medium text-gray-400">{Math.round(progress)}% concluído</Text>
					</View>
					<Progress
						value={progress}
						className="h-2"
					/>
				</View>

				{/* Question Card */}
				{currentQ && (
					<Card className="mb-6 bg-gray-900/80 border-gray-700">
						<CardHeader>
							<CardTitle className="text-xl text-white">{currentQ.title}</CardTitle>
							<CardDescription className="text-gray-300 leading-relaxed">
								{currentQ.question}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<View className="gap-3">
								{currentQ.options.map((option) => (
									<Button
										key={option.value}
										variant={selectedOption === option.value ? "default" : "default"}
										onPress={() => handleAnswer(option.value)}
										className={`p-4 h-auto justify-start ${
											selectedOption === option.value
												? "bg-blue-600 border-blue-600"
												: "bg-gray-800/50 border-gray-600"
										}`}
									>
										<View className="flex-row items-start">
											<Text
												className={`font-medium mr-3 ${
													selectedOption === option.value ? "text-white" : "text-blue-400"
												}`}
											>
												{option.value})
											</Text>
											<Text
												className={`flex-1 text-left leading-relaxed ${
													selectedOption === option.value ? "text-white" : "text-gray-300"
												}`}
											>
												{option.label}
											</Text>
										</View>
									</Button>
								))}
							</View>
						</CardContent>
					</Card>
				)}

				{/* Monthly Investment Value */}
				{isMonthlyValueStep && (
					<Card className="mb-6 bg-gray-900/80 border-gray-700">
						<CardHeader>
							<CardTitle className="text-xl text-white">Valor Mensal de Investimento</CardTitle>
							<CardDescription className="text-gray-300 leading-relaxed">
								Quanto você pretende investir mensalmente? (em R$)
							</CardDescription>
						</CardHeader>
						<CardContent>
							<View className="gap-4">
								<View>
									<Text className="text-sm font-medium text-gray-300 mb-2">Valor mensal (R$)</Text>
									<Input
										placeholder="Ex: 1000.00"
										value={monthlyValue}
										onChangeText={setMonthlyValue}
										keyboardType="numeric"
										className="bg-gray-800/50 border-gray-600 text-white"
									/>
								</View>
							</View>
						</CardContent>
					</Card>
				)}

				{/* Navigation */}
				<View className="flex-row justify-between mb-24">
					<Button
						variant="outline"
						onPress={handlePrevious}
						disabled={currentQuestion === 0}
						className="flex-row items-center border-gray-600 bg-gray-800/50"
					>
						<ArrowLeft
							size={16}
							color="#9CA3AF"
						/>
						<Text className="text-gray-300 ml-2">Anterior</Text>
					</Button>

					<Button
						onPress={handleNext}
						disabled={!canProceed}
						className="flex-row items-center bg-blue-600"
					>
						<Text className="text-white mr-2">
							{isMonthlyValueStep ? "Obter Recomendações" : "Próxima"}
						</Text>
						<ArrowRight
							size={16}
							color="#FFFFFF"
						/>
					</Button>
				</View>
			</ScrollView>
		</>
	)
}
