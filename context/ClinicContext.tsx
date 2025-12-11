import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Appointment, AppointmentStatus, Doctor, VisitNote } from '../types';

interface ClinicContextType {
  appointments: Appointment[]; // Filtered for current doctor
  doctor: Doctor | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  register: (name: string, specialty: string, username: string, password: string) => boolean;
  logout: () => void;
  addAppointment: (patientName: string, phone: string, reason: string) => void;
  updateStatus: (id: string, status: AppointmentStatus) => void;
  saveVisitNote: (id: string, note: VisitNote) => void;
  callNextPatient: () => void;
  getAppointment: (id: string) => Appointment | undefined;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- Auth State ---
  const [doctor, setDoctor] = useState<Doctor | null>(() => {
    const savedUser = localStorage.getItem('docqueue_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // --- Data State (All Appointments for System) ---
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('docqueue_appointments');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Persist Data ---
  useEffect(() => {
    localStorage.setItem('docqueue_appointments', JSON.stringify(allAppointments));
  }, [allAppointments]);

  // Persist User Session
  useEffect(() => {
    if (doctor) {
      localStorage.setItem('docqueue_current_user', JSON.stringify(doctor));
    } else {
      localStorage.removeItem('docqueue_current_user');
    }
  }, [doctor]);

  // --- Derived State (Filtered for Current Doctor) ---
  const appointments = useMemo(() => {
    if (!doctor) return [];
    // Only show appointments that belong to this doctor
    return allAppointments.filter(appt => appt.doctorId === doctor.id);
  }, [allAppointments, doctor]);

  // --- Auth Actions ---
  const register = (name: string, specialty: string, username: string, password: string): boolean => {
    const usersStr = localStorage.getItem('docqueue_users');
    const users: Doctor[] = usersStr ? JSON.parse(usersStr) : [];

    if (users.find(u => u.username === username)) {
      return false; // User exists
    }

    const newDoc: Doctor = {
      id: crypto.randomUUID(),
      name,
      specialty,
      username,
      password // Save password (in production, hash this!)
    };

    users.push(newDoc);
    localStorage.setItem('docqueue_users', JSON.stringify(users));
    
    // Auto login
    setDoctor(newDoc);
    return true;
  };

  const login = (username: string, password: string): boolean => {
    const usersStr = localStorage.getItem('docqueue_users');
    const users: Doctor[] = usersStr ? JSON.parse(usersStr) : [];
    
    // Check both username and password
    const foundUser = users.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      setDoctor(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setDoctor(null);
  };

  // --- Appointment Actions ---
  const addAppointment = (patientName: string, phone: string, reason: string) => {
    if (!doctor) return;

    // Queue number should probably be per-doctor or global? 
    // Usually per-doctor queue is better for this dashboard style.
    const doctorAppointments = allAppointments.filter(a => a.doctorId === doctor.id);
    const nextQueueNum = doctorAppointments.length > 0 
      ? Math.max(...doctorAppointments.map(a => a.queueNumber)) + 1 
      : 101;

    const newAppt: Appointment = {
      id: crypto.randomUUID(),
      queueNumber: nextQueueNum,
      patientName,
      phone,
      reason,
      status: AppointmentStatus.WAITING,
      createdAt: new Date().toISOString(),
      doctorId: doctor.id // Assign to current doctor
    };

    setAllAppointments(prev => [...prev, newAppt]);
  };

  const updateStatus = (id: string, status: AppointmentStatus) => {
    setAllAppointments(prev => prev.map(appt => 
      appt.id === id ? { ...appt, status } : appt
    ));
  };

  const saveVisitNote = (id: string, note: VisitNote) => {
    setAllAppointments(prev => prev.map(appt => 
      appt.id === id ? { ...appt, visitNotes: note } : appt
    ));
  };

  const callNextPatient = () => {
    const waiting = appointments
      .filter(a => a.status === AppointmentStatus.WAITING)
      .sort((a, b) => a.queueNumber - b.queueNumber);

    if (waiting.length > 0) {
      const nextId = waiting[0].id;
      updateStatus(nextId, AppointmentStatus.IN_CONSULT);
    }
  };

  const getAppointment = (id: string) => {
    // Ensure we only return if it belongs to the doctor (security/privacy)
    const appt = allAppointments.find(a => a.id === id);
    if (appt && doctor && appt.doctorId === doctor.id) {
        return appt;
    }
    return undefined;
  };

  return (
    <ClinicContext.Provider value={{ 
      appointments, 
      doctor, 
      isAuthenticated: !!doctor,
      login,
      register,
      logout,
      addAppointment, 
      updateStatus, 
      saveVisitNote, 
      callNextPatient,
      getAppointment
    }}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) throw new Error("useClinic must be used within a ClinicProvider");
  return context;
};