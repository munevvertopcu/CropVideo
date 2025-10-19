import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, Platform, Text, View } from 'react-native';
import { useTrimVideo } from '../../hooks/useTrimVideo';
import { useVideoDuration } from '../../hooks/useVideoDuration';
import { VideoTrimmingState } from '../../types';
import { Button } from '../ui/Button';
import { SegmentInfoRow } from '../ui/SegmentInfoRow';
import { SliderDurationLabels } from '../ui/SliderDurationLabels';
import { TrimRangeSlider } from '../ui/TrimRangeSlider';

interface VideoTrimmerProps {
  videoUri: string;
  duration: number;
  onTrimStateChange: (state: VideoTrimmingState) => void;
  onNext: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const CLIP_DURATION_MS = 5000;

export const VideoTrimmer: React.FC<VideoTrimmerProps> = ({
  videoUri,
  duration,
  onTrimStateChange,
  onNext
}) => {
  const [actualDurationMs, setActualDurationMs] = useState<number>(0);
  const [startMs, setStartMs] = useState<number>(0);
  const [endMs, setEndMs] = useState<number>(0);
  const [displayedStartMs, setDisplayedStartMs] = useState<number>(0);
  const [displayedEndMs, setDisplayedEndMs] = useState<number>(0);
  const [trimmedUri, setTrimmedUri] = useState<string | null>(null);
  const videoSource = useMemo(() => ({ uri: videoUri ?? "" } as { uri: string }), [videoUri]);
  const player = useVideoPlayer(videoSource);

  const { runTrim, isTrimming, resetTrim } = useTrimVideo({
    onSuccess: ({ trimmedUri, startTime, endTime, duration }) => {
      const trimmingState: VideoTrimmingState = {
        startTime,
        endTime,
        duration,
        trimmedUri
      };
      setTrimmedUri(trimmedUri);
      onTrimStateChange(trimmingState);
      onNext();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Unexpected error trimming video.';
      console.error('Trim failed:', error);
      Alert.alert('Trim Failed', message);
    }
  });

  const effectiveDurationMs = actualDurationMs > 0 ? actualDurationMs : duration;

  const startMaxMs = useMemo(() => {
    if (!effectiveDurationMs || effectiveDurationMs <= 0) return 0;
    return Math.max(0, effectiveDurationMs - CLIP_DURATION_MS);
  }, [effectiveDurationMs]);


  const clipDurationMs = useMemo(
    () => Math.max(0, displayedEndMs - displayedStartMs),
    [displayedEndMs, displayedStartMs]
  );

  const measuredDuration = useVideoDuration(player, videoUri);
  useEffect(() => {
    if (measuredDuration > 0) setActualDurationMs(measuredDuration);
  }, [measuredDuration]);

  useEffect(() => {
    // Clamp start within valid bounds whenever duration changes
    setStartMs(prev => {
      const clampedStart = Math.min(Math.max(0, prev), startMaxMs);
      return Number.isFinite(clampedStart) ? clampedStart : 0;
    });
  }, [startMaxMs]);

  useEffect(() => {
    setTrimmedUri(null);
  }, [startMs, endMs, videoUri]);

  useEffect(() => {
    setDisplayedStartMs(startMs);
    setDisplayedEndMs(endMs);
  }, [startMs, endMs]);

  useEffect(() => {
    resetTrim();
    setStartMs(0);
    setEndMs(Math.min(CLIP_DURATION_MS, effectiveDurationMs));
  }, [videoUri, effectiveDurationMs, resetTrim]);

  const handleRangeChange = (s: number, e: number) => {
    setDisplayedStartMs(s);
    setDisplayedEndMs(e);
    setStartMs(s);
    setEndMs(e);
  };

  const handleTrimPress = async () => {
    if (!videoUri || isTrimming) return;

    if (Platform.OS === 'web') {
      Alert.alert(
        'Unsupported Platform',
        'Video trimming is only supported on Android and iOS devices.'
      );
      return;
    }

    if (clipDurationMs <= 0) {
      Alert.alert('Trim Error', 'Unable to determine trim range. Please try again.');
      return;
    }

    const startRounded = Math.round(displayedStartMs);
    const endRounded = Math.round(displayedEndMs);
    const durationRounded = Math.max(0, Math.round(clipDurationMs));
    const maxDurationRounded = Math.round(effectiveDurationMs);

    if (endRounded <= startRounded) {
      Alert.alert('Trim Error', 'End time must be greater than start time.');
      return;
    }

    if (endRounded > maxDurationRounded) {
      Alert.alert('Trim Error', 'End time exceeds the video duration.');
      return;
    }

    try {
      await runTrim({
        uri: videoUri,
        startMs: startRounded,
        endMs: endRounded,
        durationMs: durationRounded
      });
    } catch {
      // already handled in onError. The try/catch here is there to prevent the error that occurs during mutateAsync (runTrim) from being carried up as “Unhandled promise rejection”.
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <VideoView
        style={{
          width: screenWidth - 32,
          height: 200,
          backgroundColor: '#000000',
          borderRadius: 12,
          alignSelf: 'center',
          flex: 1
        }}
        player={player}
        nativeControls
      />
      <View className="mt-6">
        <TrimRangeSlider
          durationMs={effectiveDurationMs}
          startMs={startMs}
          endMs={endMs}
          fixedWindowMs={CLIP_DURATION_MS}
          onChange={handleRangeChange}
        />
        <SliderDurationLabels
          startMs={displayedStartMs}
          endMs={displayedEndMs}
          totalMs={effectiveDurationMs}
        />
      </View>
      <Text className="text-black text-center mt-5 mb-3 text-base font-medium">
        Select 5-second segment
      </Text>
      <SegmentInfoRow
        startMs={displayedStartMs}
        endMs={displayedEndMs}
        clipMs={clipDurationMs}
      />
      <View className="mt-6">
        <Button
          label="Trim & Continue"
          onPress={handleTrimPress}
          loading={isTrimming}
          loadingLabel="Trimming..."
          disabled={!videoUri || clipDurationMs <= 0}
          variant="primary"
        />
        {trimmedUri && (
          <Text className="text-xs text-gray-500 text-center mt-3">
            Trim saved to: {trimmedUri}
          </Text>
        )}
      </View>
    </View>
  );
};
