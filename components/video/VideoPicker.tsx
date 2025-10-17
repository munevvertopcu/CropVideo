import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';

interface VideoPickerProps {
    onVideoSelected: (uri: string, duration: number) => void;
}

export const VideoPicker: React.FC<VideoPickerProps> = ({ onVideoSelected }) => {
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

    const pickVideo = async () => {
        try {
            const hasPermission = await requestPermissions();
            if (!hasPermission) return;

            const res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['videos'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            });

            if (!res.canceled && res.assets?.[0]?.uri) {
                const asset = res.assets[0];
                const duration = Math.floor((asset.duration ?? 0) * 1000);
                onVideoSelected(asset.uri, duration);
            }
        } catch (error) {
            console.error('Video picker error:', error);
            Alert.alert(
                'Error',
                'Failed to pick video. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    return (
        <TouchableOpacity
            onPress={pickVideo}
            className="bg-blue-500 p-4 rounded-lg flex-row items-center justify-center gap-2"
        >
            <Ionicons name="videocam" size={24} color="white" />
            <Text className="text-white text-lg font-bold">
                Select Video
            </Text>
        </TouchableOpacity>
    );
};