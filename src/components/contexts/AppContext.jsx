import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { dataService } from '../services/dataService';

// Initial state
const initialState = {
  doctors: [],
  appointments: [],
  medicines: [],
  cart: [],
  orderHistory: [],
  userProfile: null,
  loading: false,
  error: null,
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_DOCTORS':
      return { ...state, doctors: action.payload };
    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.payload };
    case 'SET_MEDICINES':
      return { ...state, medicines: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'SET_ORDER_HISTORY':
      return { ...state, orderHistory: action.payload };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map((apt) =>
          apt.id === action.payload.id
            ? { ...apt, ...action.payload.updates }
            : apt
        ),
      };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.medicine.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.medicine.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload.medicine, quantity: action.payload.quantity }],
        };
      }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_CART_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.id !== action.payload.medicineId),
        };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.medicineId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_ORDER':
      return {
        ...state,
        orderHistory: [action.payload, ...state.orderHistory],
      };
    default:
      return state;
  }
}

// Context
const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const withLoadingAndError = async (operation, skipLoading = false) => {
    try {
      if (!skipLoading) dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const result = await operation();
      return result;
    } catch (error) {
      console.error('Operation failed:', error);
      dispatch({ type: 'SET_ERROR', payload: error?.message || 'An error occurred' });
      return null;
    } finally {
      if (!skipLoading) dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Doctor actions
  const loadDoctors = async () => {
    await withLoadingAndError(async () => {
      const doctors = await dataService.getDoctors();
      dispatch({ type: 'SET_DOCTORS', payload: doctors });
    });
  };

  const searchDoctors = async (query, specialty) => {
    const result = await withLoadingAndError(() => dataService.searchDoctors(query, specialty), true);
    return result || [];
  };

  const getDoctorById = async (id) => {
    return await withLoadingAndError(() => dataService.getDoctorById(id), true);
  };

  // Appointment actions
  const loadAppointments = async () => {
    await withLoadingAndError(async () => {
      const appointments = await dataService.getAppointments();
      dispatch({ type: 'SET_APPOINTMENTS', payload: appointments });
    });
  };

  const createAppointment = async (appointment) => {
    const result = await withLoadingAndError(async () => {
      const newAppointment = await dataService.createAppointment(appointment);
      dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });
      return newAppointment;
    });
    return result;
  };

  const updateAppointment = async (id, updates) => {
    await withLoadingAndError(async () => {
      await dataService.updateAppointment(id, updates);
      dispatch({ type: 'UPDATE_APPOINTMENT', payload: { id, updates } });
    });
  };

  const cancelAppointment = async (id) => {
    await withLoadingAndError(async () => {
      await dataService.cancelAppointment(id);
      dispatch({ type: 'UPDATE_APPOINTMENT', payload: { id, updates: { status: 'cancelled' } } });
    });
  };

  // Medicine actions
  const loadMedicines = async () => {
    await withLoadingAndError(async () => {
      const medicines = await dataService.getMedicines();
      dispatch({ type: 'SET_MEDICINES', payload: medicines });
    });
  };

  const searchMedicines = async (query, category) => {
    const result = await withLoadingAndError(() => dataService.searchMedicines(query, category), true);
    return result || [];
  };

  const getMedicineById = async (id) => {
    return await withLoadingAndError(() => dataService.getMedicineById(id), true);
  };

  // Cart actions
  const loadCart = async () => {
    await withLoadingAndError(async () => {
      const cart = await dataService.getCart();
      dispatch({ type: 'SET_CART', payload: cart });
    }, true);
  };

  const addToCart = async (medicine, quantity = 1) => {
    await withLoadingAndError(async () => {
      await dataService.addToCart(medicine, quantity);
      dispatch({ type: 'ADD_TO_CART', payload: { medicine, quantity } });
    }, true);
  };

  const removeFromCart = async (medicineId) => {
    await withLoadingAndError(async () => {
      await dataService.removeFromCart(medicineId);
      dispatch({ type: 'REMOVE_FROM_CART', payload: medicineId });
    }, true);
  };

  const updateCartQuantity = async (medicineId, quantity) => {
    await withLoadingAndError(async () => {
      await dataService.updateCartItemQuantity(medicineId, quantity);
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { medicineId, quantity } });
    }, true);
  };

  const clearCart = async () => {
    await withLoadingAndError(async () => {
      await dataService.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    }, true);
  };

  const getCartTotal = () => {
    const items = state.cart.reduce((total, item) => total + item.quantity, 0);
    const price = state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    return { items, price };
  };

  // Order actions
  const loadOrderHistory = async () => {
    await withLoadingAndError(async () => {
      const orders = await dataService.getOrderHistory();
      dispatch({ type: 'SET_ORDER_HISTORY', payload: orders });
    });
  };

  const createOrder = async (orderData) => {
    const result = await withLoadingAndError(async () => {
      const newOrder = await dataService.createOrder(orderData);
      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      dispatch({ type: 'CLEAR_CART' });
      return newOrder;
    });
    return result;
  };

  // User profile actions
  const loadUserProfile = async () => {
    await withLoadingAndError(async () => {
      const profile = await dataService.getUserProfile();
      dispatch({ type: 'SET_USER_PROFILE', payload: profile });
    }, true);
  };

  const updateUserProfile = async (updates) => {
    await withLoadingAndError(async () => {
      await dataService.updateUserProfile(updates);
      if (state.userProfile) {
        dispatch({ type: 'SET_USER_PROFILE', payload: { ...state.userProfile, ...updates } });
      }
    });
  };

  // Utility
  const initializeApp = async () => {
    await withLoadingAndError(async () => {
      await dataService.initializeData();
      await Promise.all([
        loadDoctors(),
        loadAppointments(),
        loadMedicines(),
        loadCart(),
        loadOrderHistory(),
        loadUserProfile(),
      ]);
    });
  };

  const refreshData = async () => {
    await initializeApp();
  };

  useEffect(() => {
    initializeApp();
  }, []);

  const contextValue = {
    state,
    dispatch,
    loadDoctors,
    searchDoctors,
    getDoctorById,
    loadAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    loadMedicines,
    searchMedicines,
    getMedicineById,
    loadCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    loadOrderHistory,
    createOrder,
    loadUserProfile,
    updateUserProfile,
    initializeApp,
    refreshData,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
