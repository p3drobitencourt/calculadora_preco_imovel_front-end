import React, { useState } from 'react';
import './App.css';

function App() {
  // Estados para os dados
  const [area, setArea] = useState('');
  const [quartos, setQuartos] = useState('');
  const [banheiros, setBanheiros] = useState('');
  const [vagas, setVagas] = useState('');
  const [cidade, setCidade] = useState('São Paulo'); // Valor padrão para não ir vazio
  const [tipo, setTipo] = useState('apartamento');   // Valor padrão
  
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // URL DA API
  const API_URL = 'https://api-calc-imoveis-a7fbhqg3h4hghmhr.eastus2-01.azurewebsites.net/predict';

  // Lista exata de cidades extraída do seu modelo_metadata.json
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

  const tipos = [
    { label: "Apartamento", value: "apartamento" },
    { label: "Casa", value: "casas" },
    { label: "Casa de Condomínio", value: "casas-de-condominio" }
  ];

  const fazerPrevisao = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setResultado(null);

    // Mágica acontecendo: Mapeando os nomes do front para o que o Python espera
    const payload = {
      area: Number(area),
      quartos: Number(quartos),
      bathrooms: Number(banheiros),      // Python espera 'bathrooms'
      parkingSpaces: Number(vagas),      // Python espera 'parkingSpaces'
      city: cidade,                      // Envia o NOME (String), ex: "São Paulo"
      imvl_type: tipo                    // Envia o TIPO (String), ex: "casas"
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
        throw new Error(dados.error || JSON.stringify(dados));
      }

      // O Python já devolve formatado como "R$ X.XXX,XX"
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
        <p className="subtitle">Previsão baseada em Inteligência Artificial.</p>

        <form onSubmit={fazerPrevisao}>
          
          <div className="form-group">
            <label>Cidade</label>
            <select 
              value={cidade} 
              onChange={e => setCidade(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#334155', color: 'white', border: '1px solid #475569' }}
            >
              {cidades.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tipo do Imóvel</label>
            <select 
              value={tipo} 
              onChange={e => setTipo(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#334155', color: 'white', border: '1px solid #475569' }}
            >
              {tipos.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Área (m²)</label>
              <input type="number" value={area} onChange={e => setArea(e.target.value)} required placeholder="120" />
            </div>

            <div className="form-group">
              <label>Quartos</label>
              <input type="number" value={quartos} onChange={e => setQuartos(e.target.value)} required placeholder="3" />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Banheiros</label>
              <input type="number" value={banheiros} onChange={e => setBanheiros(e.target.value)} required placeholder="2" />
            </div>

            <div className="form-group">
              <label>Vagas</label>
              <input type="number" value={vagas} onChange={e => setVagas(e.target.value)} required placeholder="1" />
            </div>
          </div>

          <button type="submit" disabled={carregando}>
            {carregando ? 'Calculando...' : 'Calcular Valor'}
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