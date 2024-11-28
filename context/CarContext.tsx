import React, { createContext, useContext, useState } from 'react';
import CarContextType from '@/types/CarContextType'; // Import the type
import Vehicle from '@/types/Vehicle'; // Import Vehicle

const CarContext = createContext<CarContextType | undefined>(undefined);

export const useCarContext = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCarContext must be used within a CarProvider');
  }
  return context;
};

export const CarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [car, setCar] = useState<Vehicle | null>(null);

  return (
    <CarContext.Provider value={{ car, setCar }}>
      {children}
    </CarContext.Provider>
  );
};
