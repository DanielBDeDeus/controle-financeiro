import { useEffect, useMemo, useState } from "react";
import { paraNumero } from "./utils/finance";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import PessoasPage from "./PessoasPage";

// ╔══════════════════════════════════════════════╗
// ║                  GRÁFICO                     ║
// ╠══════════════════════════════════════════════╣
// ║ Componentes de visualização (Recharts)       ║
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

// ╔══════════════════════════════════════════════╗
// ║         CHAVES DO LOCALSTORAGE               ║
// ╠══════════════════════════════════════════════╣
// ║ Centraliza todas as chaves usadas para       ║
// ║ persistência no navegador                    ║
// ╚══════════════════════════════════════════════╝
const STORAGE_KEYS = {
  pessoas: "controle-financeiro:pessoas",
  gastoDebito: "controle-financeiro:gasto-debito",
  faturaAtual: "controle-financeiro:fatura-atual",
  cartoes: "controle-financeiro:cartoes",
  gastos: "controle-financeiro:gastos",
  perfilAtivo: "controle-financeiro:perfil-ativo",
  resetEtapa: "controle-financeiro:reset-etapa",
  transacoes: "controle-financeiro:transacoes",
  contas: "controle-financeiro:contas",
};

// ╔══════════════════════════════════════════════╗
// ║           SISTEMA DE TEMAS DINÂMICOS         ║
// ╠══════════════════════════════════════════════╣
// ║ Cada pessoa pode possuir um tema próprio     ║
// ║ Household mistura cores automaticamente      ║
// ║                                              ║
// ║⚠ Alterar estrutura aqui quebra UI inteira   ║
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
// ║        FUNÇÕES AUXILIARES DE STORAGE         ║
// ╠══════════════════════════════════════════════╣
// ║ Leitura e parsing seguro do localStorage     ║
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
// ╔══════════════════════════════════════════════╗
// ║         FORMATAÇÃO PADRÃO DE VALORES         ║
// ╠══════════════════════════════════════════════╣
// ║ Converte qualquer entrada para BRL seguro    ║
// ║ Evita NaN e inconsistências visuais          ║
// ╚══════════════════════════════════════════════╝
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
// ╔══════════════════════════════════════════════╗
// ║        SISTEMA DE URGÊNCIA DE CONTAS         ║
// ╠══════════════════════════════════════════════╣
// ║ Define prioridade visual baseada na data     ║
// ║ Usado diretamente para styling dinâmico      ║
// ║                                              ║
// ║ retorno: normal | medio | alto | critico     ║
// ║          | atrasado                          ║
// ╚══════════════════════════════════════════════╝
// ╔══════════════════════════════════════════════╗
// ║          REGRAS DE URGÊNCIA DE CONTAS        ║
// ╠══════════════════════════════════════════════╣
// ║ atraso        → data vencida já passou       ║
// ║ até 1 dia     → crítico (pagar AGORA)        ║
// ║ até 3 dias    → alto                         ║
// ║ até 7 dias    → médio                        ║
// ║ acima disso   → normal                       ║
// ║                                              ║
// ║ ⚠ Baseado em diferença de dias (diffDias)    ║
// ╚══════════════════════════════════════════════╝
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
function getUrgenciaFechamento(cartao) {
  if (cartao.tipo !== "credito" || !cartao.diaFechamento) {
    return "normal";
  }

  const hoje = new Date();
  const diaHoje = hoje.getDate();
  const diaFechamento = cartao.diaFechamento;

  let diffDias = diaFechamento - diaHoje;

  // passou do fechamento → próxima fatura
  if (diffDias < 0) {
    diffDias += 30;
  }

  if (diffDias === 0) return "critico";
  if (diffDias <= 1) return "critico";
  if (diffDias <= 3) return "alto";
  if (diffDias <= 7) return "medio";

  return "normal";
}
// ╔══════════════════════════════════════════════╗
// ║         SISTEMA DE CONFIRMAÇÃO DE RESET      ║
// ╠══════════════════════════════════════════════╣
// ║ Usuário precisa clicar múltiplas vezes       ║
// ║ Evita reset acidental destrutivo             ║
// ╚══════════════════════════════════════════════╝
const RESET_MESSAGES = [
  "☢ Tem certeza que quer apagar tudo?",
  "☢ Isso vai apagar TODOS os dados salvos.",
  "☢ ÚLTIMA CHANCE. Apagar tudo mesmo?",
];
// ╔══════════════════════════════════════════════╗
// ║               COMPONENTE PRINCIPAL           ║
// ╠══════════════════════════════════════════════╣
// ║ Orquestra todo o sistema financeiro          ║
// ║                                              ║
// ║ Responsabilidades:                           ║
// ║ - Estados globais (gastos, contas, pessoas)  ║
// ║ - Persistência                               ║
// ║ - Cálculos derivados                         ║
// ║ - Renderização do dashboard                  ║
// ╚══════════════════════════════════════════════╝
function Dashboard({
  pessoas,
  setPessoas,
  contas,
  setContas,
  transacoes,
  setTransacoes,
  temaAtivo,
  perfilAtivo,
  setPerfilAtivo
}) {
const navigate = useNavigate();
// ╔══════════════════════════════════════════════╗
// ║        DEFINIÇÃO DO PERFIL ATIVO             ║
// ╠══════════════════════════════════════════════╣
// ║ household = visão combinada da casa          ║
// ║ qualquer outro valor = id da pessoa ativa    ║
// ╚══════════════════════════════════════════════╝
// ╔══════════════════════════════════════════════╗
// ║         TEMA DA VISÃO CONJUNTA               ║
// ╚══════════════════════════════════════════════╝

const [resetEtapa, setResetEtapa] = useState(
  () => Number(lerTextoStorage(STORAGE_KEYS.resetEtapa) || 0)
);

// ╔══════════════════════════════════════════════╗
// ║           (RESERVADO - FUTURO)               ║
// ╠══════════════════════════════════════════════╣
// ║ Espaço para lógica futura relacionada a      ║
// ║ manipulação direta de pessoas                ║
// ╚══════════════════════════════════════════════╝



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
  const [diaFechamento, setDiaFechamento] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("");
  const [erroCartao, setErroCartao] = useState("");
  const [limiteCartao, setLimiteCartao] = useState("");
  const [limiteUsado, setLimiteUsado] = useState("");

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
// ╠══════════════════════════════════════════════╣
// ║ Controle de contas, vencimentos e pagamento  ║
// ╚══════════════════════════════════════════════╝

// ╔══════════════════════════════════════════════╗
// ║        HISTÓRICO DE MOVIMENTAÇÕES            ║
// ╠══════════════════════════════════════════════╣
// ║ Log de entradas/saídas manuais de saldo      ║
// ╚══════════════════════════════════════════════╝
  
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
// ╠══════════════════════════════════════════════╣
// ║ Sincroniza estados com localStorage          ║
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
// ╠══════════════════════════════════════════════╣
// ║ CRUD + regras de consistência de pessoas     ║
// ╚══════════════════════════════════════════════╝
  function excluirPessoa(idPessoa) {
// ╔══════════════════════════════════════════════╗
// ║          EXCLUSÃO EM CASCATA (PESSOA)        ║
// ╠══════════════════════════════════════════════╣
// ║ Remove pessoa + gastos associados            ║
// ║                                              ║
// ║ ⚠ Impacta saldo global e histórico           ║
// ╚══════════════════════════════════════════════╝
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
// ║     ALTERAÇÃO DE SALDO COM RASTREABILIDADE   ║
// ╠══════════════════════════════════════════════╣
// ║ Atualiza saldo E cria um "gasto especial"    ║
// ║                                              ║
// ║ Tipo: ajuste_manual                          ║
// ║                                              ║
// ║ ⚠ Mantém consistência visual no sistema      ║
// ╚══════════════════════════════════════════════╝
function alterarSaldoPessoa(idPessoa, valor, comentario = "") {
  const numero = parseFloat(String(valor).replace(",", "."));

  if (isNaN(numero)) return;

  const pessoa = pessoas.find(p => p.id === idPessoa);
  if (!pessoa) return;

  // ╔══════════════════════════════════════════════╗
  // ║         ATUALIZA SALDO DIRETAMENTE           ║
  // ╚══════════════════════════════════════════════╝
  setPessoas((prev) =>
    prev.map((p) =>
      p.id === idPessoa
        ? { ...p, saldo: (p.saldo || 0) + numero }
        : p
    )
  );

  // ╔══════════════════════════════════════════════╗
  // ║      CRIA REGISTRO VISUAL COMO "GASTO"       ║
  // ╠══════════════════════════════════════════════╣
  // ║ Permite rastrear ajustes dentro da UI        ║
  // ╚══════════════════════════════════════════════╝
  const ajusteComoGasto = {
    id: Date.now(),
    nome: comentario || "Ajuste manual de saldo",
    valor: Math.abs(numero),
    tipo: numero < 0 ? "debito" : "entrada",
    cartaoNome: "Ajuste manual",
    pessoaId: pessoa.id,
    pessoaNome: pessoa.nome,

    // ╔══════════════════════════════════════════════╗
    // ║            TAG ESPECIAL DO SISTEMA           ║
    // ╚══════════════════════════════════════════════╝
    origem: "ajuste_manual",
  };

  const novaLista = [ajusteComoGasto, ...gastos];
  setGastos(novaLista);

  recalcularTotais(novaLista);

  // ╔══════════════════════════════════════════════╗
  // ║            LOG DE AUDITORIA (INTERNO)        ║
  // ╚══════════════════════════════════════════════╝
const novaTransacao = {
  id: Date.now(),
  tipo: numero < 0 ? "debito" : "entrada",
  origem: "ajuste_manual",
  nome: comentario || "Ajuste manual de saldo",
  valor: Math.abs(numero),
  pessoaId: pessoa.id,
  pessoaNome: pessoa.nome,
  cartaoNome: null,
  data: new Date().toISOString(),
  observacao: comentario || "",
};

setTransacoes((prev) => [novaTransacao, ...prev]);
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
if (tipoCartao === "credito" && !diaFechamento) {
  setErroCartao("Informe o dia de fechamento.");
  return;
}
if (tipoCartao === "credito" && !diaVencimento) {
  setErroCartao("Informe o dia de vencimento.");
  return;
}
if (tipoCartao === "credito" && !limiteCartao) {
  setErroCartao("Informe o limite do cartão.");
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
  diaFechamento:
  tipoCartao === "credito" ? Number(diaFechamento) : null,

diaVencimento:
  tipoCartao === "credito" ? Number(diaVencimento) : null,

  limite:
    tipoCartao === "credito"
      ? paraNumero(limiteCartao)
      : null,

  limiteUsado:
    tipoCartao === "credito"
      ? paraNumero(limiteUsado)
      : 0,
};

    setCartoes([...cartoes, novoCartao]);
    setNomeCartao("");
    setErroCartao("");
    setDiaFechamento("");
    setDiaVencimento("");
    setLimiteCartao("");
    setLimiteUsado("");
  }
// ╔══════════════════════════════════════════════╗
// ║          FUNÇÃO: EXCLUIR CARTÃO              ║
// ╠══════════════════════════════════════════════╣
// ║ Remove um cartão do sistema e também         ║
// ║ remove todos os gastos vinculados a ele      ║
// ╚══════════════════════════════════════════════╝
function excluirCartao(idCartao) {
// ╔══════════════════════════════════════════════╗
// ║          EXCLUSÃO DE CARTÃO (CRÍTICO)        ║
// ╠══════════════════════════════════════════════╣
// ║ Remove cartão + TODOS os gastos vinculados   ║
// ║                                              ║
// ║ ⚠ Operação destrutiva irreversível           ║
// ╚══════════════════════════════════════════════╝
  const cartao = cartoes.find(c => c.id === idCartao);
  if (!cartao) return;

  // ╔══════════════════════════════════════════════╗
  // ║   FILTRA GASTOS QUE NÃO USAM ESTE CARTÃO     ║
  // ╚══════════════════════════════════════════════╝
  const gastosRestantes = gastos.filter(
    (g) => g.cartaoNome !== cartao.nome
  );

  // ╔══════════════════════════════════════════════╗
  // ║        REMOVE CARTÃO DA LISTA                ║
  // ╚══════════════════════════════════════════════╝
  setCartoes(cartoes.filter(c => c.id !== idCartao));

  // ╔══════════════════════════════════════════════╗
  // ║     ATUALIZA LISTA DE GASTOS                ║
  // ╚══════════════════════════════════════════════╝
  setGastos(gastosRestantes);

  // ╔══════════════════════════════════════════════╗
  // ║      RECALCULA TOTAIS DO SISTEMA            ║
  // ╚══════════════════════════════════════════════╝
  recalcularTotais(gastosRestantes);
}

// ╔══════════════════════════════════════════════╗
// ║                FUNÇÕES DE GASTOS             ║
// ╠══════════════════════════════════════════════╣
// ║ Criação, edição, exclusão e recalculo        ║
// ╚══════════════════════════════════════════════╝

  function limparFormularioGasto() {
    setNomeGasto("");
    setValorGasto("");
    setCartaoSelecionado("");
    setPessoaSelecionada("");
    setGastoEmEdicaoId(null);
    setErroGasto("");
  }
// ╔══════════════════════════════════════════════╗
// ║        RECÁLCULO GLOBAL DE FINANÇAS          ║
// ╠══════════════════════════════════════════════╣
// ║ Fonte única da verdade para:                 ║
// ║ - total débito                               ║
// ║ - total crédito                              ║
// ║                                              ║
// ║ ⚠ Toda alteração passa por aqui              ║
// ╚══════════════════════════════════════════════╝
  function recalcularTotais(listaDeGastos) {
    const totalDebito = listaDeGastos
      .filter((gasto) => gasto.tipo === "debito")
      .reduce((acumulador, gasto) => acumulador + paraNumero(gasto.valor), 0);

    const totalCredito = listaDeGastos
      .filter((gasto) => gasto.tipo === "credito")
      .reduce((acumulador, gasto) => acumulador + paraNumero(gasto.valor), 0);
    // ╔══════════════════════════════════════════════╗
    // ║              TOTAL DE ENTRADAS               ║
    // ╚══════════════════════════════════════════════╝
    const totalEntradas = listaDeGastos
      .filter((gasto) => gasto.tipo === "entrada")
      .reduce((acc, gasto) => acc + paraNumero(gasto.valor), 0);
        setGastoDebito(totalDebito);
        setFaturaAtual(totalCredito);
        // ⚠ entradas não impactam fatura nem débito diretamente
        // ficam disponíveis para analytics/graph
  }
// ╔══════════════════════════════════════════════╗
// ║        FLUXO PRINCIPAL DE GASTOS             ║
// ╠══════════════════════════════════════════════╣
// ║ 1. Validação                                 ║
// ║ 2. Identificação de cartão/pessoa            ║
// ║ 3. Edição OU criação                         ║
// ║ 4. Impacto no saldo (débito)                 ║
// ║ 5. Recalculo global                          ║
// ║                                              ║
// ║ ⚠ Função crítica do sistema                 ║
// ╚══════════════════════════════════════════════╝
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
// ║           IMPACTO FINANCEIRO DO GASTO        ║
// ╠══════════════════════════════════════════════╣
// ║ Débito  → reduz saldo imediatamente          ║
// ║ Crédito → entra apenas na fatura             ║
// ║                                              ║
// ║ ⚠ Afeta saldo OU fatura dependendo do tipo   ║
// ╚══════════════════════════════════════════════╝

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

  const novaTransacao = {
  id: Date.now() + 1,
  tipo: cartao.tipo,
  origem: "gasto",
  nome: nomeNormalizado,
  valor,
  pessoaId: pessoa.id,
  pessoaNome: pessoa.nome,
  cartaoNome: cartao.nome,
  data: new Date().toISOString(),
  observacao: "",
};

setTransacoes((prev) => [novaTransacao, ...prev]);

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
// ╠══════════════════════════════════════════════╣
// ║ Controle de boletos e impacto no saldo       ║
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

// ╔══════════════════════════════════════════════╗
// ║     MARCAR CONTA COMO PAGA                  ║
// ╚══════════════════════════════════════════════╝
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

  // ╔══════════════════════════════════════════════╗
  // ║        REGISTRO NO LEDGER (CONTA PAGA)       ║
  // ╚══════════════════════════════════════════════╝
  const novaTransacao = {
    id: Date.now(),
    tipo: "conta_paga",
    origem: "boleto",
    nome: conta.nome,
    valor: paraNumero(conta.valor),
    pessoaId: pessoa.id,
    pessoaNome: pessoa.nome,
    cartaoNome: null,
    data: new Date().toISOString(),
    observacao: "Pagamento de conta",
  };

  setTransacoes((prev) => [novaTransacao, ...prev]);
}

// ╔══════════════════════════════════════════════╗
// ║          FUNÇÃO: EXCLUIR CONTA               ║
// ╚══════════════════════════════════════════════╝
function excluirConta(idConta) {
  setContas(contas.filter(c => c.id !== idConta));
}
// ╔══════════════════════════════════════════════╗
// ║           CÁLCULOS DE PERFIL ATIVO           ║
// ╠══════════════════════════════════════════════╣
// ║ Filtragem e agregação baseada no perfil      ║
// ╚══════════════════════════════════════════════╝

// ╔══════════════════════════════════════════════╗
// ║        SISTEMA DE VISÃO (HOUSEHOLD vs USER)  ║
// ╠══════════════════════════════════════════════╣
// ║ Household → mostra tudo agregado             ║
// ║ Perfil → filtra por pessoa específica        ║
// ║                                              ║
// ║ Afeta TODOS os cálculos abaixo               ║
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
    return pessoas.reduce((acc, pessoa) => {
      return acc + (
        salarioDisponivel(pessoa)
          ? paraNumero(pessoa.salario)
          : 0
      );
    }, 0);
  }

  if (!pessoaAtiva) return 0;

  return salarioDisponivel(pessoaAtiva)
    ? paraNumero(pessoaAtiva.salario)
    : 0;

}, [ehHousehold, pessoaAtiva, pessoas]);

  const saldoTotalPessoas = pessoas.reduce((acc, pessoa) => {
  return acc + (pessoa.saldo || 0);
}, 0);
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
// ╔══════════════════════════════════════════════╗
// ║           CÁLCULO DE SALDO DISPONÍVEL        ║
// ╠══════════════════════════════════════════════╣
// ║ saldo atual - contas pendentes               ║
// ║                                              ║
// ║ Representa dinheiro REAL utilizável          ║
// ║                                              ║
// ║ ⚠ Não inclui crédito futuro                  ║
// ╚══════════════════════════════════════════════╝
const saldoDisponivel =
  saldoTotalPessoas -
  totalContasPendentes;

const totalContasPagas = contas
  .filter((c) => c.pago)
  .reduce((acc, c) => acc + paraNumero(c.valor), 0);

const totalSalario = pessoas.reduce((acc, p) => {
  return acc + (
    salarioDisponivel(p)
      ? paraNumero(p.salario)
      : 0
  );
}, 0);
// ╔══════════════════════════════════════════════╗
// ║             DADOS DO GRÁFICO                 ║
// ╠══════════════════════════════════════════════╣
// ║ Cada item representa uma métrica financeira  ║
// ║                                              ║
// ║ ⚠ Ordem deve bater com array COLORS          ║
// ╚══════════════════════════════════════════════╝
const totalEntradas = gastosFiltrados
  .filter((g) => g.tipo === "entrada")
  .reduce((acc, g) => acc + paraNumero(g.valor), 0);

const dataGrafico = [
  { name: "Salário", value: totalSalario },
  { name: "Débito", value: paraNumero(gastoDebitoFiltrado) || 0 },
  { name: "Crédito", value: paraNumero(faturaAtualFiltrada) || 0 },
  { name: "Entradas", value: totalEntradas || 0 },
  { name: "Contas pagas", value: totalContasPagas || 0 },
];

const dadosSaldoPessoas = pessoas.map((p) => {
  const saldo = p.saldo || 0;

  return {
    name: p.nome,
    saldo,
    saldoNormalizado: Math.min(saldo, 5000), // clamp visual
  };
});

// ╔══════════════════════════════════════════════╗
// ║           CORES DO GRÁFICO                   ║
// ╠══════════════════════════════════════════════╣
// ║ Ordem: salário, débito, crédito, contas      ║
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
// ╔══════════════════════════════════════════════╗
// ║              RESET TOTAL DO SISTEMA          ║
// ╠══════════════════════════════════════════════╣
// ║ Remove TODOS os dados (estado + storage)     ║
// ║                                              ║
// ║ ⚠ Irreversível                              ║
// ╚══════════════════════════════════════════════╝
  function limparTudo() {
  setPessoas([]);

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
// ╔══════════════════════════════════════════════╗
// ║           RESET FORÇADO DE ESTADO            ║
// ╠══════════════════════════════════════════════╣
// ║ Garante limpeza completa após reset          ║
// ║                                              ║
// ║ ⚠ Evita inconsistências de estado            ║
// ╚══════════════════════════════════════════════╝
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
// ╔══════════════════════════════════════════════╗
// ║             SISTEMA DE ESTILOS               ║
// ╠══════════════════════════════════════════════╣
// ║ Todos os estilos dependem do tema ativo      ║
// ║                                              ║
// ║ ⚠ Alterar aqui impacta TODA a UI             ║
// ╚══════════════════════════════════════════════╝
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
  padding: "0",
  minWidth: "320px",
  maxWidth: "100%",
  color: temaAtivo.cardText,
  overflow: "hidden",
  position: "relative",
  boxShadow:
    "0 18px 38px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.88)",
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
  marginBottom: 0,
  padding: "16px 18px 14px 18px",
  borderBottom: `1px solid ${temaAtivo.kpiBorder}`,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 100%)",
  boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.25)",
},

      cardTitle: {
  margin: 0,
  color: temaAtivo.cardTitle,
  fontSize: "18px",
  fontWeight: "800",
  letterSpacing: "-0.2px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  textTransform: "none",
},
icon: {
  fontSize: 22,
  verticalAlign: "middle",
  marginRight: 8,
  opacity: 0.95,
  filter: "drop-shadow(0 0 4px rgba(0,0,0,0.2))",
},

      cardChip: {
  fontSize: "10px",
  fontWeight: "800",
  letterSpacing: "1px",
  textTransform: "uppercase",
  color: temaAtivo.chipText,
  background: temaAtivo.chipBg,
  border: `1px solid ${temaAtivo.chipBorder}`,
  padding: "5px 10px",
  borderRadius: "999px",
  whiteSpace: "nowrap",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
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
  padding: "16px 18px 18px 18px",
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
  fontSize: "13px",
  color: temaAtivo.subtitle,
  lineHeight: "1.55",
  margin: 0,
  maxWidth: "320px",
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
  borderRadius: "12px",
  border: `1px solid ${temaAtivo.inputBorder}`,
  boxSizing: "border-box",
  background: temaAtivo.inputBg,
  color: temaAtivo.inputText,
  outline: "none",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.18)",
},

      button: {
  width: "100%",
  padding: "13px",
  background: temaAtivo.buttonBg,
  color: "#ffffff",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "800",
  marginTop: "4px",
  boxShadow:
    `${temaAtivo.buttonShadow}, inset 0 1px 0 rgba(255,255,255,0.25)`,
  transition: "transform 0.14s ease, box-shadow 0.14s ease, opacity 0.14s ease",
},

      buttonSecundario: {
  width: "100%",
  padding: "13px",
  background: temaAtivo.buttonSecondaryBg,
  color: temaAtivo.buttonSecondaryText,
  border: `1px solid ${temaAtivo.buttonSecondaryBorder}`,
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "800",
  marginTop: "8px",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
  transition: "transform 0.14s ease, box-shadow 0.14s ease, opacity 0.14s ease",
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

// ╔══════════════════════════════════════════════╗
// ║        REGRA DE DISPONIBILIDADE DE SALÁRIO   ║
// ╠══════════════════════════════════════════════╣
// ║ Salário só entra no cálculo após pagamento   ║
// ║                                              ║
// ║ Suporta override manual (pagamento irregular)║
// ║                                              ║
// ║ ⚠ Evita inflar saldo antes da data correta   ║
// ╚══════════════════════════════════════════════╝
function salarioDisponivel(pessoa) {
  if (pessoa.pagamentoIrregular && pessoa.dataPagamentoOverride) {
    const hoje = new Date();
    const pagamento = new Date(pessoa.dataPagamentoOverride);

    return pagamento <= hoje;
  }

  return true;
}
    return (
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
            <div style={{ marginTop: 10 }}>
<button
  onClick={() => navigate("/pessoas")}
  style={{
    ...styles.button,
    width: "auto",
    padding: "10px 16px",
    marginTop: 12,
    fontSize: 13,
    borderRadius: 999,
  }}
>
  + Pessoas
</button>
</div>
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
              <h2 style={styles.cardTitle}>
  <span className="material-symbols-outlined" style={styles.icon}>
    visibility
  </span>
  Modo de visualização
</h2>
              <span style={styles.cardChip}>Perfil</span>
            </div>

            <label style={styles.label}>Quem estamos visualizando?</label>
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
              <h2 style={styles.cardTitle}>
  <span className="material-symbols-outlined" style={styles.icon}>
    filter_alt
  </span>
  Resumo da seleção
</h2>
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
                  {gastosFiltrados.filter(g => g.tipo !== "entrada").length}
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
              <h2 style={styles.cardTitle}>
  <span className="material-symbols-outlined" style={styles.icon}>
    bar_chart
  </span>
  Visão geral financeira
</h2>
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
    <h2 style={styles.cardTitle}>
  <span className="material-symbols-outlined" style={styles.icon}>
    group
  </span>
  Saldo individual
</h2>
    <span style={styles.cardChip}>Financeiro</span>
  </div>

  <div style={{ marginBottom: 12 }}>
<ResponsiveContainer width="100%" height={160}>
  <BarChart
    data={dadosSaldoPessoas}
    layout="vertical"
    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
  >
    <XAxis type="number" hide />
    <YAxis
      type="category"
      dataKey="name"
      width={80}
      tick={{ fill: "#94a3b8", fontSize: 12 }}
    />

    <Tooltip formatter={(v, _, item) => formatarMoeda(item.payload.saldo)} />

    <Bar
// ╔══════════════════════════════════════════════╗
// ║         NORMALIZAÇÃO VISUAL DO GRÁFICO       ║
// ╠══════════════════════════════════════════════╣
// ║ Evita barras desproporcionais                ║
// ║                                              ║
// ║ clamp: 0 → 100%                             ║
// ╚══════════════════════════════════════════════╝
      dataKey="saldoNormalizado"
      radius={[8, 8, 8, 8]}
      barSize={14}
    >
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
          <div style={{ ...styles.card, position: "sticky", top: "20px" }}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
  <span className="material-symbols-outlined" style={styles.icon}>
    analytics
  </span>
  Resumo financeiro
</h2>
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

    <h2 style={styles.cardTitle}>
      <span className="material-symbols-outlined" style={styles.icon}>
        credit_card
      </span>
      Cartões
    </h2>
    <span style={styles.cardChip}>Cadastro</span>
  </div>

  <div style={{ padding: "16px 18px 18px 18px" }}>

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
            {tipoCartao === "credito" && (
  <>
<div>
  <label style={styles.label}>
    <span className="material-symbols-outlined" style={{ fontSize: 16, marginRight: 6 }}>
      calendar_month
    </span>
    Fechamento da fatura
  </label>

  <input
    placeholder="dd/mm"
    value={diaFechamento}
    onChange={(e) => {
      let v = e.target.value.replace(/\D/g, "");

      if (v.length >= 3) {
        v = v.slice(0, 2) + "/" + v.slice(2, 4);
      }

      setDiaFechamento(v.slice(0, 5));
    }}
    style={styles.input}
  />
</div>

<div>
  <label style={styles.label}>
    <span className="material-symbols-outlined" style={{ fontSize: 16, marginRight: 6 }}>
      event
    </span>
    Vencimento da fatura
  </label>

  <input
    placeholder="dd/mm"
    value={diaVencimento}
    onChange={(e) => {
      let v = e.target.value.replace(/\D/g, "");

      if (v.length >= 3) {
        v = v.slice(0, 2) + "/" + v.slice(2, 4);
      }

      setDiaVencimento(v.slice(0, 5));
    }}
    style={styles.input}
  />
</div>

    <input
      placeholder="Limite total (ex: 5000)"
      value={limiteCartao}
      onChange={(e) =>
        setLimiteCartao(e.target.value.replace(/[^\d,]/g, ""))
      }
      style={styles.input}
    />

    <input
      placeholder="Já utilizado (ex: 1200)"
      value={limiteUsado}
      onChange={(e) =>
        setLimiteUsado(e.target.value.replace(/[^\d,]/g, ""))
      }
      style={styles.input}
    />
  </>
)}

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
                  <span style={styles.itemText}>
  {cartao.nome}
  {cartao.tipo === "credito" && cartao.diaFechamento && (
  <span
    style={{
      marginLeft: 8,
      fontSize: 12,
      opacity: 0.9,

      ...(temaAtivo.urgency?.[getUrgenciaFechamento(cartao)]?.border && {
        border: temaAtivo.urgency[getUrgenciaFechamento(cartao)].border,
        padding: "2px 6px",
        borderRadius: 6,
      }),

      ...(temaAtivo.urgency?.[getUrgenciaFechamento(cartao)]?.bg && {
        background: temaAtivo.urgency[getUrgenciaFechamento(cartao)].bg,
      }),

      ...(temaAtivo.urgency?.[getUrgenciaFechamento(cartao)]?.glow && {
        boxShadow: temaAtivo.urgency[getUrgenciaFechamento(cartao)].glow,
      }),
    }}
  >
    (fecha dia {cartao.diaFechamento} • vence dia {cartao.diaVencimento})
  </span>
)}
</span>

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
          </div>

          <div style={{ ...styles.card, position: "sticky", top: "20px" }}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
  <span className="material-symbols-outlined" style={styles.icon}>
    payments
  </span>
  Gastos
</h2>
              <span style={styles.cardChip}>Registro</span>
            </div>
<div style={{ padding: "16px 18px 18px 18px" }}>
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

{gasto.origem === "ajuste_manual" && (
  <span
    style={{
      marginLeft: 8,
      fontSize: 11,
      padding: "2px 6px",
      borderRadius: 6,
      background: "rgba(255,255,255,0.2)",
      border: "1px solid rgba(255,255,255,0.3)",
    }}
  >
    ajuste manual
  </span>
)}
                    </span>

                    <span
                      style={{
                        ...styles.badgeMini,
                        ...(gasto.tipo === "debito"
                              ? styles.badgeDebito
                              : gasto.tipo === "credito"
                              ? styles.badgeCredito
                              : styles.badgeSaldo),
                      }}
                    >
                      {gasto.tipo === "entrada" ? "entrada (saldo)" : gasto.tipo}
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
</div>
        {/* ╔══════════════════════════════════════════════╗
            ║                   CONTAS                     ║
            ╚══════════════════════════════════════════════╝ */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
  <span className="material-symbols-outlined" style={styles.icon}>
    receipt_long
  </span>
  Contas
</h2>
            <span style={styles.cardChip}>Boletos</span>
          </div>
<div style={{ padding: "16px 18px 18px 18px" }}>
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

<div>
  <label style={styles.label}>
    <span className="material-symbols-outlined" style={{ fontSize: 16, marginRight: 6 }}>
      receipt_long
    </span>
    Vencimento da conta
  </label>

  <input
    placeholder="dd/mm/aaaa"
    value={dataConta}
    onChange={(e) => {
      let v = e.target.value.replace(/\D/g, "");

      if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
      if (v.length >= 6) v = v.slice(0, 5) + "/" + v.slice(5);

      setDataConta(v.slice(0, 10));
    }}
    style={styles.input}
  />
</div>
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
<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 6,
    flex: 1,
  }}
>
  {/* ╔══════════════════════════════════════════════╗
      ║              NOME DA CONTA                 ║
      ╚══════════════════════════════════════════════╝ */}
  <span
    style={{
      fontWeight: "700",
      fontSize: 14,
      color: temaAtivo.cardTitle,
    }}
  >
    {conta.nome}
  </span>

  {/* ╔══════════════════════════════════════════════╗
      ║               VALOR DA CONTA                 ║
      ╚══════════════════════════════════════════════╝ */}
  <span style={{ fontSize: 13, color: temaAtivo.cardText }}>
    💰 {formatarMoeda(conta.valor)}
  </span>

  {/* ╔══════════════════════════════════════════════╗
      ║           DATA DE VENCIMENTO (FIX)           ║
      ╠══════════════════════════════════════════════╣
      ║ Agora com label claro e ícone                ║
      ╚══════════════════════════════════════════════╝ */}
  <span style={{ fontSize: 12, color: temaAtivo.subtitle }}>
    📅 Vencimento: {new Date(conta.dataVencimento).toLocaleDateString("pt-BR")}
  </span>

  {/* ╔══════════════════════════════════════════════╗
      ║              STATUS DE ATRASO              ║
      ╚══════════════════════════════════════════════╝ */}
  {isContaAtrasada(conta) && (
    <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>
      ⚠ ATRASADO
    </span>
  )}
</div>

{!conta.pago && (
  <div style={{ display: "flex", gap: 8 }}>
  {!conta.pago && (
    <button
      onClick={() => marcarContaComoPaga(conta.id)}
      style={styles.actionButtonSmall}
    >
      Pagar
    </button>
  )}

  <button
    onClick={() => excluirConta(conta.id)}
    style={styles.actionButtonDanger}
  >
    Excluir
  </button>
</div>
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
// ╔══════════════════════════════════════════════╗
// ║             ROOT DA APLICAÇÃO                ║
// ╠══════════════════════════════════════════════╣
// ║ Define rotas e estado global compartilhado   ║
// ║                                              ║
// ║ "/" → Dashboard                              ║
// ║ "/pessoas" → Gestão de pessoas               ║
// ╚══════════════════════════════════════════════╝
export default function App() {
  const [pessoas, setPessoas] = useState(() =>
    lerJsonStorage(STORAGE_KEYS.pessoas, [])
  );
  const [contas, setContas] = useState(() =>
  lerJsonStorage(STORAGE_KEYS.contas, [])
);
const [transacoes, setTransacoes] = useState(() =>
  lerJsonStorage(STORAGE_KEYS.transacoes, [])
);

// ╔══════════════════════════════════════════════╗
// ║        TEMA + PERFIL GLOBAL                  ║
// ╚══════════════════════════════════════════════╝

const [perfilAtivo, setPerfilAtivo] = useState("household");
// ╔══════════════════════════════════════════════╗
// ║             SISTEMA DE TEMAS                 ║
// ╠══════════════════════════════════════════════╣
// ║ Perfil → usa tema da pessoa                  ║
// ║ Household → mistura média dos temas          ║
// ║                                              ║
// ║ ⚠ Impacta TODA a UI                          ║
// ╚══════════════════════════════════════════════╝
const temaAtivo = useMemo(() => {
// ╔══════════════════════════════════════════════╗
// ║        SISTEMA DE VISÃO (PERFIL vs GLOBAL)   ║
// ╠══════════════════════════════════════════════╣
// ║ Household → mostra tudo agregado             ║
// ║ Perfil → filtra por pessoa                   ║
// ║                                              ║
// ║ ⚠ Afeta TODOS os cálculos abaixo             ║
// ╚══════════════════════════════════════════════╝
  const ehHousehold = perfilAtivo === "household";

  const pessoaAtiva = pessoas.find(
    (p) => String(p.id) === String(perfilAtivo)
  );

  if (!ehHousehold && pessoaAtiva) {
    return THEMES[pessoaAtiva.tema] ?? THEMES.cassette_neon;
  }

  if (pessoas.length === 0) {
    return THEMES.cassette_neon;
  }

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
}, [perfilAtivo, pessoas]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.pessoas,
      JSON.stringify(pessoas)
    );
  }, [pessoas]);
useEffect(() => {
  window.localStorage.setItem(
    STORAGE_KEYS.contas,
    JSON.stringify(contas)
  );
}, [contas]);
useEffect(() => {
  window.localStorage.setItem(
    STORAGE_KEYS.transacoes,
    JSON.stringify(transacoes)
  );
}, [transacoes]);
  return (
<BrowserRouter>
  <Routes>

    <Route
      path="/"
      element={
        <Dashboard
  pessoas={pessoas}
  setPessoas={setPessoas}
  contas={contas}
  setContas={setContas}
  transacoes={transacoes}
  setTransacoes={setTransacoes}
  temaAtivo={temaAtivo}
  perfilAtivo={perfilAtivo}
  setPerfilAtivo={setPerfilAtivo}
/>
      }
    />

    <Route
      path="/pessoas"
      element={
<PessoasPage
  pessoas={pessoas}
  setPessoas={setPessoas}
  contas={contas}
  temaAtivo={temaAtivo}
/>
      }
    />

  </Routes>
</BrowserRouter>
  );
}