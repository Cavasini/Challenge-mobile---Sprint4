# 📈 Invest Profile - Perfil de Investidor Mobile

> **Aplicativo React Native completo para análise de perfil de investidor e recomendações personalizadas**

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-61DAFB?style=flat&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.9-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NativeWind](https://img.shields.io/badge/NativeWind-4.1.23-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://www.nativewind.dev/)

## 🎯 Sobre o Projeto

O **Invest Profile** é um aplicativo mobile completo desenvolvido em React Native que permite aos usuários descobrirem seu perfil de investidor através de um questionário inteligente e receberem recomendações personalizadas de investimentos baseadas em análise de IA, tolerância ao risco e objetivos financeiros.

### ✨ Principais Funcionalidades

#### 🔐 **Sistema de Autenticação Completo**

- **Login/Registro** com validação em tempo real e tratamento de erros
- **Persistência de sessão** automática com AsyncStorage
- **Logout seguro** com limpeza completa de dados locais
- **Gerenciamento de tokens JWT** automático para todas as requisições

#### 📋 **Questionário Inteligente**

- **8 perguntas estratégicas** sobre perfil de investidor
- **Validação completa** de respostas obrigatórias
- **Campo de valor mensal** para investimento com formatação
- **Interface responsiva** com ScrollView otimizada
- **Navegação fluida** entre perguntas com feedback visual

#### 📊 **Análise de Perfil com IA**

- **Classificação automática**: Conservador, Moderado, Sofisticado
- **Score de risco** com progress bar gradiente personalizada
- **Badges especiais**: Alta Liquidez, ESG, Preocupações Macroeconômicas
- **Observações detalhadas** sobre tolerância ao risco
- **Interface visual** com ícones e cores específicas por perfil

#### 💼 **Recomendações Personalizadas**

- **Renda Fixa**: CDBs, LCIs, Tesouro Direto com taxas atualizadas
- **Renda Variável**: Ações com logos SVG e preços em tempo real
- **Informações completas**: Rentabilidade, prazo, risco, liquidez
- **Logos das empresas** carregadas dinamicamente via API
- **Formatação brasileira** de moeda e percentuais

#### 🔧 **CRUD Completo via API REST**

- **Create**: Registro de usuários, questionários e análises
- **Read**: Consulta de perfis, recomendações e dados salvos
- **Update**: Atualização de avatar, reprocessamento de análises
- **Delete**: Logout, limpeza de dados e remoção de perfis

#### 🛡️ **Validação e Tratamento de Erros**

- **Validação de entrada** em formulários e campos obrigatórios
- **Tratamento de erros HTTP** com mensagens específicas por status
- **Retry automático** em falhas de rede com backoff exponencial
- **Feedback visual** com loading states e error boundaries

## 🏗️ Arquitetura do Projeto

```
invest-profile/
├── 📱 app/                    # Telas e navegação (Expo Router)
│   ├── (auth)/               # Fluxo de autenticação
│   │   ├── login.tsx         # Tela de login
│   │   └── register.tsx      # Tela de registro
│   ├── (tabs)/               # Navegação por abas
│   │   ├── home.tsx          # Tela inicial
│   │   ├── profile.tsx       # Perfil do usuário
│   │   └── recommendations.tsx # Recomendações
│   ├── _layout.tsx           # Layout principal
│   ├── index.tsx             # Tela de boas-vindas
│   └── questionnaire.tsx     # Questionário de perfil
├── 🔧 api/                   # Integrações externas
│   └── investment-api.ts     # API de investimentos
├── 📚 lib/                   # Serviços e utilitários
│   ├── auth-service.ts       # Serviços de autenticação
│   ├── profile-service.ts    # Gerenciamento de perfil
│   ├── avatar-service.ts     # Gerenciamento de avatar
│   ├── theme.ts              # Configurações de tema
│   └── utils.ts              # Utilitários gerais
├── 🎨 components/            # Componentes reutilizáveis
│   └── ui/                   # Componentes de interface
└── 📱 assets/                # Recursos estáticos
```

## 🔄 Integração com APIs

### 🌐 Endpoints Utilizados

O aplicativo se integra com duas APIs principais hospedadas na AWS:

#### 1. **API de Autenticação**

- **Base URL**: `http://52.207.230.152:8082`
- **Endpoints**:
    - `POST /auth/login` - Autenticação de usuários
    - `POST /auth/register` - Registro de novos usuários
- **Função**: Gerencia autenticação e criação de contas

#### 2. **API de Análise de Perfil**

- **Base URL**: `http://52.207.230.152:8080/api/v1`
- **Endpoint**: `POST /profile/analyze`
- **Função**: Analisa respostas do questionário e retorna classificação do perfil

```typescript
interface AnalyzeProfileRequest {
	userId: string
	answers: Record<string, string> // {q1: "a", q2: "b", ...}
	monthlyInvestmentValue: number
}

interface AnalyzeProfileResponse {
	userId: string
	totalScore: number
	profileClassification: "Conservador" | "Moderado" | "Sofisticado"
	identifiedInterests: {
		liquidityNeeded: boolean
		esgInterest: string
		macroeconomicConcerns: string[]
		riskToleranceNotes: string
	}
}
```

#### 3. **API de Recomendações**

- **Base URL**: `http://3.88.201.1:8081/api/v1`
- **Endpoint**: `POST /recommender`
- **Função**: Retorna investimentos recomendados baseados no perfil

```typescript
interface RecommendationResponse {
	FixedIncomesList: FixedIncomeItem[] // Renda Fixa
	VariableIncomesList: VariableIncomeItem[] // Ações
}
```

### 🔄 Fluxo de Dados

1. **Questionário** → Coleta respostas e valor mensal
2. **Análise** → Envia dados para API de perfil
3. **Classificação** → Recebe perfil e características
4. **Recomendações** → Solicita investimentos baseados no perfil
5. **Persistência** → Salva dados localmente (AsyncStorage)

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm/yarn/pnpm
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (para Android) ou Xcode (para iOS)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/your-username/invest-profile-app.git
cd invest-profile-app

# 2. Instale as dependências
npm install
# ou
yarn install

# 3. Inicie o servidor de desenvolvimento
npm run dev
# ou
yarn dev
```

### 📱 Executando no Dispositivo

```bash
# Desenvolvimento com cache limpo
npm run dev

# Android
npm run android

# iOS (Mac apenas)
npm run ios

# Web
npm run web

# Limpeza completa (remove .expo e node_modules)
npm run clean
```

Ou escaneie o QR Code com o Expo Go no seu dispositivo

## 🛠️ Stack Tecnológica

### Core

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **Expo Router** - Navegação baseada em arquivos

### UI/UX

- **NativeWind** - Tailwind CSS para React Native
- **React Native Reusables** - Componentes UI
- **Lucide React Native** - Ícones
- **Class Variance Authority** - Variantes de componentes

### Estado e Persistência

- **AsyncStorage** - Armazenamento local
- **Context API** - Gerenciamento de estado
- **Custom Services** - Camada de serviços

### Desenvolvimento

- **ESLint + Prettier** - Linting e formatação
- **Metro** - Bundler React Native

## 📋 Funcionalidades Detalhadas

### 🔐 Autenticação

- **Login/Registro**: Interface intuitiva com validação
- **Persistência**: Sessão mantida entre execuções
- **Segurança**: Tokens salvos localmente de forma segura

### 📝 Questionário de Perfil

- **8 Perguntas Estratégicas**:
    1. Objetivo principal de investimento
    2. Necessidade de liquidez
    3. Reação a perdas no mercado
    4. Interesse em ESG
    5. Conhecimento sobre investimentos
    6. Horizonte de investimento
    7. Situação financeira
    8. Valor mensal para investir

### 📊 Análise de Perfil

- **Classificação Automática**:
    - 🛡️ **Conservador**: Foco em segurança e preservação
    - ⚖️ **Moderado**: Equilíbrio entre risco e retorno
    - 🎯 **Sofisticado**: Alta tolerância ao risco

### 💰 Recomendações

- **Renda Fixa**: CDBs, LCIs, Tesouro com taxas atualizadas
- **Renda Variável**: Ações com preços em tempo real
- **Detalhes Completos**: Vencimento, liquidez, risco, etc.

### 🔧 CRUD via API REST

- **Create**: Registro, login, questionários, análises
- **Read**: Consulta de perfis, recomendações, dados salvos
- **Update**: Avatar, reprocessamento de análises
- **Delete**: Logout, limpeza de dados, remoção de perfis

### 🛡️ Tratamento de Erros

- **Validação**: Campos obrigatórios, formato de email, respostas
- **Erros HTTP**: Mensagens específicas por status (401, 400, 500)
- **Retry**: Tentativas automáticas com backoff exponencial
- **Feedback**: Loading states, error boundaries, alerts

## 🔧 Serviços e Arquitetura

### **AuthService** (`lib/auth-service.ts`)

Gerenciamento completo de autenticação com JWT e persistência local.

```typescript
class AuthService {
	// Autenticação
	static async login(email: string, password: string): Promise<UserSession>
	static async register(email: string, password: string, username: string): Promise<RegisterResponse>
	static async logout(): Promise<void>

	// Sessão e tokens
	static async getSession(): Promise<UserSession | null>
	static async isAuthenticated(): Promise<boolean>
	static async getToken(): Promise<string | null>
	static async getAuthHeaders(): Promise<Record<string, string>>

	// Persistência
	static async saveSession(token: string, userId: string, email: string, username: string): Promise<void>
	static async clearSession(): Promise<void>
}
```

### **ProfileService** (`lib/profile-service.ts`)

Gerenciamento do questionário, análise de perfil e recomendações.

```typescript
class ProfileService {
	// Questionário
	static async saveQuestionnaireData(data: Omit<QuestionnaireData, "userId" | "completedAt">): Promise<void>
	static async getQuestionnaireData(): Promise<QuestionnaireData | null>
	static async isQuestionnaireCompleted(): Promise<boolean>

	// Análise de perfil
	static async analyzeUserProfile(): Promise<ProfileAnalysis>
	static async getProfileAnalysis(): Promise<ProfileAnalysis | null>

	// Recomendações
	static async loadRecommendations(): Promise<RecommendationData>
	static async getRecommendations(): Promise<RecommendationData | null>
	static async hasRecommendations(): Promise<boolean>

	// Utilitários
	static async getProfileStatus(): Promise<{
		hasQuestionnaire: boolean
		hasAnalysis: boolean
		hasRecommendations: boolean
	}>
	static async clearAllData(): Promise<void>
}
```

### **AvatarService** (`lib/avatar-service.ts`)

Gerenciamento de avatar do usuário com seleção e processamento de imagens.

```typescript
class AvatarService {
	// Avatar management
	static async saveAvatar(uri: string): Promise<void>
	static async getAvatar(): Promise<string | null>
	static async removeAvatar(): Promise<void>

	// Image selection and processing
	static async selectImageWithOptions(): Promise<string | null>
	// - Solicita permissões de câmera e galeria
	// - Permite seleção com crop 1:1 para avatar circular
	// - Redimensiona automaticamente para 200x200px
	// - Comprime com qualidade 0.8 em JPEG
}
```

### **Investment API** (`api/investment-api.ts`)

Cliente HTTP para integração com as APIs de backend.

```typescript
// Funções de autenticação
export async function register(email: string, password: string, username: string): Promise<RegisterResponse>
export async function loginUser(email: string, password: string): Promise<AuthResponse>

// Funções de análise
export async function analyzeProfile(data: AnalyzeProfileRequest): Promise<AnalyzeProfileResponse>
export async function getRecommendations(profileData: AnalyzeProfileResponse): Promise<RecommendationResponse>

// Tratamento de erros customizado
export class ApiError extends Error {
	constructor(public status: number, public statusText: string, message?: string)
}
```

## 👨‍💻 Autores

-
-
-
- ***
