import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '@/firebase.config'; // Import Firestore instance


const maintenanceDataFile = require('@/assets/hondapilot.json');

// interface Car {
//   make: string;
//   model: string;
// }

// Define the types for your data
interface MaintenanceRecord {
  desc: string;
  due_mileage: number;
}

interface MaintenanceData {
  data: MaintenanceRecord[];
}

export default function App() {
  // Define types for the state variables
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate file fetch (replace this with actual file fetching logic)
  const maintenanceDataFile: MaintenanceData | null = null;

  // Async function to fetch maintenance data
  const fetchMaintenanceData = async () => {
    try {
      if (maintenanceDataFile) {
        setMaintenanceData(maintenanceDataFile);
        setLoading(false); // Stop loading if file data is found
        return;
      }
      setError("No data found in the file");

      const cachedData = await AsyncStorage.getItem('maintenanceData');
      if (cachedData) {
        setMaintenanceData(JSON.parse(cachedData));
        setLoading(false); // No need to load if cached data is found
        return;
      }

      // Fetch data from API
      const response = await fetch(process.env.EXPO_PUBLIC_BASE_URL as string, {
        method: 'GET',
        headers: {
          // 'Partner-Token': process.env.EXPO_PUBLIC_PARTNER_TOKEN as string,
          // 'Authorization': process.env.EXPO_PUBLIC_AUTHORIZATION as string,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
      }

      const data: MaintenanceData = await response.json();
      setMaintenanceData(data);
      await AsyncStorage.setItem('maintenanceData', JSON.stringify(data)); // Store data in local storage
    } catch (error: any) { // Error handling with type annotation for error
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  // JSX rendering logic
  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#00ff00" />}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
      {maintenanceData && (
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.header}>Maintenance Data:</Text>
          {maintenanceData.data.map((record, index) => ( // Assuming maintenanceData has a 'data' property containing an array
            <Text key={index} style={styles.dataText}>
              {index + 1 + '. ' + record.desc} every {record.due_mileage} miles
            </Text>
          ))}
          <Text style={styles.dataText}>{JSON.stringify(maintenanceData, null, 2)}</Text>
        </ScrollView>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

// export default function App() {
//   const [cars, setCars] = useState<Car[]>([]);

//   useEffect(() => {
//     const fetchCars = async () => {
//       try {
//         const carsCollection = collection(db, 'Cars');
//         const carsSnapshot = await getDocs(carsCollection);
//         const carsList = carsSnapshot.docs.map(doc => doc.data() as Car);
//         setCars(carsList);
//       } catch (error) {
//         console.error('Error fetching cars data: ', error);
//       }
//     };

//     fetchCars();
//   }, []);

//   return (
//     <View style={styles.container}>
//       {cars.map((car, index) => (
//         <Text key={index}>{car.make} {car.model}</Text>
//       ))}
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16, // Added padding for better spacing
  },
  scrollView: {
    flexGrow: 1, // Allows the ScrollView to take up all available space
    justifyContent: 'center', // Center content vertically
    paddingBottom: 20, // Add bottom padding for better scrolling
  },
  header: {
    fontSize: 20,
    color: '#fff', // Change color to white for better visibility
    marginBottom: 10,
  },
  dataText: {
    color: '#d3d3d3', // Change text color for better readability
    fontFamily: 'monospace', // Use a monospace font for better data display
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
