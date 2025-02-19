import { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useFocusEffect } from '@react-navigation/native';
import {
  getActivities,
  deleteAllActivities,
  setupDatabase,
  deleteActivityById,
} from '../utils/database';
import SwipeableItem, {
  useSwipeableItemParams,
} from 'react-native-swipeable-item';
import OverlayProvider from 'react-native-swipeable-item';
import Animated, { Layout, FadeOutRight } from 'react-native-reanimated';

export default function HomeScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const initializeDb = async () => {
      await setupDatabase();
      fetchActivities();
    };
    initializeDb();
  }, []);

  const fetchActivities = async () => {
    await getActivities(setActivities);
  };

  useFocusEffect(
    useCallback(() => {
      fetchActivities();
    }, [])
  );

  const handleDeleteAll = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete all activities?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteAllActivities();
            fetchActivities();
          },
        },
      ]
    );
  };

  const handleDeleteActivity = async (id: number) => {
    await deleteActivityById(id);
    setActivities((prev) => prev.filter((activity) => activity.id !== id));
  };

  return (
    <OverlayProvider item={{}}>
      <View style={styles.container}>
        <Text style={styles.title}>Activity Tracker</Text>
        <Button title="Add Activity" onPress={() => router.push('/add-activity')} />
        <Button title="Delete All Activities" onPress={handleDeleteAll} color="red" />

        <FlashList
          data={activities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SwipeableActivity item={item} onDelete={handleDeleteActivity} />
          )}
          estimatedItemSize={50}
        />
      </View>
    </OverlayProvider>
  );
}

const SwipeableActivity = ({
  item,
  onDelete,
}: {
  item: any;
  onDelete: (id: number) => void;
}) => {
  const { close } = useSwipeableItemParams();

  return (
    <SwipeableItem
      key={item.id}
      item={item}
    // This is the best way I think I can do this
      snapPointsLeft={[80]} 
      snapPointsRight={[80]}
      renderUnderlayLeft={() => (
        <View style={[styles.underlay, { alignItems: 'flex-end' }]}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              onDelete(item.id);
              close();
            }}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      renderUnderlayRight={() => (
        <View style={[styles.underlay, { alignItems: 'flex-start' }]}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              onDelete(item.id);
              close();
            }}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    >
      <Animated.View style={styles.item} layout={Layout.springify()} exiting={FadeOutRight}>
        <Text style={styles.dateText}>
          {new Date(item.date * 1000).toLocaleString()}
        </Text>
        <Text style={styles.text}>Steps: {item.steps}</Text>
      </Animated.View>
    </SwipeableItem>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    flex: 1,
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  dateText: {
    fontSize: 14,
    color: '#555',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  underlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 80,
    height: '100%',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});