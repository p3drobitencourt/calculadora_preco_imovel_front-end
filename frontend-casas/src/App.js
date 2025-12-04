import React, { useState } from 'react';
import './App.css';

function App() {
  // --- Estados do Formulário ---
  const [area, setArea] = useState('');
  const [quartos, setQuartos] = useState('');
  const [banheiros, setBanheiros] = useState('');
  const [vagas, setVagas] = useState('');
  
  // Valores padrão para os selects (evita erro de enviar vazio)
  const [cidade, setCidade] = useState('São Paulo'); 
  const [tipo, setTipo] = useState('apartamento');   
  
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // URL da API no Azure
  const API_URL = 'https://api-calc-imoveis-a7fbhqg3h4hghmhr.eastus2-01.azurewebsites.net/prever';

  //teste local
  //const API_URL = 'http://127.0.0.1:5000/prever';
  // --- LISTAS EXTRAÍDAS DO SEU JSON (modelo_columns.json) ---
  const cidades = [
    "Americana", "Araraquara", "Armação dos Búzios", "Atibaia", "Barueri", "Bauru", "Belo Horizonte", "Bertioga", "Betim", 
    "Bragança Paulista", "Brasília", "Cabo Frio", "Camaçari", "Campinas", "Canoas", "Caraguatatuba", "Carapicuíba", 
    "Caçapava", "Contagem", "Cotia", "Curitiba", "Diadema", "Feira de Santana", "Florianópolis", "Fortaleza", 
    "Goiânia", "Gravataí", "Guarujá", "Guarulhos", "Hortolândia", "Indaiatuba", "Itapetininga", "Itatiba", "Itu", 
    "Jacareí", "Joinville", "Juiz de Fora", "Jundiaí", "Lauro de Freitas", "Limeira", "Londrina", "Louveira", 
    "Macaé", "Maringá", "Marília", "Mogi Guaçu", "Mogi das Cruzes", "Niterói", "Nova Iguaçu", "Nova Lima", 
    "Novo Hamburgo", "Osasco", "Palhoça", "Paulínia", "Pelotas", "Peruíbe", "Petrópolis", "Piracicaba", 
    "Porto Alegre", "Porto Feliz", "Praia Grande", "Presidente Prudente", "Recife", "Ribeirão Preto", 
    "Rio das Ostras", "Rio de Janeiro", "Salvador", "Santana de Parnaíba", "Santo André", "Santos", "Sorocaba", 
    "Sumare", "Suzano", "São Bernardo do Campo", "São Caetano do Sul", "São Carlos", "São Gonçalo", "São José", 
    "São José do Rio Preto", "São José dos Campos", "São José dos Pinhais", "São Leopoldo", "São Paulo", 
    "São Sebastião", "Taubaté", "Teresópolis", "Tremembé", "Uberaba", "Uberlândia", "Valinhos", "Viamão", "Vinhedo"
  ];

  // Tipos mapeados (Apartamento é o padrão/base, pois não está na lista one-hot)
  const tipos = [
    { label: "Apartamento", value: "apartamento" },
    { label: "Casa", value: "casas" },
    { label: "Casa de Condomínio", value: "casas-de-condominio" }
  ];

  const fazerPrevisao = async (e) => {
  e.preventDefault();
  setCarregando(true);
  setResultado(null);

  const payload = {
    area: Number(area),
    quartos: Number(quartos),
    bathrooms: Number(banheiros),
    parkingSpaces: Number(vagas),
    city: cidade,
    imvl_type: tipo
  };

  console.log("Enviando payload:", payload);

  try {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log("Status:", resposta.status);

    const dados = await resposta.json();
    console.log("RESPOSTA COMPLETA DA API:", JSON.stringify(dados, null, 2));

    if (!resposta.ok) {
      throw new Error(dados.error || `Erro ${resposta.status}`);
    }

    // Tenta diferentes formas de acessar o preço
    const preco = dados.preco_previsto;

    if (preco) {
      setResultado(preco);
      console.log("Resultado atualizado para:", preco);
    } else {
      console.warn("Nenhum campo de preço encontrado na resposta!");
    }

  } catch (erro) {
    console.error("Erro:", erro);
    alert(`Erro: ${erro.message}`);
  }
  setCarregando(false);
};

  // Estilo para os Selects ficarem bonitos igual aos Inputs
  const selectStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#334155',
    border: '1px solid #475569',
    borderRadius: '8px',
    color: 'white',
    fontSize: '1rem',
    boxSizing: 'border-box',
    cursor: 'pointer'
  };

  return (
    <div className="App">
      <div className="container">
        <h1>
          <span style={{ 
            color: '#ed4bb7ff', 
            opacity: 1,
            WebKitTextFillColor: 'unset !important',
            textShadow: '0 0 10px rgba(219, 15, 255, 0.5)'
          }}>🏘️</span> Oráculo Imobiliário
        </h1>
        <p className="subtitle">Previsão Imobiliária com Inteligência Artificial</p>

        <form onSubmit={fazerPrevisao}>
          
          {/* SELEÇÃO DE CIDADE */}
          <div className="form-group">
            <label>Cidade</label>
            <select 
              value={cidade} 
              onChange={(e) => setCidade(e.target.value)}
              style={selectStyle}
            >
              {cidades.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* SELEÇÃO DE TIPO */}
          <div className="form-group">
            <label>Tipo de Imóvel</label>
            <select 
              value={tipo} 
              onChange={(e) => setTipo(e.target.value)}
              style={selectStyle}
            >
              {tipos.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* CAMPOS NUMÉRICOS (Lado a Lado) */}
          <div className="grid-2">
            <div className="form-group">
              <label>Área (m²)</label>
              <input 
                type="number" 
                value={area} 
                onChange={(e) => setArea(e.target.value)} 
                required 
                placeholder="Ex: 80" 
              />
            </div>

            <div className="form-group">
              <label>Número de Quartos</label>
              <input 
                type="number" 
                value={quartos} 
                onChange={(e) => setQuartos(e.target.value)} 
                required 
                placeholder="Ex: 2" 
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Número de Banheiros</label>
              <input 
                type="number" 
                value={banheiros} 
                onChange={(e) => setBanheiros(e.target.value)} 
                required 
                placeholder="Ex: 1" 
              />
            </div>

            <div className="form-group">
              <label>Vagas para automóveis</label>
              <input 
                type="number" 
                value={vagas} 
                onChange={(e) => setVagas(e.target.value)} 
                required 
                placeholder="Ex: 1" 
              />
            </div>
          </div>

          <button type="submit" disabled={carregando}>
            {carregando ? 'Consultando...' : 'Calcular Valor'}
          </button>
        </form>

        {resultado && (
          <div className="result-card">
            <h2>💰 Valor do Aluguel Estimado:</h2>
            <p className="price">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(resultado * 1000)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;