import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Button } from "../components/ui/Button";
import { VideoListItem } from '../components/ui/VideoListItem';
import { VideoListModal } from "../components/ui/VideoListModal";
import { useVideoStore } from '../store/useVideoStore';
import { VideoEntry } from '../types';

export default function HomeScreen() {
  const router = useRouter();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const items = useVideoStore(s => s.entries);

  const handleAddVideo = () => {
    setIsAddModalVisible(true);
  };

  const handleOpenDetails = useCallback((item: VideoEntry) => {
    router.push({ pathname: '/video/[id]', params: { id: item.id } });
  }, [router]);

  const empty = useMemo(() => items.length === 0, [items]);
  const keyExtractor = useCallback((item: VideoEntry) => item.id, []);

  return (
    <View className="flex-1 bg-D9D9D9">
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
        <Text className="text-2xl font-bold text-gray-900">My Videos</Text>
      </View>
      {empty ? (
        <View className="flex-1 justify-center items-center px-8">
          <Ionicons name="videocam-outline" size={80} color="#9CA3AF" />
          <Text className="text-2xl font-bold text-gray-400 mt-4 mb-2">No Videos Yet</Text>
          <Text className="text-gray-400 text-center mb-8 leading-6">
            Start building your video diary by adding your first memorable moment
          </Text>
          <Button
            label="Add Your First Video"
            onPress={handleAddVideo}
            variant="primary"
            className="px-8 py-4 rounded-full"
          />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={7}
          removeClippedSubviews
          renderItem={({ item }) => (
            <VideoListItem item={item} onPress={handleOpenDetails} />
          )}
        />
      )}
      <VideoListModal
        visible={isAddModalVisible}
        onClose={async () => { setIsAddModalVisible(false); }}
      />
      <TouchableOpacity
        onPress={handleAddVideo}
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center"
        accessibilityLabel="Add Video"
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

