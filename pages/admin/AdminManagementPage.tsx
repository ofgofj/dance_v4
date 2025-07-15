import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Admin } from '../../types';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import AdminForm from '../../components/AdminForm';
import { ICONS } from '../../constants';
import Card from '../../components/ui/Card';

const AdminManagementPage: React.FC = () => {
  const { admins, deleteAdmin } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminToEdit, setAdminToEdit] = useState<Admin | null>(null);

  const handleAddNew = () => {
    setAdminToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (admin: Admin) => {
    setAdminToEdit(admin);
    setIsModalOpen(true);
  };

  const handleDelete = (adminId: string) => {
    if (window.confirm('この管理者を本当に削除しますか？')) {
      deleteAdmin(adminId);
    }
  };

  const columns = [
    { header: '管理者氏名', accessor: (a: Admin) => a.name },
    { header: 'メールアドレス', accessor: (a: Admin) => a.email },
    {
      header: '操作',
      accessor: (a: Admin) => (
        <div className="flex space-x-2">
          <button onClick={() => handleEdit(a)} className="text-blue-600 hover:text-blue-800 p-1">{ICONS.edit}</button>
          <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:text-red-800 p-1">{ICONS.trash}</button>
        </div>
      )
    },
  ];

  return (
    <div className="container mx-auto p-6 sm:p-8">
      <Header title="管理者設定">
        <Button onClick={handleAddNew} variant="primary">
          <span className="mr-2">{ICONS.plus}</span>
          新規管理者を追加
        </Button>
      </Header>
      <Card>
        <Table columns={columns} data={admins} />
      </Card>
      <AdminForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} adminToEdit={adminToEdit} />
    </div>
  );
};

export default AdminManagementPage;