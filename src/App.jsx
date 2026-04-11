import { useState } from "react";
import { calcularSaldoDisponivel, paraNumero } from "./utils/finance";

// ==============================
// IMPORT DO GRÁFICO
// ==============================
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export default function App() {
  // ==============================
  // STATES
  // ==============================

  const [salario, setSalario] = useState("");
  const [gastoDebito, setGastoDebito] = useState("");
  const [faturaAtual, setFaturaAtual] = useState("");

  const [cartoes, setCartoes] = useState([]);
  const [nomeCartao, setNomeCartao] = useState("");
  const [tipoCartao, setTipoCartao] = useState("credito");
  const [erroCartao, setErroCartao] = useState("");

  const [gastos, setGastos] = useState([]);
  const [valorGasto, setValorGasto] = useState("");
  const [cartaoSelecionado, setCartaoSelecionado] = useState("");

  // ==============================
  // CARTÕES
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
  // GASTOS
  // ==============================

  function adicionarGasto() {
    if (!valorGasto || !cartaoSelecionado) return;

    const cartao = cartoes.find(
      (c) => c.id === Number(cartaoSelecionado)
    );

    const valor = paraNumero(valorGasto);

    const novoGasto = {
      id: Date.now(),
      valor,
      cartaoNome: cartao.nome,
      tipo: cartao.tipo,
    };

    setGastos([...gastos, novoGasto]);

    if (cartao.tipo === "debito") {
      setGastoDebito((prev) => paraNumero(prev) + valor);
    } else {
      setFaturaAtual((prev) => paraNumero(prev) + valor);
    }

    setValorGasto("");
  }

  // ==============================
  // CÁLCULOS
  // ==============================

  const saldoDisponivel = calcularSaldoDisponivel(
    paraNumero(salario),
    paraNumero(gastoDebito),
    paraNumero(faturaAtual)
  );

  // ==============================
  // DADOS DO GRÁFICO (COM PROTEÇÃO)
  // ==============================

  const rawData = [
    { name: "Débito", value: paraNumero(gastoDebito) || 0 },
    { name: "Crédito", value: paraNumero(faturaAtual) || 0 },
  ];

  const hasData = rawData.some((d) => d.value > 0);

  const dataGrafico = hasData
    ? rawData
    : [
        { name: "Débito", value: 1 },
        { name: "Crédito", value: 1 },
      ];

  const COLORS = ["#e63946", "#ffb703"];

  // ==============================
  // RENDER
  // ==============================

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Controle Financeiro</h1>

      {/* LEGENDA */}
      <div style={styles.legenda}>
        <span style={{ ...styles.badge, background: "#e63946" }}>
          🔴 Débito (sai do dinheiro agora)
        </span>

        <span style={{ ...styles.badge, background: "#ffb703" }}>
          🟡 Crédito (vai para fatura)
        </span>

        <span style={{ ...styles.badge, background: "#2a9d8f" }}>
          🟢 Saldo disponível
        </span>
      </div>

      <div style={styles.grid}>
        {/* USUÁRIO */}
        <div style={styles.card}>
          <h2>Usuário</h2>

          <label>Salário:</label>
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

          <p style={{ color: "#2a9d8f", fontWeight: "bold" }}>
            Saldo: R$ {saldoDisponivel}
          </p>

          <p style={{ color: "#e63946" }}>
            Débito: R$ {gastoDebito}
          </p>

          <p style={{ color: "#ffb703" }}>
            Fatura: R$ {faturaAtual}
          </p>
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
                {c.nome}
                <span
                  style={{
                    ...styles.badge,
                    background:
                      c.tipo === "debito" ? "#e63946" : "#ffb703",
                  }}
                >
                  {c.tipo}
                </span>
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
            <option value="">Selecione</option>
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
                R$ {g.valor} - {g.cartaoNome}
                <span
                  style={{
                    ...styles.badge,
                    background:
                      g.tipo === "debito" ? "#e63946" : "#ffb703",
                  }}
                >
                  {g.tipo}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* GRÁFICO */}
        <div style={{ ...styles.card, textAlign: "center" }}>
          <h2>Distribuição de gastos</h2>

          {!hasData && (
            <p style={{ fontSize: "12px", opacity: 0.6 }}>
              Adicione gastos para visualizar o gráfico
            </p>
          )}

          <PieChart width={320} height={260}>
            <Pie
              data={dataGrafico}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
            >
              {dataGrafico.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
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
    fontFamily: "Segoe UI",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  legenda: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  badge: {
    color: "white",
    padding: "5px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    marginLeft: "8px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.25)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "20px",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#0077b6",
    color: "white",
    border: "none",
    borderRadius: "8px",
  },

  erro: {
    color: "red",
  },
};