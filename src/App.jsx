import { useEffect, useMemo, useState } from "react";
import { calcularSaldoDisponivel, paraNumero } from "./utils/finance";

// ==============================
// IMPORTS DO GRÁFICO
// ==============================
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

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
};

// ==============================
// TEMAS PREDEFINIDOS
// ==============================
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

// ==============================
// FUNÇÕES AUXILIARES DE LEITURA
// ==============================

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

const RESET_MESSAGES = [
  "☢ Tem certeza que quer apagar tudo?",
  "☢ Isso vai apagar TODOS os dados salvos.",
  "☢ ÚLTIMA CHANCE. Apagar tudo mesmo?",
];

export default function App() {
  // ==============================
  // STATES DE PERFIL / VISÃO
  // ==============================

  // "household" = visão combinada da casa
  // qualquer outro valor = id da pessoa ativa
  const [perfilAtivo, setPerfilAtivo] = useState(
    () => lerTextoStorage(STORAGE_KEYS.perfilAtivo) || "household"
  );

  // Tema da visão Household

const [resetEtapa, setResetEtapa] = useState(
  () => Number(lerTextoStorage(STORAGE_KEYS.resetEtapa) || 0)
);

  // ==============================
  // STATES DE PESSOAS
  // ==============================

  const [pessoas, setPessoas] = useState(() =>
    lerJsonStorage(STORAGE_KEYS.pessoas, [])
  );

  const [nomePessoa, setNomePessoa] = useState("");
  const [salarioPessoa, setSalarioPessoa] = useState("");
  const [pessoaEmEdicaoId, setPessoaEmEdicaoId] = useState(null);
  const [erroPessoa, setErroPessoa] = useState("");

  // ==============================
  // STATES PRINCIPAIS
  // ==============================

  const [gastoDebito, setGastoDebito] = useState(() =>
    lerTextoStorage(STORAGE_KEYS.gastoDebito)
  );

  const [faturaAtual, setFaturaAtual] = useState(() =>
    lerTextoStorage(STORAGE_KEYS.faturaAtual)
  );

  // ==============================
  // STATES DE CARTÕES
  // ==============================

  const [cartoes, setCartoes] = useState(() =>
    lerJsonStorage(STORAGE_KEYS.cartoes, [])
  );

  const [nomeCartao, setNomeCartao] = useState("");
  const [tipoCartao, setTipoCartao] = useState("credito");
  const [erroCartao, setErroCartao] = useState("");

  // ==============================
  // STATES DE GASTOS
  // ==============================

  const [gastos, setGastos] = useState(() =>
    lerJsonStorage(STORAGE_KEYS.gastos, [])
  );

  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");
  const [cartaoSelecionado, setCartaoSelecionado] = useState("");
  const [pessoaSelecionada, setPessoaSelecionada] = useState("");
  const [quemPagouSelecionado, setQuemPagouSelecionado] = useState("");
  const [gastoEmEdicaoId, setGastoEmEdicaoId] = useState(null);
  const [erroGasto, setErroGasto] = useState("");

  // ==============================
  // EFEITOS DE PERSISTÊNCIA
  // ==============================

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

  // ==============================
  // FUNÇÕES DE PESSOAS
  // ==============================

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

  // ==============================
  // FUNÇÃO: ADICIONAR CARTÃO
  // ==============================

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

  // ==============================
  // FUNÇÕES DE GASTOS
  // ==============================

  function limparFormularioGasto() {
    setQuemPagouSelecionado("");
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
    if (!quemPagouSelecionado) {
  setErroGasto("Selecione quem pagou o gasto.");
  return;
}

    const cartao = cartoes.find(
      (cartaoExistente) => cartaoExistente.id === Number(cartaoSelecionado)
    );

    if (!cartao) {
      setErroGasto("Cartão inválido.");
      return;
    }

    const pessoa = pessoas.find(
      (pessoaExistente) => pessoaExistente.id === Number(pessoaSelecionada)
    );

    if (!pessoa) {
      setErroGasto("Pessoa inválida.");
      return;
    }

    const valor = paraNumero(valorGasto);

    if (gastoEmEdicaoId) {
      const gastosAtualizados = gastos.map((gasto) =>
        gasto.id === gastoEmEdicaoId
          ? {
  ...gasto,
  nome: nomeNormalizado,
  valor,
  cartaoNome: cartao.nome,
  tipo: cartao.tipo,
  pessoaId: pessoa.id,
  pessoaNome: pessoa.nome,
  quemPagouId: Number(quemPagouSelecionado),
  quemPagouNome:
    pessoas.find((p) => p.id === Number(quemPagouSelecionado))?.nome || "",
}
          : gasto
      );

      setGastos(gastosAtualizados);
      recalcularTotais(gastosAtualizados);
      limparFormularioGasto();
      return;
    }

const quemPagou = pessoas.find(
  (p) => p.id === Number(quemPagouSelecionado)
);

const novoGasto = {
  id: Date.now(),
  nome: nomeNormalizado,
  valor,
  cartaoNome: cartao.nome,
  tipo: cartao.tipo,
  pessoaId: pessoa.id,
  pessoaNome: pessoa.nome,
  quemPagouId: quemPagou.id,
  quemPagouNome: quemPagou.nome,
};

    const novaLista = [...gastos, novoGasto];
    setGastos(novaLista);

    if (cartao.tipo === "debito") {
      setGastoDebito((valorAnterior) => paraNumero(valorAnterior) + valor);
    } else {
      setFaturaAtual((valorAnterior) => paraNumero(valorAnterior) + valor);
    }

    limparFormularioGasto();
  }

function editarGasto(gasto) {
  const cartaoCorrespondente = cartoes.find(
    (cartao) =>
      cartao.nome === gasto.cartaoNome &&
      cartao.tipo === gasto.tipo
  );

  setQuemPagouSelecionado(String(gasto.quemPagouId || ""));
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
    const gastosRestantes = gastos.filter((gasto) => gasto.id !== idGasto);
    setGastos(gastosRestantes);
    recalcularTotais(gastosRestantes);

    if (gastoEmEdicaoId === idGasto) {
      limparFormularioGasto();
    }
  }

  // ==============================
  // CÁLCULOS DE PERFIL ATIVO
  // ==============================

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
  // INDIVIDUAL
  if (!ehHousehold && pessoaAtiva) {
    return THEMES[pessoaAtiva.tema] ?? THEMES.cassette_neon;
  }

  // FALLBACK
  if (pessoas.length === 0) {
    return THEMES.cassette_neon;
  }

  // HOUSEHOLD (average)
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

  const saldoDisponivel = calcularSaldoDisponivel(
    paraNumero(salarioTotalFiltrado),
    paraNumero(gastoDebitoFiltrado),
    paraNumero(faturaAtualFiltrada)
  );

  const dataGrafico = [
    { name: "Débito", value: paraNumero(gastoDebitoFiltrado) || 0 },
    { name: "Crédito", value: paraNumero(faturaAtualFiltrada) || 0 },
  ];

  const COLORS = ["#ff6b7a", "#ffb84d"];
  const mostrarGrafico = gastosFiltrados.length > 0;

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
  setQuemPagouSelecionado("");
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
        padding: "28px",
        boxSizing: "border-box",
        overflowX: "hidden",
        background: temaAtivo.pageBg,
      },

      shell: {
        maxWidth: "1480px",
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
  gridTemplateColumns: "1fr 1fr 1fr", // force 3 columns
  gap: "18px",
  alignItems: "start",
  marginBottom: "18px",
},
bottomGrid: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr", // clean 2 columns
  gap: "18px",
  alignItems: "start",
  marginBottom: "18px",
},

card: {
  background: temaAtivo.cardBg,
  border: `1px solid ${temaAtivo.cardBorder}`,
  borderRadius: "22px",
  padding: "18px",
  color: temaAtivo.cardText,
  boxShadow:
    "0 12px 28px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
  height: "fit-content",
},
cardScroll: {
  maxHeight: "500px",
  overflowY: "auto",
},
      cardGrafico: {
        textAlign: "center",
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
        minHeight: "240px",
        overflow: "hidden",
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
        gap: "10px",
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
footer: {
  marginTop: "40px",
  paddingTop: "20px",
  borderTop: "1px solid rgba(255,255,255,0.08)",
},
    }),
    [temaAtivo]
  );

  return (
        <div style={styles.container}>
      <div style={styles.shell}>
        {/* BARRA SUPERIOR / IDENTIDADE VISUAL */}
        <div style={styles.machineBar}>
          <div style={styles.machineLights}>
            <span style={{ ...styles.machineDot, background: "#ff6b7a" }} />
            <span style={{ ...styles.machineDot, background: "#ffb84d" }} />
            <span style={{ ...styles.machineDot, background: "#57d3a4" }} />
          </div>

          <div style={styles.machineLabel}>FINANCE MODULE / HOME PANEL</div>
        </div>

        {/* CABEÇALHO */}
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

        {/* LINHA 1: PERFIL ATIVO + LEITURA + GRÁFICO */}
        <div style={styles.topGrid}>
          <div style={{ ...styles.card, ...styles.cardScroll }}>
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

          <div style={{ ...styles.card, ...styles.cardScroll }}>
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

          <div style={{ ...styles.card, ...styles.cardGrafico }}>
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
                <PieChart width={320} height={240}>
                  <Pie
                    data={dataGrafico}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={82}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={800}
                    animationEasing="ease-out"
                  >
                    {dataGrafico.map((item, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "#111821",
                      color: "#f3f7fb",
                    }}
                  />
                  <Legend />
                </PieChart>
              </div>
            )}
          </div>
        </div>

        {/* LINHA 2: PESSOAS + RESUMO */}
        <div style={styles.topGrid}>
          <div style={{ ...styles.card, ...styles.cardScroll }}>
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

            <button onClick={salvarPessoa} style={styles.button}>
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
              {pessoas.map((pessoa) => (
                <li key={pessoa.id} style={styles.itemListaColuna}>
                  <div style={styles.itemLinhaSuperior}>
                    <span style={styles.itemText}>
                      {pessoa.nome} · {formatarMoeda(pessoa.salario)}
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
              ))}
            </ul>
          </div>

          <div style={{ ...styles.card, ...styles.cardScroll }}>
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

        {/* LINHA INFERIOR */}
        <div style={styles.bottomGrid}>
          <div style={{ ...styles.card, ...styles.cardScroll }}>
            <div style={styles.cardHeader}>
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

            <button onClick={adicionarCartao} style={styles.button}>
              Adicionar cartão
            </button>

            {erroCartao && <p style={styles.erro}>{erroCartao}</p>}

            <ul style={styles.lista}>
              {cartoes.map((cartao) => (
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
              ))}
            </ul>
          </div>

          <div style={{ ...styles.card, ...styles.cardScroll }}>
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
  value={quemPagouSelecionado}
  onChange={(e) => setQuemPagouSelecionado(e.target.value)}
  style={styles.input}
>
  <option value="">Quem pagou?</option>
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

            <button onClick={adicionarGasto} style={styles.button}>
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
              {gastosFiltrados.map((gasto) => (
                <li key={gasto.id} style={styles.itemListaColuna}>
                  <div style={styles.itemLinhaSuperior}>
                    <span style={styles.itemText}>
{gasto.nome} · {formatarMoeda(gasto.valor)} · {gasto.cartaoNome} · {gasto.pessoaNome} · pago por {gasto.quemPagouNome}
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
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div style={styles.footer}>
  <div style={styles.resetBox}>
    <p style={styles.resetTitle}>☢ Zona de risco</p>
    <p style={styles.resetText}>
      Isso apagará todos os dados do sistema. Use apenas em último caso.
    </p>

    <button onClick={lidarComResetTotal} style={styles.resetButton}>
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