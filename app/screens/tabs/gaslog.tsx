import { Text } from 'react-native';
import React from 'react';
import { useCarContext } from '@/context/CarContext';

export default function GasLog() {
  const { car } = useCarContext();
  if(!car) {
    return <Text>No car selected</Text>
  }
  return (
    <Text>Gas Log for {car.make} {car.model}</Text>
  )
}