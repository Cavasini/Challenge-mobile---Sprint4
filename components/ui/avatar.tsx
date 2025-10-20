import * as React from "react"
import { View, Image, TouchableOpacity } from "react-native"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"

interface AvatarProps {
	size?: "sm" | "md" | "lg"
	src?: string
	alt?: string
	fallback?: string
	onPress?: () => void
	className?: string
}

const sizeClasses = {
	sm: "h-8 w-8",
	md: "h-16 w-16",
	lg: "h-24 w-24",
}

const textSizeClasses = {
	sm: "text-xs",
	md: "text-lg",
	lg: "text-2xl",
}

export const Avatar = ({ size = "md", src, alt, fallback, onPress, className }: AvatarProps) => {
	const [imageError, setImageError] = React.useState(false)

	const handleImageError = () => {
		setImageError(true)
	}

	const content = (
		<View
			className={cn(
				"rounded-full bg-gray-600 items-center justify-center overflow-hidden",
				sizeClasses[size],
				className
			)}
		>
			{src && !imageError ? (
				<Image
					source={{ uri: src }}
					style={{ width: "100%", height: "100%" }}
					onError={handleImageError}
					accessibilityLabel={alt}
				/>
			) : (
				<Text className={cn("text-white font-semibold", textSizeClasses[size])}>{fallback || "?"}</Text>
			)}
		</View>
	)

	if (onPress) {
		return (
			<TouchableOpacity
				onPress={onPress}
				activeOpacity={0.7}
			>
				{content}
			</TouchableOpacity>
		)
	}

	return content
}
