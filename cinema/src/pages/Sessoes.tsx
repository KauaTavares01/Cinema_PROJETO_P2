import React, { useEffect, useState } from 'react';
import SessaoForm from '../components/SessaoForm';

interface Sessao {
  id: number;
  filmeId: number;
  salaId: number;
  dataHora: string;
  preco: number;
}

interface Filme {
  id: number;
  titulo: string;
}

interface Sala {
  id: number;
  numeroSala: string;
}

const Sessoes: React.FC = () => {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);

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
        console.error('Erro ao carregar sessões:', err);
      }
    };
    carregar();
  }, []);

  const getFilmeTitulo = (id: number) =>
    filmes.find((f) => f.id === id)?.titulo || `ID ${id}`;
  const getSalaNumero = (id: number) =>
    salas.find((s) => s.id === id)?.numeroSala || `ID ${id}`;

  const handleNovaSessao = (nova: Sessao) => {
    setSessoes((prev) => [...prev, nova]);
  };

  return (
    <div className="container mt-5">
      <h1>Sessões</h1>
      <p className="text-muted">Gerencie as sessões do cinema.</p>

      <SessaoForm onSucesso={handleNovaSessao} />

      <h2>Sessões cadastradas</h2>
      {sessoes.length === 0 ? (
        <p>Nenhuma sessão cadastrada.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Filme</th>
              <th>Sala</th>
              <th>Data/Hora</th>
              <th>Preço (R$)</th>
            </tr>
          </thead>
          <tbody>
            {sessoes.map((s) => (
              <tr key={s.id}>
                <td>{getFilmeTitulo(s.filmeId)}</td>
                <td>{getSalaNumero(s.salaId)}</td>
                <td>{s.dataHora}</td>
                <td>{Number(s.preco).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Sessoes;
