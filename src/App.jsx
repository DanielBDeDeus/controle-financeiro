import { useState } from "react";

// Importa funções de lógica financeira que já criamos anteriormente
import { calcularSaldoDisponivel, paraNumero } from "./utils/finance";

export default function App() {
  // ==============================
  // STATES (armazenam dados do usuário)
  // ==============================

  // Salário mensal do usuário
  const [salario, setSalario] = useState("");

  // Total gasto no débito
  const [gastoDebito, setGastoDebito] = useState("");

  // Valor da fatura atual do cartão de crédito
  const [faturaAtual, setFaturaAtual] = useState("");

  // ==============================
  // CÁLCULOS
  // ==============================

  // Calcula automaticamente o saldo disponível usando a função utilitária
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
        {/* ==============================
            CARD: USUÁRIO
        ============================== */}
        <div style={styles.card}>
          <h2>Usuário</h2>

          <label>Salário mensal:</label>

          {/* Input controlado → atualiza o state ao digitar */}
          <input
            type="number"
            value={salario}
            onChange={(e) => setSalario(e.target.value)}
            style={styles.input}
          />

          <p>Salário: R$ {salario || 0}</p>
        </div>

        {/* ==============================
            CARD: RESUMO FINANCEIRO
        ============================== */}
        <div style={styles.card}>
          <h2>Resumo</h2>

          {/* Mostra saldo calculado dinamicamente */}
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

        {/* ==============================
            CARD: CARTÕES
        ============================== */}
        <div style={styles.card}>
          <h2>Cartões</h2>
          <p>Nenhum cartão cadastrado</p>
        </div>

        {/* ==============================
            CARD: GASTOS
        ============================== */}
        <div style={styles.card}>
          <h2>Gastos</h2>
          <p>Nenhum gasto registrado</p>
        </div>
      </div>
    </div>
  );
}

// ==============================
// ESTILOS (Glassmorphism / Vista vibe)
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

  // Card com efeito de vidro (glassmorphism)
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
};