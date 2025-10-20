import { Text, View } from "react-native"
import React, { useState } from "react"
import { SvgUri } from "react-native-svg"

interface StockLogoProps {
	logoUrl?: string
	ticker: string
}

export const StockLogo = ({ logoUrl, ticker }: StockLogoProps) => {
	const [svgError, setSvgError] = useState(false)

	const handleSvgError = () => {
		setSvgError(true)
	}

	// Se não há URL ou erro no SVG, mostra fallback
	if (!logoUrl || svgError) {
		return (
			<View className="h-10 w-10 bg-gray-700 rounded-full items-center justify-center">
				<Text className="text-white font-bold text-sm">{ticker.substring(0, 2)}</Text>
			</View>
		)
	}

	return (
		<View className="h-10 w-10 bg-gray-700 rounded-full items-center justify-center overflow-hidden">
			<SvgUri
				uri={logoUrl}
				className="h-10 w-10 object-contain"
				onError={handleSvgError}
			/>
		</View>
	)
}