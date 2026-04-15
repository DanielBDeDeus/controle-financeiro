import { useState } from "react";
import { paraNumero } from "./utils/finance";

export default function PessoasPage({ pessoas, setPessoas }) {
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
    <div style={{ padding: 40 }}>
      <h1>Pessoas</h1>

      {/* FORM */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Nome"
          value={nomePessoa}
          onChange={(e) => setNomePessoa(e.target.value)}
        />

        <input
          placeholder="Salário"
          value={salarioPessoa}
          onChange={(e) => setSalarioPessoa(e.target.value)}
        />

        <button onClick={salvarPessoa}>Adicionar</button>

        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </div>

      {/* LISTA */}
      <ul>
        {pessoas.map((p) => (
          <li key={p.id}>
            {p.nome} — R$ {p.salario}
            <button onClick={() => excluirPessoa(p.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}