import React from 'react';
import { Text, View } from 'react-native';
import { formatSecondsFromMs } from '../../lib/formatters';

interface Props {
  startMs: number;
  endMs: number;
  clipMs: number;
}

export const SegmentInfoRow: React.FC<Props> = ({ startMs, endMs, clipMs }) => {
  return (
    <View className="flex-row justify-between items-center px-2 mb-4">
      <View className="flex-1 items-center px-2">
        <Text className="text-gray-500 text-sm mb-1 font-medium">Start</Text>
        <Text className="text-gray-900 text-lg font-bold">{formatSecondsFromMs(startMs)}s</Text>
      </View>
      <View className="flex-1 items-center px-2">
        <Text className="text-gray-500 text-sm mb-1 font-medium">Clip Length</Text>
        <Text className="text-green-600 text-lg font-bold">{formatSecondsFromMs(clipMs)}s</Text>
      </View>
      <View className="flex-1 items-center px-2">
        <Text className="text-gray-500 text-sm mb-1 font-medium">End</Text>
        <Text className="text-gray-900 text-lg font-bold">{formatSecondsFromMs(endMs)}s</Text>
      </View>
    </View>
  );
};
