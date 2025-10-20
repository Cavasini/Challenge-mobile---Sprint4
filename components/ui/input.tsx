import * as React from "react"
import { TextInput, type TextInputProps, View, Text, TouchableOpacity } from "react-native"
import { Eye, EyeOff } from "lucide-react-native"
import { cn } from "@/lib/utils"

interface InputProps extends TextInputProps {
	className?: string
	error?: string
	label?: string
	showPasswordToggle?: boolean
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
	({ className, error, label, showPasswordToggle, secureTextEntry, ...props }, ref) => {
		const hasError = !!error
		const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)

		const shouldShowToggle = showPasswordToggle && secureTextEntry
		const actualSecureTextEntry = shouldShowToggle ? !isPasswordVisible : secureTextEntry

		return (
			<View className="w-full">
				{label && <Text className="text-white mb-2 font-medium">{label}</Text>}
				<View className="relative">
					<TextInput
						ref={ref}
						className={cn(
							"web:flex h-12 native:h-12 web:w-full rounded-md border px-3 web:py-2 native:py-3 native:text-base lg:text-sm text-white web:file:border-0 web:file:bg-transparent web:file:text-sm web:file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 web:focus-visible:ring-offset-background",
							hasError ? "border-red-500 bg-red-500/10" : "border-input bg-background",
							shouldShowToggle && "pr-12", // Espaço para o ícone
							className
						)}
						placeholderTextColor={hasError ? "#FCA5A5" : "hsl(240 5% 64.9%)"}
						secureTextEntry={actualSecureTextEntry}
						{...props}
					/>
					{shouldShowToggle && (
						<TouchableOpacity
							onPress={() => setIsPasswordVisible(!isPasswordVisible)}
							className="absolute right-3 top-0 h-12 justify-center"
							activeOpacity={0.7}
						>
							{isPasswordVisible ? (
								<EyeOff
									size={20}
									color="#9CA3AF"
								/>
							) : (
								<Eye
									size={20}
									color="#9CA3AF"
								/>
							)}
						</TouchableOpacity>
					)}
				</View>
				{hasError && <Text className="text-red-400 text-sm mt-1 ml-1">{error}</Text>}
			</View>
		)
	}
)

Input.displayName = "Input"

export { Input }
