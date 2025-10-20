import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImagePicker from "expo-image-picker"
import * as ImageManipulator from "expo-image-manipulator"

const AVATAR_KEY = "@user_avatar"

export class AvatarService {
	// Salvar imagem do avatar
	static async saveAvatar(uri: string): Promise<void> {
		try {
			await AsyncStorage.setItem(AVATAR_KEY, uri)
		} catch (error) {
			console.error("Error saving avatar:", error)
			throw new Error("Failed to save avatar")
		}
	}

	// Obter imagem do avatar
	static async getAvatar(): Promise<string | null> {
		try {
			return await AsyncStorage.getItem(AVATAR_KEY)
		} catch (error) {
			console.error("Error getting avatar:", error)
			return null
		}
	}

	// Remover imagem do avatar
	static async removeAvatar(): Promise<void> {
		try {
			await AsyncStorage.removeItem(AVATAR_KEY)
		} catch (error) {
			console.error("Error removing avatar:", error)
			throw new Error("Failed to remove avatar")
		}
	}

	// Selecionar imagem com opções nativas (galeria + câmera)
	static async selectImageWithOptions(): Promise<string | null> {
		try {
			// Solicitar permissões para galeria e câmera
			const [mediaLibraryStatus, cameraStatus] = await Promise.all([
				ImagePicker.requestMediaLibraryPermissionsAsync(),
				ImagePicker.requestCameraPermissionsAsync(),
			])

			if (mediaLibraryStatus.status !== "granted" || cameraStatus.status !== "granted") {
				throw new Error("Permissões de câmera e galeria são necessárias")
			}

			// Usar o seletor nativo que mostra galeria + câmera
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1], // Quadrado para avatar circular
				quality: 0.8,
				allowsMultipleSelection: false,
			})

			if (result.canceled) {
				return null
			}

			// Processar imagem (redimensionar se necessário)
			const manipulatedImage = await ImageManipulator.manipulateAsync(
				result.assets[0].uri,
				[{ resize: { width: 200, height: 200 } }], // Redimensionar para 200x200
				{ compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
			)

			return manipulatedImage.uri
		} catch (error) {
			console.error("Error selecting image:", error)
			throw error
		}
	}
}
