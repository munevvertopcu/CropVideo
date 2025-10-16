import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32
    }}>
      <Ionicons name="videocam-outline" size={80} color="#9CA3AF" />
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#9CA3AF',
        marginTop: 16,
        marginBottom: 8
      }}>
        No Videos Yet
      </Text>
      <Text style={{
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24
      }}>
        Start building your video diary by adding your first memorable moment
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#3B82F6',
          paddingHorizontal: 32,
          paddingVertical: 16,
          borderRadius: 25
        }}
      >
        <Text style={{
          color: 'white',
          fontWeight: '600',
          fontSize: 18
        }}>
          Add Your First Video
        </Text>
      </TouchableOpacity>
    </View>
  );
}
