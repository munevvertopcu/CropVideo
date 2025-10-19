import React from 'react';
import { Text, View } from 'react-native';
import { formatSecondsFromMs } from '../../lib/formatters';

interface Props {
  startMs: number;
  endMs: number;
  totalMs: number;
}

export const SliderDurationLabels: React.FC<Props> = ({ startMs, endMs, totalMs }) => {
  return (
    <View className="flex-row justify-between items-center mt-3">
      <Text className="text-gray-600 text-sm font-medium">0s</Text>
      <View className="flex-row items-center">
        <Text className="text-blue-700 text-sm font-semibold">{formatSecondsFromMs(startMs)}s</Text>
        <Text className="text-gray-400 text-sm mx-1">to</Text>
        <Text className="text-blue-700 text-sm font-semibold">{formatSecondsFromMs(endMs)}s</Text>
      </View>
      <Text className="text-gray-600 text-sm font-medium">{formatSecondsFromMs(totalMs)}s</Text>
    </View>
  );
};
