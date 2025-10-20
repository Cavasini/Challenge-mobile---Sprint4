import "@/global.css"

import { NAV_THEME } from "@/lib/theme"
import { ThemeProvider } from "@react-navigation/native"
import { PortalHost } from "@rn-primitives/portal"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useColorScheme } from "nativewind"
import { KeyboardProvider } from "react-native-keyboard-controller"

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router"

export default function RootLayout() {
	const { colorScheme } = useColorScheme()

	return (
		<ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
			<KeyboardProvider>
				<StatusBar style="light" />
				<Stack screenOptions={{ headerShown: false }} />
				<PortalHost />
			</KeyboardProvider>
		</ThemeProvider>
	)
}
