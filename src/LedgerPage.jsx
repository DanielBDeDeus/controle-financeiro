import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { paraNumero } from "./utils/finance";

// ╔══════════════════════════════════════════════╗
// ║         FORMATAÇÃO DE MOEDA (PADRÃO)         ║
// ╚══════════════════════════════════════════════╝
function formatarMoeda(valor) {
  const numeroSeguro = paraNumero(valor);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numeroSeguro);
}

// ╔══════════════════════════════════════════════╗
// ║           FORMATAÇÃO DE DATA                 ║
// ╚══════════════════════════════════════════════╝
function formatarData(dataIso) {
  const d = new Date(dataIso);

  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ╔══════════════════════════════════════════════╗
// ║                LEDGER PAGE                   ║
// ╠══════════════════════════════════════════════╣
// ║ Página dedicada ao histórico completo        ║
// ║ de transações do sistema                     ║
// ║                                              ║
// ║ Fonte única de verdade (audit trail)         ║
// ╚══════════════════════════════════════════════╝
export default function LedgerPage({
  transacoes,
  temaAtivo,
  pessoas,
  perfilAtivo,
}) {
  const navigate = useNavigate();

  const ehHousehold = perfilAtivo === "household";

  // ╔══════════════════════════════════════════════╗
  // ║        FILTRO POR PERFIL ATIVO              ║
  // ╚══════════════════════════════════════════════╝
  const transacoesFiltradas = useMemo(() => {
    if (ehHousehold) return transacoes;

    return transacoes.filter(
      (t) => String(t.pessoaId) === String(perfilAtivo)
    );
  }, [transacoes, ehHousehold, perfilAtivo]);

  // ╔══════════════════════════════════════════════╗
  // ║        ORDENAÇÃO (MAIS RECENTE PRIMEIRO)    ║
  // ╚══════════════════════════════════════════════╝
  const listaOrdenada = useMemo(() => {
    return [...transacoesFiltradas].sort(
      (a, b) => new Date(b.data) - new Date(a.data)
    );
  }, [transacoesFiltradas]);

  // ╔══════════════════════════════════════════════╗
  // ║               ESTILOS BASE                  ║
  // ╚══════════════════════════════════════════════╝
  const styles = {
    container: {
      minHeight: "100vh",
      padding: "24px",
      background: temaAtivo.pageBg,
      color: temaAtivo.cardText,
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },

    title: {
      fontSize: "36px",
      fontWeight: "700",
      margin: 0,
      color: temaAtivo.title,
    },

    button: {
      padding: "10px 16px",
      borderRadius: "999px",
      border: "none",
      cursor: "pointer",
      fontWeight: "700",
      background: temaAtivo.buttonBg,
      color: "#fff",
    },

    card: {
      background: temaAtivo.cardBg,
      border: `1px solid ${temaAtivo.cardBorder}`,
      borderRadius: "16px",
      padding: "16px",
      marginBottom: "12px",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },

    rowTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "10px",
    },

    nome: {
      fontWeight: "700",
    },

    valor: {
      fontWeight: "700",
    },

    meta: {
      fontSize: "12px",
      opacity: 0.8,
    },

    badge: {
      padding: "4px 8px",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: "700",
      color: "#fff",
    },

    debito: { background: "#ef4444" },
    credito: { background: "#f59e0b" },
    entrada: { background: "#22c55e" },
    conta: { background: "#3b82f6" },
  };

  // ╔══════════════════════════════════════════════╗
  // ║            RENDER PRINCIPAL                 ║
  // ╚══════════════════════════════════════════════╝
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Ledger</h1>

        <button onClick={() => navigate("/")} style={styles.button}>
          ← Voltar
        </button>
      </div>

      {listaOrdenada.length === 0 ? (
        <p>Nenhuma transação registrada ainda.</p>
      ) : (
        listaOrdenada.map((t) => (
          <div key={t.id} style={styles.card}>
            <div style={styles.rowTop}>
              <span style={styles.nome}>{t.nome}</span>

              <span
                style={{
                  ...styles.valor,
                  ...(t.tipo === "debito"
                    ? styles.debito
                    : t.tipo === "credito"
                    ? styles.credito
                    : t.tipo === "entrada"
                    ? styles.entrada
                    : styles.conta),
                  ...styles.badge,
                }}
              >
                {t.tipo}
              </span>
            </div>

            <div style={styles.rowTop}>
              <span>{formatarMoeda(t.valor)}</span>
              <span style={styles.meta}>{formatarData(t.data)}</span>
            </div>

            <div style={styles.meta}>
              {t.pessoaNome}
              {t.cartaoNome && ` · ${t.cartaoNome}`}
              {t.origem && ` · ${t.origem}`}
            </div>
          </div>
        ))
      )}
    </div>
  );
}