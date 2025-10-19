import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useMemo, useState } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { MetadataForm } from '../../components/video/MetadataForm';
import { useVideoStore } from '../../store/useVideoStore';
import type { VideoEntry } from '../../types';

export default function VideoDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const entries = useVideoStore(s => s.entries);
  const updateVideo = useVideoStore(s => s.updateVideo);
  const removeVideo = useVideoStore(s => s.removeVideo);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const item: VideoEntry | undefined = useMemo(
    () => entries.find(e => e.id === id),
    [entries, id]
  );

  const player = useVideoPlayer(useMemo(() => ({
    uri: item?.croppedUri ?? ''
  } as { uri: string }), [item?.croppedUri]));

  const handleDelete = () => {
    if (!item) return;
    Alert.alert('Delete', 'Are you sure you want to delete this video?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await Promise.resolve(removeVideo(item.id));
          router.back();
        }
      }
    ]);
  };

  const handleEditSave = async (data: { name: string; description: string; }) => {
    if (!item) return;
    await Promise.resolve(updateVideo(item.id, data));
    setIsEditOpen(false);
  };

  if (!item) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-900">Video not found.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-3 px-4 py-2.5 bg-gray-200 rounded-lg"
        >
          <Text className="text-gray-900 font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: 'Details',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
          )
        }}
      />
      <View className="p-4">
        <VideoView
          style={{ width: '100%', height: 240, backgroundColor: '#000', borderRadius: 12 }}
          player={player}
          nativeControls
        />
        <Text className="mt-4 text-xl font-bold text-gray-900" numberOfLines={2}>
          {item.name}
        </Text>
        {!!item.description && (
          <Text className="mt-2 text-sm text-gray-600" numberOfLines={6}>
            {item.description}
          </Text>
        )}
        <View className="mt-10">
          <Button
            label="Edit Details"
            variant="secondary"
            onPress={() => setIsEditOpen(true)}
            className="mx-10"
          />
          <View className="h-3" />
          <Button
            label="Delete"
            variant="danger"
            onPress={handleDelete}
            className="mx-10"
          />
        </View>
      </View>
      <Modal visible={isEditOpen} animationType="slide" onRequestClose={() => setIsEditOpen(false)}>
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between p-3 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => setIsEditOpen(false)}
              className="p-2">
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-base font-semibold text-gray-900">Edit Details</Text>
            <View className="w-6" />
          </View>
          <MetadataForm
            title="Edit Details"
            initialData={{ name: item.name, description: item.description }}
            onSubmit={handleEditSave}
            onCancel={() => setIsEditOpen(false)}
          />
        </View>
      </Modal>
    </View>
  );
}
