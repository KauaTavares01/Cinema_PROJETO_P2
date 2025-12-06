import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Esquema de validação do filme
const filmeSchema = z.object({
  titulo: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(100, 'Título deve ter no máximo 100 caracteres'),

  sinopse: z
    .string()
    .min(10, 'Sinopse deve ter pelo menos 10 caracteres')
    .max(500, 'Sinopse deve ter no máximo 500 caracteres'),

  duracao: z
    .coerce
    .number()
    .int({ message: 'Duração deve ser um número inteiro' })
    .positive({ message: 'Duração deve ser maior que zero' })
    .max(600, { message: 'Duração não deve ser maior que 600 minutos' }),

  classificacao: z
    .string()
    .min(1, 'Classificação é obrigatória'),

  genero: z
    .string()
    .min(1, 'Gênero é obrigatório'),

  dataExibicao: z
    .string()
    .min(1, 'Data de exibição é obrigatória'),
});

export type FilmeFormData = z.infer<typeof filmeSchema>;

interface FilmeFormProps {
  onSucesso?: () => void;
}

const FilmeForm: React.FC<FilmeFormProps> = ({ onSucesso }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FilmeFormData>({
    resolver: zodResolver(filmeSchema) as any,
  });

  const onSubmit = async (data: FilmeFormData) => {
    try {
      const resp = await fetch('http://localhost:3000/filmes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!resp.ok) throw new Error('Erro ao cadastrar filme');

      alert('Filme cadastrado com sucesso!');
      reset();
      if (onSucesso) onSucesso();
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar filme');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* TÍTULO */}
      <div className="mb-3">
        <label className="form-label">Título</label>
        <input
          className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
          {...register('titulo')}
        />
        {errors.titulo && (
          <div className="invalid-feedback">{errors.titulo.message}</div>
        )}
      </div>

      {/* SINOPSE */}
      <div className="mb-3">
        <label className="form-label">Sinopse</label>
        <textarea
          className={`form-control ${errors.sinopse ? 'is-invalid' : ''}`}
          rows={3}
          {...register('sinopse')}
        />
        {errors.sinopse && (
          <div className="invalid-feedback">{errors.sinopse.message}</div>
        )}
      </div>

      {/* DURAÇÃO */}
      <div className="mb-3">
        <label className="form-label">Duração (min)</label>
        <input
          type="number"
          className={`form-control ${errors.duracao ? 'is-invalid' : ''}`}
          {...register('duracao', { valueAsNumber: true })}
        />
        {errors.duracao && (
          <div className="invalid-feedback">{errors.duracao.message}</div>
        )}
      </div>

      {/* CLASSIFICAÇÃO */}
      <div className="mb-3">
        <label className="form-label">Classificação</label>
        <input
          className={`form-control ${
            errors.classificacao ? 'is-invalid' : ''
          }`}
          {...register('classificacao')}
        />
        {errors.classificacao && (
          <div className="invalid-feedback">
            {errors.classificacao.message}
          </div>
        )}
      </div>

      {/* GÊNERO */}
      <div className="mb-3">
        <label className="form-label">Gênero</label>
        <input
          className={`form-control ${errors.genero ? 'is-invalid' : ''}`}
          {...register('genero')}
        />
        {errors.genero && (
          <div className="invalid-feedback">{errors.genero.message}</div>
        )}
      </div>

      {/* DATA DE EXIBIÇÃO */}
      <div className="mb-3">
        <label className="form-label">Data de Exibição</label>
        <input
          type="date"
          className={`form-control ${
            errors.dataExibicao ? 'is-invalid' : ''
          }`}
          {...register('dataExibicao')}
        />
        {errors.dataExibicao && (
          <div className="invalid-feedback">
            {errors.dataExibicao.message}
          </div>
        )}
      </div>

      <button className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Cadastrar Filme'}
      </button>
    </form>
  );
};

export default FilmeForm;
