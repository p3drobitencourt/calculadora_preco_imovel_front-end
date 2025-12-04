import React, { useState } from 'react';
import './App.css';

function App() {
  const [area, setArea] = useState('');
  const [quartos, setQuartos] = useState('');
  const [preco, setPreco] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // URL DO AZURE DIRETA (Sem proxy, o jeito clássico)
  const API_URL = 'https://api-calc-imoveis-a7fbhqg3h4hghmhr.eastus2-01.azurewebsites.net/prever';

  const fazerPrevisao = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setPreco(null);

    try {
      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          area: Number(area),
          quartos: Number(quartos)
        }),
      });

      if (!resposta.ok) {
        throw new Error('Erro na comunicação com a API');
      }

      const dados = await resposta.json();
      
      const valorFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(dados.preco_previsto);

      setPreco(valorFormatado);

    } catch (erro) {
      console.error("Erro:", erro);
      alert("Erro ao conectar com o Oráculo. Verifique se a API está online!");
    }
    setCarregando(false);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>🏠 Oráculo Imobiliário</h1>
        <p className="subtitle">Insira os dados para a previsão divina.</p>

        <form onSubmit={fazerPrevisao}>
          <div className="form-group">
            <label>Área do Imóvel (m²)</label>
            <input 
              type="number" 
              placeholder="Ex: 120"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Número de Quartos</label>
            <input 
              type="number" 
              placeholder="Ex: 3"
              value={quartos}
              onChange={(e) => setQuartos(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={carregando}>
            {carregando ? 'Consultando...' : 'Calcular Valor'}
          </button>
        </form>

        {preco && (
          <div className="result-card">
            <h2>💰 Estimativa Divina:</h2>
            <p className="price">{preco}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;