import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { useData } from '../hooks/useData';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Modal from './ui/Modal';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: Student | null;
}

const initialStudentState: Omit<Student, 'id'> = {
  firstName: '', lastName: '', firstNameKana: '', lastNameKana: '', gender: 'other',
  birthDate: '', phone: '', email: '', address: '', parentName: '',
  parentContact: '', enrollmentDate: new Date().toISOString().split('T')[0], classIds: [], notes: '', parentId: ''
};

const StudentForm: React.FC<StudentFormProps> = ({ isOpen, onClose, studentToEdit }) => {
  const [student, setStudent] = useState(initialStudentState);
  const { addStudent, updateStudent, classes, parents } = useData();

  useEffect(() => {
    if (studentToEdit) {
      setStudent(studentToEdit);
    } else {
      setStudent(initialStudentState);
    }
  }, [studentToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudent(prev => ({ ...prev, [name]: value }));
  };
  
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    setStudent(prev => ({ ...prev, classIds: selectedIds }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentToEdit) {
      updateStudent(student as Student);
    } else {
      addStudent(student);
    }
    onClose();
  };
  
  const classOptions = classes.map(c => ({ value: c.id, label: c.name }));
  const parentOptions = [{value: '', label: '未割り当て'}, ...parents.map(p => ({ value: p.id, label: p.name }))]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={studentToEdit ? '生徒情報の編集' : '新規生徒の登録'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="姓" id="lastName" name="lastName" value={student.lastName} onChange={handleChange} required />
          <Input label="名" id="firstName" name="firstName" value={student.firstName} onChange={handleChange} required />
          <Input label="姓 (カナ)" id="lastNameKana" name="lastNameKana" value={student.lastNameKana} onChange={handleChange} required />
          <Input label="名 (カナ)" id="firstNameKana" name="firstNameKana" value={student.firstNameKana} onChange={handleChange} required />
          <Select label="性別" id="gender" name="gender" value={student.gender} onChange={handleChange} options={[
            { value: 'male', label: '男性' }, { value: 'female', label: '女性' }, { value: 'other', label: 'その他' }
          ]} />
          <Input label="生年月日" id="birthDate" name="birthDate" type="date" value={student.birthDate} onChange={handleChange} required />
          <Input label="電話番号" id="phone" name="phone" type="tel" value={student.phone} onChange={handleChange} />
          <Input label="メールアドレス" id="email" name="email" type="email" value={student.email} onChange={handleChange} />
          <Input label="住所" id="address" name="address" value={student.address} onChange={handleChange} className="md:col-span-2" />
          <Input label="保護者氏名 (任意)" id="parentName" name="parentName" value={student.parentName || ''} onChange={handleChange} />
          <Input label="保護者連絡先 (任意)" id="parentContact" name="parentContact" value={student.parentContact || ''} onChange={handleChange} />
          <Input label="入会日" id="enrollmentDate" name="enrollmentDate" type="date" value={student.enrollmentDate} onChange={handleChange} />
          
          <Select label="保護者アカウント" id="parentId" name="parentId" value={student.parentId || ''} onChange={handleChange} options={parentOptions} />

          <div>
             <label htmlFor="classIds" className="block text-sm font-medium text-gray-700 mb-1">受講クラス (複数選択可)</label>
             <select id="classIds" name="classIds" multiple value={student.classIds} onChange={handleClassChange} className="w-full h-32 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                {classOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
             </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">特記事項</label>
            <textarea id="notes" name="notes" value={student.notes || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>キャンセル</Button>
          <Button type="submit">{studentToEdit ? '更新' : '登録'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentForm;
