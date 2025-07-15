import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { ICONS } from '../constants';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log("ログインボタン押された");  //
    try {
      await login(email, password);
      // navigate('/') は呼ばない
      console.log('ログイン成功');
    } catch (err) {
      console.error(err);
      setError('メールアドレスまたはパスワードが正しくありません。');
    }
  };

  // currentUserがセットされたら遷移
  useEffect(() => {
    console.log("currentUser:", currentUser); //
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-pink-500 w-20 h-20 mx-auto mb-4">
            {ICONS.danceIcon}
          </div>
          <h1 className="text-3xl font-bold text-gray-800">ダンススクールへようこそ</h1>
          <p className="text-gray-500 mt-2">アカウントにログインしてください</p>
        </div>
        <Card className="!p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="メールアドレス"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="パスワード"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <Button type="submit" className="w-full" size="lg">
              ログイン
            </Button>
            
            <div className="text-center text-sm mt-4">
              <Link to="/register" className="font-medium text-pink-600 hover:text-pink-500">
                新規登録はこちら
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
