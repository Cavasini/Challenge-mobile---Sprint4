import React from "react"
import { Tabs } from "expo-router"
import { User, House, TrendingUp } from "lucide-react-native"

/*prettier-ignore*/
export default function TabsLayout() {
	return (
		<Tabs
			      screenOptions={{
			        headerShown: false,
					headerStyle: { backgroundColor: "#111827" },
					headerTitleStyle: { 
						color: "#FFFFFF",
						fontWeight: "bold"
					},
					headerTitleAlign: "center",
			        tabBarActiveTintColor: "#FFFFFF",
			        tabBarStyle: {
			          backgroundColor: "#111827",
			          borderTopColor: "#6224C5",
			        },
			      }}		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					tabBarIcon: ({color}) => <House size={24} color={color} />,
				}}
			/>
			<Tabs.Screen 
                name="recommendations" 
                options={{
					title: "Recomendações",
					tabBarIcon: ({color}) => <TrendingUp size={24} color={color} />,
				}}    
            />
			<Tabs.Screen 
                name="profile"
                options={{
					title: "Perfil",
					tabBarIcon: ({color}) => <User size={24} color={color} />,
				}} 
            />
		</Tabs>
	)
}
