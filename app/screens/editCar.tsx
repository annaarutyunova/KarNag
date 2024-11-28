import React, {useState, useEffect} from 'react';
import { StyleSheet, TextInput, Pressable, Image, ScrollView, ActivityIndicator } from 'react-native';
import Button from '@/components/Button';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setDoc, updateDoc, doc } from 'firebase/firestore';
import { db, storage } from '@/firebase.config'; 
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useCarContext, CarProvider } from '@/context/CarContext';
// import CarContextType from '@/types/CarContext';


export default function EditCar() {
  const { car, setCar } = useCarContext();
  const router = useRouter();
  const [carMake, setMake] = useState(car?.make || '');
  const [carModel, setModel] = useState(car?.model || '');
  const [carYear, setYear] = useState(car?.year || '');
  const [carMileage, setMileage] = useState(car?.mileage || '');
  const [selectedCarImage, setSelectedImage] = useState(car?.imageURL || '');
  const color = useThemeColor({light: "black", dark: "#B5B5B5"}, "text")
  if (!car) {
    return (
      <ThemedView>
        <ActivityIndicator size='large' color={color} />
        <ThemedText>{carMake}</ThemedText>
      </ThemedView>
  )
  }
  useEffect(() => {
    if (car) {
      setMake(car.make);
      setModel(car.model);
      setYear(car.year.toString());
      setMileage(car.mileage.toString());
      setSelectedImage(car.imageURL);
    }
  }, [car]);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if(!result.canceled) {
      setSelectedImage(result.assets[0].uri)
    }
  };

  const saveCar = async () => {
    const carData = {
      id: car.id,
      make: carMake,
      model: carModel,
      year: Number(carYear),
      mileage: Number(carMileage),
      imageURL: selectedCarImage,
    }
    try {
      const carRef = doc(db, 'Cars', car.id)
      const res = await updateDoc(carRef, carData)
      
      if(selectedCarImage && selectedCarImage != car.imageURL) {
        // Create a storage reference from our storage service
        const imageRef = ref(storage, `${car.id}.jpg`);
        const img = await fetch(selectedCarImage);
        const bytes = await img.blob();
        await uploadBytes(imageRef, bytes);

        const imageURL = await getDownloadURL(imageRef);
        await setDoc(carRef, {imageURL: imageURL}, {merge: true});
        carData.imageURL = imageURL;
      }
      setCar(carData);
      router.back()
    } catch(error) {
      console.error(`Error updating car: `, error)
    }
  }
  
  return (
    
    <ScrollView>
      <Image
          style={styles.image}
          source={{
          uri: `${car.imageURL}`
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
        value={carYear.toString()}
        placeholder="Year"
        keyboardType="numeric"
        placeholderTextColor={color}
      />
      <TextInput
        editable={true}
        style={[styles.input, {color: color}, {borderColor: color}]}
        onChangeText={setMileage}
        value={carMileage.toString()}
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
