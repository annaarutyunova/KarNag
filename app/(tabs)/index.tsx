import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView, Image, Text, Pressable } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase.config'; // Import Firestore instance
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface Car {
  make: string;
  model: string;
  mileage: number;
  year: number;
  imageURL: string;
}

export default function Car() {
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
      <ThemedView style={styles.container}>
      
        <ScrollView contentContainerStyle={styles.scrollView}>
          {cars.map((car, index) => (
            <Link key={index} style={styles.box} href='/car'>
              <ThemedView style={styles.box} >
                <Image
                style={styles.image}
                source={{
                  uri: `${car.imageURL}`
                }}></Image>
                <ThemedView style={styles.carInfo}>
                  <ThemedText>{car.make} {car.model}</ThemedText>
                  <ThemedText>Year: {car.year}</ThemedText>
                  <ThemedText>Mileage: {car.mileage}</ThemedText>
                </ThemedView>
              </ThemedView>
            </Link>
          ))}
        </ScrollView>
        <Link href="/addcar" style={styles.button}>
           <ThemedText style={styles.button}>+</ThemedText>
        </Link>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 16, // Added padding for better spacing
  },
  scrollView: {
    flexGrow: 1, // Allows the ScrollView to take up all available space
    // justifyContent: 'center', // Center content vertically
    paddingBottom: 20, // Add bottom padding for better scrolling
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    fontSize: 40,
    padding: 12,
    textAlign: 'center'
  },
  image: {
    width: 150,
    height: 120,
    objectFit: 'cover',
    borderRadius: 2
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20
  },
  carInfo: {
    display: 'flex',
    justifyContent: 'space-around'
  }
});
