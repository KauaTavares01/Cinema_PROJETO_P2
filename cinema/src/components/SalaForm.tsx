import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const salaSchema = z.object({
  numeroSala: z
    .string()
    .min(1, 'Número da sala é obrigatório')
    .max(10, 'Número da sala deve ter no máximo 10 caracteres'),
  capacidade: z
    .coerce
    .number()
    .int({ message: 'Capacidade deve ser um número inteiro' })
    .positive({ message: 'Capacidade deve ser maior que zero' })
    .max(500, { message: 'Capacidade máxima é 500 lugares' }),
});

export type SalaFormData = z.infer<typeof salaSchema>;

export interface Sala {
  id: number;
  numeroSala: string;
  capacidade: number;
}

interface SalaFormProps {
  onSucesso?: (novaSala: Sala) => void;
}

const SalaForm: React.FC<SalaFormProps> = ({ onSucesso }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SalaFormData>({
    resolver: zodResolver(salaSchema) as any,
  });

  const onSubmit = async (data: SalaFormData) => {
    try {
      const resp = await fetch('http://localhost:3000/salas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!resp.ok) throw new Error('Erro ao cadastrar sala');

      const novaSala: Sala = await resp.json();
      alert('Sala cadastrada com sucesso!');
      reset();
      if (onSucesso) onSucesso(novaSala);
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar sala');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mb-4">
      {/* NÚMERO DA SALA */}
      <div className="mb-3">
        <label className="form-label">Número da sala</label>
        <input
          className={`form-control ${errors.numeroSala ? 'is-invalid' : ''}`}
          {...register('numeroSala')}
        />
        {errors.numeroSala && (
          <div className="invalid-feedback">{errors.numeroSala.message}</div>
        )}
      </div>

      {/* CAPACIDADE */}
      <div className="mb-3">
        <label className="form-label">Capacidade</label>
        <input
          type="number"
          className={`form-control ${errors.capacidade ? 'is-invalid' : ''}`}
          {...register('capacidade', { valueAsNumber: true })}
        />
        {errors.capacidade && (
          <div className="invalid-feedback">{errors.capacidade.message}</div>
        )}
      </div>

      <button className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Cadastrar Sala'}
      </button>
    </form>
  );
};

export default SalaForm;
