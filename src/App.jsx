import { useEffect, useMemo, useState } from "react";
import { paraNumero } from "./utils/finance";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ╔══════════════════════════════════════════════╗
// ║                  GRÁFICO                     ║
// ╚══════════════════════════════════════════════╝
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";

// ==============================
// CHAVES DO LOCALSTORAGE
// ==============================
const STORAGE_KEYS = {
  pessoas: "controle-financeiro:pessoas",
  gastoDebito: "controle-financeiro:gasto-debito",
  faturaAtual: "controle-financeiro:fatura-atual",
  cartoes: "controle-financeiro:cartoes",
  gastos: "controle-financeiro:gastos",
  perfilAtivo: "controle-financeiro:perfil-ativo",
  resetEtapa: "controle-financeiro:reset-etapa",
  contas: "controle-financeiro:contas",
};

// ╔══════════════════════════════════════════════╗
// ║             TEMAS PREDEFINIDOS               ║
// ╚══════════════════════════════════════════════╝
const THEMES = {
  cassette_neon: {
    label: "Cassette Neon",
    pageBg:
      "radial-gradient(circle at top left, rgba(72,185,255,0.10), transparent 28%), radial-gradient(circle at top right, rgba(87,211,164,0.08), transparent 18%), linear-gradient(180deg, #0d141c 0%, #0a1016 100%)",
    shellBg:
      "linear-gradient(180deg, rgba(18,24,32,0.94) 0%, rgba(12,17,24,0.96) 100%)",
    shellBorder: "rgba(255,255,255,0.08)",
    shellShadow:
      "0 24px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
    title: "#eaf2fb",
    subtitle: "#8fa2b8",
    machineLabel: "#95a2b3",
    cardBg:
      "linear-gradient(180deg, rgba(245,248,252,0.96) 0%, rgba(225,232,240,0.94) 100%)",
    cardBorder: "rgba(255,255,255,0.6)",
    cardTitle: "#1b3147",
    cardText: "#223548",
    chipBg: "rgba(17,24,39,0.06)",
    chipBorder: "rgba(17,24,39,0.08)",
    chipText: "#5c6b7b",
    inputBg: "#111821",
    inputText: "#f2f7fb",
    inputBorder: "rgba(19, 33, 48, 0.12)",
    kpiBg: "rgba(255,255,255,0.45)",
    kpiBorder: "rgba(0,0,0,0.05)",
    rowBg: "rgba(255,255,255,0.42)",
    rowBorder: "rgba(0,0,0,0.04)",
    buttonBg: "linear-gradient(180deg, #48b9ff 0%, #2f87b7 100%)",
    buttonShadow: "0 8px 20px rgba(47, 135, 183, 0.22)",
    buttonSecondaryBg: "rgba(17,24,39,0.08)",
    buttonSecondaryText: "#203243",
    buttonSecondaryBorder: "rgba(17,24,39,0.12)",
    urgency: {
  normal: {},
  medio: {
    border: "1px solid #ffb84d",
    bg: "rgba(255,184,77,0.08)",
  },
  alto: {
    border: "2px solid #ff4d4f",
    bg: "rgba(255,77,79,0.12)",
  },
  critico: {
    border: "2px solid #ff0000",
    glow: "0 0 10px rgba(255,0,0,0.5)",
  },
  atrasado: {
    border: "2px solid #ff0000",
    bg: "rgba(255,0,0,0.08)",
  }
},
  },

  vista_glass: {
    label: "Vista Glass",
    pageBg:
      "radial-gradient(circle at top left, rgba(130,212,255,0.18), transparent 24%), radial-gradient(circle at bottom right, rgba(173,255,244,0.14), transparent 22%), linear-gradient(180deg, #b8dcff 0%, #dff3ff 50%, #c8ebff 100%)",
    shellBg:
      "linear-gradient(180deg, rgba(234,246,255,0.58) 0%, rgba(202,232,255,0.46) 100%)",
    shellBorder: "rgba(255,255,255,0.75)",
    shellShadow:
      "0 24px 80px rgba(59,104,148,0.20), inset 0 1px 0 rgba(255,255,255,0.85)",
    title: "#1b4f7a",
    subtitle: "#4e7391",
    machineLabel: "#5e7b93",
    cardBg:
      "linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(236,247,255,0.70) 100%)",
    cardBorder: "rgba(255,255,255,0.85)",
    cardTitle: "#244e73",
    cardText: "#2f4d66",
    chipBg: "rgba(255,255,255,0.55)",
    chipBorder: "rgba(54,100,140,0.12)",
    chipText: "#5a7690",
    inputBg: "rgba(238,248,255,0.95)",
    inputText: "#24445c",
    inputBorder: "rgba(65, 114, 157, 0.15)",
    kpiBg: "rgba(255,255,255,0.62)",
    kpiBorder: "rgba(65,114,157,0.08)",
    rowBg: "rgba(255,255,255,0.58)",
    rowBorder: "rgba(65,114,157,0.08)",
    buttonBg: "linear-gradient(180deg, #6cc9ff 0%, #3f99d3 100%)",
    buttonShadow: "0 8px 20px rgba(63, 153, 211, 0.22)",
    buttonSecondaryBg: "rgba(255,255,255,0.50)",
    buttonSecondaryText: "#24445c",
    buttonSecondaryBorder: "rgba(65,114,157,0.12)",
  },

  msn_bubblegum: {
    label: "MSN Bubblegum",
    pageBg:
      "radial-gradient(circle at top left, rgba(255,167,214,0.18), transparent 22%), radial-gradient(circle at top right, rgba(143,221,255,0.18), transparent 22%), linear-gradient(180deg, #f6dfff 0%, #e9f7ff 52%, #d8eeff 100%)",
    shellBg:
      "linear-gradient(180deg, rgba(255,247,255,0.82) 0%, rgba(239,247,255,0.76) 100%)",
    shellBorder: "rgba(255,255,255,0.82)",
    shellShadow:
      "0 24px 80px rgba(117,81,136,0.16), inset 0 1px 0 rgba(255,255,255,0.88)",
    title: "#6f4b8b",
    subtitle: "#7a6d88",
    machineLabel: "#8c7ea0",
    cardBg:
      "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(247,241,255,0.88) 100%)",
    cardBorder: "rgba(255,255,255,0.90)",
    cardTitle: "#684d84",
    cardText: "#5d5670",
    chipBg: "rgba(255,255,255,0.65)",
    chipBorder: "rgba(111,75,139,0.10)",
    chipText: "#7e6f95",
    inputBg: "#fff7ff",
    inputText: "#5d5670",
    inputBorder: "rgba(111,75,139,0.10)",
    kpiBg: "rgba(255,255,255,0.70)",
    kpiBorder: "rgba(111,75,139,0.08)",
    rowBg: "rgba(255,255,255,0.68)",
    rowBorder: "rgba(111,75,139,0.08)",
    buttonBg: "linear-gradient(180deg, #8fd8ff 0%, #6fa9ff 100%)",
    buttonShadow: "0 8px 20px rgba(111, 169, 255, 0.20)",
    buttonSecondaryBg: "rgba(255,255,255,0.52)",
    buttonSecondaryText: "#5d5670",
    buttonSecondaryBorder: "rgba(111,75,139,0.10)",
  },

  midnight_terminal: {
    label: "Midnight Terminal",
    pageBg:
      "radial-gradient(circle at top left, rgba(74,180,165,0.10), transparent 22%), radial-gradient(circle at bottom right, rgba(255,184,77,0.08), transparent 18%), linear-gradient(180deg, #070b10 0%, #0c1117 100%)",
    shellBg:
      "linear-gradient(180deg, rgba(11,17,22,0.96) 0%, rgba(8,12,16,0.98) 100%)",
    shellBorder: "rgba(106,139,173,0.12)",
    shellShadow:
      "0 24px 80px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.03)",
    title: "#dfeaf5",
    subtitle: "#8a9bab",
    machineLabel: "#7f919f",
    cardBg:
      "linear-gradient(180deg, rgba(25,32,40,0.96) 0%, rgba(18,24,31,0.94) 100%)",
    cardBorder: "rgba(106,139,173,0.12)",
    cardTitle: "#dce7f2",
    cardText: "#c3d0dc",
    chipBg: "rgba(255,255,255,0.04)",
    chipBorder: "rgba(255,255,255,0.06)",
    chipText: "#98a9ba",
    inputBg: "#0a0f14",
    inputText: "#eef5fb",
    inputBorder: "rgba(106,139,173,0.12)",
    kpiBg: "rgba(255,255,255,0.04)",
    kpiBorder: "rgba(255,255,255,0.06)",
    rowBg: "rgba(255,255,255,0.04)",
    rowBorder: "rgba(255,255,255,0.05)",
    buttonBg: "linear-gradient(180deg, #52b7c7 0%, #2d7481 100%)",
    buttonShadow: "0 8px 20px rgba(45, 116, 129, 0.20)",
    buttonSecondaryBg: "rgba(255,255,255,0.04)",
    buttonSecondaryText: "#dce7f2",
    buttonSecondaryBorder: "rgba(255,255,255,0.06)",
  },

  household_warm: {
    label: "Household Warm",
    pageBg:
      "radial-gradient(circle at top left, rgba(255,209,168,0.18), transparent 24%), radial-gradient(circle at bottom right, rgba(155,219,201,0.16), transparent 22%), linear-gradient(180deg, #f2e2d2 0%, #efe6dd 52%, #dfe9e4 100%)",
    shellBg:
      "linear-gradient(180deg, rgba(88,68,58,0.92) 0%, rgba(70,56,49,0.95) 100%)",
    shellBorder: "rgba(255,255,255,0.10)",
    shellShadow:
      "0 24px 80px rgba(72,50,39,0.26), inset 0 1px 0 rgba(255,255,255,0.05)",
    title: "#f7efe7",
    subtitle: "#dccfc4",
    machineLabel: "#cebeb0",
    cardBg:
      "linear-gradient(180deg, rgba(253,248,242,0.96) 0%, rgba(243,235,227,0.94) 100%)",
    cardBorder: "rgba(255,255,255,0.62)",
    cardTitle: "#5d473c",
    cardText: "#5d4d44",
    chipBg: "rgba(93,71,60,0.06)",
    chipBorder: "rgba(93,71,60,0.10)",
    chipText: "#7f6659",
    inputBg: "#4a3932",
    inputText: "#f8f0e7",
    inputBorder: "rgba(93,71,60,0.20)",
    kpiBg: "rgba(255,255,255,0.46)",
    kpiBorder: "rgba(93,71,60,0.08)",
    rowBg: "rgba(255,255,255,0.42)",
    rowBorder: "rgba(93,71,60,0.08)",
    buttonBg: "linear-gradient(180deg, #d89963 0%, #b2714d 100%)",
    buttonShadow: "0 8px 20px rgba(178, 113, 77, 0.20)",
    buttonSecondaryBg: "rgba(93,71,60,0.08)",
    buttonSecondaryText: "#5d4d44",
    buttonSecondaryBorder: "rgba(93,71,60,0.12)",
  },
};

// ╔══════════════════════════════════════════════╗
// ║         FUNÇÕES AUXILIARES DE LEITURA        ║
// ╚══════════════════════════════════════════════╝

function lerTextoStorage(chave) {
  if (typeof window === "undefined") {
    return "";
  }

  const valorSalvo = window.localStorage.getItem(chave);
  return valorSalvo ?? "";
}

function lerJsonStorage(chave, valorPadrao) {
  if (typeof window === "undefined") {
    return valorPadrao;
  }

  const valorSalvo = window.localStorage.getItem(chave);

  if (!valorSalvo) {
    return valorPadrao;
  }

  try {
    return JSON.parse(valorSalvo);
  } catch {
    return valorPadrao;
  }
}
function formatarMoeda(valor) {
  const numeroSeguro = paraNumero(valor);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeroSeguro);
}

function isContaAtrasada(conta) {
  if (conta.pago) return false;

  const hoje = new Date();
  const vencimento = new Date(conta.dataVencimento);

  hoje.setHours(0, 0, 0, 0);
  vencimento.setHours(0, 0, 0, 0);

  return vencimento < hoje;
}

function getContaUrgencia(conta) {
  if (conta.pago) return "pago";

  const hoje = new Date();
  const vencimento = new Date(conta.dataVencimento);

  hoje.setHours(0, 0, 0, 0);
  vencimento.setHours(0, 0, 0, 0);

  const diffDias = (vencimento - hoje) / (1000 * 60 * 60 * 24);

  if (diffDias < 0) return "atrasado";
  if (diffDias <= 1) return "critico";     // amanhã ou hoje
  if (diffDias <= 3) return "alto";
  if (diffDias <= 7) return "medio";

  return "normal";
}

const RESET_MESSAGES = [
  "☢ Tem certeza que quer apagar tudo?",
  "☢ Isso vai apagar TODOS os dados salvos.",
  "☢ ÚLTIMA CHANCE. Apagar tudo mesmo?",
];
function Dashboard(props) {

// ╔══════════════════════════════════════════════╗
// ║        DEFINIÇÃO DO PERFIL ATIVO             ║
// ╠══════════════════════════════════════════════╣
// ║ household = visão combinada da casa          ║
// ║ qualquer outro valor = id da pessoa ativa    ║
// ╚══════════════════════════════════════════════╝
  const [perfilAtivo, setPerfilAtivo] = useState(
    () => lerTextoStorage(STORAGE_KEYS.perfilAtivo) || "household"
  );

// ╔══════════════════════════════════════════════╗
// ║         TEMA DA VISÃO CONJUNTA               ║
// ╚══════════════════════════════════════════════╝

const [resetEtapa, setResetEtapa] = useState(
  () => Number(lerTextoStorage(STORAGE_KEYS.resetEtapa) || 0)
);

// ╔══════════════════════════════════════════════╗
// ║               STATES DE PESSOAS              ║
// ╚══════════════════════════════════════════════╝

const [pessoas, setPessoas] = useState(() =>
  lerJsonStorage(STORAGE_KEYS.pessoas, [])
);

// ╔══════════════════════════════════════════════╗
// ║             LAYOUT DO DASHBOARD              ║
// ╚══════════════════════════════════════════════╝
const [layout, setLayout] = useState([
  { i: "visao", x: 0, y: 0, w: 3, h: 2 },
  { i: "leitura", x: 9, y: 0, w: 3, h: 2 },
  { i: "grafico", x: 3, y: 0, w: 6, h: 4 },

  { i: "pessoas", x: 0, y: 2, w: 3, h: 3 },
  { i: "resumo", x: 9, y: 2, w: 3, h: 3 },

  { i: "cartoes", x: 0, y: 5, w: 4, h: 3 },
  { i: "gastos", x: 4, y: 5, w: 4, h: 3 },
  { i: "contas", x: 8, y: 5, w: 4, h: 3 },
]);

const [nomePessoa, setNomePessoa] = useState("");
  const [salarioPessoa, setSalarioPessoa] = useState("");
  const [pessoaEmEdicaoId, setPessoaEmEdicaoId] = useState(null);
  const [erroPessoa, setErroPessoa] = useState("");

// ╔══════════════════════════════════════════════╗
// ║              STATES PRINCIPAIS               ║
// ╚══════════════════════════════════════════════╝

  const [gastoDebito, setGastoDebito] = useState(() =>
    lerTextoStorage(STORAGE_KEYS.gastoDebito)
  );

  const [faturaAtual, setFaturaAtual] = useState(() =>
    lerTextoStorage(STORAGE_KEYS.faturaAtual)
  );

// ╔══════════════════════════════════════════════╗
// ║               STATES DE CARTÕES              ║
// ╚══════════════════════════════════════════════╝

  const [cartoes, setCartoes] = useState(() =>
    lerJsonStorage(STORAGE_KEYS.cartoes, [])
  );

  const [nomeCartao, setNomeCartao] = useState("");
  const [tipoCartao, setTipoCartao] = useState("credito");
  const [erroCartao, setErroCartao] = useState("");

// ╔══════════════════════════════════════════════╗
// ║                STATES DE GASTOS              ║
// ╚══════════════════════════════════════════════╝

  const [gastos, setGastos] = useState(() =>
    lerJsonStorage(STORAGE_KEYS.gastos, [])
  );

  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");
  const [cartaoSelecionado, setCartaoSelecionado] = useState("");
  const [pessoaSelecionada, setPessoaSelecionada] = useState("");
  const [gastoEmEdicaoId, setGastoEmEdicaoId] = useState(null);
  const [erroGasto, setErroGasto] = useState("");
  

// ╔══════════════════════════════════════════════╗
// ║           STATES DE CONTAS (BOLETOS)         ║
// ╚══════════════════════════════════════════════╝

  const [contas, setContas] = useState(() =>
    lerJsonStorage(STORAGE_KEYS.contas, [])
  );
// ╔══════════════════════════════════════════════╗
// ║        HISTÓRICO DE MOVIMENTAÇÕES            ║
// ╚══════════════════════════════════════════════╝
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [valorSaldoInput, setValorSaldoInput] = useState("");
  const [comentarioSaldo, setComentarioSaldo] = useState("");
  const [pessoaSaldoSelecionada, setPessoaSaldoSelecionada] = useState(null);
  const [nomeConta, setNomeConta] = useState("");
  const [valorConta, setValorConta] = useState("");
  const [dataConta, setDataConta] = useState("");
  const [erroConta, setErroConta] = useState("");
  const [quemPagouConta, setQuemPagouConta] = useState("");

// ╔══════════════════════════════════════════════╗
// ║            EFEITOS DE PERSISTÊNCIA           ║
// ╚══════════════════════════════════════════════╝

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.pessoas,
      JSON.stringify(pessoas)
    );
  }, [pessoas]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.gastoDebito,
      String(gastoDebito)
    );
  }, [gastoDebito]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.faturaAtual,
      String(faturaAtual)
    );
  }, [faturaAtual]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.cartoes,
      JSON.stringify(cartoes)
    );
  }, [cartoes]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.gastos,
      JSON.stringify(gastos)
    );
  }, [gastos]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.perfilAtivo,
      String(perfilAtivo)
    );
  }, [perfilAtivo]);

  

useEffect(() => {
  window.localStorage.setItem(
    STORAGE_KEYS.resetEtapa,
    String(resetEtapa)
  );
}, [resetEtapa]);

useEffect(() => {
  window.localStorage.setItem(
    STORAGE_KEYS.contas,
    JSON.stringify(contas)
  );
}, [contas]);

// ╔══════════════════════════════════════════════╗
// ║               FUNÇÕES DE PESSOAS             ║
// ╚══════════════════════════════════════════════╝

  function limparFormularioPessoa() {
    setNomePessoa("");
    setSalarioPessoa("");
    setPessoaEmEdicaoId(null);
    setErroPessoa("");
  }

  function salvarPessoa() {
    const nomeNormalizado = nomePessoa.trim();

    if (!nomeNormalizado) {
      setErroPessoa("Digite um nome para a pessoa.");
      return;
    }

    if (!salarioPessoa) {
      setErroPessoa("Digite um salário para a pessoa.");
      return;
    }

    const salarioConvertido = paraNumero(salarioPessoa);

    if (pessoaEmEdicaoId) {
      setPessoas((pessoasAnteriores) =>
        pessoasAnteriores.map((pessoa) =>
          pessoa.id === pessoaEmEdicaoId
            ? {
                ...pessoa,
                nome: nomeNormalizado,
                salario: salarioConvertido,
              }
            : pessoa
        )
      );

      limparFormularioPessoa();
      return;
    }

const novaPessoa = {
  id: Date.now(),
  nome: nomeNormalizado,
  salario: salarioConvertido,
  saldo: salarioConvertido,
  tema: "cassette_neon",
};

    setPessoas([...pessoas, novaPessoa]);
    limparFormularioPessoa();
  }

  function editarPessoa(pessoa) {
    setNomePessoa(pessoa.nome);
    setSalarioPessoa(
  String(pessoa.salario).replace(".", ",")
);
    setPessoaEmEdicaoId(pessoa.id);
    setErroPessoa("");
  }

  function excluirPessoa(idPessoa) {
    setPessoas((pessoasAnteriores) =>
      pessoasAnteriores.filter((pessoa) => pessoa.id !== idPessoa)
    );

    const gastosRestantes = gastos.filter(
      (gasto) => gasto.pessoaId !== idPessoa
    );

    setGastos(gastosRestantes);

    const novoTotalDebito = gastosRestantes
      .filter((gasto) => gasto.tipo === "debito")
      .reduce((acumulador, gasto) => acumulador + paraNumero(gasto.valor), 0);

    const novoTotalCredito = gastosRestantes
      .filter((gasto) => gasto.tipo === "credito")
      .reduce((acumulador, gasto) => acumulador + paraNumero(gasto.valor), 0);

    setGastoDebito(novoTotalDebito);
    setFaturaAtual(novoTotalCredito);

    if (Number(pessoaSelecionada) === idPessoa) {
      setPessoaSelecionada("");
    }

    if (pessoaEmEdicaoId === idPessoa) {
      limparFormularioPessoa();
    }

    if (String(perfilAtivo) === String(idPessoa)) {
      setPerfilAtivo("household");
    }
  }

  function alterarTemaDaPessoa(idPessoa, novoTema) {
    setPessoas((pessoasAnteriores) =>
      pessoasAnteriores.map((pessoa) =>
        pessoa.id === idPessoa
          ? {
              ...pessoa,
              tema: novoTema,
            }
          : pessoa
      )
    );
  }

// ╔══════════════════════════════════════════════╗
// ║     ADICIONAR / REMOVER SALDO (COM LOG)      ║
// ╚══════════════════════════════════════════════╝
function alterarSaldoPessoa(idPessoa, valor, comentario = "") {
  const numero = parseFloat(String(valor).replace(",", "."));

  if (isNaN(numero)) return;

  setPessoas((prev) =>
    prev.map((p) =>
      p.id === idPessoa
        ? { ...p, saldo: (p.saldo || 0) + numero }
        : p
    )
  );

  const novaMovimentacao = {
    id: Date.now(),
    pessoaId: idPessoa,
    valor: numero,
    comentario,
    data: new Date().toISOString(),
  };

  setMovimentacoes((prev) => [novaMovimentacao, ...prev]);
}

// ╔══════════════════════════════════════════════╗
// ║            FUNÇÃO: ADICIONAR CARTÃO          ║
// ╚══════════════════════════════════════════════╝

  function adicionarCartao() {
    const nomeNormalizado = nomeCartao.trim().toLowerCase();

    if (!nomeNormalizado) {
      setErroCartao("Digite um nome para o cartão.");
      return;
    }

    const duplicado = cartoes.some(
      (cartaoExistente) =>
        cartaoExistente.nome.toLowerCase() === nomeNormalizado &&
        cartaoExistente.tipo === tipoCartao
    );

    if (duplicado) {
      setErroCartao("Esse cartão já existe com esse tipo.");
      return;
    }

    const novoCartao = {
      id: Date.now(),
      nome: nomeCartao.trim(),
      tipo: tipoCartao,
    };

    setCartoes([...cartoes, novoCartao]);
    setNomeCartao("");
    setErroCartao("");
  }

// ╔══════════════════════════════════════════════╗
// ║                FUNÇÕES DE GASTOS             ║
// ╚══════════════════════════════════════════════╝

  function limparFormularioGasto() {
    setNomeGasto("");
    setValorGasto("");
    setCartaoSelecionado("");
    setPessoaSelecionada("");
    setGastoEmEdicaoId(null);
    setErroGasto("");
  }

  function recalcularTotais(listaDeGastos) {
    const totalDebito = listaDeGastos
      .filter((gasto) => gasto.tipo === "debito")
      .reduce((acumulador, gasto) => acumulador + paraNumero(gasto.valor), 0);

    const totalCredito = listaDeGastos
      .filter((gasto) => gasto.tipo === "credito")
      .reduce((acumulador, gasto) => acumulador + paraNumero(gasto.valor), 0);

    setGastoDebito(totalDebito);
    setFaturaAtual(totalCredito);
  }

  function adicionarGasto() {
  const nomeNormalizado = nomeGasto.trim();

  if (!nomeNormalizado) {
    setErroGasto("Digite um nome para o gasto.");
    return;
  }

  if (!valorGasto) {
    setErroGasto("Digite um valor para o gasto.");
    return;
  }

  if (!cartaoSelecionado) {
    setErroGasto("Selecione um cartão.");
    return;
  }

  if (!pessoaSelecionada) {
    setErroGasto("Selecione a pessoa responsável pelo gasto.");
    return;
  }

  const cartao = cartoes.find(
    (c) => c.id === Number(cartaoSelecionado)
  );

  if (!cartao) {
    setErroGasto("Cartão inválido.");
    return;
  }

  const pessoa = pessoas.find(
    (p) => p.id === Number(pessoaSelecionada)
  );

  if (!pessoa) {
    setErroGasto("Pessoa inválida.");
    return;
  }

  const valor = paraNumero(valorGasto);

// ╔══════════════════════════════════════════════╗
// ║              EDIÇÃO DE GASTO                 ║
// ╚══════════════════════════════════════════════╝
  if (gastoEmEdicaoId) {
    const gastoAntigo = gastos.find(g => g.id === gastoEmEdicaoId);

    if (!gastoAntigo) return;

    let pessoasAtualizadas = [...pessoas];

// ╔══════════════════════════════════════════════╗
// ║        RESTAURA VALOR ANTIGO (DÉBITO)        ║
// ╚══════════════════════════════════════════════╝
    if (gastoAntigo.tipo === "debito") {
      pessoasAtualizadas = pessoasAtualizadas.map(p =>
        p.id === gastoAntigo.pessoaId
          ? { ...p, saldo: (p.saldo || 0) + paraNumero(gastoAntigo.valor) }
          : p
      );
    }

// ╔══════════════════════════════════════════════╗
// ║        APLICA NOVO VALOR (DÉBITO)            ║
// ╚══════════════════════════════════════════════╝
    if (cartao.tipo === "debito") {
      pessoasAtualizadas = pessoasAtualizadas.map(p =>
        p.id === pessoa.id
          ? { ...p, saldo: (p.saldo || 0) - valor }
          : p
      );
    }

    setPessoas(pessoasAtualizadas);

    const gastosAtualizados = gastos.map(g =>
      g.id === gastoEmEdicaoId
        ? {
            ...g,
            nome: nomeNormalizado,
            valor,
            cartaoNome: cartao.nome,
            tipo: cartao.tipo,
            pessoaId: pessoa.id,
            pessoaNome: pessoa.nome,
          }
        : g
    );

    setGastos(gastosAtualizados);
    recalcularTotais(gastosAtualizados);
    limparFormularioGasto();
    return;
  }

// ╔══════════════════════════════════════════════╗
// ║             CRIAÇÃO DE GASTO                 ║
// ╚══════════════════════════════════════════════╝
  const novoGasto = {
    id: Date.now(),
    nome: nomeNormalizado,
    valor,
    cartaoNome: cartao.nome,
    tipo: cartao.tipo,
    pessoaId: pessoa.id,
    pessoaNome: pessoa.nome,
  };

  const novaLista = [...gastos, novoGasto];
  setGastos(novaLista);

// ╔══════════════════════════════════════════════╗
// ║         DESCONTA DO SALDO (DÉBITO)           ║
// ╚══════════════════════════════════════════════╝
  if (cartao.tipo === "debito") {
    const pessoasAtualizadas = pessoas.map(p =>
      p.id === pessoa.id
        ? { ...p, saldo: (p.saldo || 0) - valor }
        : p
    );

    setPessoas(pessoasAtualizadas);
  }

  recalcularTotais(novaLista);
  limparFormularioGasto();
}

function editarGasto(gasto) {
  const cartaoCorrespondente = cartoes.find(
    (cartao) =>
      cartao.nome === gasto.cartaoNome &&
      cartao.tipo === gasto.tipo
  );
  setNomeGasto(gasto.nome);
  setValorGasto(
    Number(gasto.valor)
      .toFixed(2)
      .replace(".", ",")
  );

  setCartaoSelecionado(
    cartaoCorrespondente ? String(cartaoCorrespondente.id) : ""
  );

  setPessoaSelecionada(String(gasto.pessoaId));
  setGastoEmEdicaoId(gasto.id);
  setErroGasto("");
}

  function excluirGasto(idGasto) {
  const gasto = gastos.find(g => g.id === idGasto);
  if (!gasto) return;

  let pessoasAtualizadas = [...pessoas];

// ╔══════════════════════════════════════════════╗
// ║        DEVOLVE SALDO (ERA DÉBITO)            ║
// ╚══════════════════════════════════════════════╝
  if (gasto.tipo === "debito") {
    pessoasAtualizadas = pessoasAtualizadas.map(p =>
      p.id === gasto.pessoaId
        ? { ...p, saldo: (p.saldo || 0) + paraNumero(gasto.valor) }
        : p
    );
  }

  setPessoas(pessoasAtualizadas);

  const gastosRestantes = gastos.filter(g => g.id !== idGasto);
  setGastos(gastosRestantes);

  recalcularTotais(gastosRestantes);

  if (gastoEmEdicaoId === idGasto) {
    limparFormularioGasto();
  }
}

// ╔══════════════════════════════════════════════╗
// ║                FUNÇÕES DE CONTAS             ║
// ╚══════════════════════════════════════════════╝

function adicionarConta() {
  if (!nomeConta.trim()) {
    setErroConta("Digite o nome da conta.");
    return;
  }

  if (!valorConta) {
    setErroConta("Digite o valor.");
    return;
  }

  if (!dataConta) {
    setErroConta("Selecione a data.");
    return;
  }

  if (!quemPagouConta) {
    setErroConta("Selecione quem vai pagar.");
    return;
  }

  const pessoa = pessoas.find(
    (p) => p.id === Number(quemPagouConta)
  );

  if (!pessoa) {
    setErroConta("Pessoa inválida.");
    return;
  }

  const novaConta = {
    id: Date.now(),
    nome: nomeConta.trim(),
    valor: paraNumero(valorConta),
    dataVencimento: dataConta,
    pago: false,
    quemPagouId: pessoa.id,
    quemPagouNome: pessoa.nome,
  };

  setContas([...contas, novaConta]);

  setNomeConta("");
  setValorConta("");
  setDataConta("");
  setQuemPagouConta("");
  setErroConta("");
}

function marcarContaComoPaga(idConta) {
  const conta = contas.find((c) => c.id === idConta);
  if (!conta || conta.pago) return;

  const pessoa = pessoas.find(
    (p) => p.id === conta.quemPagouId
  );

  if (!pessoa) return;

// ╔══════════════════════════════════════════════╗
// ║     DESCONTA DO SALDO DA PESSOA              ║
// ╚══════════════════════════════════════════════╝
  const pessoasAtualizadas = pessoas.map((p) =>
    p.id === pessoa.id
      ? { ...p, saldo: (p.saldo || 0) - paraNumero(conta.valor) }
      : p
  );

  setPessoas(pessoasAtualizadas);

// ╔══════════════════════════════════════════════╗
// ║             MARCAR COMO PAGO                 ║
// ╚══════════════════════════════════════════════╝
  const contasAtualizadas = contas.map((c) =>
    c.id === idConta
      ? { ...c, pago: true }
      : c
  );

  setContas(contasAtualizadas);
}

// ╔══════════════════════════════════════════════╗
// ║           CÁLCULOS DE PERFIL ATIVO           ║
// ╚══════════════════════════════════════════════╝

  const ehHousehold = perfilAtivo === "household";

  const pessoaAtiva = useMemo(() => {
    if (ehHousehold) {
      return null;
    }

    return (
      pessoas.find((pessoa) => String(pessoa.id) === String(perfilAtivo)) ?? null
    );
  }, [ehHousehold, perfilAtivo, pessoas]);

const temaAtivo = useMemo(() => {
// ╔══════════════════════════════════════════════╗
// ║             VISÃO INDIVIDUAL                 ║
// ╚══════════════════════════════════════════════╝
  if (!ehHousehold && pessoaAtiva) {
    return THEMES[pessoaAtiva.tema] ?? THEMES.cassette_neon;
  }

// ╔══════════════════════════════════════════════╗
// ║               CASO PADRÃO                    ║
// ╚══════════════════════════════════════════════╝
  if (pessoas.length === 0) {
    return THEMES.cassette_neon;
  }

// ╔══════════════════════════════════════════════╗
// ║       HOUSEHOLD (MÉDIA DAS CORES)            ║
// ╚══════════════════════════════════════════════╝
  const cores = pessoas.map(
    (p) => THEMES[p.tema] ?? THEMES.cassette_neon
  );

  const avg = (arr) =>
    Math.floor(arr.reduce((a, b) => a + b, 0) / arr.length);

  const hexToRgb = (hex) => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.substring(0, 2), 16),
      parseInt(h.substring(2, 4), 16),
      parseInt(h.substring(4, 6), 16),
    ];
  };

  const rgbToHex = ([r, g, b]) =>
    `#${[r, g, b]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")}`;

  const bgColors = cores.map((t) => {
    const match = t.pageBg.match(/#([0-9a-f]{6})/i);
    return hexToRgb(match ? match[0] : "#0d141c");
  });

  const avgColor = [
    avg(bgColors.map((c) => c[0])),
    avg(bgColors.map((c) => c[1])),
    avg(bgColors.map((c) => c[2])),
  ];

  return {
    ...THEMES.cassette_neon,
    pageBg: rgbToHex(avgColor),
  };
}, [ehHousehold, pessoaAtiva, pessoas]);

  const gastosFiltrados = useMemo(() => {
    if (ehHousehold) {
      return gastos;
    }

    return gastos.filter(
      (gasto) => String(gasto.pessoaId) === String(perfilAtivo)
    );
  }, [ehHousehold, gastos, perfilAtivo]);

  const gastoDebitoFiltrado = useMemo(() => {
    return gastosFiltrados
      .filter((gasto) => gasto.tipo === "debito")
      .reduce((acumulador, gasto) => acumulador + paraNumero(gasto.valor), 0);
  }, [gastosFiltrados]);

  const faturaAtualFiltrada = useMemo(() => {
    return gastosFiltrados
      .filter((gasto) => gasto.tipo === "credito")
      .reduce((acumulador, gasto) => acumulador + paraNumero(gasto.valor), 0);
  }, [gastosFiltrados]);

  const salarioTotalFiltrado = useMemo(() => {
    if (ehHousehold) {
      return pessoas.reduce(
        (acumulador, pessoa) => acumulador + paraNumero(pessoa.salario),
        0
      );
    }

    return pessoaAtiva ? paraNumero(pessoaAtiva.salario) : 0;
  }, [ehHousehold, pessoaAtiva, pessoas]);

  const saldoTotalPessoas = pessoas.reduce(
  (acc, pessoa) => acc + (pessoa.saldo || 0),
  0
);
  const totalContasPendentes = contas
  .filter((conta) => !conta.pago)
  .reduce((acc, conta) => acc + paraNumero(conta.valor), 0);

 const contasOrdenadas = [...contas].sort((a, b) => {
// ╔══════════════════════════════════════════════╗
// ║        CONTAS NÃO PAGAS PRIMEIRO             ║
// ╚══════════════════════════════════════════════╝
  if (a.pago !== b.pago) return a.pago ? 1 : -1;

// ╔══════════════════════════════════════════════╗
// ║          ORDENAR POR DATA                    ║
// ╚══════════════════════════════════════════════╝
  return new Date(a.dataVencimento) - new Date(b.dataVencimento);
});

const saldoDisponivel =
  saldoTotalPessoas -
  totalContasPendentes;

const totalContasPagas = contas
  .filter((c) => c.pago)
  .reduce((acc, c) => acc + paraNumero(c.valor), 0);

const totalSalario = pessoas.reduce(
  (acc, p) => acc + paraNumero(p.salario),
  0
);

const dataGrafico = [
  { name: "Salário", value: totalSalario },
  { name: "Débito", value: paraNumero(gastoDebitoFiltrado) || 0 },
  { name: "Crédito", value: paraNumero(faturaAtualFiltrada) || 0 },
  { name: "Contas pagas", value: totalContasPagas || 0 },
];

const dadosSaldoPessoas = pessoas.map((p) => ({
  name: p.nome,
  saldo: p.saldo || 0,
}));

  // ╔══════════════════════════════════════════════╗
  // ║           CORES DO GRÁFICO                   ║
  // ╠══════════════════════════════════════════════╣
  // ║ salário                                      ║
  // ║ débito                                       ║
  // ║ crédito                                      ║
  // ║ contas                                       ║
  // ╚══════════════════════════════════════════════╝
const COLORS = [
  "#22c55e",
  "#ef4444",
  "#f59e0b",
  "#3b82f6",
];
  const mostrarGrafico =
  totalSalario > 0 ||
  gastosFiltrados.length > 0 ||
  totalContasPagas > 0;

  const nomeVisaoAtiva = ehHousehold
    ? "Household"
    : pessoaAtiva?.nome || "Perfil";

  function alterarTemaAtivo(novoTema) {
    if (ehHousehold) {
      return;
    }

    if (pessoaAtiva) {
      alterarTemaDaPessoa(pessoaAtiva.id, novoTema);
    }
  }
  function limparTudo() {
  setPessoas([]);
  setNomePessoa("");
  setSalarioPessoa("");
  setPessoaEmEdicaoId(null);
  setErroPessoa("");

  setCartoes([]);
  setNomeCartao("");
  setTipoCartao("credito");
  setErroCartao("");

  setGastos([]);
  setNomeGasto("");
  setValorGasto("");
  setCartaoSelecionado("");
  setPessoaSelecionada("");
  setGastoEmEdicaoId(null);
  setErroGasto("");

  setGastoDebito(0);
  setFaturaAtual(0);

  setPerfilAtivo("household");
  setResetEtapa(0);

  Object.values(STORAGE_KEYS).forEach((chave) => {
    window.localStorage.removeItem(chave);
  });
  setTimeout(() => {
  window.location.reload();
}, 50);
}

function lidarComResetTotal() {
  if (resetEtapa < 2) {
    setResetEtapa((etapaAnterior) => etapaAnterior + 1);
    return;
  }

  limparTudo();
}

const valorTemaSelecionado = pessoaAtiva?.tema || "cassette_neon";

  const styles = useMemo(
    () => ({
      container: {
        width: "100%",
        minHeight: "100vh",
        padding: "16px 24px",
        boxSizing: "border-box",
        justifyContent: "center",
        overflowX: "hidden",
        maxWidth: "1600px",
        margin: "0 auto",
        background: temaAtivo.pageBg,
      },

      shell: {
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "18px",
        borderRadius: "28px",
        background: temaAtivo.shellBg,
        border: `1px solid ${temaAtivo.shellBorder}`,
        boxShadow: temaAtivo.shellShadow,
      },

      machineBar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "18px",
        paddingBottom: "12px",
        borderBottom: `1px solid ${temaAtivo.shellBorder}`,
      },

      machineLights: {
        display: "flex",
        gap: "8px",
      },

      machineDot: {
        width: "10px",
        height: "10px",
        borderRadius: "999px",
        boxShadow: "0 0 10px currentColor",
        display: "inline-block",
      },

      machineLabel: {
        color: temaAtivo.machineLabel,
        fontSize: "12px",
        letterSpacing: "1.4px",
        fontWeight: "700",
      },

      header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: "24px",
        flexWrap: "wrap",
        marginBottom: "24px",
      },

      title: {
        margin: 0,
        color: temaAtivo.title,
        fontSize: "56px",
        lineHeight: "1",
        fontWeight: "700",
        letterSpacing: "-1.8px",
      },

      subtitle: {
        marginTop: "10px",
        marginBottom: 0,
        color: temaAtivo.subtitle,
        maxWidth: "720px",
        fontSize: "15px",
      },

      legenda: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      },

      badge: {
        color: "#ffffff",
        padding: "9px 14px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "700",
        whiteSpace: "nowrap",
        boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
      },

      badgeMini: {
        color: "#ffffff",
        padding: "6px 10px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: "700",
        marginLeft: "10px",
        whiteSpace: "nowrap",
        boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
      },

      badgeDebito: {
        background: "linear-gradient(180deg, #ff7b89 0%, #e85d75 100%)",
      },

      badgeCredito: {
        background: "linear-gradient(180deg, #ffc66e 0%, #e9a03b 100%)",
      },

      badgeSaldo: {
        background: "linear-gradient(180deg, #4edbb0 0%, #2d9d8f 100%)",
      },


topGrid: {
  display: "grid",
// ╔══════════════════════════════════════════════╗
// ║              GRID SUPERIOR                   ║
// ╚══════════════════════════════════════════════╝
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "18px",
  alignItems: "start",
  marginBottom: "18px",
},

card: {
  background: temaAtivo.cardBg,
  border: `1px solid ${temaAtivo.cardBorder}`,
  borderRadius: "22px",
  padding: "18px",
  minWidth: "320px",
  maxWidth: "100%",
  color: temaAtivo.cardText,
  boxShadow:
    "0 12px 28px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",

},

      cardGrafico: {
  textAlign: "center",
  minHeight: "360px",
  gridColumn: "span 2",
  minWidth: "500px",
  boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
  border: "1px solid rgba(255,255,255,0.08)",
  transform: "scale(1.02)",
  zIndex: 2,
},

      cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        marginBottom: "14px",
      },

      cardTitle: {
        margin: 0,
        color: temaAtivo.cardTitle,
        fontSize: "28px",
        fontWeight: "700",
        letterSpacing: "-0.4px",
      },

      cardChip: {
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.8px",
        textTransform: "uppercase",
        color: temaAtivo.chipText,
        background: temaAtivo.chipBg,
        border: `1px solid ${temaAtivo.chipBorder}`,
        padding: "6px 10px",
        borderRadius: "999px",
        whiteSpace: "nowrap",
      },

      label: {
        color: temaAtivo.cardText,
        fontWeight: "700",
        display: "block",
        marginBottom: "6px",
        fontSize: "14px",
      },

      kpiStack: {
        display: "grid",
        gap: "12px",
      },

      kpiRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        padding: "12px 14px",
        borderRadius: "16px",
        background: temaAtivo.kpiBg,
        border: `1px solid ${temaAtivo.kpiBorder}`,
      },

      kpiLabel: {
        color: temaAtivo.cardText,
        fontSize: "14px",
        fontWeight: "600",
      },

      kpiValue: {
        fontSize: "22px",
        fontWeight: "700",
      },

      resumoSaldo: {
        color: "#2d9d8f",
      },

      resumoDebito: {
        color: "#e85d75",
      },

      resumoCredito: {
        color: "#d68a1f",
      },

      textoAuxiliar: {
        fontSize: "14px",
        color: temaAtivo.subtitle,
        lineHeight: "1.5",
        margin: 0,
        maxWidth: "260px",
      },

      placeholderGrafico: {
        minHeight: "240px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px",
      },

      graficoWrapper: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "300px",
  overflow: "hidden",
  paddingTop: "8px",
},

      input: {
        width: "100%",
        padding: "13px 14px",
        margin: "10px 0",
        borderRadius: "14px",
        border: `1px solid ${temaAtivo.inputBorder}`,
        boxSizing: "border-box",
        background: temaAtivo.inputBg,
        color: temaAtivo.inputText,
        outline: "none",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      },

      button: {
        width: "100%",
        padding: "13px",
        background: temaAtivo.buttonBg,
        color: "#ffffff",
        border: "none",
        borderRadius: "14px",
        cursor: "pointer",
        fontWeight: "700",
        marginTop: "4px",
        boxShadow: temaAtivo.buttonShadow,
      },

      buttonSecundario: {
        width: "100%",
        padding: "13px",
        background: temaAtivo.buttonSecondaryBg,
        color: temaAtivo.buttonSecondaryText,
        border: `1px solid ${temaAtivo.buttonSecondaryBorder}`,
        borderRadius: "14px",
        cursor: "pointer",
        fontWeight: "700",
        marginTop: "8px",
      },

      erro: {
        color: "#c1121f",
        fontWeight: "700",
        marginTop: "12px",
        marginBottom: 0,
      },

      lista: {
        paddingLeft: "20px",
        marginTop: "18px",
        marginBottom: 0,
      },

      itemLista: {
        marginBottom: "12px",
        color: temaAtivo.cardText,
        lineHeight: "1.45",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: "10px 12px",
        borderRadius: "14px",
        background: temaAtivo.rowBg,
        border: `1px solid ${temaAtivo.rowBorder}`,
      },

      itemListaColuna: {
        marginBottom: "12px",
        color: temaAtivo.cardText,
        lineHeight: "1.45",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "10px 12px",
        borderRadius: "14px",
        background: temaAtivo.rowBg,
        border: `1px solid ${temaAtivo.rowBorder}`,
        listStyle: "none",
      },

      itemLinhaSuperior: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
      },

      itemText: {
        flex: 1,
        minWidth: 0,
      },

      actionRow: {
        width: "100%",
        display: "flex",
        gap: "8px",
      },

      actionButton: {
        flex: 1,
        padding: "9px 12px",
        background: "rgba(72,185,255,0.12)",
        color: "#204761",
        border: "1px solid rgba(72,185,255,0.16)",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "700",
      },

      actionButtonDanger: {
        flex: 1,
        padding: "9px 12px",
        background: "rgba(232,93,117,0.12)",
        color: "#8a2334",
        border: "1px solid rgba(232,93,117,0.16)",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "700",
      },
      actionButtonSmall: {
  padding: "8px 14px",
  background: "rgba(72,185,255,0.12)",
  color: "#204761",
  border: "1px solid rgba(72,185,255,0.16)",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  whiteSpace: "nowrap",
},
      resetBox: {
  marginTop: "18px",
  padding: "14px",
  borderRadius: "16px",
  background:
    "linear-gradient(180deg, rgba(62,8,8,0.14) 0%, rgba(102,14,14,0.18) 100%)",
  border: "1px solid rgba(255, 77, 77, 0.26)",
  boxShadow:
    "0 0 0 1px rgba(255, 191, 0, 0.10), inset 0 0 22px rgba(255, 77, 77, 0.08)",
},

resetTitle: {
  margin: 0,
  fontSize: "14px",
  fontWeight: "800",
  color: "#ffb300",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
},

resetText: {
  marginTop: "8px",
  marginBottom: "12px",
  fontSize: "13px",
  lineHeight: "1.5",
  color: temaAtivo.cardText,
},

resetButton: {
  width: "100%",
  padding: "14px",
  background:
    "linear-gradient(180deg, #ffef5a 0%, #ffb300 42%, #ff5a36 100%)",
  color: "#2b1300",
  border: "1px solid rgba(255, 120, 0, 0.35)",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "900",
  marginTop: "4px",
  boxShadow:
    "0 0 18px rgba(255, 179, 0, 0.25), 0 8px 24px rgba(255, 90, 54, 0.22)",
  textTransform: "uppercase",
  letterSpacing: "0.4px",
},
bottomGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "18px",
  alignItems: "start",
},
bottomGridFull: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "18px",
  alignItems: "start",
  marginTop: "10px",
},
footer: {
  marginTop: "20px",
  paddingTop: "20px",
  paddingBottom: "10px",
  borderTop: "1px solid rgba(255,255,255,0.08)",
},
    }),
    [temaAtivo]
  );
    return(
        <div style={styles.container}>
      <div style={styles.shell}>
        {/* ╔══════════════════════════════════════════════╗
            ║        BARRA SUPERIOR / IDENTIDADE VISUAL    ║
            ╚══════════════════════════════════════════════╝ */}
        <div style={styles.machineBar}>
          <div style={styles.machineLights}>
            <span style={{ ...styles.machineDot, background: "#ff6b7a" }} />
            <span style={{ ...styles.machineDot, background: "#ffb84d" }} />
            <span style={{ ...styles.machineDot, background: "#57d3a4" }} />
          </div>

          <div style={styles.machineLabel}>FINANCE MODULE / HOME PANEL</div>
        </div>

        {/* ╔══════════════════════════════════════════════╗
            ║                 CABEÇALHO                    ║
            ╚══════════════════════════════════════════════╝ */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>DividimOS</h1>
            <p style={styles.subtitle}>
  Sistema de controle financeiro para casais, com visão individual,
  visão conjunta e personalização do dashboard.
</p>
          </div>

          <div style={styles.legenda}>
            <span style={{ ...styles.badge, ...styles.badgeDebito }}>
              Débito
            </span>

            <span style={{ ...styles.badge, ...styles.badgeCredito }}>
              Crédito
            </span>

            <span style={{ ...styles.badge, ...styles.badgeSaldo }}>
              Saldo
            </span>
          </div>
        </div>

        {/* ╔══════════════════════════════════════════════╗
            ║                  LINHA 1                     ║
            ╚══════════════════════════════════════════════╝ */}
        <div style={styles.topGrid}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Visão ativa</h2>
              <span style={styles.cardChip}>Perfil</span>
            </div>

            <label style={styles.label}>Selecionar perfil</label>
            <select
              value={perfilAtivo}
              onChange={(e) => setPerfilAtivo(e.target.value)}
              style={styles.input}
            >
              <option value="household">Household (visão conjunta)</option>
              {pessoas.map((pessoa) => (
                <option key={pessoa.id} value={String(pessoa.id)}>
                  {pessoa.nome}
                </option>
              ))}
            </select>

            {pessoas.length === 0 ? (
              <p style={styles.erro}>
                Cadastre ao menos uma pessoa para liberar perfis individuais.
              </p>
            ) : (
              <p style={{ ...styles.textoAuxiliar, marginTop: "6px" }}>
                Perfis disponíveis: {pessoas.map((pessoa) => pessoa.nome).join(", ")}
              </p>
            )}

{!ehHousehold && (
  <>
    <label style={styles.label}>Tema do dashboard</label>
    <select
      value={valorTemaSelecionado}
      onChange={(e) => alterarTemaAtivo(e.target.value)}
      style={styles.input}
    >
      {Object.entries(THEMES).map(([chave, tema]) => (
        <option key={chave} value={chave}>
          {tema.label}
        </option>
      ))}
    </select>
  </>
)}


            <div style={styles.kpiStack}>
              <div style={styles.kpiRow}>
                <span style={styles.kpiLabel}>Modo atual</span>
                <span style={{ ...styles.kpiValue, ...styles.resumoSaldo }}>
                  {nomeVisaoAtiva}
                </span>
              </div>
            </div>


          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Leitura da visão</h2>
              <span style={styles.cardChip}>Filtro</span>
            </div>

            <div style={styles.kpiStack}>
              <div style={styles.kpiRow}>
                <span style={styles.kpiLabel}>Salário considerado</span>
                <span style={{ ...styles.kpiValue, ...styles.resumoSaldo }}>
                  {formatarMoeda(salarioTotalFiltrado)}
                </span>
              </div>

              <div style={styles.kpiRow}>
                <span style={styles.kpiLabel}>Gastos visíveis</span>
                <span style={{ ...styles.kpiValue, ...styles.resumoDebito }}>
                  {gastosFiltrados.length}
                </span>
              </div>
            </div>

            <p style={{ ...styles.textoAuxiliar, marginTop: "14px" }}>
              Em <strong>Household</strong>, o painel mostra tudo junto. Em um
              perfil individual, o painel filtra salário, gráfico e gastos
              daquela pessoa.
            </p>
          </div>

          <div style={{ ...styles.card, ...styles.cardGrafico, gridColumn: "span 1" }}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Distribuição</h2>
              <span style={styles.cardChip}>Visual</span>
            </div>

            {!mostrarGrafico ? (
              <div style={styles.placeholderGrafico}>
                <p style={styles.textoAuxiliar}>
                  O gráfico aparecerá depois que houver ao menos um gasto na
                  visão atual.
                </p>
              </div>
            ) : (
              <div style={styles.graficoWrapper}>
<ResponsiveContainer width="100%" height={300}>
  <BarChart
    data={dataGrafico}
    margin={{ top: 26, right: 18, left: 6, bottom: 10 }}
    barCategoryGap="18%"
  >
    <CartesianGrid
      strokeDasharray="4 4"
      stroke="rgba(255,255,255,0.14)"
      vertical={false}
    />

    <XAxis
      dataKey="name"
      stroke="#64748b"
      tick={{ fontSize: 13, fontWeight: 700, fill: "#475569" }}
      axisLine={false}
      tickLine={false}
    />

    <YAxis
      stroke="#94a3b8"
      tick={{ fontSize: 12, fill: "#64748b" }}
      axisLine={false}
      tickLine={false}
      tickFormatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`}
    />

    <Tooltip
      cursor={{ fill: "rgba(255,255,255,0.05)" }}
      contentStyle={{
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.18)",
        background: "rgba(15,23,42,0.96)",
        color: "#f8fafc",
        boxShadow: "0 10px 30px rgba(0,0,0,0.28)",
      }}
      labelStyle={{
        color: "#cbd5e1",
        fontWeight: 700,
        marginBottom: 6,
      }}
      formatter={(value) => formatarMoeda(value)}
    />

    <Bar
      dataKey="value"
      radius={[12, 12, 0, 0]}
      animationDuration={500}
    >
      {dataGrafico.map((_, index) => (
  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
))}

      <LabelList
        dataKey="value"
        position="top"
        formatter={(value) => formatarMoeda(value)}
        style={{
          fill: "#0f172a",
          fontSize: 12,
          fontWeight: 800,
        }}
      />
    </Bar>
  </BarChart>
</ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

{/* ╔══════════════════════════════════════════════╗
    ║                  LINHA 2                     ║
    ╚══════════════════════════════════════════════╝ */}
<div style={styles.bottomGrid}>
  <div style={{ ...styles.card, gridColumn: "span 1", minHeight: 520 }}>
  <div style={styles.cardHeader}>
    <h2 style={styles.cardTitle}>Saldo por pessoa</h2>
    <span style={styles.cardChip}>Financeiro</span>
  </div>

  <div style={{ marginBottom: 12 }}>
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={dadosSaldoPessoas}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(v) => formatarMoeda(v)} />

        <Bar dataKey="saldo" radius={[10, 10, 0, 0]}>
          {dadosSaldoPessoas.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>

  {pessoas.map((pessoa) => (
    <div key={pessoa.id} style={styles.itemListaColuna}>
      <div style={styles.itemLinhaSuperior}>
        <strong>{pessoa.nome}</strong>
        <span>{formatarMoeda(pessoa.saldo || 0)}</span>
      </div>

      <div style={styles.actionRow}>
        <button
  onClick={() => setPessoaSaldoSelecionada(pessoa.id)}
  style={styles.actionButton}
>
  Ajustar saldo
</button>
      </div>
      {pessoaSaldoSelecionada === pessoa.id && (
  <div style={{ marginTop: 10 }}>
    <input
      placeholder="Valor"
      value={valorSaldoInput}
      onChange={(e) => setValorSaldoInput(e.target.value)}
      style={styles.input}
    />

    <input
      placeholder="Comentário (opcional)"
      value={comentarioSaldo}
      onChange={(e) => setComentarioSaldo(e.target.value)}
      style={styles.input}
    />

    <div style={{ display: "flex", gap: 8 }}>
  <button
    onClick={() => {
      alterarSaldoPessoa(pessoa.id, valorSaldoInput, comentarioSaldo);
      setPessoaSaldoSelecionada(null);
      setValorSaldoInput("");
      setComentarioSaldo("");
    }}
    style={styles.button}
  >
    + Adicionar
  </button>

  <button
    onClick={() => {
      alterarSaldoPessoa(pessoa.id, "-" + valorSaldoInput, comentarioSaldo);
      setPessoaSaldoSelecionada(null);
      setValorSaldoInput("");
      setComentarioSaldo("");
    }}
    style={styles.buttonSecundario}
  >
    - Remover
  </button>
</div>

    <button
      onClick={() => setPessoaSaldoSelecionada(null)}
      style={styles.buttonSecundario}
    >
      Cancelar
    </button>
  </div>
)}
    </div>
  ))}
</div>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              
              <h2 style={styles.cardTitle}>Pessoas</h2>
              <span style={styles.cardChip}>Rendas</span>
            </div>

            <label style={styles.label}>Nome da pessoa</label>
            <input
              type="text"
              value={nomePessoa}
              onChange={(e) => setNomePessoa(e.target.value)}
              style={styles.input}
              placeholder="Ex.: Daniel"
            />

            <label style={styles.label}>Salário da pessoa</label>
            <input
              type="text"
              value={salarioPessoa}
              onChange={(e) => {
  const valor = e.target.value
    .replace(/[^\d,]/g, "")
    .replace(/(,.*),/g, "$1");

  setSalarioPessoa(valor);
}}
              style={styles.input}
              placeholder="Ex.: 3500"
            />

            <button
  onClick={salvarPessoa}
  style={styles.button}
  disabled={!nomePessoa || !salarioPessoa}
>
              {pessoaEmEdicaoId ? "Salvar pessoa" : "Adicionar pessoa"}
            </button>

            {pessoaEmEdicaoId && (
              <button
                onClick={limparFormularioPessoa}
                style={styles.buttonSecundario}
              >
                Cancelar edição
              </button>
            )}

            {erroPessoa && <p style={styles.erro}>{erroPessoa}</p>}

            <ul style={styles.lista}>
              {pessoas.length === 0 ? (
  <li style={styles.itemLista}>
  <span style={styles.textoAuxiliar}>
    Nenhuma pessoa cadastrada.
  </span>
</li>
) : (
  pessoas.map((pessoa) => (
                <li key={pessoa.id} style={styles.itemListaColuna}>
                  <div style={styles.itemLinhaSuperior}>
                    <span style={styles.itemText}>
                      {pessoa.nome} · {formatarMoeda(pessoa.salario)} · saldo: {formatarMoeda(pessoa.saldo || 0)}
                    </span>

                    <span style={{ ...styles.badgeMini, ...styles.badgeSaldo }}>
                      renda
                    </span>
                  </div>

                  <select
                    value={pessoa.tema || "cassette_neon"}
                    onChange={(e) =>
                      alterarTemaDaPessoa(pessoa.id, e.target.value)
                    }
                    style={styles.input}
                  >
                    {Object.entries(THEMES).map(([chave, tema]) => (
                      <option key={chave} value={chave}>
                        {tema.label}
                      </option>
                    ))}
                  </select>

                  <div style={styles.actionRow}>
                    <button
                      onClick={() => editarPessoa(pessoa)}
                      style={styles.actionButton}
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => excluirPessoa(pessoa.id)}
                      style={styles.actionButtonDanger}
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              )))}
            </ul>
          </div>

          <div style={{ ...styles.card, position: "sticky", top: "20px" }}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Resumo</h2>
              <span style={styles.cardChip}>Leitura</span>
            </div>

            <div style={styles.kpiStack}>
              <div style={styles.kpiRow}>
                <span style={styles.kpiLabel}>
                  {ehHousehold ? "Salário total" : "Salário do perfil"}
                </span>
                <span style={{ ...styles.kpiValue, ...styles.resumoSaldo }}>
                  {formatarMoeda(salarioTotalFiltrado)}
                </span>
              </div>

              <div style={styles.kpiRow}>
                <span style={styles.kpiLabel}>Saldo disponível</span>
                <span style={{ ...styles.kpiValue, ...styles.resumoSaldo }}>
                  {formatarMoeda(saldoDisponivel)}
                </span>
              </div>

              <div style={styles.kpiRow}>
  <span style={styles.kpiLabel}>Contas pendentes</span>
  <span style={{ ...styles.kpiValue, ...styles.resumoDebito }}>
    {formatarMoeda(totalContasPendentes)}
  </span>
</div>

              <div style={styles.kpiRow}>
                <span style={styles.kpiLabel}>Saída imediata</span>
                <span style={{ ...styles.kpiValue, ...styles.resumoDebito }}>
                  {formatarMoeda(gastoDebitoFiltrado)}
                </span>
              </div>

              <div style={styles.kpiRow}>
                <span style={styles.kpiLabel}>Fatura acumulada</span>
                <span style={{ ...styles.kpiValue, ...styles.resumoCredito }}>
                  {formatarMoeda(faturaAtualFiltrada)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div style={styles.bottomGridFull}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              {/* ╔══════════════════════════════════════════════╗
                  ║               LINHA INFERIOR                 ║
                  ╚══════════════════════════════════════════════╝ */}

              <h2 style={styles.cardTitle}>Cartões</h2>
              <span style={styles.cardChip}>Cadastro</span>
            </div>

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

            <button
  onClick={adicionarCartao}
  style={styles.button}
  disabled={!nomeCartao}
>
              Adicionar cartão
            </button>

            {erroCartao && <p style={styles.erro}>{erroCartao}</p>}

            <ul style={styles.lista}>
              {cartoes.length === 0 ? (
  <li style={styles.itemLista}>
  <span style={styles.textoAuxiliar}>
    Nenhum cartão cadastrado.
  </span>
</li>
) : (
  cartoes.map((cartao) => (
                <li key={cartao.id} style={styles.itemLista}>
                  <span style={styles.itemText}>{cartao.nome}</span>

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
              ))
              )}
            </ul>
          </div>

          <div style={{ ...styles.card, position: "sticky", top: "20px" }}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Gastos</h2>
              <span style={styles.cardChip}>Registro</span>
            </div>

            <input
              type="text"
              placeholder="Nome do gasto"
              value={nomeGasto}
              onChange={(e) => setNomeGasto(e.target.value)}
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Valor"
              value={valorGasto}
              onChange={(e) => {
  const valor = e.target.value
    .replace(/[^\d,]/g, "")   // only numbers + comma
    .replace(/(,.*),/g, "$1"); // only ONE comma

  setValorGasto(valor);
}}
              style={styles.input}
            />

            <select
              value={pessoaSelecionada}
              onChange={(e) => setPessoaSelecionada(e.target.value)}
              style={styles.input}
            >
              <option value="">Selecione uma pessoa</option>
              {pessoas.map((pessoa) => (
                <option key={pessoa.id} value={pessoa.id}>
                  {pessoa.nome}
                </option>
              ))}
            </select>


            <select
              value={cartaoSelecionado}
              onChange={(e) => setCartaoSelecionado(e.target.value)}
              style={styles.input}
            >
              <option value="">Selecione um cartão</option>
              {cartoes.map((cartao) => (
                <option key={cartao.id} value={cartao.id}>
                  {cartao.nome} ({cartao.tipo})
                </option>
              ))}
            </select>

            <button
  onClick={adicionarGasto}
  style={styles.button}
  disabled={
    !nomeGasto ||
    !valorGasto ||
    !cartaoSelecionado ||
    !pessoaSelecionada
  }
>
              {gastoEmEdicaoId ? "Salvar gasto" : "Adicionar gasto"}
            </button>

            {gastoEmEdicaoId && (
              <button
                onClick={limparFormularioGasto}
                style={styles.buttonSecundario}
              >
                Cancelar edição
              </button>
            )}

            {erroGasto && <p style={styles.erro}>{erroGasto}</p>}

            <ul style={styles.lista}>
              {gastosFiltrados.length === 0 ? (
  <li style={styles.itemLista}>
  <span style={styles.textoAuxiliar}>
    Nenhum gasto registrado.
  </span>
</li>
) : (
  gastosFiltrados.map((gasto) => (
                <li key={gasto.id} style={styles.itemListaColuna}>
                  <div style={styles.itemLinhaSuperior}>
                    <span style={styles.itemText}>
{gasto.nome} · {formatarMoeda(gasto.valor)} · {gasto.cartaoNome} · {gasto.pessoaNome}
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
                  </div>

                  <div style={styles.actionRow}>
                    <button
                      onClick={() => editarGasto(gasto)}
                      style={styles.actionButton}
                    >
                    Editar
                  </button>

                  <button
                    onClick={() => excluirGasto(gasto.id)}
                    style={styles.actionButtonDanger}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))
            )}
          </ul>
        </div>

        {/* ╔══════════════════════════════════════════════╗
            ║                   CONTAS                     ║
            ╚══════════════════════════════════════════════╝ */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Contas</h2>
            <span style={styles.cardChip}>Boletos</span>
          </div>

          <input
            placeholder="Nome da conta"
            value={nomeConta}
            onChange={(e) => setNomeConta(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Valor"
            value={valorConta}
            onChange={(e) =>
              setValorConta(e.target.value.replace(/[^\d,]/g, ""))
            }
            style={styles.input}
          />

          <input
            type="date"
            value={dataConta}
            onChange={(e) => setDataConta(e.target.value)}
            style={styles.input}
          />
          <select
  value={quemPagouConta}
  onChange={(e) => setQuemPagouConta(e.target.value)}
  style={styles.input}
>
  <option value="">Quem vai pagar?</option>
  {pessoas.map((pessoa) => (
    <option key={pessoa.id} value={pessoa.id}>
      {pessoa.nome}
    </option>
  ))}
</select>

          <button
  onClick={adicionarConta}
  disabled={!nomeConta || !valorConta || !dataConta || !quemPagouConta}
  style={styles.button}
>
            Adicionar conta
          </button>

          <ul style={styles.lista}>
            {contas.length === 0 ? (
              <li style={styles.itemLista}>
                <span style={styles.textoAuxiliar}>
                  Nenhuma conta cadastrada.
                </span>
              </li>
            ) : (
              contasOrdenadas.map((conta) => (
                <li
  key={conta.id}
style={{
  ...styles.itemLista,
  ...(temaAtivo.urgency?.[getContaUrgencia(conta)]?.border && {
    border: temaAtivo.urgency[getContaUrgencia(conta)].border,
  }),
  ...(temaAtivo.urgency?.[getContaUrgencia(conta)]?.bg && {
    background: temaAtivo.urgency[getContaUrgencia(conta)].bg,
  }),
  ...(temaAtivo.urgency?.[getContaUrgencia(conta)]?.glow && {
    boxShadow: temaAtivo.urgency[getContaUrgencia(conta)].glow,
  }),
}}
>
<div style={{
  display: "flex",
  flexDirection: "column",
  gap: 4,
  flex: 1
}}>
  <span style={{ 
  fontWeight: "700", 
  fontSize: 14,
  color: temaAtivo.cardTitle
}}>
  {conta.nome}
</span>

  <span style={{ fontSize: 13, color: temaAtivo.cardText }}>
    {formatarMoeda(conta.valor)}
  </span>

  <span style={{ fontSize: 12, color: temaAtivo.subtitle }}>
    vence {conta.dataVencimento}
  </span>

  {isContaAtrasada(conta) && (
    <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>
      ATRASADO
    </span>
  )}
</div>

{!conta.pago && (
  <button
    onClick={() => marcarContaComoPaga(conta.id)}
    style={styles.actionButtonSmall}
  >
    Pagar
  </button>
)}

{conta.pago && (
  <span style={{ color: "#2ecc71", fontWeight: "bold" }}>
    ✔ Pago por {conta.quemPagouNome}
  </span>
)}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
</div>
      {/* ╔══════════════════════════════════════════════╗
          ║                   FOOTER                     ║
          ╚══════════════════════════════════════════════╝ */}
      <div style={styles.footer}>
        <div style={styles.resetBox}>
          <p style={styles.resetTitle}>☢ Zona de risco</p>
          <p style={styles.resetText}>
            Isso apagará todos os dados do sistema. Use apenas em último caso.
          </p>

          <button
            onClick={lidarComResetTotal}
            style={styles.resetButton}
          >
            ☢ {RESET_MESSAGES[resetEtapa] ?? RESET_MESSAGES[2]}
          </button>

          {resetEtapa > 0 && (
            <button
              onClick={() => setResetEtapa(0)}
              style={styles.buttonSecundario}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );

 

}
export default function App() {
  return <Dashboard />;
}