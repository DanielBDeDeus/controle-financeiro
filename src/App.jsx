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
    background: "#cfefff",
    padding: "30px",
    fontFamily: "Segoe UI, sans-serif",
  },

  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#005f99",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  input: {
    width: "100%",
    padding: "8px",
    marginTop: "10px",
    marginBottom: "10px",
  },
};