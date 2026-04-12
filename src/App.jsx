import { useState } from "react";
import { calcularSaldoDisponivel, paraNumero } from "./utils/finance";

// ==============================
// IMPORTS DO GRÁFICO
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
  // STATES PRINCIPAIS
  // ==============================

  // Salário mensal informado pelo usuário
  const [salario, setSalario] = useState("");

  // Total acumulado de gastos em débito
  const [gastoDebito, setGastoDebito] = useState("");

  // Total acumulado da fatura atual do crédito
  const [faturaAtual, setFaturaAtual] = useState("");

  // ==============================
  // STATES DE CARTÕES
  // ==============================

  // Lista de cartões cadastrados
  const [cartoes, setCartoes] = useState([]);

  // Campo de nome do cartão
  const [nomeCartao, setNomeCartao] = useState("");

  // Tipo do cartão selecionado no formulário
  const [tipoCartao, setTipoCartao] = useState("credito");

  // Mensagem de erro relacionada ao cadastro de cartões
  const [erroCartao, setErroCartao] = useState("");

  // ==============================
  // STATES DE GASTOS
  // ==============================

  // Lista de gastos cadastrados
  const [gastos, setGastos] = useState([]);

  // Campo de valor do gasto
  const [valorGasto, setValorGasto] = useState("");

  // ID do cartão selecionado para vincular o gasto
  const [cartaoSelecionado, setCartaoSelecionado] = useState("");

  // ==============================
  // FUNÇÃO: ADICIONAR CARTÃO
  // ==============================

  function adicionarCartao() {
    // Normaliza o nome para evitar problemas com espaços e maiúsculas/minúsculas
    const nomeNormalizado = nomeCartao.trim().toLowerCase();

    // Regra 1: nome do cartão não pode estar vazio
    if (!nomeNormalizado) {
      setErroCartao("Digite um nome para o cartão.");
      return;
    }

    // Regra 2: não pode existir cartão com MESMO nome + MESMO tipo
    const duplicado = cartoes.some(
      (cartaoExistente) =>
        cartaoExistente.nome.toLowerCase() === nomeNormalizado &&
        cartaoExistente.tipo === tipoCartao
    );

    if (duplicado) {
      setErroCartao("Esse cartão já existe com esse tipo.");
      return;
    }

    // Cria o novo cartão
    const novoCartao = {
      id: Date.now(),
      nome: nomeCartao.trim(),
      tipo: tipoCartao,
    };

    // Salva o novo cartão na lista
    setCartoes([...cartoes, novoCartao]);

    // Limpa campos e erros
    setNomeCartao("");
    setErroCartao("");
  }

  // ==============================
  // FUNÇÃO: ADICIONAR GASTO
  // ==============================

  function adicionarGasto() {
    // Só adiciona se houver valor e cartão selecionado
    if (!valorGasto || !cartaoSelecionado) return;

    // Busca o cartão correspondente
    const cartao = cartoes.find(
      (cartaoExistente) => cartaoExistente.id === Number(cartaoSelecionado)
    );

    // Segurança extra: se por algum motivo o cartão não existir, aborta
    if (!cartao) return;

    // Converte o valor para número seguro
    const valor = paraNumero(valorGasto);

    // Cria o objeto do novo gasto
    const novoGasto = {
      id: Date.now(),
      valor,
      cartaoNome: cartao.nome,
      tipo: cartao.tipo,
    };

    // Adiciona à lista
    setGastos([...gastos, novoGasto]);

    // Atualiza os totais automaticamente conforme o tipo do cartão
    if (cartao.tipo === "debito") {
      setGastoDebito((valorAnterior) => paraNumero(valorAnterior) + valor);
    } else {
      setFaturaAtual((valorAnterior) => paraNumero(valorAnterior) + valor);
    }

    // Limpa apenas o campo do valor
    setValorGasto("");
  }

  // ==============================
  // CÁLCULOS PRINCIPAIS
  // ==============================

  // Calcula saldo disponível com base na função utilitária
  const saldoDisponivel = calcularSaldoDisponivel(
    paraNumero(salario),
    paraNumero(gastoDebito),
    paraNumero(faturaAtual)
  );

  // ==============================
  // DADOS DO GRÁFICO
  // ==============================

  // Dados reais do gráfico
  const rawData = [
    { name: "Débito", value: paraNumero(gastoDebito) || 0 },
    { name: "Crédito", value: paraNumero(faturaAtual) || 0 },
  ];

  // Verifica se existe ao menos algum valor > 0
  const hasData = rawData.some((item) => item.value > 0);

  // Se não houver dados, usamos um fallback simples para o componente não "sumir"
  const dataGrafico = hasData
    ? rawData
    : [
        { name: "Débito", value: 1 },
        { name: "Crédito", value: 1 },
      ];

  // Cores alinhadas com a legenda do sistema
  const COLORS = ["#e63946", "#ffb703"];

  // ==============================
  // RENDER
  // ==============================

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Controle Financeiro</h1>

      {/* LEGENDA VISUAL */}
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
        {/* ===================== CARD: USUÁRIO ===================== */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Usuário</h2>

          <label style={styles.label}>Salário:</label>
          <input
            type="number"
            value={salario}
            onChange={(e) => setSalario(e.target.value)}
            style={styles.input}
            placeholder="Salário"
          />
        </div>

        {/* ===================== CARD: RESUMO ===================== */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Resumo</h2>

          <p style={{ ...styles.resumoTexto, color: "#2a9d8f", fontWeight: "bold" }}>
            Saldo: R$ {saldoDisponivel}
          </p>

          <p style={{ ...styles.resumoTexto, color: "#e63946" }}>
            Débito: R$ {gastoDebito}
          </p>

          <p style={{ ...styles.resumoTexto, color: "#ffb703" }}>
            Fatura: R$ {faturaAtual}
          </p>
        </div>

        {/* ===================== CARD: CARTÕES ===================== */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Cartões</h2>

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

          <ul style={styles.lista}>
            {cartoes.map((cartao) => (
              <li key={cartao.id} style={styles.itemLista}>
                <span>{cartao.nome}</span>

                <span
                  style={{
                    ...styles.badge,
                    background:
                      cartao.tipo === "debito" ? "#e63946" : "#ffb703",
                  }}
                >
                  {cartao.tipo}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ===================== CARD: GASTOS ===================== */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Gastos</h2>

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
            {cartoes.map((cartao) => (
              <option key={cartao.id} value={cartao.id}>
                {cartao.nome} ({cartao.tipo})
              </option>
            ))}
          </select>

          <button onClick={adicionarGasto} style={styles.button}>
            Adicionar gasto
          </button>

          <ul style={styles.lista}>
            {gastos.map((gasto) => (
              <li key={gasto.id} style={styles.itemLista}>
                <span>
                  R$ {gasto.valor} - {gasto.cartaoNome}
                </span>

                <span
                  style={{
                    ...styles.badge,
                    background:
                      gasto.tipo === "debito" ? "#e63946" : "#ffb703",
                  }}
                >
                  {gasto.tipo}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ===================== CARD: GRÁFICO ===================== */}
        <div style={{ ...styles.card, ...styles.cardGrafico }}>
          <h2 style={styles.cardTitle}>Distribuição de gastos</h2>

          {!hasData && (
            <p style={styles.textoAuxiliar}>
              Adicione gastos para visualizar o gráfico
            </p>
          )}

          <div style={styles.graficoWrapper}>
            <PieChart width={320} height={260}>
              <Pie
                data={dataGrafico}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
              >
                {dataGrafico.map((item, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </div>
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
    width: "100%",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #a8d8ff, #d6f0ff)",
    padding: "40px",
    boxSizing: "border-box",
    overflowX: "hidden",
    fontFamily: "Segoe UI, sans-serif",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#023047",
    textShadow: "0 2px 8px rgba(255,255,255,0.35)",
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
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    marginLeft: "8px",
    display: "inline-flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    alignItems: "start",
  },

  card: {
    background: "rgba(255, 255, 255, 0.28)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.45)",
    borderRadius: "16px",
    padding: "20px",
    color: "#023047",
    height: "fit-content",
    boxShadow: "0 8px 24px rgba(0, 70, 120, 0.12)",
  },

  cardGrafico: {
    textAlign: "center",
  },

  cardTitle: {
    color: "#0b4f6c",
    marginTop: 0,
    marginBottom: "16px",
  },

  label: {
    color: "#0b4f6c",
    fontWeight: "600",
  },

  resumoTexto: {
    margin: "8px 0",
    fontSize: "16px",
  },

  textoAuxiliar: {
    fontSize: "12px",
    opacity: 0.7,
    marginBottom: "10px",
    color: "#355070",
  },

  graficoWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "260px",
    overflow: "hidden",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid rgba(0, 0, 0, 0.15)",
    boxSizing: "border-box",
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
    color: "#d00000",
    fontWeight: "600",
  },

  lista: {
    paddingLeft: "20px",
    marginTop: "16px",
    marginBottom: 0,
  },

  itemLista: {
    marginBottom: "10px",
    color: "#355070",
  },
};