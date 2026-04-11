import { useState } from "react";

export default function App() {
  const [salario, setSalario] = useState("");

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Controle Financeiro</h1>

      <div style={styles.grid}>
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

        <div style={styles.card}>
          <h2>Resumo</h2>
          <p>Saldo disponível: R$ 0</p>
          <p>Gastos no débito: R$ 0</p>
          <p>Fatura atual: R$ 0</p>
        </div>

        <div style={styles.card}>
          <h2>Cartões</h2>
          <p>Nenhum cartão cadastrado</p>
        </div>

        <div style={styles.card}>
          <h2>Gastos</h2>
          <p>Nenhum gasto registrado</p>
        </div>
      </div>
    </div>
  );
}

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
};