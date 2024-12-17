import { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View, ActivityIndicator, ScrollView, Modal, Pressable } from 'react-native'
import { doc, getDoc, collection, addDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase.config'
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCarContext } from '@/context/CarContext';
import { TextInput } from 'react-native-gesture-handler';

const maintenanceDataFile = require('@/assets/hondapilot.json');

// First we check if car's maintenance info is in the database (based on make, model, and year)
// If not: 
  // Then API call that we aren't doing right now.
  // Then the API call we need to save all maintenance to the database general collection of car maintenance
  // Then display it on the screen
// If info is in the database, we display it
// If there's been any change made, we save the change? or we write the entire thing to 
// the database different collection? based on the specific car_id.


export default function Maintenance() {
  const { car } = useCarContext();
  let year = car?.year
  let make = car?.make
  let model = car?.model

  const apiURL =`http://api.carmd.com/v3.0/maintlist?year=${year}&make=${make.toUpperCase()}&model=${model.toUpperCase()}`
  interface MaintenanceRecord {
    desc: string;
    due_mileage: number;
  }
  interface MaintenanceData {
    data: MaintenanceRecord[];
  }

  const [maintenanceData, setMaintenanceData] = useState<MaintenanceRecord[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const saveMaintenanceToFirestore = async (carId: string, data: MaintenanceData) => {
    try {
      // Transform API response into Firestore-friendly format
      const maintenanceObj = data.data.reduce((acc, record) => {
        acc[record.desc] = record.due_mileage; // Map description as the key and due_mileage as the value
        return acc;
      }, {} as Record<string, number>);
  
      // Save the formatted object into Firestore under the given car ID
      const docRef = doc(db, "Maintenance", carId);
      await setDoc(docRef, maintenanceObj);
  
      console.log("Maintenance data saved successfully!");
    } catch (error) {
      console.error("Error saving maintenance data to Firestore:", error);
    }
  };

  const fetchMaintenanceData = async () => {
    try {
      if (!car) {
        setError("No car selected");
        setLoading(false);
        return;
      }
  
      setLoading(true);
      const carId = `${car.make[0].toUpperCase() + car.make.slice(1)}${car.model[0].toUpperCase() + car.model.slice(1)}${car.year}`; // Generate document ID
  
      // Check if data exists in Firestore
      const docRef = doc(db, "Maintenance", carId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        // Data exists in Firestore
        const firestoreData = docSnap.data();
        // Transform Firestore data back into array format for rendering
        const formattedData = Object.entries(firestoreData).map(([desc, due_mileage]) => ({
          desc,
          due_mileage,
        }));
        setMaintenanceData(formattedData);
        setLoading(false);
        return; // Exit here if data is found
      }
  
      // Data does not exist, fetch from API
      const response = await fetch(apiURL, {
        method: "GET",
        headers: {
          'Partner-Token': process.env.EXPO_PUBLIC_PARTNER_TOKEN as string,
          'Authorization': process.env.EXPO_PUBLIC_AUTHORIZATION as string,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch maintenance data from API");
      }
  
      const data: MaintenanceData = await response.json();
  
      // Save the fetched data to Firestore
      await saveMaintenanceToFirestore(carId, data);
  
      // Set state with the fetched data
      setMaintenanceData(data.data);
      setLoading(false);
      console.log("Data fetched and saved successfully!");
    } catch (error) {
      console.error("Error fetching or saving maintenance data:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchMaintenanceData();
  }, []);


  const openModal = (record: MaintenanceRecord) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecord(null);
  }
  
 if(!car) {
  return <ThemedText>No car selected</ThemedText>
 }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={{fontSize:20, fontWeight:800}}>Service Reminders</ThemedText>
      <ThemedText style={{fontSize: 16}}>Current Mileage: {car.mileage}</ThemedText>
      <ThemedView style={{display:'flex', flexDirection:'row'}}>      
        <ThemedText style={{borderLeftWidth:2, borderLeftColor:'#ffd33d', paddingHorizontal:10}}>Coming up</ThemedText>
        <ThemedText style={{borderLeftWidth:2, borderLeftColor:'green', paddingHorizontal:10}}>All Good</ThemedText>
        <ThemedText style={{borderLeftWidth:2, borderLeftColor:'red', paddingHorizontal:10}}>Overdue</ThemedText>
      </ThemedView>
      {loading && <ActivityIndicator color="#00ff00" />}
        {error && <Text style={styles.errorText}>Error: {error}</Text>}
         {maintenanceData && (
          <ScrollView contentContainerStyle={styles.scrollView}>
            {maintenanceData.map((record, index) => (
            <Pressable key={index} onPress={() => openModal(record)}>
              <ThemedView style={styles.reminderContainer}>
                <ThemedText style={styles.dataText}>
                  {record.desc}
                </ThemedText>
                <ThemedText>
                  Due next: {car.mileage + record.due_mileage} miles
                </ThemedText>
              </ThemedView>
            </Pressable>
            ))} 
            {/* <Text style={styles.dataText}>{JSON.stringify(maintenanceData, null, 2)}</Text> */}
          </ScrollView>
        )}
        <Modal transparent={true} visible={isModalVisible} onRequestClose={closeModal} animationType='slide'>
          <ThemedView style={styles.modalContainer}>
            <ThemedView style={styles.modalContent}>
              {selectedRecord && (
                <>
                  <ThemedText style={styles.modalTitle}>{selectedRecord.desc}</ThemedText>
                  <ThemedText style={styles.modalText}>Due Mileage: {selectedRecord.due_mileage}</ThemedText>
                  <ThemedText style={styles.modalText}></ThemedText>
                </>
              )}
              <Pressable onPress={closeModal} style={styles.closeButton}>
                <ThemedText style={styles.closeButtonText}>Close</ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        </Modal>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  scrollView: {
    marginTop: 20,
    flexGrow: 1,
    justifyContent: 'center', 
    paddingBottom: 20, 
    display: 'flex',
    gap: 30
  },
  dataText: {
    color: '#d3d3d3', 
    fontSize: 16,
    fontFamily: 'SpaceMonoItalic'
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  reminderContainer: {
    padding: 12,
    borderColor: '#ffd33d',
    borderLeftWidth: 1,
    display: 'flex',
    gap: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ffd33d',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  
});
