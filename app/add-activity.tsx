import { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
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
        try {
            await addActivity(stepsInt, currentTimestamp);
            console.log(`Inserted: ${stepsInt} steps on ${currentTimestamp}`);
            router.back();
        } catch (error) {
            console.error('Error inserting activity:', error);
            Alert.alert('Database Error', 'Failed to insert activity.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Activity</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter steps"
                keyboardType="numeric"
                value={steps}
                onChangeText={setSteps}
            />
            <Button title="Save Activity" onPress={handleAddActivity} />
            <Button title="Go back" onPress={() => router.back()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
});