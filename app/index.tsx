import { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useFocusEffect } from '@react-navigation/native';
import { getActivities, deleteAllActivities, setupDatabase, deleteActivityById } from '../utils/database';
import SwipeableItem, { useSwipeableItemParams } from 'react-native-swipeable-item';
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
        <FlashList
          data={activities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SwipeableActivity item={item} onDelete={handleDeleteActivity} />
          )}
          estimatedItemSize={50}
        />

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/add-activity')}
        >
          <Text style={styles.addButtonText}>Add activity</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDeleteAll}
        >
          <Text style={styles.deleteButtonText}>Delete all activities</Text>
        </TouchableOpacity>
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
            style={styles.deleteSwipeButton}
            onPress={() => {
              onDelete(item.id);
              close();
            }}
          >
            <Text style={styles.deleteSwipeButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      renderUnderlayRight={() => (
        <View style={[styles.underlay, { alignItems: 'flex-start' }]}>
          <TouchableOpacity
            style={styles.deleteSwipeButton}
            onPress={() => {
              onDelete(item.id);
              close();
            }}
          >
            <Text style={styles.deleteSwipeButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    >
      <Animated.View 
        style={styles.activityItem} 
        layout={Layout.springify()} 
        exiting={FadeOutRight}
      >
        <Text style={styles.dateText}>
          {new Date(item.date * 1000).toLocaleString()}
        </Text>
        <Text style={styles.stepsText}>Steps: {item.steps}</Text>
      </Animated.View>
    </SwipeableItem>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 10,
  },
  activityItem: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    padding: 10,
    marginVertical: 5,
  },
  dateText: {
    color: '#000',
    fontSize: 14,
    marginBottom: 5,
  },
  stepsText: {
    color: '#000',
    fontSize: 18,
  },
  underlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  deleteSwipeButton: {
    width: 80,
    height: '100%',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteSwipeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    width: '100%',
    backgroundColor: '#00CBA9',
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    width: '100%',
    backgroundColor: 'red',
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});