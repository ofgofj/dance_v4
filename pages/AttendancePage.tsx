import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { AttendanceStatus } from '../types';
import Header from '../components/Header';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

const AttendancePage: React.FC = () => {
  const { classes, getStudentsInClass, getAttendance, updateAttendance } = useData();
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const studentsInClass = useMemo(() => getStudentsInClass(selectedClassId), [getStudentsInClass, selectedClassId]);
  const attendanceRecords = useMemo(() => getAttendance(selectedClassId, selectedDate), [getAttendance, selectedClassId, selectedDate]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    updateAttendance({
      studentId,
      classId: selectedClassId,
      date: selectedDate,
      status
    });
  };

  const getStudentStatus = (studentId: string) => {
    const record = attendanceRecords.find(a => a.studentId === studentId);
    return record ? record.status : undefined;
  };

  const classOptions = classes.map(c => ({ value: c.id, label: c.name }));
  
  return (
    <div className="container mx-auto p-6 sm:p-8">
      <Header title="出欠管理" />
      <Card>
        <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b">
          <div className="flex-1 min-w-[200px]">
             <label htmlFor="date-select" className="block text-sm font-medium text-gray-700 mb-1">日付</label>
             <input
                id="date-select"
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              />
          </div>
          <div className="flex-1 min-w-[200px]">
            {classes.length > 0 ? (
                <Select
                  label="クラス"
                  id="class-select"
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                  options={classOptions}
                />
            ) : <p className="text-gray-500 mt-7">まずクラスを登録してください。</p>}
          </div>
        </div>
        
        {selectedClassId ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">{classes.find(c => c.id === selectedClassId)?.name} - {selectedDate}</h3>
            <div className="space-y-3">
              {studentsInClass.length > 0 ? studentsInClass.map(student => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{student.lastName} {student.firstName}</p>
                  <div className="flex gap-2 flex-wrap">
                    {Object.values(AttendanceStatus).map(status => (
                        <Button 
                            key={status}
                            size="sm"
                            variant={getStudentStatus(student.id) === status ? 'primary' : 'secondary'}
                            onClick={() => handleStatusChange(student.id, status)}
                        >
                           {status}
                        </Button>
                    ))}
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-4">このクラスには生徒が登録されていません。</p>
              )}
            </div>
          </div>
        ) : (
             <p className="text-gray-500 text-center py-4">クラスを選択してください。</p>
        )}
      </Card>
    </div>
  );
};

export default AttendancePage;