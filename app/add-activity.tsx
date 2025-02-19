import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { addActivity } from '../utils/database';

export default function AddActivityScreen() {
  const router = useRouter();
  const [steps, setSteps] = useState('');

  const handleAddActivity = async () => {
    const stepsInt = parseInt(steps, 10);
    if (isNaN(stepsInt) || stepsInt <= 0) {
      Alert.alert('Error', 'Please enter a valid number of steps.');
      return;
    }
    const currentTimestamp = Math.floor(Date.now() / 1000);
    await addActivity(stepsInt, currentTimestamp);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Activity</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Steps"
        keyboardType="numeric"
        value={steps}
        onChangeText={setSteps}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddActivity}>
        <Text style={styles.addButtonText}>Add activity</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
        <Text style={styles.goBackButtonText}>Go back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginBottom: 20,
  },
  addButton: {
    width: '100%',
    backgroundColor: '#00CBA9',
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  goBackButton: {
    width: '100%',
    backgroundColor: 'red',
    padding: 15,
    alignItems: 'center',
  },
  goBackButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});