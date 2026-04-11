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
  // CARTÕES
  // ==============================

  const [cartoes, setCartoes] = useState([]);
  const [nomeCartao, setNomeCartao] = useState("");
  const [tipoCartao, setTipoCartao] = useState("credito");
  const [erroCartao, setErroCartao] = useState("");

  // ==============================
  // GASTOS
  // ==============================

  const [gastos, setGastos] = useState([]);
  const [valorGasto, setValorGasto] = useState("");
  const [cartaoSelecionado, setCartaoSelecionado] = useState("");

  // ==============================
  // ADICIONAR CARTÃO
  // ==============================

  function adicionarCartao() {
    const nomeNormalizado = nomeCartao.trim().toLowerCase();

    if (!nomeNormalizado) {
      setErroCartao("Digite um nome para o cartão.");
      return;
    }

    const duplicado = cartoes.some(
      (c) =>
        c.nome.toLowerCase() === nomeNormalizado &&
        c.tipo === tipoCartao
    );

    if (duplicado) {
      setErroCartao("Esse cartão já existe com esse tipo.");
      return;
    }

    const novoCartao = {
      id: Date.now(),
      nome: nomeCartao,
      tipo: tipoCartao,
    };

    setCartoes([...cartoes, novoCartao]);
    setNomeCartao("");
    setErroCartao("");
  }

  // ==============================
  // ADICIONAR GASTO
  // ==============================

  function adicionarGasto() {
    if (!valorGasto || !cartaoSelecionado) return;

    const cartao = cartoes.find(
      (c) => c.id === Number(cartaoSelecionado)
    );

    const novoGasto = {
      id: Date.now(),
      valor: paraNumero(valorGasto),
      cartaoNome: cartao.nome,
      tipo: cartao.tipo,
    };

    setGastos([...gastos, novoGasto]);

    // Atualiza totais automaticamente
    if (cartao.tipo === "debito") {
      setGastoDebito((prev) => paraNumero(prev) + novoGasto.valor);
    } else {
      setFaturaAtual((prev) => paraNumero(prev) + novoGasto.valor);
    }

    setValorGasto("");
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
        </div>

        {/* RESUMO */}
        <div style={styles.card}>
          <h2>Resumo</h2>

          <p>Saldo disponível: R$ {saldoDisponivel}</p>
          <p>Débito: R$ {gastoDebito}</p>
          <p>Fatura: R$ {faturaAtual}</p>
        </div>

        {/* CARTÕES */}
        <div style={styles.card}>
          <h2>Cartões</h2>

          <input
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

          <button onClick={adicionarCartao} style={styles.button}>
            Adicionar
          </button>

          {erroCartao && <p style={styles.erro}>{erroCartao}</p>}

          <ul>
            {cartoes.map((c) => (
              <li key={c.id}>
                {c.nome} ({c.tipo})
              </li>
            ))}
          </ul>
        </div>

        {/* GASTOS */}
        <div style={styles.card}>
          <h2>Gastos</h2>

          <input
            type="number"
            placeholder="Valor"
            value={valorGasto}
            onChange={(e) => setValorGasto(e.target.value)}
            style={styles.input}
          />

          <select
            value={cartaoSelecionado}
            onChange={(e) => setCartaoSelecionado(e.target.value)}
            style={styles.input}
          >
            <option value="">Selecione um cartão</option>
            {cartoes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} ({c.tipo})
              </option>
            ))}
          </select>

          <button onClick={adicionarGasto} style={styles.button}>
            Adicionar gasto
          </button>

          <ul>
            {gastos.map((g) => (
              <li key={g.id}>
                R$ {g.valor} - {g.cartaoNome} ({g.tipo})
              </li>
            ))}
          </ul>
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
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
  },

  card: {
    background: "rgba(255,255,255,0.25)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(255,255,255,0.3)",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#0077b6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  erro: {
    color: "red",
    fontSize: "14px",
  },
};