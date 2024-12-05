import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase.config'; // Import Firestore instance
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Vehicle from '@/types/Vehicle';
import { Swipeable } from 'react-native-gesture-handler';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Car() {
  const [cars, setCars] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsCollection = collection(db, 'Cars');
        const carsSnapshot = await getDocs(carsCollection);
        const carsList = carsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setCars(carsList as Vehicle[]);
      } catch (error) {
        console.error('Error fetching cars data: ', error);
      }
    };

    fetchCars();
  }, []);

  const deleteCar = async (carId: string) => {
    try {
      await deleteDoc(doc(db, 'Cars', carId));
      setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
      Alert.alert('Success', 'Car deleted successfully!');
    } catch (error) {
      console.error('Error deleting car: ', error);
      Alert.alert('Error', 'Failed to delete the car.');
    }
  };

  const renderRightActions = (carId: string) => (
    <ThemedView style={styles.deleteButton}>
      <ThemedText
        style={styles.deleteButtonText}
        onPress={() => {
          Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this car?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => deleteCar(carId) },
            ]
          );
        }}
      >
        Delete
      </ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {cars.map((car) => (
          <Swipeable
            key={car.id}
            renderRightActions={() => renderRightActions(car.id)}
          >
            <Link
              style={styles.box}
              href={{
                pathname: '/screens/tabs/car',
                params: {
                  id: car.id,
                  make: car.make,
                  model: car.model,
                  year: car.year,
                  mileage: car.mileage,
                  imageURL: car.imageURL,
                },
              }}
            >
              <ThemedView style={styles.box}>
                <Image
                  style={styles.image}
                  source={{
                    uri: `${car.imageURL}`,
                  }}
                />
                <ThemedView style={styles.carInfo}>
                  <ThemedText>{car.make} {car.model}</ThemedText>
                  <ThemedText>Year: {car.year}</ThemedText>
                  <ThemedText>Mileage: {car.mileage}</ThemedText>
                </ThemedView>
              </ThemedView>
            </Link>
          </Swipeable>
        ))}
      </ScrollView>
      <Link href="/addcar" style={styles.button}>
        <AntDesign name="pluscircleo" size={34} color='#ffd33d' />
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    padding: 16
  },
  scrollView: {
    flexGrow: 1, // Allows the ScrollView to take up all available space
    paddingBottom: 20, // Add bottom padding for better scrolling
    display: 'flex',
    gap: 20

  },
  button: {
    padding: 12,
    textAlign: 'center',
  },
  plus: {
    fontSize: 40
  },
  image: {
    width: 150,
    height: 120,
    objectFit: 'cover',
    // borderRadius: 2,
    margin: 'auto'
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center'
  },
  carInfo: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    marginVertical: 10,
    // borderRadius: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    // padding: 10,
  },
});
