import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { changePassword } from '../../authUtils';
import { auth } from '../../firebase';

const ChangePasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!newPassword || !confirmPassword) {
      setError('新しいパスワードを入力してください');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }
    if (newPassword.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return;
    }
    try {
      await changePassword(auth.currentUser, newPassword);
      setSuccess('パスワードが変更されました');
      localStorage.setItem('forcePasswordChange', 'false');
      setTimeout(() => navigate('/parent/dashboard'), 1200);
    } catch (err: any) {
      setError('パスワード変更に失敗しました: ' + (err.message || '')); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="!p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">パスワード変更</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="新しいパスワード"
              id="new-password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <Input
              label="新しいパスワード（確認）"
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center">{success}</p>}
            <Button type="submit" className="w-full" size="lg">
              パスワードを変更
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ChangePasswordPage; 