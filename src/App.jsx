import { useState } from "react";
import { calcularSaldoDisponivel, paraNumero } from "./utils/finance";

export default function App() {
  // ==============================
  // STATES PRINCIPAIS
  // ==============================

  const [salario, setSalario] = useState("");
  const [gastoDebito, setGastoDebito] = useState("");
  const [faturaAtual, setFaturaAtual] = useState("");

  // ==============================
  // STATES DE CARTÕES
  // ==============================

  const [cartoes, setCartoes] = useState([]);

  const [nomeCartao, setNomeCartao] = useState("");
  const [tipoCartao, setTipoCartao] = useState("credito");

  // Mensagem de erro (regra de negócio)
  const [erroCartao, setErroCartao] = useState("");

  // ==============================
  // FUNÇÃO: ADICIONAR CARTÃO
  // ==============================

  function adicionarCartao() {
    const nomeNormalizado = nomeCartao.trim().toLowerCase();

    // 1. Validação: campo vazio
    if (!nomeNormalizado) {
      setErroCartao("Digite um nome para o cartão.");
      return;
    }

    // 2. Validação: duplicidade (nome + tipo)
    const cartaoDuplicado = cartoes.some(
      (c) =>
        c.nome.toLowerCase() === nomeNormalizado &&
        c.tipo === tipoCartao
    );

    if (cartaoDuplicado) {
      setErroCartao("Esse cartão já existe com esse tipo.");
      return;
    }

    // 3. Cria novo cartão
    const novoCartao = {
      id: Date.now(),
      nome: nomeCartao,
      tipo: tipoCartao,
    };

    // 4. Atualiza lista
    setCartoes([...cartoes, novoCartao]);

    // 5. Limpa inputs
    setNomeCartao("");
    setErroCartao("");
  }

  // ==============================
  // CÁLCULO
  // ==============================

  const saldoDisponivel = calcularSaldoDisponivel(
    paraNumero(salario),
    paraNumero(gastoDebito),
    paraNumero(faturaAtual)
  );

  // ==============================
  // RENDER
  // ==============================

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Controle Financeiro</h1>

      <div style={styles.grid}>
        {/* USUÁRIO */}
        <div style={styles.card}>
          <h2>Usuário</h2>

          <label>Salário mensal:</label>
          <input
            type="number"
            value={salario}
            onChange={(e) => setSalario(e.target.value)}
            style={styles.input}
          />

          <p>Salário: R$ {salario || 0}</p>
        </div>

        {/* RESUMO */}
        <div style={styles.card}>
          <h2>Resumo</h2>

          <p>Saldo disponível: R$ {saldoDisponivel}</p>

          <label>Gastos no débito:</label>
          <input
            type="number"
            value={gastoDebito}
            onChange={(e) => setGastoDebito(e.target.value)}
            style={styles.input}
          />

          <label>Fatura atual:</label>
          <input
            type="number"
            value={faturaAtual}
            onChange={(e) => setFaturaAtual(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* CARTÕES */}
        <div style={styles.card}>
          <h2>Cartões</h2>

          <input
            type="text"
            placeholder="Nome do cartão"
            value={nomeCartao}
            onChange={(e) => setNomeCartao(e.target.value)}
            style={styles.input}
          />

          <select
            value={tipoCartao}
            onChange={(e) => setTipoCartao(e.target.value)}
            style={styles.input}
          >
            <option value="credito">Crédito</option>
            <option value="debito">Débito</option>
          </select>

          <button style={styles.button} onClick={adicionarCartao}>
            Adicionar cartão
          </button>

          {/* ERRO */}
          {erroCartao && (
            <p style={styles.erro}>{erroCartao}</p>
          )}

          {/* LISTA */}
          {cartoes.length === 0 ? (
            <p>Nenhum cartão cadastrado</p>
          ) : (
            <ul style={styles.lista}>
              {cartoes.map((cartao) => (
                <li key={cartao.id} style={styles.itemLista}>
                  {cartao.nome} ({cartao.tipo})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* GASTOS */}
        <div style={styles.card}>
          <h2>Gastos</h2>
          <p>Nenhum gasto registrado</p>
        </div>
      </div>
    </div>
  );
}

// ==============================
// ESTILOS
// ==============================
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #bde0ff, #e0f7ff)",
    padding: "30px",
    fontFamily: "Segoe UI, sans-serif",
  },

  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#004e7c",
    textShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
  },

  card: {
    background: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(255,255,255,0.3)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    color: "#003049",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid rgba(0,0,0,0.2)",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#0077b6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
  },

  erro: {
    color: "red",
    marginTop: "10px",
    fontSize: "14px",
  },

  lista: {
    marginTop: "15px",
    paddingLeft: "15px",
  },

  itemLista: {
    marginBottom: "5px",
  },
};