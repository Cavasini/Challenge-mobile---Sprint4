import * as React from "react"
import { View, TouchableOpacity, Modal, Pressable } from "react-native"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
	children: React.ReactNode
	trigger: React.ReactNode
}

interface DropdownMenuItemProps {
	onPress: () => void
	children: React.ReactNode
	destructive?: boolean
	onItemPress?: () => void
}

export const DropdownMenu = ({ children, trigger }: DropdownMenuProps) => {
	const [isOpen, setIsOpen] = React.useState(false)

	return (
		<View>
			<TouchableOpacity
				onPress={() => setIsOpen(true)}
				activeOpacity={0.7}
			>
				{trigger}
			</TouchableOpacity>

			<Modal
				visible={isOpen}
				transparent
				animationType="fade"
				onRequestClose={() => setIsOpen(false)}
			>
				<Pressable
					className="flex-1 bg-black/50"
					onPress={() => setIsOpen(false)}
				>
					<View className="flex-1 justify-start items-end pt-16 pr-4">
						<View className="bg-gray-800 rounded-lg border border-gray-700 min-w-48 py-2">
							{React.Children.map(children, (child) =>
								React.cloneElement(child as React.ReactElement<DropdownMenuItemProps>, {
									onItemPress: () => setIsOpen(false),
								})
							)}
						</View>
					</View>
				</Pressable>
			</Modal>
		</View>
	)
}

export const DropdownMenuItem = ({ onPress, children, destructive = false, onItemPress }: DropdownMenuItemProps) => {
	const handlePress = () => {
		onPress()
		onItemPress?.()
	}

	return (
		<TouchableOpacity
			onPress={handlePress}
			className="px-4 py-3 active:bg-gray-700"
			activeOpacity={0.7}
		>
			<Text className={cn("text-sm", destructive ? "text-red-400" : "text-white")}>{children}</Text>
		</TouchableOpacity>
	)
}
