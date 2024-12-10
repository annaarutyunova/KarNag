import { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View, ActivityIndicator, ScrollView, Modal, Pressable } from 'react-native'
import { doc, getDoc } from 'firebase/firestore';
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
  const [selectedRecord, setSElectedRecord] = useState<MaintenanceRecord | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);




  // const fetchMaintenanceData = async () => {
  //   try{
  //     if(maintenanceDataFile) {
  //       setMaintenanceData(maintenanceDataFile);
  //       setLoading(false);
  //       return
  //     }
  //   } catch (error: any) {
  //     setLoading(false);
  //   }
  // }

  const fetchMaintenanceData = async () => {
    if (!car) {
      setError("No car selected");
      setLoading(false);
      return;
    }

    const docId = `${car.make[0].toUpperCase() + car.make.slice(1)}${car.model[0].toUpperCase() + car.model.slice(1)}${car.year}`; // Generate document ID
    console.log("docID", docId)
    const docRef = doc(db, "Maintenance", docId); // Replace 'carMaintenance' with your collection name

    try {
      const docSnap = await getDoc(docRef);
      console.log("Doc snap", docSnap.data)
      if (docSnap.exists()) {
        // Document exists
        setMaintenanceData(docSnap.data().data); // Assuming `data` contains an array of maintenance records
      } else {
        // Document does not exist
        console.log("No maintenance data found for this car. Let's add it to the database");
        try{
          if(maintenanceDataFile) {
            setMaintenanceData(maintenanceDataFile);
            setLoading(false);
            return
          }
        } catch (error: any) {
          setLoading(false);
        }
      }
    } catch (err) {
      console.error("Error fetching maintenance data:", err);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
  }, []);


  const openModal = (record: MaintenanceRecord) => {
    setSElectedRecord(record);
    setModalVisible(true);
    console.log(car?.make, car?.model)
  };
  const closeModal = () => {
    setModalVisible(false);
    setSElectedRecord(null);
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
