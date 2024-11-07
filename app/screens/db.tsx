import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase.config'; // Import Firestore instance

interface Car {
  make: string;
  model: string;
}

export default function App() {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsCollection = collection(db, 'Cars');
        const carsSnapshot = await getDocs(carsCollection);
        const carsList = carsSnapshot.docs.map(doc => doc.data());
        setCars(carsList as Car[]);
      } catch (error) {
        console.error('Error fetching cars data: ', error);
      }
    };

    fetchCars();
  }, []);

  return (
    <View style={styles.container}>
    
      <ScrollView contentContainerStyle={styles.scrollView}>
      {cars.map((car, index) => (
        <Text style={styles.text} key={index}>{car.make} {car.model}</Text>
      ))}
        </ScrollView>
    </View>
  );
}

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
  text: {
    color: 'white'
  }
});
