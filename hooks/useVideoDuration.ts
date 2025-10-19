import { useEffect, useState } from 'react';

export function useVideoDuration(player: any, videoUri?: string | null) {
  const [actualDurationMs, setActualDurationMs] = useState<number>(0);

  useEffect(() => {
    if (videoUri && player) {
      const checkDuration = () => {
        try {
          const playerDuration = player.duration;
          if (playerDuration && playerDuration > 0) {
            const durationInMs = Math.floor(playerDuration * 1000);
            setActualDurationMs(durationInMs);
          }
        } catch (error) {
          console.log('Could not get actual duration from player:', error);
        }
      };
      const timer = setTimeout(checkDuration, 1000);
      return () => clearTimeout(timer);
    }
  }, [videoUri, player]);

  return actualDurationMs;
}

