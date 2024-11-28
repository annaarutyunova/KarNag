import Vehicle from '@/types/Vehicle';
export default interface CarContextType {
  car: Vehicle | null;
  setCar: (car: Vehicle) => void;
}