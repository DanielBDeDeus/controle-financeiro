// Função para formatar valores em reais (R$)
export function formatarBRL(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(valor || 0));
}

// Converte qualquer valor para número seguro
export function paraNumero(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : 0;
}

// Retorna a data de hoje no formato YYYY-MM-DD
export function hojeISO() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

// Extrai o mês no formato YYYY-MM
export function obterAnoMes(data) {
  return data?.slice(0, 7) || "";
}

// Extrai o dia do mês (número)
export function obterDiaDoMes(data) {
  return Number(data?.slice(8, 10) || 0);
}

// Define se o gasto entra na fatura atual ou próxima
export function classificarGastoCredito(dataGasto, diaFechamento) {
  return obterDiaDoMes(dataGasto) <= Number(diaFechamento)
    ? "atual"
    : "proxima";
}

// Calcula saldo disponível
export function calcularSaldoDisponivel(salario, gastoDebito, faturaAtual) {
  return paraNumero(salario) - paraNumero(gastoDebito) - paraNumero(faturaAtual);
}