import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface Filme {
  id: number;
  titulo: string;
}

interface Sala {
  id: number;
  numeroSala: string;
}

// 🔹 Schema da sessão
const sessaoSchema = z.object({
  filmeId: z
    .number({ message: 'Filme é obrigatório' })
    .int({ message: 'Filme inválido' })
    .positive({ message: 'Filme é obrigatório' }),
  salaId: z
    .number({ message: 'Sala é obrigatória' })
    .int({ message: 'Sala inválida' })
    .positive({ message: 'Sala é obrigatória' }),
  dataHora: z
    .string()
    .min(1, 'Data e hora são obrigatórias'),
  preco: z
    .number({ message: 'Preço é obrigatório' })
    .positive({ message: 'Preço deve ser maior que zero' })
    .max(500, { message: 'Preço máximo permitido é R$ 500,00' }),
});

export type SessaoFormData = z.infer<typeof sessaoSchema>;

interface SessaoFormProps {
  onSucesso?: (novaSessao: any) => void;
}

const SessaoForm: React.FC<SessaoFormProps> = ({ onSucesso }) => {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SessaoFormData>({
    resolver: zodResolver(sessaoSchema),
  });

  useEffect(() => {
    const carregar = async () => {
      try {
        const [resFilmes, resSalas] = await Promise.all([
          fetch('http://localhost:3000/filmes'),
          fetch('http://localhost:3000/salas'),
        ]);
        const filmesData = await resFilmes.json();
        const salasData = await resSalas.json();
        setFilmes(filmesData);
        setSalas(salasData);
      } catch (err) {
        console.error('Erro ao carregar filmes/salas:', err);
      }
    };
    carregar();
  }, []);

  const onSubmit = async (data: SessaoFormData) => {
    try {
      const resp = await fetch('http://localhost:3000/sessoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!resp.ok) throw new Error('Erro ao cadastrar sessão');
      const novaSessao = await resp.json();
      alert('Sessão cadastrada com sucesso!');
      reset();
      if (onSucesso) onSucesso(novaSessao);
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar sessão');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mb-4">
      {/* FILME */}
      <div className="mb-3">
        <label className="form-label">Filme</label>
        <select
          className={`form-control ${errors.filmeId ? 'is-invalid' : ''}`}
          {...register('filmeId', { valueAsNumber: true })} // 🔹 converte pra number
        >
          <option value="">Selecione um filme</option>
          {filmes.map((f) => (
            <option key={f.id} value={f.id}>
              {f.titulo}
            </option>
          ))}
        </select>
        {errors.filmeId && (
          <div className="invalid-feedback">{errors.filmeId.message}</div>
        )}
      </div>

      {/* SALA */}
      <div className="mb-3">
        <label className="form-label">Sala</label>
        <select
          className={`form-control ${errors.salaId ? 'is-invalid' : ''}`}
          {...register('salaId', { valueAsNumber: true })} // 🔹 converte pra number
        >
          <option value="">Selecione uma sala</option>
          {salas.map((s) => (
            <option key={s.id} value={s.id}>
              {s.numeroSala}
            </option>
          ))}
        </select>
        {errors.salaId && (
          <div className="invalid-feedback">{errors.salaId.message}</div>
        )}
      </div>

      {/* DATA E HORA */}
      <div className="mb-3">
        <label className="form-label">Data e hora</label>
        <input
          type="datetime-local"
          className={`form-control ${errors.dataHora ? 'is-invalid' : ''}`}
          {...register('dataHora')}
        />
        {errors.dataHora && (
          <div className="invalid-feedback">{errors.dataHora.message}</div>
        )}
      </div>

      {/* PREÇO */}
      <div className="mb-3">
        <label className="form-label">Preço (R$)</label>
        <input
          type="number"
          step="0.01"
          className={`form-control ${errors.preco ? 'is-invalid' : ''}`}
          {...register('preco', { valueAsNumber: true })} // 🔹 converte pra number
        />
        {errors.preco && (
          <div className="invalid-feedback">{errors.preco.message}</div>
        )}
      </div>

      <button className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Cadastrar Sessão'}
      </button>
    </form>
  );
};

export default SessaoForm;
