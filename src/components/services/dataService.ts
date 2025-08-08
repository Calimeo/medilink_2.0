
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  DOCTORS: 'doctors',
  APPOINTMENTS: 'appointments',
  MEDICINES: 'medicines',
  CART: 'cart',
  USER_PROFILE: 'user_profile',
  ORDER_HISTORY: 'order_history',
  PRESCRIPTIONS: 'prescriptions',
  MEDICAL_RECORDS: 'medical_records',
};

// Types
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  hospital: string;
  availability: string;
  consultationFee: string;
  image?: string;
  bio?: string;
  education?: string[];
  languages?: string[];
  isAvailable?: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  hospital: string;
  type: 'in-person' | 'video-call';
  notes?: string;
  symptoms?: string;
  createdAt: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  price: number;
  category: string;
  inStock: boolean;
  description: string;
  manufacturer: string;
  requiresPrescription: boolean;
  dosage?: string;
  sideEffects?: string[];
  stockQuantity?: number;
}

export interface CartItem extends Medicine {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryAddress: string;
  paymentMethod: string;
  prescriptionRequired: boolean;
  prescriptionUploaded?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
}

export interface MedicalRecord {
  id: string;
  doctorId: string;
  doctorName: string;
  appointmentId: string;
  date: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  prescriptions: string[];
  followUpRequired: boolean;
  followUpDate?: string;
  notes: string;
}

// Default data
const defaultDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    rating: 4.8,
    experience: '15 years',
    hospital: 'City General Hospital',
    availability: 'Available Today',
    consultationFee: '$150',
    bio: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
    education: ['MD from Harvard Medical School', 'Residency at Johns Hopkins'],
    languages: ['English', 'Spanish'],
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Dermatology',
    rating: 4.9,
    experience: '12 years',
    hospital: 'Metro Medical Center',
    availability: 'Available Tomorrow',
    consultationFee: '$120',
    bio: 'Board-certified dermatologist with expertise in skin cancer detection and cosmetic procedures.',
    education: ['MD from Stanford University', 'Dermatology Fellowship at UCSF'],
    languages: ['English', 'Mandarin'],
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrics',
    rating: 4.7,
    experience: '10 years',
    hospital: 'Children\'s Hospital',
    availability: 'Available Today',
    consultationFee: '$100',
    bio: 'Pediatrician dedicated to providing comprehensive care for children and adolescents.',
    education: ['MD from UCLA', 'Pediatric Residency at Children\'s Hospital LA'],
    languages: ['English', 'Spanish', 'Portuguese'],
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Neurology',
    rating: 4.9,
    experience: '20 years',
    hospital: 'Neurological Institute',
    availability: 'Available Next Week',
    consultationFee: '$200',
    bio: 'Leading neurologist specializing in brain disorders and neurological conditions.',
    education: ['MD from Mayo Clinic', 'Neurology Fellowship at Cleveland Clinic'],
    languages: ['English'],
    isAvailable: false,
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    specialty: 'Orthopedics',
    rating: 4.6,
    experience: '8 years',
    hospital: 'Sports Medicine Clinic',
    availability: 'Available Today',
    consultationFee: '$180',
    bio: 'Orthopedic surgeon specializing in sports injuries and joint replacement.',
    education: ['MD from University of Michigan', 'Orthopedic Surgery Residency at Mayo Clinic'],
    languages: ['English', 'French'],
    isAvailable: true,
  },
];

const defaultMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    price: 12.99,
    category: 'Pain Relief',
    inStock: true,
    description: 'Effective pain relief and fever reducer',
    manufacturer: 'PharmaCorp',
    requiresPrescription: false,
    dosage: '1-2 tablets every 4-6 hours',
    sideEffects: ['Nausea', 'Stomach upset'],
    stockQuantity: 150,
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    genericName: 'Amoxicillin',
    price: 24.50,
    category: 'Antibiotics',
    inStock: true,
    description: 'Antibiotic for bacterial infections',
    manufacturer: 'MediLab',
    requiresPrescription: true,
    dosage: '1 capsule 3 times daily',
    sideEffects: ['Diarrhea', 'Nausea', 'Skin rash'],
    stockQuantity: 75,
  },
  {
    id: '3',
    name: 'Vitamin D3 1000IU',
    genericName: 'Cholecalciferol',
    price: 18.75,
    category: 'Vitamins',
    inStock: true,
    description: 'Essential vitamin for bone health',
    manufacturer: 'HealthPlus',
    requiresPrescription: false,
    dosage: '1 tablet daily with food',
    sideEffects: ['Rare: Kidney stones with excessive use'],
    stockQuantity: 200,
  },
  {
    id: '4',
    name: 'Ibuprofen 400mg',
    genericName: 'Ibuprofen',
    price: 15.30,
    category: 'Pain Relief',
    inStock: false,
    description: 'Anti-inflammatory pain reliever',
    manufacturer: 'PharmaCorp',
    requiresPrescription: false,
    dosage: '1 tablet every 6-8 hours',
    sideEffects: ['Stomach irritation', 'Dizziness'],
    stockQuantity: 0,
  },
  {
    id: '5',
    name: 'Metformin 500mg',
    genericName: 'Metformin HCl',
    price: 32.00,
    category: 'Diabetes',
    inStock: true,
    description: 'Diabetes medication for blood sugar control',
    manufacturer: 'DiabetCare',
    requiresPrescription: true,
    dosage: '1 tablet twice daily with meals',
    sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste'],
    stockQuantity: 100,
  },
];

// Data Service Class
class DataService {
  // Initialize default data if not exists
  async initializeData() {
    try {
      const existingDoctors = await this.getDoctors();
      if (existingDoctors.length === 0) {
        await this.saveDoctors(defaultDoctors);
      }

      const existingMedicines = await this.getMedicines();
      if (existingMedicines.length === 0) {
        await this.saveMedicines(defaultMedicines);
      }

      console.log('Data service initialized successfully');
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }

  // Generic storage methods
  private async saveData(key: string, data: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  }

  private async getData<T>(key: string, defaultValue: T[] = []): Promise<T[]> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return defaultValue;
    }
  }

  // Doctor methods
  async getDoctors(): Promise<Doctor[]> {
    return this.getData<Doctor>(STORAGE_KEYS.DOCTORS);
  }

  async saveDoctors(doctors: Doctor[]): Promise<void> {
    return this.saveData(STORAGE_KEYS.DOCTORS, doctors);
  }

  async getDoctorById(id: string): Promise<Doctor | null> {
    const doctors = await this.getDoctors();
    return doctors.find(doctor => doctor.id === id) || null;
  }

  async searchDoctors(query: string, specialty?: string): Promise<Doctor[]> {
    const doctors = await this.getDoctors();
    return doctors.filter(doctor => {
      const matchesQuery = doctor.name.toLowerCase().includes(query.toLowerCase()) ||
                          doctor.specialty.toLowerCase().includes(query.toLowerCase());
      const matchesSpecialty = !specialty || specialty === 'All' || doctor.specialty === specialty;
      return matchesQuery && matchesSpecialty;
    });
  }

  // Appointment methods
  async getAppointments(): Promise<Appointment[]> {
    return this.getData<Appointment>(STORAGE_KEYS.APPOINTMENTS);
  }

  async saveAppointments(appointments: Appointment[]): Promise<void> {
    return this.saveData(STORAGE_KEYS.APPOINTMENTS, appointments);
  }

  async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
    const appointments = await this.getAppointments();
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    appointments.push(newAppointment);
    await this.saveAppointments(appointments);
    console.log('Appointment created:', newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | null> {
    const appointments = await this.getAppointments();
    const index = appointments.findIndex(apt => apt.id === id);
    if (index === -1) return null;

    appointments[index] = { ...appointments[index], ...updates };
    await this.saveAppointments(appointments);
    console.log('Appointment updated:', appointments[index]);
    return appointments[index];
  }

  async cancelAppointment(id: string): Promise<boolean> {
    const result = await this.updateAppointment(id, { status: 'cancelled' });
    return result !== null;
  }

  async getUpcomingAppointments(): Promise<Appointment[]> {
    const appointments = await this.getAppointments();
    return appointments.filter(apt => apt.status === 'upcoming');
  }

  async getPastAppointments(): Promise<Appointment[]> {
    const appointments = await this.getAppointments();
    return appointments.filter(apt => apt.status === 'completed' || apt.status === 'cancelled');
  }

  // Medicine methods
  async getMedicines(): Promise<Medicine[]> {
    return this.getData<Medicine>(STORAGE_KEYS.MEDICINES);
  }

  async saveMedicines(medicines: Medicine[]): Promise<void> {
    return this.saveData(STORAGE_KEYS.MEDICINES, medicines);
  }

  async getMedicineById(id: string): Promise<Medicine | null> {
    const medicines = await this.getMedicines();
    return medicines.find(medicine => medicine.id === id) || null;
  }

  async searchMedicines(query: string, category?: string): Promise<Medicine[]> {
    const medicines = await this.getMedicines();
    return medicines.filter(medicine => {
      const matchesQuery = medicine.name.toLowerCase().includes(query.toLowerCase()) ||
                          medicine.genericName.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || category === 'All' || medicine.category === category;
      return matchesQuery && matchesCategory;
    });
  }

  // Cart methods
  async getCart(): Promise<CartItem[]> {
    return this.getData<CartItem>(STORAGE_KEYS.CART);
  }

  async saveCart(cart: CartItem[]): Promise<void> {
    return this.saveData(STORAGE_KEYS.CART, cart);
  }

  async addToCart(medicine: Medicine, quantity: number = 1): Promise<CartItem[]> {
    const cart = await this.getCart();
    const existingItem = cart.find(item => item.id === medicine.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...medicine, quantity });
    }
    
    await this.saveCart(cart);
    console.log(`Added ${medicine.name} to cart (quantity: ${quantity})`);
    return cart;
  }

  async removeFromCart(medicineId: string): Promise<CartItem[]> {
    const cart = await this.getCart();
    const updatedCart = cart.filter(item => item.id !== medicineId);
    await this.saveCart(updatedCart);
    console.log(`Removed medicine ${medicineId} from cart`);
    return updatedCart;
  }

  async updateCartItemQuantity(medicineId: string, quantity: number): Promise<CartItem[]> {
    const cart = await this.getCart();
    const item = cart.find(item => item.id === medicineId);
    
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(medicineId);
      } else {
        item.quantity = quantity;
        await this.saveCart(cart);
        console.log(`Updated cart item ${medicineId} quantity to ${quantity}`);
      }
    }
    
    return cart;
  }

  async clearCart(): Promise<void> {
    await this.saveCart([]);
    console.log('Cart cleared');
  }

  async getCartTotal(): Promise<{ items: number; price: number }> {
    const cart = await this.getCart();
    const items = cart.reduce((total, item) => total + item.quantity, 0);
    const price = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    return { items, price };
  }

  // Order methods
  async getOrderHistory(): Promise<Order[]> {
    return this.getData<Order>(STORAGE_KEYS.ORDER_HISTORY);
  }

  async saveOrderHistory(orders: Order[]): Promise<void> {
    return this.saveData(STORAGE_KEYS.ORDER_HISTORY, orders);
  }

  async createOrder(orderData: Omit<Order, 'id' | 'orderDate'>): Promise<Order> {
    const orders = await this.getOrderHistory();
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      orderDate: new Date().toISOString(),
    };
    orders.unshift(newOrder); // Add to beginning for recent first
    await this.saveOrderHistory(orders);
    
    // Clear cart after successful order
    await this.clearCart();
    
    console.log('Order created:', newOrder);
    return newOrder;
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
    const orders = await this.getOrderHistory();
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
      order.status = status;
      await this.saveOrderHistory(orders);
      console.log(`Order ${orderId} status updated to ${status}`);
      return order;
    }
    
    return null;
  }

  // User Profile methods
  async getUserProfile(): Promise<UserProfile | null> {
    const profiles = await this.getData<UserProfile>(STORAGE_KEYS.USER_PROFILE);
    return profiles.length > 0 ? profiles[0] : null;
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    return this.saveData(STORAGE_KEYS.USER_PROFILE, [profile]);
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const profile = await this.getUserProfile();
    if (profile) {
      const updatedProfile = { ...profile, ...updates };
      await this.saveUserProfile(updatedProfile);
      console.log('User profile updated');
      return updatedProfile;
    }
    return null;
  }

  // Medical Records methods
  async getMedicalRecords(): Promise<MedicalRecord[]> {
    return this.getData<MedicalRecord>(STORAGE_KEYS.MEDICAL_RECORDS);
  }

  async saveMedicalRecords(records: MedicalRecord[]): Promise<void> {
    return this.saveData(STORAGE_KEYS.MEDICAL_RECORDS, records);
  }

  async createMedicalRecord(record: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord> {
    const records = await this.getMedicalRecords();
    const newRecord: MedicalRecord = {
      ...record,
      id: Date.now().toString(),
    };
    records.unshift(newRecord); // Add to beginning for recent first
    await this.saveMedicalRecords(records);
    console.log('Medical record created:', newRecord);
    return newRecord;
  }

  async getMedicalRecordsByDoctor(doctorId: string): Promise<MedicalRecord[]> {
    const records = await this.getMedicalRecords();
    return records.filter(record => record.doctorId === doctorId);
  }

  // Analytics and Statistics
  async getAppointmentStats(): Promise<{
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  }> {
    const appointments = await this.getAppointments();
    return {
      total: appointments.length,
      upcoming: appointments.filter(apt => apt.status === 'upcoming').length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
    };
  }

  async getOrderStats(): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
  }> {
    const orders = await this.getOrderHistory();
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      totalOrders: orders.length,
      totalSpent,
      averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0,
    };
  }

  // Data export/import for backup
  async exportAllData(): Promise<string> {
    const data = {
      doctors: await this.getDoctors(),
      appointments: await this.getAppointments(),
      medicines: await this.getMedicines(),
      cart: await this.getCart(),
      orderHistory: await this.getOrderHistory(),
      userProfile: await this.getUserProfile(),
      medicalRecords: await this.getMedicalRecords(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  async importAllData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.doctors) await this.saveDoctors(data.doctors);
      if (data.appointments) await this.saveAppointments(data.appointments);
      if (data.medicines) await this.saveMedicines(data.medicines);
      if (data.cart) await this.saveCart(data.cart);
      if (data.orderHistory) await this.saveOrderHistory(data.orderHistory);
      if (data.userProfile) await this.saveUserProfile(data.userProfile);
      if (data.medicalRecords) await this.saveMedicalRecords(data.medicalRecords);
      
      console.log('Data imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Clear all data (for testing or reset)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      console.log('All data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

// Export singleton instance
export const dataService = new DataService();
