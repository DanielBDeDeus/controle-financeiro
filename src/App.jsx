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

  // Salário mensal do usuário
  const [salario, setSalario] = useState("");

  // Total acumulado de gastos em débito
  const [gastoDebito, setGastoDebito] = useState("");

  // Total acumulado da fatura atual de crédito
  const [faturaAtual, setFaturaAtual] = useState("");

  // ==============================
  // STATES DE CARTÕES
  // ==============================

  // Lista de cartões cadastrados
  const [cartoes, setCartoes] = useState([]);

  // Nome do cartão digitado no formulário
  const [nomeCartao, setNomeCartao] = useState("");

  // Tipo do cartão selecionado
  const [tipoCartao, setTipoCartao] = useState("credito");

  // Mensagem de erro ao cadastrar cartão
  const [erroCartao, setErroCartao] = useState("");

  // ==============================
  // STATES DE GASTOS
  // ==============================

  // Lista de gastos cadastrados
  const [gastos, setGastos] = useState([]);

  // Nome do gasto
  const [nomeGasto, setNomeGasto] = useState("");

  // Valor do gasto
  const [valorGasto, setValorGasto] = useState("");

  // Cartão selecionado para o gasto
  const [cartaoSelecionado, setCartaoSelecionado] = useState("");

  // Mensagem de erro ao cadastrar gasto
  const [erroGasto, setErroGasto] = useState("");

  // ==============================
  // FUNÇÃO: ADICIONAR CARTÃO
  // ==============================

  function adicionarCartao() {
    // Normaliza o nome para evitar duplicidade boba com caixa alta/baixa
    const nomeNormalizado = nomeCartao.trim().toLowerCase();

    // Validação: nome obrigatório
    if (!nomeNormalizado) {
      setErroCartao("Digite um nome para o cartão.");
      return;
    }

    // Regra de negócio:
    // mesmo nome + mesmo tipo = proibido
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

    // Salva o cartão na lista
    setCartoes([...cartoes, novoCartao]);

    // Limpa formulário e erro
    setNomeCartao("");
    setErroCartao("");
  }

  // ==============================
  // FUNÇÃO: ADICIONAR GASTO
  // ==============================

  function adicionarGasto() {
    const nomeNormalizado = nomeGasto.trim();

    // Validação: nome obrigatório
    if (!nomeNormalizado) {
      setErroGasto("Digite um nome para o gasto.");
      return;
    }

    // Validação: valor obrigatório
    if (!valorGasto) {
      setErroGasto("Digite um valor para o gasto.");
      return;
    }

    // Validação: cartão obrigatório
    if (!cartaoSelecionado) {
      setErroGasto("Selecione um cartão.");
      return;
    }

    // Busca o cartão selecionado
    const cartao = cartoes.find(
      (cartaoExistente) => cartaoExistente.id === Number(cartaoSelecionado)
    );

    // Segurança extra
    if (!cartao) {
      setErroGasto("Cartão inválido.");
      return;
    }

    // Converte o valor para número seguro
    const valor = paraNumero(valorGasto);

    // Cria o gasto
    const novoGasto = {
      id: Date.now(),
      nome: nomeNormalizado,
      valor,
      cartaoNome: cartao.nome,
      tipo: cartao.tipo,
    };

    // Salva na lista
    setGastos([...gastos, novoGasto]);

    // Atualiza os totais automáticos
    if (cartao.tipo === "debito") {
      setGastoDebito((valorAnterior) => paraNumero(valorAnterior) + valor);
    } else {
      setFaturaAtual((valorAnterior) => paraNumero(valorAnterior) + valor);
    }

    // Limpa formulário e erro
    setNomeGasto("");
    setValorGasto("");
    setErroGasto("");
  }

  // ==============================
  // CÁLCULOS
  // ==============================

  // Calcula o saldo disponível
  const saldoDisponivel = calcularSaldoDisponivel(
    paraNumero(salario),
    paraNumero(gastoDebito),
    paraNumero(faturaAtual)
  );

  // Dados do gráfico
  const dataGrafico = [
    { name: "Débito", value: paraNumero(gastoDebito) || 0 },
    { name: "Crédito", value: paraNumero(faturaAtual) || 0 },
  ];

  // Cores do gráfico alinhadas com o restante da UI
  const COLORS = ["#ff6b6b", "#f4a261"];

  // Só mostra gráfico quando existir ao menos 1 gasto cadastrado
  const mostrarGrafico = gastos.length > 0;

  // ==============================
  // RENDER
  // ==============================

  return (
    <div style={styles.container}>
      <div style={styles.shell}>
        <h1 style={styles.title}>Controle Financeiro</h1>

        {/* LEGENDA */}
        <div style={styles.legenda}>
          <span style={{ ...styles.badge, ...styles.badgeDebito }}>
            Débito (sai do dinheiro agora)
          </span>

          <span style={{ ...styles.badge, ...styles.badgeCredito }}>
            Crédito (vai para fatura)
          </span>

          <span style={{ ...styles.badge, ...styles.badgeSaldo }}>
            Saldo disponível
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

            <p style={{ ...styles.resumoTexto, ...styles.resumoSaldo }}>
              Saldo: R$ {saldoDisponivel}
            </p>

            <p style={{ ...styles.resumoTexto, ...styles.resumoDebito }}>
              Débito: R$ {gastoDebito}
            </p>

            <p style={{ ...styles.resumoTexto, ...styles.resumoCredito }}>
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
                      ...styles.badgeMini,
                      ...(cartao.tipo === "debito"
                        ? styles.badgeDebito
                        : styles.badgeCredito),
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
              type="text"
              placeholder="Nome do gasto"
              value={nomeGasto}
              onChange={(e) => setNomeGasto(e.target.value)}
              style={styles.input}
            />

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

            {erroGasto && <p style={styles.erro}>{erroGasto}</p>}

            <ul style={styles.lista}>
              {gastos.map((gasto) => (
                <li key={gasto.id} style={styles.itemLista}>
                  <span>
                    {gasto.nome} - R$ {gasto.valor} - {gasto.cartaoNome}
                  </span>

                  <span
                    style={{
                      ...styles.badgeMini,
                      ...(gasto.tipo === "debito"
                        ? styles.badgeDebito
                        : styles.badgeCredito),
                    }}
                  >
                    {gasto.tipo}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ===================== CARD: GRÁFICO / PLACEHOLDER ===================== */}
          <div style={{ ...styles.card, ...styles.cardGrafico }}>
            <h2 style={styles.cardTitle}>Distribuição de gastos</h2>

            {!mostrarGrafico ? (
              <div style={styles.placeholderGrafico}>
                <p style={styles.textoAuxiliar}>
                  O gráfico aparecerá depois que você cadastrar ao menos um gasto.
                </p>
              </div>
            ) : (
              <div style={styles.graficoWrapper}>
                <PieChart width={320} height={260}>
                  <Pie
                    data={dataGrafico}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={700}
                    animationEasing="ease-out"
                  >
                    {dataGrafico.map((item, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            )}
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
    background:
      "linear-gradient(180deg, #d6ecff 0%, #c4def7 45%, #b8d5f0 100%)",
    padding: "32px",
    boxSizing: "border-box",
    overflowX: "hidden",
    fontFamily:
      '"Segoe UI", "Trebuchet MS", "Verdana", sans-serif',
  },

  // "Moldura" central para dar sensação mais organizada
  shell: {
    maxWidth: "1400px",
    margin: "0 auto",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#16324f",
    textShadow: "0 1px 0 rgba(255,255,255,0.6)",
    letterSpacing: "0.5px",
    fontSize: "56px",
    fontWeight: "700",
  },

  legenda: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },

  badge: {
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    whiteSpace: "nowrap",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  badgeMini: {
    color: "#ffffff",
    padding: "5px 10px",
    borderRadius: "10px",
    fontSize: "12px",
    marginLeft: "10px",
    whiteSpace: "nowrap",
  },

  badgeDebito: {
    background: "#e85d75",
  },

  badgeCredito: {
    background: "#e9a03b",
  },

  badgeSaldo: {
    background: "#2d9d8f",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
    alignItems: "start",
  },

  // Visual mais cassette-futurism minimalista:
  // menos vidro exagerado, mais painel translúcido limpo
  card: {
    background: "rgba(255, 255, 255, 0.22)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    borderRadius: "18px",
    padding: "18px",
    color: "#1d3557",
    height: "fit-content",
    boxShadow:
      "0 10px 24px rgba(40, 80, 120, 0.12), inset 0 1px 0 rgba(255,255,255,0.35)",
  },

  cardGrafico: {
    textAlign: "center",
  },

  cardTitle: {
    color: "#1a4f74",
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "22px",
    fontWeight: "700",
  },

  label: {
    color: "#234b6f",
    fontWeight: "600",
    display: "block",
    marginBottom: "6px",
  },

  resumoTexto: {
    margin: "10px 0",
    fontSize: "17px",
    fontWeight: "600",
  },

  resumoSaldo: {
    color: "#2d9d8f",
  },

  resumoDebito: {
    color: "#e85d75",
  },

  resumoCredito: {
    color: "#e9a03b",
  },

  textoAuxiliar: {
    fontSize: "14px",
    opacity: 0.82,
    margin: 0,
    color: "#486581",
    lineHeight: "1.5",
  },

  placeholderGrafico: {
    minHeight: "260px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
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
    padding: "12px 14px",
    margin: "10px 0",
    borderRadius: "10px",
    border: "1px solid rgba(0, 0, 0, 0.12)",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.82)",
    color: "#17324d",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#2f87b7",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    boxShadow: "0 4px 10px rgba(47, 135, 183, 0.2)",
  },

  erro: {
    color: "#c1121f",
    fontWeight: "700",
    marginTop: "10px",
    marginBottom: 0,
  },

  lista: {
    paddingLeft: "20px",
    marginTop: "16px",
    marginBottom: 0,
  },

  itemLista: {
    marginBottom: "12px",
    color: "#355070",
    lineHeight: "1.4",
  },
};