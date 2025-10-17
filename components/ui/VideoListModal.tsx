import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { VideoTrimmingState } from '../../types';
import { VideoPicker } from '../video/VideoPicker';
import { VideoTrimmer } from '../video/VideoTrimmer';

interface VideoListModalProps {
    visible: boolean;
    onClose: () => void;
}

type ModalStep = 'select' | 'trim' | 'metadata';

export const VideoListModal: React.FC<VideoListModalProps> = ({
    visible,
    onClose,
}) => {
    const [currentStep, setCurrentStep] = useState<ModalStep>('select');
    const [selectedVideoUri, setSelectedVideoUri] = useState<string>('');
    const [videoDuration, setVideoDuration] = useState<number>(0);
    const [trimState, setTrimState] = useState<VideoTrimmingState | null>(null);

    const handleVideoSelected = async (uri: string, duration: number) => {
        setSelectedVideoUri(uri);
        setVideoDuration(duration);
        setCurrentStep('trim');
    };

    const handleClose = () => {
        setCurrentStep('select');
        setSelectedVideoUri('');
        setVideoDuration(0);
        setTrimState(null);
        onClose();
    };

    const handleTrimComplete = (state: VideoTrimmingState) => {
        setTrimState(state);
    };

    const handleNextToMetadata = () => {
        setCurrentStep('metadata');
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 'select':
                return (
                    <View className="p-6">
                        <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            Select a Video
                        </Text>
                        <VideoPicker onVideoSelected={handleVideoSelected} />
                    </View>
                );

            case 'trim':
                return (
                    <VideoTrimmer
                        videoUri={selectedVideoUri}
                        duration={videoDuration}
                        onTrimStateChange={handleTrimComplete}
                        onNext={handleNextToMetadata}
                    />
                );

            default:
                return null;
        }
    };

    const renderHeader = () => {
        if (currentStep === 'select') return null;

        return (
            <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
                <TouchableOpacity
                    onPress={() => {
                        if (currentStep === 'metadata') {
                            setCurrentStep('trim');
                        } else if (currentStep === 'trim') {
                            setCurrentStep('select');
                        }
                    }}
                    className="p-2"
                >
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>

                <Text className="text-lg font-semibold text-gray-900">
                    {currentStep === 'trim' ? 'Trim Video' : 'Add Details'}
                </Text>

                <TouchableOpacity onPress={handleClose} className="p-2">
                    <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <View className="flex-1 bg-white">
                {renderHeader()}
                {renderStepContent()}
            </View>
        </Modal>
    );
};