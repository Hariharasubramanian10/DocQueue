export enum AppointmentStatus {
  WAITING = 'WAITING',
  IN_CONSULT = 'IN_CONSULT',
  DONE = 'DONE'
}

export interface VisitNote {
  symptoms: string;
  diagnosis: string;
  prescription: string;
  timestamp: string;
}

export interface Appointment {
  id: string;
  queueNumber: number;
  patientName: string;
  phone: string;
  reason: string;
  status: AppointmentStatus;
  createdAt: string;
  visitNotes?: VisitNote;
  doctorId: string; // Link appointment to specific doctor (optional, but good for multi-user)
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  username: string; // For login
  password?: string; // Security addition
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}