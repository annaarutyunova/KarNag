import React, {useEffect, useState} from 'react';
import { StyleSheet, ScrollView, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase.config'; // Import Firestore instance
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Car() {
  

  return (
      
       <ThemedView>
          <ThemedText>Profile</ThemedText>
        </ThemedView>
  );
}

const styles = StyleSheet.create({
 
});
