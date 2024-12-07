import { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View, ActivityIndicator, ScrollView } from 'react-native'
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCarContext } from '@/context/CarContext';

const maintenanceDataFile = require('@/assets/hondapilot.json');


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

  const fetchMaintenanceData = async () => {
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
  useEffect(() => {
    fetchMaintenanceData();
  }, []);
  
 if(!car) {
  return <ThemedText>No car selected</ThemedText>
 }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={{fontSize: 20, fontWeight: 800}}>Service Reminders</ThemedText>
      <ThemedText style={{fontSize: 16}}>Current Mileage: {car.mileage}</ThemedText>
      {loading && <ActivityIndicator color="#00ff00" />}
        {error && <Text style={styles.errorText}>Error: {error}</Text>}
        {maintenanceData && (
          <ScrollView contentContainerStyle={styles.scrollView}>
            {maintenanceData.map((record, index) => ( // Assuming maintenanceData has a 'data' property containing an array
              <ThemedView key={index} style={styles.reminderContainer}>
                <ThemedText style={styles.dataText}>
                  {record.desc}
                </ThemedText>
                <ThemedText>
                  Due next: {car.mileage + record.due_mileage} miles
                </ThemedText>
              </ThemedView>
            ))} 
            {/* <Text style={styles.dataText}>{JSON.stringify(maintenanceData, null, 2)}</Text> */}
          </ScrollView>
        )}
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
    borderWidth: 1,
    borderRadius: 10,
    display: 'flex',
    gap: 10,
  }
});
