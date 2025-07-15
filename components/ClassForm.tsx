import React, { useState, useEffect } from 'react';
import { DanceClass } from '../types';
import { useData } from '../hooks/useData';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Modal from './ui/Modal';

interface ClassFormProps {
  isOpen: boolean;
  onClose: () => void;
  classToEdit?: DanceClass | null;
}

const initialClassState: Omit<DanceClass, 'id'> = {
  name: '', instructor: '', dayOfWeek: 'Monday', time: '', location: '',
  capacity: 10, level: '', monthlyFee: 0
};

const ClassForm: React.FC<ClassFormProps> = ({ isOpen, onClose, classToEdit }) => {
  const [danceClass, setDanceClass] = useState(initialClassState);
  const { addClass, updateClass } = useData();

  useEffect(() => {
    if (classToEdit) {
      setDanceClass(classToEdit);
    } else {
      setDanceClass(initialClassState);
    }
  }, [classToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setDanceClass(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (classToEdit) {
      updateClass(danceClass as DanceClass);
    } else {
      addClass(danceClass);
    }
    onClose();
  };

  const dayOfWeekOptions = [
      { value: 'Monday', label: '月曜日' }, { value: 'Tuesday', label: '火曜日' },
      { value: 'Wednesday', label: '水曜日' }, { value: 'Thursday', label: '木曜日' },
      { value: 'Friday', label: '金曜日' }, { value: 'Saturday', label: '土曜日' },
      { value: 'Sunday', label: '日曜日' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={classToEdit ? 'クラス情報の編集' : '新規クラスの登録'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="クラス名" id="name" name="name" value={danceClass.name} onChange={handleChange} required className="md:col-span-2"/>
          <Input label="担当講師" id="instructor" name="instructor" value={danceClass.instructor} onChange={handleChange} required />
          <Select label="曜日" id="dayOfWeek" name="dayOfWeek" value={danceClass.dayOfWeek} onChange={handleChange} options={dayOfWeekOptions} />
          <Input label="時間" id="time" name="time" type="text" placeholder="例: 17:00-18:00" value={danceClass.time} onChange={handleChange} required />
          <Input label="場所" id="location" name="location" value={danceClass.location} onChange={handleChange} required />
          <Input label="定員" id="capacity" name="capacity" type="number" value={danceClass.capacity} onChange={handleChange} required />
          <Input label="対象レベル" id="level" name="level" value={danceClass.level} onChange={handleChange} />
          <Input label="月謝金額" id="monthlyFee" name="monthlyFee" type="number" value={danceClass.monthlyFee} onChange={handleChange} required />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>キャンセル</Button>
          <Button type="submit">{classToEdit ? '更新' : '登録'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ClassForm;
