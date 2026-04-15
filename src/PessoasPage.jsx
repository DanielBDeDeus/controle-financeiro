import { useState } from "react";
import { paraNumero } from "./utils/finance";
import { useNavigate } from "react-router-dom";

export default function PessoasPage({ pessoas, setPessoas, contas, temaAtivo }) {
  const navigate = useNavigate();

  // ╔══════════════════════════════════════════════╗
  // ║              ESTADOS DO FORMULÁRIO           ║
  // ╚══════════════════════════════════════════════╝

  const [nomePessoa, setNomePessoa] = useState("");
  const [salarioPessoa, setSalarioPessoa] = useState("");
  const [erro, setErro] = useState("");

  // ╔══════════════════════════════════════════════╗
  // ║         CONTROLE DE PAGAMENTO IRREGULAR      ║
  // ╚══════════════════════════════════════════════╝

  const [pagamentoIrregular, setPagamentoIrregular] = useState(false);
  const [dataPagamentoOverride, setDataPagamentoOverride] = useState("");

  // ╔══════════════════════════════════════════════╗
  // ║          CONTROLE DE AJUSTE DE SALDO         ║
  // ╚══════════════════════════════════════════════╝

  const [valorSaldo, setValorSaldo] = useState("");
  const [pessoaSelecionada, setPessoaSelecionada] = useState(null);

  // ╔══════════════════════════════════════════════╗
  // ║              CRIAÇÃO DE PESSOA               ║
  // ╚══════════════════════════════════════════════╝

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

    if (pagamentoIrregular && !dataPagamentoOverride) {
      setErro("Informe a data de pagamento deste mês.");
      return;
    }

    const salario = paraNumero(salarioPessoa);

    const novaPessoa = {
      id: Date.now(),
      nome,
      salario,
      saldo: salario,
      tema: "cassette_neon",

      pagamentoIrregular,
      dataPagamentoOverride: pagamentoIrregular
        ? dataPagamentoOverride
        : null,
    };

    setPessoas((prev) => [...prev, novaPessoa]);

    setNomePessoa("");
    setSalarioPessoa("");
    setErro("");
    setPagamentoIrregular(false);
    setDataPagamentoOverride("");
  }

  // ╔══════════════════════════════════════════════╗
  // ║              EXCLUSÃO DE PESSOA              ║
  // ╚══════════════════════════════════════════════╝

  function excluirPessoa(id) {
    setPessoas((prev) => prev.filter((p) => p.id !== id));
  }

  // ╔══════════════════════════════════════════════╗
  // ║              ALTERAÇÃO DE SALDO              ║
  // ╚══════════════════════════════════════════════╝

  function alterarSaldo(id, valor) {
    const numero = parseFloat(valor.replace(",", "."));
    if (isNaN(numero)) return;

    setPessoas((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, saldo: (p.saldo || 0) + numero } : p
      )
    );

    setValorSaldo("");
    setPessoaSelecionada(null);
  }

  // ╔══════════════════════════════════════════════╗
  // ║        FILTRO DE CONTAS POR PESSOA           ║
  // ╚══════════════════════════════════════════════╝

  function contasDaPessoa(id) {
    return contas.filter((c) => c.quemPagouId === id && !c.pago);
  }

  // ╔══════════════════════════════════════════════╗
  // ║         IDENTIFICA PRÓXIMA CONTA             ║
  // ╚══════════════════════════════════════════════╝

  function proximaConta(id) {
    const lista = contasDaPessoa(id);
    if (lista.length === 0) return null;

    return lista.sort(
      (a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento)
    )[0];
  }

  // ╔══════════════════════════════════════════════╗
  // ║                RENDERIZAÇÃO                 ║
  // ╚══════════════════════════════════════════════╝

  return (
    <div style={pageStyle(temaAtivo)}>
      {/* ╔════════════════════════════════════════╗
          ║                HEADER                 ║
          ╚════════════════════════════════════════╝ */}

      <div style={{ marginBottom: 30 }}>
        <h1 style={{ margin: 0, fontSize: 42 }}>Pessoas</h1>

        <button onClick={() => navigate("/")} style={backButton}>
          ← Voltar
        </button>
      </div>

      {/* ╔════════════════════════════════════════╗
          ║                FORMULÁRIO              ║
          ╚════════════════════════════════════════╝ */}

      <div style={card}>
        <h2>Adicionar pessoa</h2>

        <input
          placeholder="Nome"
          value={nomePessoa}
          onChange={(e) => setNomePessoa(e.target.value)}
          style={input}
        />

        <input
          placeholder="Salário"
          value={salarioPessoa}
          onChange={(e) => {
            const valor = e.target.value
              .replace(/[^\d,]/g, "")
              .replace(/(,.*),/g, "$1");

            setSalarioPessoa(valor);
          }}
          style={input}
        />

        {/* ╔════════════════════════════════════╗
            ║ PAGAMENTO IRREGULAR (TOGGLE)     ║
            ╚════════════════════════════════════╝ */}

        <label style={{ marginTop: 10, display: "block" }}>
          <input
            type="checkbox"
            checked={pagamentoIrregular}
            onChange={(e) => setPagamentoIrregular(e.target.checked)}
          />{" "}
          Recebimento irregular este mês
        </label>

        {/* ╔════════════════════════════════════╗
            ║ DATA DE PAGAMENTO (OVERRIDE)     ║
            ╚════════════════════════════════════╝ */}

        {pagamentoIrregular && (
          <input
            type="date"
            value={dataPagamentoOverride}
            onChange={(e) => setDataPagamentoOverride(e.target.value)}
            style={input}
          />
        )}

        <div style={{ marginTop: 10 }}>
          <button onClick={salvarPessoa} style={button}>
            + Adicionar
          </button>
        </div>

        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </div>

      {/* ╔════════════════════════════════════════╗
          ║              LISTA DE PESSOAS          ║
          ╚════════════════════════════════════════╝ */}

      <div style={{ marginTop: 30 }}>
        {pessoas.map((p) => {
          const contasPessoa = contasDaPessoa(p.id);
          const proxima = proximaConta(p.id);

          return (
            <div key={p.id} style={personCard}>
              <div>
                <strong style={{ fontSize: 18 }}>{p.nome}</strong>

                <div style={{ color: "#c3d0dc", marginTop: 4 }}>
                  Saldo: <strong>R$ {p.saldo}</strong>
                </div>

                {/* ╔══════════════════════════════╗
                    ║ PREVISÃO DE RECEBIMENTO     ║
                    ╚══════════════════════════════╝ */}

                {p.pagamentoIrregular && p.dataPagamentoOverride && (
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    Recebe em{" "}
                    {Math.ceil(
                      (new Date(p.dataPagamentoOverride) - new Date()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    dias
                  </div>
                )}
              </div>

              {/* ╔══════════════════════════════╗
                  ║      BARRA VISUAL DE SALDO   ║
                  ╚══════════════════════════════╝ */}

              <div style={barContainer}>
                <div
                  style={{
                    ...bar,
                    width: `${Math.min(p.saldo / 50, 100)}%`,
                  }}
                />
              </div>

              {/* ╔══════════════════════════════╗
                  ║      CONTROLE DE SALDO       ║
                  ╚══════════════════════════════╝ */}

              {pessoaSelecionada === p.id ? (
                <div>
                  <input
                    placeholder="Valor"
                    value={valorSaldo}
                    onChange={(e) => setValorSaldo(e.target.value)}
                    style={input}
                  />

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => alterarSaldo(p.id, valorSaldo)}
                      style={button}
                    >
                      + Adicionar
                    </button>

                    <button
                      onClick={() =>
                        alterarSaldo(p.id, "-" + valorSaldo)
                      }
                      style={secondary}
                    >
                      - Remover
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setPessoaSelecionada(p.id)}
                  style={secondary}
                >
                  Ajustar saldo
                </button>
              )}

              {/* ╔══════════════════════════════╗
                  ║        CONTAS ASSOCIADAS     ║
                  ╚══════════════════════════════╝ */}

              <div style={{ marginTop: 10 }}>
                <div>Contas pendentes: {contasPessoa.length}</div>

                {proxima && (
                  <div style={{ fontSize: 12 }}>
                    Próxima: {proxima.nome} ({proxima.dataVencimento})
                  </div>
                )}
              </div>

              <button onClick={() => excluirPessoa(p.id)} style={danger}>
                Excluir
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════╗
// ║                ESTILOS GERAIS                ║
// ╚══════════════════════════════════════════════╝

const pageStyle = (temaAtivo = {}) => ({
  minHeight: "100vh",
  padding: 40,
  background: temaAtivo?.pageBg || "#0d141c",
  color: temaAtivo?.title || "#fff",
});

const card = {
  maxWidth: 400,
  padding: 20,
  borderRadius: 20,
  background:
    "linear-gradient(180deg, rgba(25,32,40,0.96) 0%, rgba(18,24,31,0.94) 100%)",
  color: "#dce7f2",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
};

const input = {
  width: "100%",
  padding: "12px 14px",
  marginTop: 10,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#0a0f14",
  color: "#eef5fb",
};

const button = {
  padding: "10px 16px",
  borderRadius: 12,
  background: "linear-gradient(180deg, #48b9ff 0%, #2f87b7 100%)",
  color: "#fff",
  border: "none",
  fontWeight: "700",
  cursor: "pointer",
};

const secondary = {
  marginTop: 10,
  padding: "10px 14px",
  borderRadius: 12,
  background: "rgba(255,255,255,0.05)",
  color: "#dce7f2",
  border: "1px solid rgba(255,255,255,0.08)",
  cursor: "pointer",
};

const danger = {
  marginTop: 10,
  padding: 10,
  borderRadius: 10,
  background: "#ff4d4f",
  color: "#fff",
  border: "none",
};

const backButton = {
  marginTop: 10,
  padding: 10,
  borderRadius: 999,
  background: "#333",
  color: "#fff",
  border: "none",
};

const personCard = {
  padding: 20,
  marginBottom: 16,
  borderRadius: 20,
  background:
    "linear-gradient(180deg, rgba(25,32,40,0.96) 0%, rgba(18,24,31,0.94) 100%)",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
};

const barContainer = {
  height: 8,
  background: "rgba(255,255,255,0.1)",
  borderRadius: 999,
  marginTop: 10,
};

const bar = {
  height: "100%",
  background: "#48b9ff",
  borderRadius: 999,
};