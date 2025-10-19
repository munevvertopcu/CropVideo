import { useMutation } from '@tanstack/react-query';
import { trimVideo } from 'expo-trim-video';
import type { VideoTrimmingState } from '../types';

interface TrimArgs {
  uri: string;
  startMs: number;
  endMs: number;
  durationMs: number;
}

interface UseTrimVideoOptions {
  onSuccess?: (state: VideoTrimmingState) => void;
  onError?: (error: unknown) => void;
}

export function useTrimVideo(opts: UseTrimVideoOptions = {}) {
  const { mutateAsync, isPending, reset } = useMutation({
    mutationFn: async ({ uri, startMs, endMs, durationMs }: TrimArgs) => {
      const result = await trimVideo({ uri, start: startMs / 1000, end: endMs / 1000 });
      const state: VideoTrimmingState = {
        startTime: startMs,
        endTime: endMs,
        duration: durationMs,
        trimmedUri: result.uri,
      };
      return state;
    },
    onSuccess: (state) => {
      opts.onSuccess?.(state);
    },
    onError: (e) => {
      opts.onError?.(e);
    }
  });

  return {
    runTrim: mutateAsync,
    isTrimming: isPending,
    resetTrim: reset,
  };
}

