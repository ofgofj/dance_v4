export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  parentName?: string;
  parentContact?: string;
  enrollmentDate: string;
  classIds: string[];
  notes?: string;
  parentId?: string;
}

export interface DanceClass {
  id: string;
  name: string;
  instructor: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  time: string;
  location: string;
  capacity: number;
  level: string;
  monthlyFee: number;
}

export enum AttendanceStatus {
  Present = '出席',
  Absent = '欠席',
  Late = '遅刻',
  EarlyLeave = '早退',
  Transfer = '振替',
}

export interface AttendanceRecord {
  id?: string; // Firestore document ID
  studentId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface Payment {
  id?: string; // Firestore document ID
  studentId: string;
  year: number;
  month: number;
  amount: number;
  paid: boolean;
  paymentDate?: string;
}

export interface Parent {
  id: string; // Corresponds to Firebase Auth UID
  name: string;
  email: string;
  studentIds: string[];
}

export interface Admin {
  id: string; // Corresponds to Firebase Auth UID
  name: string;
  email: string;
}