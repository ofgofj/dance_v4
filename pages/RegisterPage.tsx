import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { createAdminAccount } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await createAdminAccount({ email, name }, password);
      setMessage("登録成功！ログイン画面へ移動します。");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError("登録できませんでした: " + err.message);
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: 400, margin: "0 auto", padding: 24 }}>
      <h2>管理者新規登録</h2>
      <div>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="名前"
          required
        />
      </div>
      <div>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="メールアドレス"
          required
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="パスワード"
          required
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit">登録</button>
      </div>
      {message && <div style={{ color: "green", marginTop: 8 }}>{message}</div>}
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </form>
  );
};

export default RegisterPage;
