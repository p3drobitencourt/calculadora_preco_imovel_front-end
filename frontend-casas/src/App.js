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
  const API_URL = 'https://api-calc-imoveis-a7fbhqg3h4hghmhr.eastus2-01.azurewebsites.net/predict';

  // --- LISTAS EXTRAÍDAS DO SEU JSON (modelo_columns.json) ---
  const cidades = [
    "Araraquara", "Armação dos Búzios", "Atibaia", "Barueri", "Bauru", "Belo Horizonte", "Bertioga", "Betim", 
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

    // Monta o pacote de dados exato que o Python espera
    const payload = {
      area: Number(area),
      quartos: Number(quartos),
      bathrooms: Number(banheiros), // Python usa 'bathrooms'
      parkingSpaces: Number(vagas), // Python usa 'parkingSpaces'
      city: cidade,                 // Envia o nome da cidade (string)
      imvl_type: tipo               // Envia o tipo (string)
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
        throw new Error(dados.error || 'Erro desconhecido na API');
      }

      setResultado(dados.preco_formatado);

    } catch (erro) {
      console.error("Erro:", erro);
      alert(`Erro no Oráculo: ${erro.message}`);
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
        <h1>🏠 Oráculo Imobiliário</h1>
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
              <label>Quartos</label>
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
              <label>Banheiros</label>
              <input 
                type="number" 
                value={banheiros} 
                onChange={(e) => setBanheiros(e.target.value)} 
                required 
                placeholder="Ex: 1" 
              />
            </div>

            <div className="form-group">
              <label>Vagas</label>
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
            <h2>💰 Valor Estimado:</h2>
            <p className="price">{resultado}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;