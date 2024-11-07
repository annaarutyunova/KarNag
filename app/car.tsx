import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, Image } from 'react-native';
import { useLocalSearchParams} from 'expo-router';

export default function Car() { 
  const { make, model, year, mileage, imageURL } = useLocalSearchParams();
  return (
    <ThemedView>
      <ThemedView style={styles.box}>
              <Image
                style={styles.image}
                source={{
                uri: `${imageURL}`
                  }}></Image>
              <ThemedView style={styles.carInfo}>
                <ThemedText>{make} {model}</ThemedText>
                <ThemedText>Year: {year}</ThemedText>
                <ThemedText>Mileage: {mileage}</ThemedText>
              </ThemedView>
            </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
