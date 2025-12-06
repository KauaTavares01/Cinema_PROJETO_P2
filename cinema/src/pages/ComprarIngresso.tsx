import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
  capacidade: number;
}

// Esquema de validação
const ingressoSchema = z.object({
  tipo: z.enum(['inteira', 'meia']),
  quantidade: z
    .number({ message: 'Quantidade deve ser um número' })
    .int({ message: 'Quantidade deve ser inteira' })
    .positive({ message: 'Quantidade deve ser maior que zero' })
    .max(20, { message: 'Quantidade máxima por compra é 20' }),
});

type IngressoFormData = z.infer<typeof ingressoSchema>;

const ComprarIngresso: React.FC = () => {
  const { sessaoId } = useParams();
  const navigate = useNavigate();

  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [filme, setFilme] = useState<Filme | null>(null);
  const [sala, setSala] = useState<Sala | null>(null);
  const [carregando, setCarregando] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IngressoFormData>({
    resolver: zodResolver(ingressoSchema),
    defaultValues: {
      tipo: 'inteira',
      quantidade: 1,
    },
  });

  const tipo = watch('tipo');
  const quantidade = watch('quantidade') || 0;

  useEffect(() => {
    const carregarDados = async () => {
      try {
        if (!sessaoId) return;

        const resSessao = await fetch(
          `http://localhost:3000/sessoes/${sessaoId}`,
        );
        if (!resSessao.ok) throw new Error('Sessão não encontrada');

        const sessaoData: Sessao = await resSessao.json();
        setSessao(sessaoData);

        const [resFilme, resSala] = await Promise.all([
          fetch(`http://localhost:3000/filmes/${sessaoData.filmeId}`),
          fetch(`http://localhost:3000/salas/${sessaoData.salaId}`),
        ]);

        const filmeData: Filme = await resFilme.json();
        const salaData: Sala = await resSala.json();

        setFilme(filmeData);
        setSala(salaData);
      } catch (error) {
        console.error('Erro ao carregar dados da compra:', error);
        alert('Erro ao carregar dados da sessão.');
        navigate('/cliente');
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [sessaoId, navigate]);

  const calcularValorTotal = () => {
    if (!sessao) return 0;
    const fator = tipo === 'meia' ? 0.5 : 1;
    return sessao.preco * quantidade * fator;
  };

  const onSubmit = async (data: IngressoFormData) => {
    try {
      if (!sessao) {
        alert('Sessão inválida');
        return;
      }

      const valorTotal = calcularValorTotal();

      const resp = await fetch('http://localhost:3000/ingressos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessaoId: sessao.id,
          tipo: data.tipo,
          quantidade: data.quantidade,
          valorTotal,
        }),
      });

      if (!resp.ok) throw new Error('Erro ao registrar ingresso');

      alert(
        `Compra realizada com sucesso! Valor total: R$ ${valorTotal.toFixed(
          2,
        )}`,
      );
      navigate('/cliente');
    } catch (err) {
      console.error(err);
      alert('Erro ao realizar a compra.');
    }
  };

  if (carregando) {
    return (
      <div className="container mt-5">
        <p>Carregando dados da sessão...</p>
      </div>
    );
  }

  if (!sessao || !filme || !sala) {
    return (
      <div className="container mt-5">
        <p>Dados da sessão não encontrados.</p>
      </div>
    );
  }

  const valorTotal = calcularValorTotal();

  return (
    <div className="container mt-5">
      <h1>Comprar Ingresso</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{filme.titulo}</h5>
          <p className="card-text">
            <strong>Sala:</strong> {sala.numeroSala}
            <br />
            <strong>Data/Hora:</strong> {sessao.dataHora}
            <br />
            <strong>Preço base:</strong> R$ {sessao.preco.toFixed(2)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* TIPO DE INGRESSO */}
        <div className="mb-3">
          <label className="form-label">Tipo de ingresso</label>
          <div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                id="tipoInteira"
                value="inteira"
                className="form-check-input"
                {...register('tipo')}
              />
              <label className="form-check-label" htmlFor="tipoInteira">
                Inteira (100%)
              </label>
            </div>

            <div className="form-check form-check-inline">
              <input
                type="radio"
                id="tipoMeia"
                value="meia"
                className="form-check-input"
                {...register('tipo')}
              />
              <label className="form-check-label" htmlFor="tipoMeia">
                Meia (50%)
              </label>
            </div>
          </div>
          {errors.tipo && (
            <div className="text-danger">{errors.tipo.message}</div>
          )}
        </div>

        {/* QUANTIDADE */}
        <div className="mb-3">
          <label className="form-label">Quantidade</label>
          <input
            type="number"
            className={`form-control ${
              errors.quantidade ? 'is-invalid' : ''
            }`}
            {...register('quantidade', { valueAsNumber: true })} // 🔹 converte para number
            min={1}
            max={20}
          />
          {errors.quantidade && (
            <div className="invalid-feedback">
              {errors.quantidade.message}
            </div>
          )}
        </div>

        {/* RESUMO */}
        <div className="mb-3">
          <h5>Resumo</h5>
          <p>
            Tipo:{' '}
            <strong>
              {tipo === 'meia' ? 'Meia (50%)' : 'Inteira (100%)'}
            </strong>
            <br />
            Quantidade: <strong>{quantidade}</strong>
            <br />
            Valor total:{' '}
            <strong>R$ {valorTotal.toFixed(2)}</strong>
          </p>
        </div>

        <button className="btn btn-success" disabled={isSubmitting}>
          {isSubmitting ? 'Processando...' : 'Confirmar compra'}
        </button>
      </form>
    </div>
  );
};

export default ComprarIngresso;
