import React, {useState} from 'react';
import { StyleSheet, TextInput, Pressable, Image, ScrollView } from 'react-native';
import Button from '@/components/Button';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setDoc, updateDoc, doc } from 'firebase/firestore';
import { db, storage } from '@/firebase.config'; 
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

function ensureString(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] : value || '';
}


export default function Addcar() {
  const { id, make, model, year, mileage, imageURL } = useLocalSearchParams();

  const router = useRouter();
  const [carMake, setMake] = useState(ensureString(make) || '');
  const [carModel, setModel] = useState(ensureString(model) || '');
  const [carYear, setYear] = useState(ensureString(year) || '');
  const [carMileage, setMileage] = useState(ensureString(mileage) || '');
  const [selectedCarImage, setSelectedImage] = useState(ensureString(imageURL) || '');
  const color = useThemeColor({light: "black", dark: "#B5B5B5"}, "text")
  console.log(selectedCarImage)

  const pickImageAsync = async () => {
    console.log("picking image")
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if(!result.canceled) {
      console.log(result.assets[0].uri);
      setSelectedImage(result.assets[0].uri)
    }
  };

  const saveCar = async () => {
    const carData = {
      id: id,
      make: carMake,
      model: carModel,
      year: carYear,
      mileage: carMileage,
      imageURL: selectedCarImage,
    }
    try {
      const carRef = doc(db, 'Cars', ensureString(id))
      const res = await updateDoc(carRef, carData)
      console.log("Updated successfully")
      
      if(selectedCarImage && selectedCarImage != imageURL) {
        // Create a storage reference from our storage service
        const imageRef = ref(storage, `${id}.jpg`);
        const img = await fetch(selectedCarImage);
        const bytes = await img.blob();
        console.log("Edit car bytes", bytes)
        await uploadBytes(imageRef, bytes);

        const imageURL = await getDownloadURL(imageRef);
        console.log("Image URL in edit car", imageURL)
        await setDoc(carRef, {imageURL: imageURL}, {merge: true});

      }

      setMake(''); 
      setModel(''); 
      setMileage(''); 
      setYear(''); 
      setSelectedImage('');

      // router.push({pathname:"/car"})
    } catch(error) {
      console.error(`Error updating car: `, error)
    }
  
  }
  
  return (
    
    <ScrollView>
      <Image
          style={styles.image}
          source={{
          uri: `${imageURL}`
        }}></Image>
      <TextInput
        editable
        style={[styles.input, {color: color}, {borderColor: color}]}
        onChangeText={setMake}
        value={carMake}
        placeholder={'Make'}
        placeholderTextColor={color}
      
      />
      <TextInput
        editable
        style={[styles.input, {color: color}, {borderColor: color}]}
        onChangeText={setModel}
        value={carModel}
        placeholder={'Model'}
        placeholderTextColor={color}
      />
      <TextInput
        editable={true}
        style={[styles.input, {color: color}, {borderColor: color}]}
        onChangeText={setYear}
        value={carYear}
        placeholder="Year"
        keyboardType="numeric"
        placeholderTextColor={color}
      />
      <TextInput
        editable={true}
        style={[styles.input, {color: color}, {borderColor: color}]}
        onChangeText={setMileage}
        value={carMileage}
        placeholder="Mileage"
        keyboardType="numeric"
        placeholderTextColor={color}
      />
        <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
      <Pressable onPress={saveCar}>
        <ThemedText style={[styles.save, {borderColor: color}]}>Save</ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  save: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    textAlign: "center",
    width: 80,
    borderRadius: 8,
  },
  input: {
    margin: 12,
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
  image: {
    width: 100,
    height: 100
  }
});
