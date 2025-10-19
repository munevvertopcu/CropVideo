import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, GestureResponderEvent, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  leftIconName?: keyof typeof Ionicons.glyphMap;
  className?: string;
  style?: ViewStyle | ViewStyle[];
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  loadingLabel,
  leftIconName,
  className,
  style,
  accessibilityLabel,
}) => {
  const base = 'px-4 py-3 rounded-lg flex-row items-center justify-center';
  const variantClass = (() => {
    switch (variant) {
      case 'primary':
        return disabled ? 'bg-gray-300' : 'bg-blue-600';
      case 'secondary':
        return disabled ? 'bg-gray-200' : 'bg-gray-300';
      case 'danger':
        return disabled ? 'bg-red-300' : 'bg-red-500';
      case 'ghost':
        return 'bg-transparent';
      default:
        return 'bg-blue-600';
    }
  })();

  const textColor = (() => {
    switch (variant) {
      case 'secondary':
        return 'text-gray-800';
      case 'ghost':
        return 'text-blue-600';
      default:
        return 'text-white';
    }
  })();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${base} ${variantClass} ${className ?? ''}`}
      style={style}
      accessibilityLabel={accessibilityLabel ?? label}
    >
      {loading ? (
        <View className="flex-row items-center">
          <ActivityIndicator color={variant === 'secondary' ? '#111827' : '#FFFFFF'} />
          <Text className={`ml-2 font-semibold ${textColor}`}>
            {loadingLabel ?? label}
          </Text>
        </View>
      ) : (
        <View className="flex-row items-center">
          {leftIconName ? (
            <Ionicons name={leftIconName} size={20} color={textColor.includes('white') ? '#FFFFFF' : '#111827'} />
          ) : null}
          <Text className={`font-semibold ${leftIconName ? 'ml-2' : ''} ${textColor}`}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

