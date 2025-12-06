import React from 'react';
import FilmeForm from '../components/FilmeForm';

const CadastroFilmes: React.FC = () => {
  return (
    <div className="container mt-5">
      <h1>Cadastro de Filmes</h1>
      <p className="text-muted">
        Preencha os dados para cadastrar um novo filme.
      </p>
      <FilmeForm />
    </div>
  );
};

export default CadastroFilmes;
