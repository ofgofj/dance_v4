import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { Student, DanceClass, AttendanceRecord, Payment, Parent, Admin } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, where, getDocs, writeBatch } from 'firebase/firestore';

// Helper to convert Firestore doc to object with ID
const fromDoc = <T,>(d: any): T => ({ ...d.data(), id: d.id } as T);

interface DataContextType {
  students: Student[];
  classes: DanceClass[];
  attendance: AttendanceRecord[];
  payments: Payment[];
  parents: Parent[];
  admins: Admin[];
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (student: Student) => Promise<void>;
  deleteStudent: (studentId: string) => Promise<void>;
  addClass: (danceClass: Omit<DanceClass, 'id'>) => Promise<void>;
  updateClass: (danceClass: DanceClass) => Promise<void>;
  deleteClass: (classId: string) => Promise<void>;
  updateParent: (parent: Parent) => Promise<void>;
  deleteParent: (parentId: string) => Promise<void>;
  updateAdmin: (admin: Admin) => Promise<void>;
  deleteAdmin: (adminId: string) => Promise<void>;
  getStudentsInClass: (classId: string) => Student[];
  getAttendance: (classId: string, date: string) => AttendanceRecord[];
  updateAttendance: (record: Omit<AttendanceRecord, 'id'>) => Promise<void>;
  getPayments: (year: number, month: number) => (Payment & { studentName: string })[];
  updatePaymentStatus: (studentId: string, year: number, month: number, paid: boolean) => Promise<void>;
  loading: boolean;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<DanceClass[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const listeners = [
      onSnapshot(collection(db, 'students'), snapshot => setStudents(snapshot.docs.map(d => fromDoc<Student>(d)))),
      onSnapshot(collection(db, 'classes'), snapshot => setClasses(snapshot.docs.map(d => fromDoc<DanceClass>(d)))),
      onSnapshot(collection(db, 'attendance'), snapshot => setAttendance(snapshot.docs.map(d => fromDoc<AttendanceRecord>(d)))),
      onSnapshot(collection(db, 'payments'), snapshot => setPayments(snapshot.docs.map(d => fromDoc<Payment>(d)))),
      onSnapshot(collection(db, 'parents'), snapshot => setParents(snapshot.docs.map(d => fromDoc<Parent>(d)))),
      onSnapshot(collection(db, 'admins'), snapshot => setAdmins(snapshot.docs.map(d => fromDoc<Admin>(d)))),
    ];
    
    // Simple loading state check.
    // In a real app, you might use Promise.all with getDocs for initial load.
    const timer = setTimeout(() => setLoading(false), 1500);

    return () => {
        listeners.forEach(unsubscribe => unsubscribe());
        clearTimeout(timer);
    };
  }, []);

  const addStudent = useCallback(async (student: Omit<Student, 'id'>) => {
    const newStudentRef = await addDoc(collection(db, 'students'), student);
    if (student.parentId) {
      const parentRef = doc(db, 'parents', student.parentId);
      const parentDoc = parents.find(p => p.id === student.parentId);
      if(parentDoc){
          const updatedStudentIds = [...parentDoc.studentIds, newStudentRef.id];
          await updateDoc(parentRef, { studentIds: updatedStudentIds });
      }
    }
  }, [parents]);

  const updateStudent = useCallback(async (updatedStudent: Student) => {
    const { id, ...studentData } = updatedStudent;
    const studentRef = doc(db, 'students', id);
    await updateDoc(studentRef, studentData);

    const originalStudent = students.find(s => s.id === id);
    const oldParentId = originalStudent?.parentId;
    const newParentId = updatedStudent.parentId;

    if (oldParentId !== newParentId) {
        const batch = writeBatch(db);
        // Remove from old parent
        if (oldParentId) {
            const oldParentRef = doc(db, 'parents', oldParentId);
            const oldParentDoc = parents.find(p => p.id === oldParentId);
            if(oldParentDoc) {
                batch.update(oldParentRef, { studentIds: oldParentDoc.studentIds.filter(sid => sid !== id) });
            }
        }
        // Add to new parent
        if (newParentId) {
            const newParentRef = doc(db, 'parents', newParentId);
            const newParentDoc = parents.find(p => p.id === newParentId);
             if(newParentDoc) {
                batch.update(newParentRef, { studentIds: [...newParentDoc.studentIds, id] });
            }
        }
        await batch.commit();
    }
  }, [students, parents]);

  const deleteStudent = useCallback(async (studentId: string) => {
    const studentToDelete = students.find(s => s.id === studentId);
    if (!studentToDelete) return;

    await deleteDoc(doc(db, 'students', studentId));

    if (studentToDelete.parentId) {
        const parentRef = doc(db, 'parents', studentToDelete.parentId);
        const parentDoc = parents.find(p => p.id === studentToDelete.parentId);
        if(parentDoc) {
            const updatedStudentIds = parentDoc.studentIds.filter(id => id !== studentId);
            await updateDoc(parentRef, { studentIds: updatedStudentIds });
        }
    }
  }, [students, parents]);
  
  const addClass = async (danceClass: Omit<DanceClass, 'id'>) => {
    await addDoc(collection(db, 'classes'), danceClass);
  };
  const updateClass = async (danceClass: DanceClass) => {
    const { id, ...classData } = danceClass;
    await updateDoc(doc(db, 'classes', id), classData);
  };
  const deleteClass = async (classId: string) => {
    await deleteDoc(doc(db, 'classes', classId));
    // Also remove this classId from all students
    const batch = writeBatch(db);
    students.forEach(s => {
        if(s.classIds.includes(classId)) {
            const studentRef = doc(db, 'students', s.id);
            batch.update(studentRef, { classIds: s.classIds.filter(id => id !== classId) });
        }
    });
    await batch.commit();
  };

  const updateParent = async (parent: Parent) => {
    const { id, ...parentData } = parent;
    await updateDoc(doc(db, 'parents', id), parentData);
  };
  const deleteParent = async (parentId: string) => {
    // Note: This only deletes the Firestore record, not the Firebase Auth user.
    // In a real app, this should be handled by a backend function.
    await deleteDoc(doc(db, 'parents', parentId));
    // Unassign students from this parent
    const batch = writeBatch(db);
    students.forEach(s => {
        if(s.parentId === parentId) {
            const studentRef = doc(db, 'students', s.id);
            batch.update(studentRef, { parentId: '' });
        }
    });
    await batch.commit();
  };

  const updateAdmin = async (admin: Admin) => {
     const { id, ...adminData } = admin;
     await updateDoc(doc(db, 'admins', id), adminData);
  };
  const deleteAdmin = async (adminId: string) => {
    if(admins.length <= 1) {
        alert("最後の管理者は削除できません。");
        return;
    }
    await deleteDoc(doc(db, 'admins', adminId));
  };
  
  const getStudentsInClass = useCallback((classId: string) => {
    return students.filter(s => s.classIds.includes(classId));
  }, [students]);

  const getAttendance = useCallback((classId: string, date: string) => {
    return attendance.filter(a => a.classId === classId && a.date === date);
  }, [attendance]);
  
  const updateAttendance = useCallback(async (record: Omit<AttendanceRecord, 'id'>) => {
    const q = query(collection(db, 'attendance'), 
        where("studentId", "==", record.studentId), 
        where("classId", "==", record.classId), 
        where("date", "==", record.date)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const existingDocRef = querySnapshot.docs[0].ref;
        await updateDoc(existingDocRef, { status: record.status });
    } else {
        await addDoc(collection(db, 'attendance'), record);
    }
  }, []);

  const getPayments = useCallback((year: number, month: number) => {
    return students.map(student => {
      const payment = payments.find(p => p.studentId === student.id && p.year === year && p.month === month);
      const studentClasses = classes.filter(c => student.classIds.includes(c.id));
      const totalFee = studentClasses.reduce((sum, c) => sum + c.monthlyFee, 0);

      return {
        id: payment?.id,
        studentId: student.id,
        studentName: `${student.lastName} ${student.firstName}`,
        year,
        month,
        amount: totalFee,
        paid: payment ? payment.paid : false,
        paymentDate: payment?.paymentDate
      };
    });
  }, [students, classes, payments]);
  
  const updatePaymentStatus = useCallback(async (studentId: string, year: number, month: number, paid: boolean) => {
      const q = query(collection(db, "payments"), 
        where("studentId", "==", studentId), 
        where("year", "==", year), 
        where("month", "==", month));
      
      const querySnapshot = await getDocs(q);

      const studentClasses = classes.filter(c => students.find(s => s.id === studentId)?.classIds.includes(c.id));
      const amount = studentClasses.reduce((sum, c) => sum + c.monthlyFee, 0);

      const newPaymentData = {
          studentId,
          year,
          month,
          amount,
          paid,
          paymentDate: paid ? new Date().toISOString().split('T')[0] : ''
      };

      if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, newPaymentData);
      } else {
          await addDoc(collection(db, 'payments'), newPaymentData);
      }
  }, [classes, students]);

  const value = useMemo(() => ({
    students, classes, attendance, payments, parents, admins,
    addStudent, updateStudent, deleteStudent,
    addClass, updateClass, deleteClass,
    updateParent, deleteParent,
    updateAdmin, deleteAdmin,
    getStudentsInClass, getAttendance, updateAttendance,
    getPayments, updatePaymentStatus,
    loading
  }), [students, classes, attendance, payments, parents, admins, addStudent, updateStudent, deleteStudent, addClass, updateClass, deleteClass, updateParent, deleteParent, updateAdmin, deleteAdmin, getStudentsInClass, getAttendance, updateAttendance, getPayments, updatePaymentStatus, loading]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};