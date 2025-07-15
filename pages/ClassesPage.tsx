import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { DanceClass } from '../types';
import Header from '../components/Header';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import ClassForm from '../components/ClassForm';
import { ICONS } from '../constants';
import Card from '../components/ui/Card';

const ClassesPage: React.FC = () => {
  const { classes, deleteClass } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<DanceClass | null>(null);

  const handleAddNew = () => {
    setClassToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (danceClass: DanceClass) => {
    setClassToEdit(danceClass);
    setIsModalOpen(true);
  };

  const handleDelete = (classId: string) => {
    if (window.confirm('このクラスを本当に削除しますか？関連する生徒のクラス登録も解除されます。')) {
      deleteClass(classId);
    }
  };

  const dayOfWeekJapanese = {
    Monday: '月', Tuesday: '火', Wednesday: '水', Thursday: '木',
    Friday: '金', Saturday: '土', Sunday: '日'
  };

  const columns = [
    { header: 'クラス名', accessor: (c: DanceClass) => c.name },
    { header: '担当講師', accessor: (c: DanceClass) => c.instructor },
    { header: '曜日/時間', accessor: (c: DanceClass) => `${dayOfWeekJapanese[c.dayOfWeek]} / ${c.time}` },
    { header: '場所', accessor: (c: DanceClass) => c.location },
    { header: '月謝', accessor: (c: DanceClass) => `${c.monthlyFee.toLocaleString()}円` },
    { header: '定員', accessor: (c: DanceClass) => c.capacity },
    {
      header: '操作',
      accessor: (c: DanceClass) => (
        <div className="flex space-x-2">
          <button onClick={() => handleEdit(c)} className="text-blue-600 hover:text-blue-800 p-1">{ICONS.edit}</button>
          <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800 p-1">{ICONS.trash}</button>
        </div>
      )
    },
  ];

  return (
    <div className="container mx-auto p-6 sm:p-8">
      <Header title="クラス管理">
        <Button onClick={handleAddNew} variant="primary">
            <span className="mr-2">{ICONS.plus}</span>
            新規クラスを追加
        </Button>
      </Header>
      <Card>
        <Table columns={columns} data={classes} />
      </Card>
      <ClassForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} classToEdit={classToEdit} />
    </div>
  );
};

export default ClassesPage;