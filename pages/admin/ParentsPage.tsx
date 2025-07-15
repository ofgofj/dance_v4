import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { Parent } from '../../types';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import ParentForm from '../../components/ParentForm';
import { ICONS } from '../../constants';
import Card from '../../components/ui/Card';

const ParentsPage: React.FC = () => {
  const { parents, students, deleteParent } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parentToEdit, setParentToEdit] = useState<Parent | null>(null);

  const handleAddNew = () => {
    setParentToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (parent: Parent) => {
    setParentToEdit(parent);
    setIsModalOpen(true);
  };

  const handleDelete = (parentId: string) => {
    if (window.confirm('この保護者を本当に削除しますか？関連する生徒の割り当ても解除されます。')) {
      deleteParent(parentId);
    }
  };

  const getStudentsForParent = (parentId: string) => {
      return students
        .filter(s => s.parentId === parentId)
        .map(s => `${s.lastName} ${s.firstName}`)
        .join(', ');
  }

  const columns = [
    { header: '保護者氏名', accessor: (p: Parent) => p.name },
    { header: 'メールアドレス', accessor: (p: Parent) => p.email },
    { header: '担当生徒', accessor: (p: Parent) => getStudentsForParent(p.id) || 'なし' },
    {
      header: '操作',
      accessor: (p: Parent) => (
        <div className="flex space-x-2">
          <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800 p-1">{ICONS.edit}</button>
          <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800 p-1">{ICONS.trash}</button>
        </div>
      )
    },
  ];

  return (
    <div className="container mx-auto p-6 sm:p-8">
      <Header title="保護者管理">
        <Button onClick={handleAddNew} variant="primary">
          <span className="mr-2">{ICONS.plus}</span>
          新規保護者を追加
        </Button>
      </Header>
      <Card>
        <Table columns={columns} data={parents} />
      </Card>
      <ParentForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} parentToEdit={parentToEdit} />
    </div>
  );
};

export default ParentsPage;
