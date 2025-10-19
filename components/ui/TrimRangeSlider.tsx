import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

interface TrimRangeSliderProps {
  durationMs: number;
  startMs: number;
  endMs: number;
  fixedWindowMs?: number;
  onChange?: (startMs: number, endMs: number) => void;
}

export const TrimRangeSlider: React.FC<TrimRangeSliderProps> = ({
  durationMs,
  startMs,
  endMs,
  fixedWindowMs = 5000,
  onChange,
}) => {
  const durationSV = useSharedValue(0);
  const trackWidthSV = useSharedValue(0);
  const startMsSV = useSharedValue(0);
  const endMsSV = useSharedValue(0);
  const isInteractingSV = useSharedValue(false);

  // Sync props -> shared values in one pass (guarded to avoid loops)
  useEffect(() => {
    const dur = Math.max(0, durationMs || 0);
    if (durationSV.value !== dur) durationSV.value = dur;

    const startNext = Math.max(0, Math.min(startMs || 0, Math.max(0, dur - fixedWindowMs)));
    if (startMsSV.value !== startNext) startMsSV.value = startNext;

    const minEnd = Math.min(fixedWindowMs, dur);
    const endNext = Math.max(minEnd, Math.min(endMs || 0, dur));
    if (endMsSV.value !== endNext) endMsSV.value = endNext;
  }, [durationMs, startMs, endMs, fixedWindowMs]);

  const onTrackLayout = (event: { nativeEvent: { layout: { width: number } } }) => {
    trackWidthSV.value = event.nativeEvent.layout.width || 0;
  };

  // Pan the whole selected window
  const windowInitialStartX = useSharedValue(0);
  const windowPan = Gesture.Pan()
    .onBegin(() => {
      isInteractingSV.value = true;
      windowInitialStartX.value = startMsSV.value;
    })
    .onChange((e) => {
      const tw = trackWidthSV.value || 0;
      const dur = durationSV.value || 0;
      if (tw <= 0 || dur <= 0) return;

      const dx = e.translationX || 0;
      const deltaMs = (dx / tw) * dur;
      const winLen = Math.min(fixedWindowMs, dur);
      const minStart = 0;
      const maxStart = Math.max(0, dur - winLen);
      const newStart = Math.min(Math.max(minStart, windowInitialStartX.value + deltaMs), maxStart);
      startMsSV.value = Math.round(newStart);
      endMsSV.value = Math.round(newStart + winLen);
    })
    .onEnd(() => {
      isInteractingSV.value = false;
    });

  // Drag start handle
  const startInitialX = useSharedValue(0);
  const startGesture = Gesture.Pan()
    .onBegin(() => {
      isInteractingSV.value = true;
      startInitialX.value = startMsSV.value;
    })
    .onChange((e) => {
      const tw = trackWidthSV.value || 0;
      const dur = durationSV.value || 0;
      if (tw <= 0 || dur <= 0) return;

      const dx = e.translationX || 0;
      const x = Math.max(0, startInitialX.value + (dx / tw) * dur);
      const maxStart = Math.max(0, dur - fixedWindowMs);
      const clampedStart = Math.min(x, maxStart);
      startMsSV.value = Math.round(clampedStart);
      endMsSV.value = Math.round(clampedStart + Math.min(fixedWindowMs, dur));
    })
    .onEnd(() => {
      isInteractingSV.value = false;
    });

  // Drag end handle
  const endInitialX = useSharedValue(0);
  const endGesture = Gesture.Pan()
    .onBegin(() => {
      isInteractingSV.value = true;
      endInitialX.value = endMsSV.value;
    })
    .onChange((e) => {
      const tw = trackWidthSV.value || 0;
      const dur = durationSV.value || 0;
      if (tw <= 0 || dur <= 0) return;

      const dx = e.translationX || 0;
      const x = Math.max(0, endInitialX.value + (dx / tw) * dur);
      const minEnd = Math.min(fixedWindowMs, dur);
      const clampedEnd = Math.min(Math.max(minEnd, x), dur);
      endMsSV.value = Math.round(clampedEnd);
      const startCandidate = Math.max(0, endMsSV.value - Math.min(fixedWindowMs, dur));
      const maxStart = Math.max(0, dur - Math.min(fixedWindowMs, dur));
      startMsSV.value = Math.min(startCandidate, maxStart);
    })
    .onEnd(() => {
      isInteractingSV.value = false;
    });

  const selectionAnimatedStyle = useAnimatedStyle(() => {
    const tw = trackWidthSV.value || 0;
    const dur = durationSV.value || 1;
    const left = (startMsSV.value / dur) * tw;
    const right = (endMsSV.value / dur) * tw;
    return { left, width: Math.max(16, right - left) } as any;
  });

  const startHandleStyle = useAnimatedStyle(() => {
    const tw = trackWidthSV.value || 0;
    const dur = durationSV.value || 1;
    const left = (startMsSV.value / dur) * tw - 10;
    return { left } as any;
  });

  const endHandleStyle = useAnimatedStyle(() => {
    const tw = trackWidthSV.value || 0;
    const dur = durationSV.value || 1;
    const left = (endMsSV.value / dur) * tw - 10;
    return { left } as any;
  });

  const notifyChange = (s: number, e: number) => {
    onChange?.(s, e);
  };

  // Emit changes via animated reaction only when interacting
  useAnimatedReaction(
    () => ({
      ds: startMsSV.value,
      de: endMsSV.value,
      active: isInteractingSV.value,
    }),
    (vals, prev) => {
      if (!vals.active) return;
      if (!prev || vals.ds !== prev.ds || vals.de !== prev.de) {
        runOnJS(notifyChange)(Math.round(vals.ds), Math.round(vals.de));
      }
    }
  );

  return (
    <GestureDetector gesture={windowPan}>
      <View
        className="relative w-full h-12 justify-center"
        onLayout={onTrackLayout}>
        <View
          className="absolute left-0 right-0 h-[10px] rounded-full bg-gray-300" />
        <Animated.View
          pointerEvents="none"
          className="absolute top-1/2 h-[6px] -mt-[3px] rounded-full bg-[#0062b1]"
          style={selectionAnimatedStyle}
        />

        <GestureDetector gesture={startGesture}>
          <Animated.View
            className="absolute top-0 w-5 h-12 rounded-lg border-2 border-white z-20 bg-blue-600"
            style={startHandleStyle}
          />
        </GestureDetector>

        <GestureDetector gesture={endGesture}>
          <Animated.View
            className="absolute top-0 w-5 h-12 rounded-lg border-2 border-white z-20 bg-emerald-500"
            style={endHandleStyle}
          />
        </GestureDetector>
      </View>
    </GestureDetector>
  );
};
