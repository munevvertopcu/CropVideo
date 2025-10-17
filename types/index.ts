export interface VideoEntry {
  id: string;
  name: string;
  description: string;
  originalUri: string;
  croppedUri: string;
  duration: number;
  startTime: number;
  endTime: number;
  createdAt: Date | string;
  thumbnailUri?: string;
}

export interface VideoTrimmingState {
  startTime: number;
  endTime: number;
  duration: number;
}

export interface MetadataFormData {
  name: string;
  description: string;
}
