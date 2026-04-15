import { useState } from "react";
import { paraNumero } from "./utils/finance";
import { useNavigate } from "react-router-dom";

export default function PessoasPage({ pessoas, setPessoas, contas, temaAtivo }) {
  const navigate = useNavigate();

  // ╔══════════════════════════════════════════════╗
  // ║              ESTADOS DO FORMULÁRIO           ║
  // ╠══════════════════════════════════════════════╣
  // ║ Estados responsáveis pelos campos base       ║
  // ║ usados para cadastrar uma nova pessoa        ║
  // ╚══════════════════════════════════════════════╝

  const [nomePessoa, setNomePessoa] = useState("");
  const [salarioPessoa, setSalarioPessoa] = useState("");
  const [erro, setErro] = useState("");

  // ╔══════════════════════════════════════════════╗
  // ║         CONTROLE DE PAGAMENTO IRREGULAR      ║
  // ╠══════════════════════════════════════════════╣
  // ║ Permite marcar que, neste mês, a pessoa      ║
  // ║ receberá em uma data diferente da usual      ║
  // ╚══════════════════════════════════════════════╝

  const [pagamentoIrregular, setPagamentoIrregular] = useState(false);
  const [dataPagamentoOverride, setDataPagamentoOverride] = useState("");

  // ╔══════════════════════════════════════════════╗
  // ║          CONTROLE DE AJUSTE DE SALDO         ║
  // ╠══════════════════════════════════════════════╣
  // ║ Estados usados quando o usuário quer         ║
  // ║ adicionar ou remover saldo manualmente       ║
  // ╚══════════════════════════════════════════════╝

  const [valorSaldo, setValorSaldo] = useState("");
  const [pessoaSelecionada, setPessoaSelecionada] = useState(null);

  // ╔══════════════════════════════════════════════╗
  // ║         ESCALA GLOBAL DAS BARRAS DE SALDO    ║
  // ╠══════════════════════════════════════════════╣
  // ║ Define o maior saldo atual entre todas       ║
  // ║ as pessoas para normalizar a largura         ║
  // ║ das barras visuais                           ║
  // ╚══════════════════════════════════════════════╝

  const maiorSaldo = Math.max(...pessoas.map((p) => p.saldo || 0), 1);

  // ╔══════════════════════════════════════════════╗
  // ║              CRIAÇÃO DE PESSOA               ║
  // ╠══════════════════════════════════════════════╣
  // ║ Valida os campos do formulário, converte     ║
  // ║ o salário em número e cria um novo objeto    ║
  // ║ de pessoa no estado global                   ║
  // ╚══════════════════════════════════════════════╝

  function salvarPessoa() {
    // ╔══════════════════════════════════════════╗
    // ║ NORMALIZA O NOME ANTES DE VALIDAR        ║
    // ╚══════════════════════════════════════════╝
    const nome = nomePessoa.trim();

    // ╔══════════════════════════════════════════╗
    // ║ VALIDAÇÃO: NOME OBRIGATÓRIO              ║
    // ╚══════════════════════════════════════════╝
    if (!nome) {
      setErro("Digite um nome.");
      return;
    }

    // ╔══════════════════════════════════════════╗
    // ║ VALIDAÇÃO: SALÁRIO OBRIGATÓRIO           ║
    // ╚══════════════════════════════════════════╝
    if (!salarioPessoa) {
      setErro("Digite um salário.");
      return;
    }

    // ╔══════════════════════════════════════════╗
    // ║ VALIDAÇÃO: DATA CUSTOM OBRIGATÓRIA       ║
    // ║ QUANDO HOUVER PAGAMENTO IRREGULAR        ║
    // ╚══════════════════════════════════════════╝
    if (pagamentoIrregular && !dataPagamentoOverride) {
      setErro("Informe a data de pagamento deste mês.");
      return;
    }

    // ╔══════════════════════════════════════════╗
    // ║ CONVERSÃO DE TEXTO PARA NÚMERO           ║
    // ╚══════════════════════════════════════════╝
    const salario = paraNumero(salarioPessoa);

    // ╔══════════════════════════════════════════╗
    // ║ MONTAGEM DO OBJETO DA NOVA PESSOA        ║
    // ╠══════════════════════════════════════════╣
    // ║ Observação: o saldo inicial entra igual  ║
    // ║ ao salário informado                     ║
    // ╚══════════════════════════════════════════╝
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

    // ╔══════════════════════════════════════════╗
    // ║ ATUALIZA A LISTA GLOBAL DE PESSOAS       ║
    // ╚══════════════════════════════════════════╝
    setPessoas((prev) => [...prev, novaPessoa]);

    // ╔══════════════════════════════════════════╗
    // ║ LIMPA O FORMULÁRIO APÓS O CADASTRO       ║
    // ╚══════════════════════════════════════════╝
    setNomePessoa("");
    setSalarioPessoa("");
    setErro("");
    setPagamentoIrregular(false);
    setDataPagamentoOverride("");
  }

  // ╔══════════════════════════════════════════════╗
  // ║              EXCLUSÃO DE PESSOA              ║
  // ╠══════════════════════════════════════════════╣
  // ║ Remove a pessoa da lista atual               ║
  // ╚══════════════════════════════════════════════╝

  function excluirPessoa(id) {
    setPessoas((prev) => prev.filter((p) => p.id !== id));
  }

  // ╔══════════════════════════════════════════════╗
  // ║              ALTERAÇÃO DE SALDO              ║
  // ╠══════════════════════════════════════════════╣
  // ║ Soma ou subtrai um valor manualmente do      ║
  // ║ saldo atual da pessoa selecionada            ║
  // ╚══════════════════════════════════════════════╝

  function alterarSaldo(id, valor) {
    // ╔══════════════════════════════════════════╗
    // ║ CONVERTE ENTRADA PARA NÚMERO DECIMAL     ║
    // ╚══════════════════════════════════════════╝
    const numero = parseFloat(valor.replace(",", "."));

    // ╔══════════════════════════════════════════╗
    // ║ ABORTA SE O VALOR NÃO FOR VÁLIDO         ║
    // ╚══════════════════════════════════════════╝
    if (isNaN(numero)) return;

    // ╔══════════════════════════════════════════╗
    // ║ ATUALIZA APENAS A PESSOA CORRESPONDENTE  ║
    // ╚══════════════════════════════════════════╝
    setPessoas((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, saldo: (p.saldo || 0) + numero } : p
      )
    );

    // ╔══════════════════════════════════════════╗
    // ║ LIMPA A INTERFACE DE AJUSTE DE SALDO     ║
    // ╚══════════════════════════════════════════╝
    setValorSaldo("");
    setPessoaSelecionada(null);
  }

  // ╔══════════════════════════════════════════════╗
  // ║        FILTRO DE CONTAS POR PESSOA           ║
  // ╠══════════════════════════════════════════════╣
  // ║ Retorna somente contas pendentes ligadas     ║
  // ║ à pessoa informada                           ║
  // ╚══════════════════════════════════════════════╝

  function contasDaPessoa(id) {
    return contas.filter((c) => c.quemPagouId === id && !c.pago);
  }

  // ╔══════════════════════════════════════════════╗
  // ║         IDENTIFICA PRÓXIMA CONTA             ║
  // ╠══════════════════════════════════════════════╣
  // ║ Ordena as contas pendentes por data e        ║
  // ║ retorna a mais próxima do vencimento         ║
  // ╚══════════════════════════════════════════════╝

  function proximaConta(id) {
    // ╔══════════════════════════════════════════╗
    // ║ RECUPERA AS CONTAS DA PESSOA             ║
    // ╚══════════════════════════════════════════╝
    const lista = contasDaPessoa(id);

    // ╔══════════════════════════════════════════╗
    // ║ SE NÃO HOUVER CONTA, NÃO HÁ PRÓXIMA      ║
    // ╚══════════════════════════════════════════╝
    if (lista.length === 0) return null;

    // ╔══════════════════════════════════════════╗
    // ║ ORDENA PELA DATA MAIS PRÓXIMA            ║
    // ╚══════════════════════════════════════════╝
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
          ╠════════════════════════════════════════╣
          ║ Título da página + botão de retorno   ║
          ╚════════════════════════════════════════╝ */}

      <div style={{ marginBottom: 30 }}>
        <h1 style={{ margin: 0, fontSize: 42 }}>Pessoas</h1>

        <button onClick={() => navigate("/")} style={backButton}>
          ← Voltar
        </button>
      </div>

      {/* ╔════════════════════════════════════════╗
          ║                FORMULÁRIO             ║
          ╠════════════════════════════════════════╣
          ║ Área de criação de nova pessoa        ║
          ╚════════════════════════════════════════╝ */}

      <div style={card}>
        <h2>Adicionar pessoa</h2>

        {/* ╔════════════════════════════════════╗
            ║ INPUT: NOME                      ║
            ╚════════════════════════════════════╝ */}
        <input
          placeholder="Nome"
          value={nomePessoa}
          onChange={(e) => setNomePessoa(e.target.value)}
          style={input}
        />

        {/* ╔════════════════════════════════════╗
            ║ INPUT: SALÁRIO                   ║
            ╠════════════════════════════════════╣
            ║ Aceita apenas números e uma      ║
            ║ vírgula decimal                  ║
            ╚════════════════════════════════════╝ */}
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
            ╠════════════════════════════════════╣
            ║ Habilita um campo de data extra  ║
            ║ para sobrescrever o recebimento  ║
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
            ╠════════════════════════════════════╣
            ║ Só aparece quando o toggle       ║
            ║ acima estiver ativo              ║
            ╚════════════════════════════════════╝ */}
        {pagamentoIrregular && (
          <input
            type="date"
            value={dataPagamentoOverride}
            onChange={(e) => setDataPagamentoOverride(e.target.value)}
            style={input}
          />
        )}

        {/* ╔════════════════════════════════════╗
            ║ AÇÃO: SALVAR PESSOA              ║
            ╚════════════════════════════════════╝ */}
        <div style={{ marginTop: 10 }}>
          <button onClick={salvarPessoa} style={button}>
            + Adicionar
          </button>
        </div>

        {/* ╔════════════════════════════════════╗
            ║ FEEDBACK DE ERRO                 ║
            ╚════════════════════════════════════╝ */}
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </div>

      {/* ╔════════════════════════════════════════╗
          ║              LISTA DE PESSOAS         ║
          ╠════════════════════════════════════════╣
          ║ Renderiza um card por pessoa         ║
          ╚════════════════════════════════════════╝ */}

      <div style={{ marginTop: 30 }}>
        {pessoas.map((p) => {
          // ╔══════════════════════════════════╗
          // ║ DADOS DERIVADOS DO CARD         ║
          // ╚══════════════════════════════════╝
          const contasPessoa = contasDaPessoa(p.id);
          const proxima = proximaConta(p.id);

          return (
            <div key={p.id} style={personCard}>
              {/* ╔══════════════════════════════╗
                  ║ CABEÇALHO DO CARD          ║
                  ╠══════════════════════════════╣
                  ║ Nome, saldo atual e        ║
                  ║ previsão de recebimento    ║
                  ╚══════════════════════════════╝ */}
              <div>
                <strong style={{ fontSize: 18 }}>{p.nome}</strong>

                <div style={{ color: "#c3d0dc", marginTop: 4 }}>
                  Saldo:{" "}
                  <strong>
                    {p.saldo.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </div>

                {/* ╔══════════════════════════════╗
                    ║ PREVISÃO DE RECEBIMENTO   ║
                    ╠══════════════════════════════╣
                    ║ Exibe quantos dias faltam ║
                    ║ para o pagamento override ║
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
                  ╠══════════════════════════════╣
                  ║ Largura proporcional ao      ║
                  ║ maior saldo encontrado       ║
                  ╚══════════════════════════════╝ */}
              <div style={barContainer}>
                <div
                  style={{
                    ...bar,
                    width: `${((p.saldo || 0) / maiorSaldo) * 100}%`,
                  }}
                />
              </div>

              {/* ╔══════════════════════════════╗
                  ║      CONTROLE DE SALDO       ║
                  ╠══════════════════════════════╣
                  ║ Alterna entre estado normal  ║
                  ║ e modo de ajuste manual      ║
                  ╚══════════════════════════════╝ */}
              {pessoaSelecionada === p.id ? (
                <div>
                  {/* ╔══════════════════════════╗
                      ║ INPUT: VALOR DO AJUSTE  ║
                      ╚══════════════════════════╝ */}
                  <input
                    placeholder="Valor"
                    value={valorSaldo}
                    onChange={(e) => setValorSaldo(e.target.value)}
                    style={input}
                  />

                  {/* ╔══════════════════════════╗
                      ║ AÇÕES: SOMAR / SUBTRAIR ║
                      ╚══════════════════════════╝ */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => alterarSaldo(p.id, valorSaldo)}
                      style={button}
                    >
                      + Adicionar
                    </button>

                    <button
                      onClick={() => alterarSaldo(p.id, "-" + valorSaldo)}
                      style={secondary}
                    >
                      - Remover
                    </button>
                  </div>
                </div>
              ) : (
                // ╔════════════════════════════╗
                // ║ BOTÃO: ENTRAR EM AJUSTE   ║
                // ╚════════════════════════════╝
                <button
                  onClick={() => setPessoaSelecionada(p.id)}
                  style={secondary}
                >
                  Ajustar saldo
                </button>
              )}

              {/* ╔══════════════════════════════╗
                  ║        CONTAS ASSOCIADAS     ║
                  ╠══════════════════════════════╣
                  ║ Resume quantidade de contas  ║
                  ║ e mostra a próxima           ║
                  ╚══════════════════════════════╝ */}
              <div style={{ marginTop: 10 }}>
                <div>Contas pendentes: {contasPessoa.length}</div>

                {proxima && (
                  <div style={{ fontSize: 12 }}>
                    Próxima: {proxima.nome} ({proxima.dataVencimento})
                  </div>
                )}
              </div>

              {/* ╔══════════════════════════════╗
                  ║      AÇÃO: EXCLUIR PESSOA    ║
                  ╚══════════════════════════════╝ */}
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
// ╠══════════════════════════════════════════════╣
// ║ Blocos de estilo reutilizados pela página    ║
// ╚══════════════════════════════════════════════╝

// ╔══════════════════════════════════════════════╗
// ║ ESTILO: PÁGINA BASE                          ║
// ╚══════════════════════════════════════════════╝
const pageStyle = (temaAtivo = {}) => ({
  minHeight: "100vh",
  padding: 40,
  background: temaAtivo?.pageBg || "#0d141c",
  color: temaAtivo?.title || "#fff",
});

// ╔══════════════════════════════════════════════╗
// ║ ESTILO: CARD DO FORMULÁRIO                   ║
// ╚══════════════════════════════════════════════╝
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

// ╔══════════════════════════════════════════════╗
// ║ ESTILO: INPUT PADRÃO                         ║
// ╚══════════════════════════════════════════════╝
const input = {
  width: "100%",
  padding: "12px 14px",
  marginTop: 10,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#0a0f14",
  color: "#eef5fb",
};

// ╔══════════════════════════════════════════════╗
// ║ ESTILO: BOTÃO PRIMÁRIO                       ║
// ╚══════════════════════════════════════════════╝
const button = {
  padding: "10px 16px",
  borderRadius: 12,
  background: "linear-gradient(180deg, #48b9ff 0%, #2f87b7 100%)",
  color: "#fff",
  border: "none",
  fontWeight: "700",
  cursor: "pointer",
};

// ╔══════════════════════════════════════════════╗
// ║ ESTILO: BOTÃO SECUNDÁRIO                     ║
// ╚══════════════════════════════════════════════╝
const secondary = {
  marginTop: 10,
  padding: "10px 14px",
  borderRadius: 12,
  background: "rgba(255,255,255,0.05)",
  color: "#dce7f2",
  border: "1px solid rgba(255,255,255,0.08)",
  cursor: "pointer",
};

// ╔══════════════════════════════════════════════╗
// ║ ESTILO: BOTÃO DE PERIGO                      ║
// ╚══════════════════════════════════════════════╝
const danger = {
  marginTop: 10,
  padding: 10,
  borderRadius: 10,
  background: "#ff4d4f",
  color: "#fff",
  border: "none",
};

// ╔══════════════════════════════════════════════╗
// ║ ESTILO: BOTÃO VOLTAR                         ║
// ╚══════════════════════════════════════════════╝
const backButton = {
  marginTop: 10,
  padding: 10,
  borderRadius: 999,
  background: "#333",
  color: "#fff",
  border: "none",
};

// ╔══════════════════════════════════════════════╗
// ║ ESTILO: CARD DE CADA PESSOA                  ║
// ╚══════════════════════════════════════════════╝
const personCard = {
  padding: 20,
  marginBottom: 16,
  borderRadius: 20,
  background:
    "linear-gradient(180deg, rgba(25,32,40,0.96) 0%, rgba(18,24,31,0.94) 100%)",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
};

// ╔══════════════════════════════════════════════╗
// ║ ESTILO: CONTAINER DA BARRA                   ║
// ╚══════════════════════════════════════════════╝
const barContainer = {
  height: 8,
  background: "rgba(255,255,255,0.1)",
  borderRadius: 999,
  marginTop: 10,
};

// ╔══════════════════════════════════════════════╗
// ║ ESTILO: BARRA DE SALDO                       ║
// ╚══════════════════════════════════════════════╝
const bar = {
  height: "100%",
  background: "#48b9ff",
  borderRadius: 999,
};