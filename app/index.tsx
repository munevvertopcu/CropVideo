import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center px-8">
      <Ionicons name="videocam-outline" size={80} color="#9CA3AF" />
      <Text className="text-2xl font-bold text-gray-400 mt-4 mb-2">
        No Videos Yet
      </Text>
      <Text className="text-gray-400 text-center mb-8 leading-6">
        Start building your video diary by adding your first memorable moment
      </Text>
      <TouchableOpacity className="bg-blue-500 px-8 py-4 rounded-full">
        <Text className="text-white font-semibold text-lg">
          Add Your First Video
        </Text>
      </TouchableOpacity>
    </View>
  );
}