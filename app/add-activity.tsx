import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function AddActivityScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Add Activity Screen</Text>
      <Button title="Go back" onPress={() => router.back()} />
    </View>
  );
}