import React, {useState} from 'react';
import { StyleSheet, TextInput, Pressable } from 'react-native';
import Button from '@/components/Button';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, getDocs, setDoc, addDoc } from 'firebase/firestore';
import { db, storage } from '@/firebase.config'; // Import Firestore instance
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';


interface Car {
  id: string;
  make: string;
  model: string;
  mileage: number;
  year: number;
}

export default function Addcar() {

  const router = useRouter();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [id, setID] = useState('');
  const color = useThemeColor({light: "black", dark: "#B5B5B5"}, "text")
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if(!result.canceled) {
      setSelectedImage(result.assets[0].uri)
    } else {
      alert('You did not select any image.');
    }
  };

  const saveCar = async () => {
    const carData = {
      id: id,
      make: make.trim() || "Make",
      model: model.trim() || "Model",
      year: year.trim() || 1998,
      mileage: mileage.trim() || 0,
      imageURL: selectedImage || null
    }
    try {
      const cars = collection(db, "Cars")
      const res = await addDoc(cars, carData)
      if(res){
        setID(res.id)
        await setDoc(res, {id: res.id}, {merge: true})
      }
      
      if(selectedImage) {
        // Create a storage reference from our storage service
        const imageRef = ref(storage, `${res.id}.jpg`);
        const img = await fetch(selectedImage);
        const bytes = await img.blob();
        await uploadBytes(imageRef, bytes);

        const imageURL = await getDownloadURL(imageRef);
        await setDoc(res, {imageURL: imageURL}, {merge: true});

      }

      setMake(''); 
      setModel(''); 
      setMileage(''); 
      setYear(''); 
      setSelectedImage(undefined);
      setID('');

      router.push("/(tabs)")
    } catch(error) {
      console.error(`Error adding car: `, error)
    }
  
  }
  
  return (
    
    <ThemedView style={styles.container}>
      <ThemedView style={styles.form}>
        <TextInput
          editable
          style={[styles.input, {color: color}, {borderColor: color}]}
          onChangeText={setMake}
          value={make}
          placeholder="Make"
          placeholderTextColor={color}
        />
        <TextInput
          editable
          style={[styles.input, {color: color}, {borderColor: color}]}
          onChangeText={setModel}
          value={model}
          placeholder="Model"
          placeholderTextColor={color}
        />
        <TextInput
          editable={true}
          style={[styles.input, {color: color}, {borderColor: color}]}
          onChangeText={setYear}
          value={year}
          placeholder="Year"
          keyboardType="numeric"
          placeholderTextColor={color}
        />
        <TextInput
          editable={true}
          style={[styles.input, {color: color}, {borderColor: color}]}
          onChangeText={setMileage}
          value={mileage}
          placeholder="Mileage"
          keyboardType="numeric"
          placeholderTextColor={color}
        />
      </ThemedView>
      <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
      <Pressable style={styles.saveContainer} onPress={saveCar}>
        <ThemedText style={[styles.save, {borderColor: color}]}>Save</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  form: {
    display: 'flex',
    gap: 20,
    marginBottom: 20,
  },
  save: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    textAlign: "center",
    width: 80,
    borderRadius: 8,
  },
  saveContainer: {
    alignSelf: 'flex-end'
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
  },
  imageContainer: {
    flex: 1,
    marginTop: 50,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});
