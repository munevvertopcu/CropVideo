export async function generateThumbnail(uri: string): Promise<string | undefined> {
  try {
    // Dynamically import to avoid crashes on web when the native module isn't available
    const mod: typeof import('expo-video-thumbnails') = await import('expo-video-thumbnails');
    const result = await mod.getThumbnailAsync(uri, { time: 0 });
    return result?.uri;
  } catch (e) {
    console.warn('Thumbnail generation failed or module not available:', e);
    return undefined;
  }
}
