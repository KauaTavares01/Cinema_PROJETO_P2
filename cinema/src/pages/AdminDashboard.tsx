import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

interface Filme {
  id: number;
  titulo: string;
}

interface Sala {
  id: number;
  numeroSala: string;
  capacidade: number;
}

interface Sessao {
  id: number;
  filmeId: number;
  salaId: number;
  dataHora: string;
  preco: number;
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const [resFilmes, resSalas, resSessoes] = await Promise.all([
          fetch('http://localhost:3000/filmes'),
          fetch('http://localhost:3000/salas'),
          fetch('http://localhost:3000/sessoes'),
        ]);

        setFilmes(await resFilmes.json());
        setSalas(await resSalas.json());
        setSessoes(await resSessoes.json());
      } catch (err) {
        console.error('Erro ao carregar dados admin:', err);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mt-4">
        <p>Acesso não autorizado.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Carregando painel...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Painel Administrativo</h1>
        <div>
          <span className="me-3">
            Logado como: <strong>Admin</strong>
          </span>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Filmes cadastrados</h5>
              <p className="display-6">{filmes.length}</p>
              <Link to="/cadastro-filmes" className="btn btn-primary btn-sm">
                Cadastrar filme
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Salas cadastradas</h5>
              <p className="display-6">{salas.length}</p>
              <Link to="/salas" className="btn btn-secondary btn-sm">
                Gerenciar salas
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Sessões cadastradas</h5>
              <p className="display-6">{sessoes.length}</p>
              <Link to="/sessoes" className="btn btn-secondary btn-sm">
                Gerenciar sessões
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Filmes recentes</h5>
          {filmes.length === 0 ? (
            <p>Nenhum filme cadastrado.</p>
          ) : (
            <ul className="list-group">
              {filmes.slice(0, 5).map((filme) => (
                <li className="list-group-item" key={filme.id}>
                  {filme.titulo}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
