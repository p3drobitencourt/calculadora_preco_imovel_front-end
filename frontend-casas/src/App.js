import React, { useState } from 'react';
import './App.css';

function App() {
  // Estados para os dados sagrados
  // Nota: O Python converte tudo para float, então esses campos devem ser numéricos
  // ou o modelo deve ter sido treinado com LabelEncoding.
  const [area, setArea] = useState('');
  const [quartos, setQuartos] = useState('');
  const [banheiros, setBanheiros] = useState('');
  const [vagas, setVagas] = useState(''); // Adicionei Vagas que é comum, se não tiver no modelo, ele ignora ou avisa
  const [cidade, setCidade] = useState(''); // O Python espera um número aqui (ex: ID da cidade)
  const [tipo, setTipo] = useState('');     // O Python espera um número aqui (ex: 0=Casa, 1=Apto)
  
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // URL DO AZURE ATUALIZADA COM A NOVA ROTA '/predict'
  const API_URL = 'https://api-calc-imoveis-a7fbhqg3h4hghmhr.eastus2-01.azurewebsites.net/predict';

  const fazerPrevisao = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setResultado(null);

    // Montando o objeto de dados
    // IMPORTANTE: As chaves (esquerda) devem ser EXATAMENTE iguais às colunas que o modelo foi treinado
    const payload = {
      area: Number(area),
      quartos: Number(quartos),
      banheiros: Number(banheiros),
      vagas: Number(vagas),
      // Se o seu modelo usa 'cidade' e 'tipo' como números, envie assim:
      cidade: Number(cidade), 
      tipo: Number(tipo)
    };

    try {
      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        // Se o Python retornar erro de validação (ex: campo faltando), mostramos aqui
        throw new Error(dados.error || dados.detalhes || 'Erro desconhecido na API');
      }

      // O Python agora retorna 'preco_formatado' direto
      setResultado(dados.preco_formatado);

    } catch (erro) {
      console.error("Erro:", erro);
      alert(`Falha no Oráculo: ${erro.message}`);
    }
    setCarregando(false);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>🏠 Oráculo Imobiliário</h1>
        <p className="subtitle">Insira os parâmetros para a previsão.</p>

        <form onSubmit={fazerPrevisao}>
          
          <div className="form-group">
            <label>Área (m²)</label>
            <input 
              type="number" 
              placeholder="Ex: 120"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Quartos</label>
            <input 
              type="number" 
              placeholder="Ex: 3"
              value={quartos}
              onChange={(e) => setQuartos(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Banheiros</label>
            <input 
              type="number" 
              placeholder="Ex: 2"
              value={banheiros}
              onChange={(e) => setBanheiros(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Vagas de Garagem</label>
            <input 
              type="number" 
              placeholder="Ex: 1"
              value={vagas}
              onChange={(e) => setVagas(e.target.value)}
            />
          </div>

          {/* ATENÇÃO: O Python faz float(valor), então Cidade e Tipo precisam ser códigos numéricos 
              ou o backend precisaria tratar texto. Deixei como number por segurança baseada no seu código Python */}
          <div className="form-group">
            <label>Código da Cidade</label>
            <input 
              type="number" 
              placeholder="Ex: 0 para Capital, 1 para Interior"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Tipo (Código)</label>
            <input 
              type="number" 
              placeholder="Ex: 0 (Casa), 1 (Apto)"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            />
          </div>

          <button type="submit" disabled={carregando}>
            {carregando ? 'Processando...' : 'Calcular Valor'}
          </button>
        </form>

        {resultado && (
          <div className="result-card">
            <h2>💰 Estimativa Divina:</h2>
            <p className="price">{resultado}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;