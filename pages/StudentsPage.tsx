import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { Student } from '../types';
import Header from '../components/Header';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import StudentForm from '../components/StudentForm';
import { ICONS } from '../constants';
import Card from '../components/ui/Card';

const StudentsPage: React.FC = () => {
  const { students, classes, deleteStudent } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddNew = () => {
    setStudentToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  const handleDelete = (studentId: string) => {
    if (window.confirm('この生徒を本当に削除しますか？')) {
      deleteStudent(studentId);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s =>
      `${s.lastName} ${s.firstName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${s.lastNameKana} ${s.firstNameKana}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const columns = [
    { header: '氏名', accessor: (s: Student) => `${s.lastName} ${s.firstName}` },
    { header: 'カナ', accessor: (s: Student) => `${s.lastNameKana} ${s.firstNameKana}` },
    { header: '受講クラス', accessor: (s: Student) => s.classIds.map(id => classes.find(c => c.id === id)?.name || 'N/A').join(', ') },
    { header: '連絡先', accessor: (s: Student) => s.email },
    { header: '入会日', accessor: (s: Student) => s.enrollmentDate },
    {
      header: '操作',
      accessor: (s: Student) => (
        <div className="flex space-x-2">
          <button onClick={() => handleEdit(s)} className="text-blue-600 hover:text-blue-800 p-1">{ICONS.edit}</button>
          <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800 p-1">{ICONS.trash}</button>
        </div>
      )
    },
  ];

  return (
    <div className="container mx-auto p-6 sm:p-8">
      <Header title="生徒管理">
        <Button onClick={handleAddNew} variant="primary">
          <span className="mr-2">{ICONS.plus}</span>
          新規生徒を追加
        </Button>
      </Header>
      <Card>
        <div className="mb-4">
            <input
                type="text"
                placeholder="生徒名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            />
        </div>
        <Table columns={columns} data={filteredStudents} />
      </Card>
      <StudentForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} studentToEdit={studentToEdit} />
    </div>
  );
};

export default StudentsPage;