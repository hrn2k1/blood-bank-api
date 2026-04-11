import { User } from '../models/User';
import { Location } from '../models/Location';
import { BloodRequest } from '../models/BloodRequest';
import { Counter } from '../models/Counter';
import { connectDatabase, disconnectDatabase } from '../config/database';

/**
 * Fix database by dropping old indexes and clearing data
 */
async function fixDatabase() {
  try {
    console.log('Connecting to database...');
    await connectDatabase();

    // Clear Users collection
    console.log('Dropping old indexes on users collection...');
    try {
      await User.collection.dropIndexes();
      console.log('✓ Dropped users indexes');
    } catch (error) {
      console.log('Note: Could not drop users indexes (they may not exist)');
    }

    console.log('Clearing users collection...');
    await User.deleteMany({});
    console.log('✓ Cleared users collection');

    console.log('Recreating users indexes...');
    await User.collection.createIndex({ contactNumber: 1 }, { unique: true });
    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('✓ Recreated users indexes');

    // Clear Locations collection
    console.log('Dropping old indexes on locations collection...');
    try {
      await Location.collection.dropIndexes();
      console.log('✓ Dropped locations indexes');
    } catch (error) {
      console.log('Note: Could not drop locations indexes (they may not exist)');
    }

    console.log('Clearing locations collection...');
    await Location.deleteMany({});
    console.log('✓ Cleared locations collection');

    // Clear BloodRequests collection
    console.log('Dropping old indexes on blood requests collection...');
    try {
      await BloodRequest.collection.dropIndexes();
      console.log('✓ Dropped blood requests indexes');
    } catch (error) {
      console.log('Note: Could not drop blood requests indexes (they may not exist)');
    }

    console.log('Clearing blood requests collection...');
    await BloodRequest.deleteMany({});
    console.log('✓ Cleared blood requests collection');

    // Clear Counter collection
    console.log('Clearing counter collection...');
    await Counter.deleteMany({});
    console.log('✓ Cleared counter collection');

    console.log('✓ Database fixed successfully');
    await disconnectDatabase();
  } catch (error) {
    console.error('✗ Error fixing database:', error);
    await disconnectDatabase();
    process.exit(1);
  }
}

fixDatabase();
