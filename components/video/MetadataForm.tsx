import React, { useMemo, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MetadataFormData } from '../../types';

interface MetadataFormProps {
  onSubmit: (data: MetadataFormData) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<MetadataFormData>;
  title?: string;
}

export const MetadataForm: React.FC<MetadataFormProps> = ({ onSubmit, onCancel, isLoading, initialData, title }) => {
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');

  const heading = useMemo(() => title ?? 'Add Details', [title]);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Validation', 'Please enter a video name.');
      return;
    }
    onSubmit({ name: trimmedName, description: description.trim() });
  };

  return (
    <View className="flex-1 p-6 bg-white">
      <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">{heading}</Text>
      <View className="mb-4">
        <Text className="text-gray-700 mb-2 text-lg font-semibold">Video Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter a name"
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
          editable={!isLoading}
        />
      </View>
      <View className="mb-6">
        <Text className="text-gray-700 mb-2 text-lg font-semibold">Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Add a short description"
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
          multiline
          numberOfLines={4}
          editable={!isLoading}
        />
      </View>
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={onCancel}
          disabled={isLoading}
          className="px-5 py-3 rounded-lg bg-gray-200">
          <Text className="text-gray-800 font-semibold">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading}
          className="px-5 py-3 rounded-lg bg-blue-600">
          <Text className="text-white font-semibold">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
