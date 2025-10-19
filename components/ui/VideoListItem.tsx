import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { VideoEntry } from '../../types';

interface Props {
  item: VideoEntry;
  onPress: (item: VideoEntry) => void;
}

const ListItemComponent: React.FC<Props> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      activeOpacity={0.8}
      className="flex-row items-center bg-white border border-gray-300 rounded-xl p-5 mb-3">
      {item.thumbnailUri ? (
        <Image
          source={{ uri: item.thumbnailUri }}
          style={{ width: 65, height: 65, borderRadius: 8, marginRight: 12 }}
          contentFit="cover"
        />
      ) : (
        <View className="w-16 h-16 rounded-lg bg-gray-200 items-center justify-center mr-3">
          <Ionicons name="image-outline" size={24} color="#6B7280" />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-gray-900 font-semibold" numberOfLines={1}>{item.name}</Text>
        <Text className="text-gray-500 text-sm" numberOfLines={2}>{item.description}</Text>
        <Text className="text-gray-400 text-xs mt-1">{Math.round(item.duration / 1000)}s - {new Date(item.createdAt).toLocaleString()}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

export const VideoListItem = memo(ListItemComponent);
