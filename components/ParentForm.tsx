import React, { useState, useEffect } from 'react';
import { Parent } from '../types';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';

interface ParentFormProps {
  isOpen: boolean;
  onClose: () => void;
  parentToEdit?: Parent | null;
}

const initialParentState: Omit<Parent, 'id' | 'studentIds'> = {
  name: '',
  email: '',
};

const ParentForm: React.FC<ParentFormProps> = ({ isOpen, onClose, parentToEdit }) => {
  const [parentData, setParentData] = useState(initialParentState);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { updateParent } = useData();
  const { createParentAccount } = useAuth();

  useEffect(() => {
    setError('');
    if (parentToEdit) {
      setParentData({name: parentToEdit.name, email: parentToEdit.email});
    } else {
      setParentData(initialParentState);
      setPassword('');
    }
  }, [parentToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
        if (parentToEdit) {
            // Update only name, email change is complex with auth
            await updateParent({ ...parentToEdit, name: parentData.name });
        } else {
            if (!password) {
                setError('新規登録の場合、パスワードは必須です。');
                return;
            }
            await createParentAccount(parentData, password);
        }
        onClose();
    } catch (err: any) {
        console.error(err);
        setError(err.message || 'エラーが発生しました。');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={parentToEdit ? '保護者情報の編集' : '新規保護者の登録'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="保護者氏名" id="name" name="name" value={parentData.name} onChange={handleChange} required className="md:col-span-2" />
          <Input label="メールアドレス" id="email" name="email" type="email" value={parentData.email} onChange={handleChange} required disabled={!!parentToEdit}/>
          {!parentToEdit && (
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
          <Button type="submit">{parentToEdit ? '更新' : '登録'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ParentForm;