import React, { useEffect, useState } from 'react';

interface Filme {
  id: number;
  titulo: string;
  sinopse: string;
  duracao: number;
  classificacao: string;
  genero: string;
  dataExibicao: string;
}

const Filmes: React.FC = () => {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const resp = await fetch('http://localhost:3000/filmes');
        const data = await resp.json();
        setFilmes(data);
      } catch (err) {
        console.error('Erro ao buscar filmes:', err);
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);

  if (carregando) {
    return (
      <div className="container mt-5">
        <p>Carregando filmes...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1>
        <i className="bi bi-film"></i> Filmes Cadastrados
      </h1>

      {filmes.length === 0 ? (
        <p>Não há filmes cadastrados.</p>
      ) : (
        <div className="row mt-3">
          {filmes.map((filme) => (
            <div key={filme.id} className="col-md-4 col-sm-6 col-12 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{filme.titulo}</h5>
                  <p className="card-text">{filme.sinopse}</p>
                  <p className="card-text">
                    <strong>Duração:</strong> {filme.duracao} min
                  </p>
                  <p className="card-text">
                    <strong>Classificação:</strong> {filme.classificacao}
                  </p>
                  <p className="card-text">
                    <strong>Gênero:</strong> {filme.genero}
                  </p>
                  <p className="card-text">
                    <strong>Data de Exibição:</strong> {filme.dataExibicao}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filmes;
