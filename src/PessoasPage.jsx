import { useState } from "react";
import { paraNumero } from "./utils/finance";
import { useNavigate } from "react-router-dom";

export default function PessoasPage({ pessoas, setPessoas }) {
  const navigate = useNavigate();

  const [nomePessoa, setNomePessoa] = useState("");
  const [salarioPessoa, setSalarioPessoa] = useState("");
  const [erro, setErro] = useState("");

  function salvarPessoa() {
    const nome = nomePessoa.trim();

    if (!nome) {
      setErro("Digite um nome.");
      return;
    }

    if (!salarioPessoa) {
      setErro("Digite um salário.");
      return;
    }

    const salario = paraNumero(salarioPessoa);

    const novaPessoa = {
      id: Date.now(),
      nome,
      salario,
      saldo: salario,
      tema: "cassette_neon",
    };

    setPessoas((prev) => [...prev, novaPessoa]);

    setNomePessoa("");
    setSalarioPessoa("");
    setErro("");
  }

  function excluirPessoa(id) {
    setPessoas((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 40,
        background:
          "radial-gradient(circle at top left, rgba(72,185,255,0.10), transparent 28%), linear-gradient(180deg, #0d141c 0%, #0a1016 100%)",
        color: "#eaf2fb",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ margin: 0, fontSize: 42 }}>Pessoas</h1>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: 12,
            padding: "10px 16px",
            borderRadius: 999,
            border: "none",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          ← Voltar
        </button>
      </div>

      {/* CARD */}
      <div
        style={{
          maxWidth: 500,
          padding: 20,
          borderRadius: 20,
          background:
            "linear-gradient(180deg, rgba(245,248,252,0.96) 0%, rgba(225,232,240,0.94) 100%)",
          color: "#1b3147",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Adicionar pessoa</h2>

        <input
          placeholder="Nome"
          value={nomePessoa}
          onChange={(e) => setNomePessoa(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Salário"
          value={salarioPessoa}
          onChange={(e) => setSalarioPessoa(e.target.value)}
          style={inputStyle}
        />

        <button onClick={salvarPessoa} style={buttonStyle}>
          Adicionar
        </button>

        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </div>

      {/* LISTA */}
      <div style={{ marginTop: 30, maxWidth: 500 }}>
        {pessoas.map((p) => (
          <div key={p.id} style={itemStyle}>
            <div>
              <strong>{p.nome}</strong>
              <div>R$ {p.salario}</div>
            </div>

            <button
              onClick={() => excluirPessoa(p.id)}
              style={deleteButton}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== styles =====

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: 10,
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.1)",
};

const buttonStyle = {
  width: "100%",
  marginTop: 12,
  padding: "12px",
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(180deg, #48b9ff 0%, #2f87b7 100%)",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
};

const itemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 14,
  marginTop: 10,
  borderRadius: 12,
  background: "rgba(255,255,255,0.08)",
};

const deleteButton = {
  background: "rgba(255,0,0,0.15)",
  border: "none",
  padding: "8px 12px",
  borderRadius: 10,
  cursor: "pointer",
  color: "#fff",
};