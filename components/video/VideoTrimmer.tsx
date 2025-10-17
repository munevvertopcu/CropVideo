import { VideoTrimmingState } from '@/types';
import Slider from "@react-native-community/slider";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';

interface VideoTrimmerProps {
  videoUri: string;
  duration: number;
  onTrimStateChange: (state: VideoTrimmingState) => void;
  onNext: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const VideoTrimmer: React.FC<VideoTrimmerProps> = ({
  videoUri,
  duration,
  onTrimStateChange,
  onNext
}) => {
  const [actualDurationMs, setActualDurationMs] = useState<number>(0);
  const [startMs, setStartMs] = useState<number>(0);
  const player = useVideoPlayer(({ uri: videoUri ?? "" } as unknown) as { uri: string });

  const effectiveDurationMs = actualDurationMs > 0 ? actualDurationMs : duration;
  const endMs = useMemo(() => {
    const safeDuration = Math.max(0, effectiveDurationMs - 500);
    const maxEndMs = startMs + 5000;
    return Math.min(maxEndMs, safeDuration);
  }, [startMs, effectiveDurationMs]);

  useEffect(() => {
    if (videoUri && player) {
      const checkDuration = () => {
        try {
          const duration = player.duration;
          if (duration && duration > 0) {
            const durationMs = Math.floor(duration * 1000);
            setActualDurationMs(durationMs);
            console.log(`Actual video duration: ${duration}s (${durationMs}ms)`);
          }
        } catch (error) {
          console.log("Could not get actual duration from player:", error);
        }
      };

      const timer = setTimeout(checkDuration, 1000);
      return () => clearTimeout(timer);
    }
  }, [videoUri, player]);

  return (
    <View className="flex-1 bg-white p-4">
      <VideoView
        style={{ width: screenWidth - 10, height: 200, backgroundColor: 'black', borderRadius: 12, alignSelf: "center" }}
        player={player}
        nativeControls
      />

      <Slider
        minimumValue={0}
        maximumValue={Math.max(0, effectiveDurationMs - 5500)}
        value={Math.min(startMs, Math.max(0, effectiveDurationMs - 5500))}
        onValueChange={(v) => setStartMs(Math.floor(v))}
      />

      <Text className="text-black text-center mb-4 text-base font-normal">
        Select 5-second segment
      </Text>

      <View className="flex-row justify-between items-center mb-4 px-2 gap-4">
        <View className="flex-1 items-center">
          <Text className="text-black text-xs mb-1 font-normal">Start</Text>
          <Text className="text-black text-lg font-bold">
            {Math.floor(startMs / 1000)}s
          </Text>
        </View>

        <View className="flex-1 items-center">
          <Text className="text-black text-xs mb-1 font-normal">Duration</Text>
          <Text className="text-green-500 font-bold text-2xl">
            {Math.floor(actualDurationMs / 1000)}
          </Text>
        </View>

        <View className="flex-1 items-center">
          <Text className="text-black text-xs mb-1 font-normal">End</Text>
          <Text className="text-black text-lg font-bold">
            {Math.floor(endMs / 1000)}s
          </Text>
        </View>
      </View>
    </View>
  );
};