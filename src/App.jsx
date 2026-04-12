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
};

// ==============================
// FUNÇÕES AUXILIARES DE LEITURA
// ==============================

// Lê texto simples do localStorage
function lerTextoStorage(chave) {
  if (typeof window === "undefined") {
    return "";
  }

  const valorSalvo = window.localStorage.getItem(chave);
  return valorSalvo ?? "";
}

// Lê JSON do localStorage com fallback seguro
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

export default function App() {
  // ==============================
  // STATES DE PESSOAS
  // ==============================

  // Lista de pessoas cadastradas
  const [pessoas, setPessoas] = useState(() =>
    lerJsonStorage(STORAGE_KEYS.pessoas, [])
  );

  // Nome digitado no formulário de pessoa
  const [nomePessoa, setNomePessoa] = useState("");

  // Salário digitado no formulário de pessoa
  const [salarioPessoa, setSalarioPessoa] = useState("");

  // Guarda qual pessoa está sendo editada
  const [pessoaEmEdicaoId, setPessoaEmEdicaoId] = useState(null);

  // Mensagem de erro ao salvar pessoa
  const [erroPessoa, setErroPessoa] = useState("");

  // ==============================
  // STATES PRINCIPAIS
  // ==============================

  // Total acumulado de gastos em débito
  const [gastoDebito, setGastoDebito] = useState(() =>
    lerTextoStorage(STORAGE_KEYS.gastoDebito)
  );

  // Total acumulado da fatura atual de crédito
  const [faturaAtual, setFaturaAtual] = useState(() =>
    lerTextoStorage(STORAGE_KEYS.faturaAtual)
  );

  // ==============================
  // STATES DE CARTÕES
  // ==============================

  // Lista de cartões cadastrados
  const [cartoes, setCartoes] = useState(() =>
    lerJsonStorage(STORAGE_KEYS.cartoes, [])
  );

  // Nome do cartão digitado no formulário
  const [nomeCartao, setNomeCartao] = useState("");

  // Tipo do cartão selecionado
  const [tipoCartao, setTipoCartao] = useState("credito");

  // Mensagem de erro ao cadastrar cartão
  const [erroCartao, setErroCartao] = useState("");

  // ==============================
  // STATES DE GASTOS
  // ==============================

  // Lista de gastos cadastrados
  const [gastos, setGastos] = useState(() =>
    lerJsonStorage(STORAGE_KEYS.gastos, [])
  );

  // Nome do gasto
  const [nomeGasto, setNomeGasto] = useState("");

  // Valor do gasto
  const [valorGasto, setValorGasto] = useState("");

  // Cartão selecionado para o gasto
  const [cartaoSelecionado, setCartaoSelecionado] = useState("");

  // Pessoa selecionada para o gasto
  const [pessoaSelecionada, setPessoaSelecionada] = useState("");

  // Guarda qual gasto está sendo editado
  const [gastoEmEdicaoId, setGastoEmEdicaoId] = useState(null);

  // Mensagem de erro ao cadastrar gasto
  const [erroGasto, setErroGasto] = useState("");

  // ==============================
  // EFEITOS DE PERSISTÊNCIA
  // ==============================

  // Salva pessoas sempre que a lista mudar
  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.pessoas,
      JSON.stringify(pessoas)
    );
  }, [pessoas]);

  // Salva total de débito sempre que ele mudar
  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.gastoDebito,
      String(gastoDebito)
    );
  }, [gastoDebito]);

  // Salva total da fatura sempre que ela mudar
  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.faturaAtual,
      String(faturaAtual)
    );
  }, [faturaAtual]);

  // Salva lista de cartões sempre que ela mudar
  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.cartoes,
      JSON.stringify(cartoes)
    );
  }, [cartoes]);

  // Salva lista de gastos sempre que ela mudar
  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.gastos,
      JSON.stringify(gastos)
    );
  }, [gastos]);

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
    };

    setPessoas([...pessoas, novaPessoa]);
    limparFormularioPessoa();
  }

  function editarPessoa(pessoa) {
    setNomePessoa(pessoa.nome);
    setSalarioPessoa(String(pessoa.salario));
    setPessoaEmEdicaoId(pessoa.id);
    setErroPessoa("");
  }

  function excluirPessoa(idPessoa) {
    // Remove a pessoa da lista
    setPessoas((pessoasAnteriores) =>
      pessoasAnteriores.filter((pessoa) => pessoa.id !== idPessoa)
    );

    // Remove gastos ligados à pessoa excluída
    const gastosRestantes = gastos.filter((gasto) => gasto.pessoaId !== idPessoa);

    setGastos(gastosRestantes);

    // Recalcula totais com base nos gastos restantes
    const novoTotalDebito = gastosRestantes
      .filter((gasto) => gasto.tipo === "debito")
      .reduce((acumulador, gasto) => acumulador + paraNumero(gasto.valor), 0);

    const novoTotalCredito = gastosRestantes
      .filter((gasto) => gasto.tipo === "credito")
      .reduce((acumulador, gasto) => acumulador + paraNumero(gasto.valor), 0);

    setGastoDebito(novoTotalDebito);
    setFaturaAtual(novoTotalCredito);

    // Se a pessoa excluída estiver selecionada no formulário de gasto, limpa
    if (Number(pessoaSelecionada) === idPessoa) {
      setPessoaSelecionada("");
    }

    // Se a pessoa excluída estiver em edição, limpa o formulário
    if (pessoaEmEdicaoId === idPessoa) {
      limparFormularioPessoa();
    }
  }

  // ==============================
  // FUNÇÃO: ADICIONAR CARTÃO
  // ==============================

  function adicionarCartao() {
    // Normaliza o nome para evitar duplicidade por caixa alta/baixa
    const nomeNormalizado = nomeCartao.trim().toLowerCase();

    // Validação: nome obrigatório
    if (!nomeNormalizado) {
      setErroCartao("Digite um nome para o cartão.");
      return;
    }

    // Regra de negócio:
    // mesmo nome + mesmo tipo = proibido
    const duplicado = cartoes.some(
      (cartaoExistente) =>
        cartaoExistente.nome.toLowerCase() === nomeNormalizado &&
        cartaoExistente.tipo === tipoCartao
    );

    if (duplicado) {
      setErroCartao("Esse cartão já existe com esse tipo.");
      return;
    }

    // Cria o novo cartão
    const novoCartao = {
      id: Date.now(),
      nome: nomeCartao.trim(),
      tipo: tipoCartao,
    };

    // Salva o cartão na lista
    setCartoes([...cartoes, novoCartao]);

    // Limpa formulário e erro
    setNomeCartao("");
    setErroCartao("");
  }

  // ==============================
  // FUNÇÕES DE GASTOS
  // ==============================

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

    // Validação: nome obrigatório
    if (!nomeNormalizado) {
      setErroGasto("Digite um nome para o gasto.");
      return;
    }

    // Validação: valor obrigatório
    if (!valorGasto) {
      setErroGasto("Digite um valor para o gasto.");
      return;
    }

    // Validação: cartão obrigatório
    if (!cartaoSelecionado) {
      setErroGasto("Selecione um cartão.");
      return;
    }

    // Validação: pessoa obrigatória
    if (!pessoaSelecionada) {
      setErroGasto("Selecione a pessoa responsável pelo gasto.");
      return;
    }

    // Busca o cartão selecionado
    const cartao = cartoes.find(
      (cartaoExistente) => cartaoExistente.id === Number(cartaoSelecionado)
    );

    // Segurança extra
    if (!cartao) {
      setErroGasto("Cartão inválido.");
      return;
    }

    // Busca a pessoa selecionada
    const pessoa = pessoas.find(
      (pessoaExistente) => pessoaExistente.id === Number(pessoaSelecionada)
    );

    // Segurança extra
    if (!pessoa) {
      setErroGasto("Pessoa inválida.");
      return;
    }

    // Converte o valor para número seguro
    const valor = paraNumero(valorGasto);

    // Se estiver editando, atualiza o gasto existente
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
            }
          : gasto
      );

      setGastos(gastosAtualizados);
      recalcularTotais(gastosAtualizados);
      limparFormularioGasto();
      return;
    }

    // Cria o gasto
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

    // Salva na lista
    setGastos(novaLista);

    // Atualiza os totais automáticos
    if (cartao.tipo === "debito") {
      setGastoDebito((valorAnterior) => paraNumero(valorAnterior) + valor);
    } else {
      setFaturaAtual((valorAnterior) => paraNumero(valorAnterior) + valor);
    }

    // Limpa formulário e erro
    limparFormularioGasto();
  }

  function editarGasto(gasto) {
    const cartaoCorrespondente = cartoes.find(
      (cartao) => cartao.nome === gasto.cartaoNome && cartao.tipo === gasto.tipo
    );

    setNomeGasto(gasto.nome);
    setValorGasto(String(gasto.valor));
    setCartaoSelecionado(cartaoCorrespondente ? String(cartaoCorrespondente.id) : "");
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
  // CÁLCULOS
  // ==============================

  // Soma dos salários de todas as pessoas cadastradas
  const salarioTotal = useMemo(() => {
    return pessoas.reduce(
      (acumulador, pessoa) => acumulador + paraNumero(pessoa.salario),
      0
    );
  }, [pessoas]);

  // Calcula o saldo disponível
  const saldoDisponivel = calcularSaldoDisponivel(
    paraNumero(salarioTotal),
    paraNumero(gastoDebito),
    paraNumero(faturaAtual)
  );

  // Dados do gráfico
  const dataGrafico = [
    { name: "Débito", value: paraNumero(gastoDebito) || 0 },
    { name: "Crédito", value: paraNumero(faturaAtual) || 0 },
  ];

  // Cores do gráfico alinhadas com o restante da interface
  const COLORS = ["#ff6b7a", "#ffb84d"];

  // Só mostra gráfico quando existir ao menos 1 gasto
  const mostrarGrafico = gastos.length > 0;

  // ==============================
  // RENDER
  // ==============================

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
            <h1 style={styles.title}>Controle Financeiro</h1>
            <p style={styles.subtitle}>
              Painel pessoal para visualizar saldo, cartões, gastos e impacto
              financeiro em tempo real.
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

        {/* LINHA SUPERIOR */}
        <div style={styles.topGrid}>
          {/* CARD: PESSOAS */}
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
              type="number"
              value={salarioPessoa}
              onChange={(e) => setSalarioPessoa(e.target.value)}
              style={styles.input}
              placeholder="Ex.: 3500"
            />

            <button onClick={salvarPessoa} style={styles.button}>
              {pessoaEmEdicaoId ? "Salvar pessoa" : "Adicionar pessoa"}
            </button>

            {pessoaEmEdicaoId && (
              <button onClick={limparFormularioPessoa} style={styles.buttonSecundario}>
                Cancelar edição
              </button>
            )}

            {erroPessoa && <p style={styles.erro}>{erroPessoa}</p>}

            <ul style={styles.lista}>
              {pessoas.map((pessoa) => (
                <li key={pessoa.id} style={styles.itemListaColuna}>
                  <div style={styles.itemLinhaSuperior}>
                    <span style={styles.itemText}>
                      {pessoa.nome} · R$ {pessoa.salario}
                    </span>

                    <span style={{ ...styles.badgeMini, ...styles.badgeSaldo }}>
                      renda
                    </span>
                  </div>

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

          {/* CARD: RESUMO */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Resumo</h2>
              <span style={styles.cardChip}>Leitura</span>
            </div>

            <div style={styles.kpiStack}>
              <div style={styles.kpiRow}>
                <span style={styles.kpiLabel}>Salário total</span>
                <span style={{ ...styles.kpiValue, ...styles.resumoSaldo }}>
                  R$ {salarioTotal}
                </span>
              </div>

              <div style={styles.kpiRow}>
                <span style={styles.kpiLabel}>Saldo disponível</span>
                <span style={{ ...styles.kpiValue, ...styles.resumoSaldo }}>
                  R$ {saldoDisponivel}
                </span>
              </div>

              <div style={styles.kpiRow}>
                <span style={styles.kpiLabel}>Saída imediata</span>
                <span style={{ ...styles.kpiValue, ...styles.resumoDebito }}>
                  R$ {gastoDebito}
                </span>
              </div>

              <div style={styles.kpiRow}>
                <span style={styles.kpiLabel}>Fatura acumulada</span>
                <span style={{ ...styles.kpiValue, ...styles.resumoCredito }}>
                  R$ {faturaAtual}
                </span>
              </div>
            </div>
          </div>

          {/* CARD: GRÁFICO */}
          <div style={{ ...styles.card, ...styles.cardGrafico }}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Distribuição</h2>
              <span style={styles.cardChip}>Visual</span>
            </div>

            {!mostrarGrafico ? (
              <div style={styles.placeholderGrafico}>
                <p style={styles.textoAuxiliar}>
                  O gráfico aparecerá depois que você cadastrar ao menos um
                  gasto.
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

        {/* LINHA INFERIOR */}
        <div style={styles.bottomGrid}>
          {/* CARD: CARTÕES */}
          <div style={styles.card}>
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

          {/* CARD: GASTOS */}
          <div style={styles.card}>
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
              type="number"
              placeholder="Valor"
              value={valorGasto}
              onChange={(e) => setValorGasto(e.target.value)}
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

            <button onClick={adicionarGasto} style={styles.button}>
              {gastoEmEdicaoId ? "Salvar gasto" : "Adicionar gasto"}
            </button>

            {gastoEmEdicaoId && (
              <button onClick={limparFormularioGasto} style={styles.buttonSecundario}>
                Cancelar edição
              </button>
            )}

            {erroGasto && <p style={styles.erro}>{erroGasto}</p>}

            <ul style={styles.lista}>
              {gastos.map((gasto) => (
                <li key={gasto.id} style={styles.itemListaColuna}>
                  <div style={styles.itemLinhaSuperior}>
                    <span style={styles.itemText}>
                      {gasto.nome} · R$ {gasto.valor} · {gasto.cartaoNome} ·{" "}
                      {gasto.pessoaNome}
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
    </div>
  );
}

// ==============================
// ESTILOS
// ==============================
const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    padding: "28px",
    boxSizing: "border-box",
    overflowX: "hidden",
  },

  shell: {
    maxWidth: "1480px",
    margin: "0 auto",
    padding: "18px",
    borderRadius: "28px",
    background:
      "linear-gradient(180deg, rgba(18,24,32,0.94) 0%, rgba(12,17,24,0.96) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow:
      "0 24px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
  },

  machineBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
    paddingBottom: "12px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
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
    color: "#95a2b3",
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
    color: "#eaf2fb",
    fontSize: "56px",
    lineHeight: "1",
    fontWeight: "700",
    letterSpacing: "-1.8px",
  },

  subtitle: {
    marginTop: "10px",
    marginBottom: 0,
    color: "#8fa2b8",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "18px",
    alignItems: "start",
    marginBottom: "18px",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "18px",
    alignItems: "start",
  },

  card: {
    background:
      "linear-gradient(180deg, rgba(245,248,252,0.96) 0%, rgba(225,232,240,0.94) 100%)",
    border: "1px solid rgba(255,255,255,0.6)",
    borderRadius: "22px",
    padding: "18px",
    color: "#223548",
    boxShadow:
      "0 12px 28px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
    height: "fit-content",
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
    color: "#1b3147",
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "-0.4px",
  },

  cardChip: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    color: "#5c6b7b",
    background: "rgba(17,24,39,0.06)",
    border: "1px solid rgba(17,24,39,0.08)",
    padding: "6px 10px",
    borderRadius: "999px",
    whiteSpace: "nowrap",
  },

  label: {
    color: "#334d66",
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
    background: "rgba(255,255,255,0.45)",
    border: "1px solid rgba(0,0,0,0.05)",
  },

  kpiLabel: {
    color: "#506579",
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
    color: "#5c6f82",
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
    border: "1px solid rgba(19, 33, 48, 0.12)",
    boxSizing: "border-box",
    background: "#111821",
    color: "#f2f7fb",
    outline: "none",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  },

  button: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(180deg, #48b9ff 0%, #2f87b7 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    marginTop: "4px",
    boxShadow: "0 8px 20px rgba(47, 135, 183, 0.22)",
  },

  buttonSecundario: {
    width: "100%",
    padding: "13px",
    background: "rgba(17,24,39,0.08)",
    color: "#203243",
    border: "1px solid rgba(17,24,39,0.12)",
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
    color: "#425a70",
    lineHeight: "1.45",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.42)",
    border: "1px solid rgba(0,0,0,0.04)",
  },

  itemListaColuna: {
    marginBottom: "12px",
    color: "#425a70",
    lineHeight: "1.45",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.42)",
    border: "1px solid rgba(0,0,0,0.04)",
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
};