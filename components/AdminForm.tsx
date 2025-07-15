import React, { useState, useEffect } from 'react';
import { Admin } from '../types';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';

interface AdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  adminToEdit?: Admin | null;
}

const initialAdminState: Omit<Admin, 'id'> = {
  name: '',
  email: '',
};

const AdminForm: React.FC<AdminFormProps> = ({ isOpen, onClose, adminToEdit }) => {
  const [adminData, setAdminData] = useState(initialAdminState);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { updateAdmin } = useData();
  const { createAdminAccount } = useAuth();

  useEffect(() => {
    setError('');
    if (adminToEdit) {
      setAdminData({ name: adminToEdit.name, email: adminToEdit.email });
    } else {
      setAdminData(initialAdminState);
      setPassword('');
    }
  }, [adminToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
        if (adminToEdit) {
          // Update only name, email change is complex with auth
          await updateAdmin({ ...adminToEdit, name: adminData.name });
        } else {
          if (!password) {
            setError('新規登録の場合、パスワードは必須です。');
            return;
          }
          await createAdminAccount(adminData, password);
        }
        onClose();
    } catch(err: any) {
        console.error(err);
        setError(err.message || 'エラーが発生しました。');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={adminToEdit ? '管理者情報の編集' : '新規管理者の登録'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="管理者氏名" id="name" name="name" value={adminData.name} onChange={handleChange} required className="md:col-span-2" />
          <Input label="メールアドレス" id="email" name="email" type="email" value={adminData.email} onChange={handleChange} required disabled={!!adminToEdit} />
          {!adminToEdit && (
            <Input 
                label="パスワード" 
                id="password" 
                name="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
            />
          )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>キャンセル</Button>
          <Button type="submit">{adminToEdit ? '更新' : '登録'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminForm;