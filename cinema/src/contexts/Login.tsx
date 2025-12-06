import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [role, setRole] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      alert('Selecione um tipo de usuário');
      return;
    }

    login(role as 'admin' | 'cliente');

    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/cliente');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Login</h1>
      <p className="text-muted">Escolha o tipo de usuário para entrar.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tipo de usuário</label>
          <select
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="admin">Administrador</option>
            <option value="cliente">Cliente</option>
          </select>
        </div>

        <button className="btn btn-primary" type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
