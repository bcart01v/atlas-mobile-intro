import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

const dbName = 'activities.db';
const dbUri = FileSystem.documentDirectory + dbName;
const db = SQLite.openDatabaseSync(dbName);

export const setupDatabase = async () => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(dbUri);
    console.log("📂 Database Path:", dbUri);
    console.log("🔍 Database Exists?", fileInfo.exists);

    if (!fileInfo.exists) {
      console.warn("⚠️ Database file does not exist. Creating new database...");
    }

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        steps INTEGER NOT NULL,
        date INTEGER NOT NULL
      );
    `);

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export const addActivity = async (steps: number, date: number) => {
  try {
    await db.execAsync(`
      INSERT INTO activities (steps, date) VALUES (${steps}, ${date});
    `);
    console.log(`Activity inserted: ${steps} steps on ${new Date(date * 1000).toLocaleString()}`);
  } catch (error) {
    console.error("Error inserting activity:", error);
  }
};

export const getActivities = async (setActivities: (activities: any[]) => void) => {
  try {
    const result = await db.getAllAsync(`SELECT * FROM activities ORDER BY date DESC;`);
    setActivities(result);
    console.log("📊 Activities fetched:", result.length);
  } catch (error) {
    console.error("🚨 Error fetching activities:", error);
  }
};

export const deleteAllActivities = async () => {
  try {
    await db.execAsync(`DELETE FROM activities;`);
    console.log('🗑️ All activities deleted successfully.');
  } catch (error) {
    console.error('🚨 Error deleting activities:', error);
  }
};

export const deleteActivityById = async (id: number) => {
  try {
    await db.execAsync(`DELETE FROM activities WHERE id = ${id};`);
    console.log(`🗑️ Activity with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error("🚨 Error deleting activity:", error);
  }
};