import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export interface PickedVideoResult {
  uri: string;
  durationMs: number;
}

export function useVideoPicker() {
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your photo library to select videos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickVideo = async (): Promise<PickedVideoResult | null> => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return null;

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      } as any);

      if (!res.canceled && res.assets?.[0]?.uri) {
        const asset = res.assets[0];
        const durationMs = Math.floor((asset.duration ?? 0) * 1000);
        return { uri: asset.uri, durationMs };
      }
      return null;
    } catch (error) {
      console.error('Video picker error:', error);
      Alert.alert('Error', 'Failed to pick video. Please try again.', [{ text: 'OK' }]);
      return null;
    }
  };

  return { pickVideo };
}

