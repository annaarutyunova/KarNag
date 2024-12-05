import React, { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, Image } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useCarContext } from '@/context/CarContext';

export default function Car() { 
  console.log()
  const { car, setCar } = useCarContext();
  const { id, make, model, year, mileage, imageURL } = useLocalSearchParams();
  useEffect(() => {
    setCar({
      id: car?.id || id as string,
      make: car?.make  || make as string,
      model: car?.model || model as string,
      year: car?.year || Number(year),
      mileage: car?.mileage || Number(mileage),
      imageURL: car?.imageURL || imageURL as string,
    });
  }, [id, make, model, year, mileage, imageURL, setCar]);
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.box}>
        <Link style={styles.button}
        href='/screens/editCar'>
          <FontAwesome5 name="edit" size={20} color="green" />
        </Link>
        <Image
          style={styles.image}
          source={{
          uri: `${imageURL}`
            }}></Image>
        <ThemedView style={styles.carInfo}>
          <ThemedText>{car?.make} {car?.model}</ThemedText>
          <ThemedText>Year: {car?.year}</ThemedText>
          <ThemedText>Mileage: {car?.mileage}</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  button: {
    fontSize: 40,
    // padding: 12,
    textAlign: 'center',
    position: 'absolute',
    right: 20,
    top: 0
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
    position: 'relative'
  },
  carInfo: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  scrollView: {
    // flexGrow: 1, // Allows the ScrollView to take up all available space
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
  }
});
