import React from 'react';
import { useVideoPicker } from '../../hooks/useVideoPicker';
import { Button } from '../ui/Button';

interface VideoPickerProps {
    onVideoSelected: (uri: string, duration: number) => void;
}

export const VideoPicker: React.FC<VideoPickerProps> = ({ onVideoSelected }) => {
    const { pickVideo } = useVideoPicker();
    const handlePick = async () => {
        const res = await pickVideo();
        if (res) onVideoSelected(res.uri, res.durationMs);
    };

    return (
        <Button
            label="Select Video"
            onPress={handlePick}
            variant="primary"
            leftIconName="videocam"
            className="p-4 rounded-lg"
        />
    );
};
