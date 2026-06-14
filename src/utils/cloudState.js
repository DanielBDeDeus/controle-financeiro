import { supabase } from "./supabaseClient";

export const APP_STATE_ID = "dividimos-main";

export const STORAGE_KEYS = {
  pessoas: "controle-financeiro:pessoas",
  gastoDebito: "controle-financeiro:gasto-debito",
  faturaAtual: "controle-financeiro:fatura-atual",
  cartoes: "controle-financeiro:cartoes",
  gastos: "controle-financeiro:gastos",
  perfilAtivo: "controle-financeiro:perfil-ativo",
  resetEtapa: "controle-financeiro:reset-etapa",
  transacoes: "controle-financeiro:transacoes",
  contas: "controle-financeiro:contas",
  mesSelecionado: "mesSelecionado",
  anoSelecionado: "anoSelecionado",
};

export const STORAGE_KEY_LIST = Object.values(STORAGE_KEYS);

export function collectLocalState() {
  const state = {};

  for (const key of STORAGE_KEY_LIST) {
    const value = window.localStorage.getItem(key);

    if (value !== null) {
      state[key] = value;
    }
  }

  return state;
}

export function restoreLocalState(state) {
  if (!state || typeof state !== "object") {
    return;
  }

  for (const [key, value] of Object.entries(state)) {
    const keyIsUsedByApp = STORAGE_KEY_LIST.includes(key);
    const valueIsString = typeof value === "string";

    if (keyIsUsedByApp && valueIsString) {
      window.localStorage.setItem(key, value);
    }
  }
}

export async function loadStateFromCloud() {
  if (!supabase) {
    console.warn("Supabase não configurado. Usando apenas localStorage.");
    return {};
  }

  const { data, error } = await supabase
    .from("app_state")
    .select("data")
    .eq("id", APP_STATE_ID)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const cloudState = data?.data ?? {};

  if (Object.keys(cloudState).length > 0) {
    restoreLocalState(cloudState);
  }

  return cloudState;
}

export async function saveStateToCloud() {
  if (!supabase) {
    console.warn("Supabase não configurado. Dados salvos apenas localmente.");
    return;
  }

  const data = collectLocalState();

  const { error } = await supabase.from("app_state").upsert({
    id: APP_STATE_ID,
    data,
  });

  if (error) {
    throw error;
  }
}

export function installCloudAutosave() {
  let timeoutId = null;

  function scheduleSave() {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      saveStateToCloud().catch((error) => {
        console.error("Erro ao salvar dados no Supabase:", error);
      });
    }, 500);
  }

  const originalSetItem = Storage.prototype.setItem;
  const originalRemoveItem = Storage.prototype.removeItem;

  Storage.prototype.setItem = function patchedSetItem(key, value) {
    originalSetItem.call(this, key, value);

    if (this === window.localStorage && STORAGE_KEY_LIST.includes(key)) {
      scheduleSave();
    }
  };

  Storage.prototype.removeItem = function patchedRemoveItem(key) {
    originalRemoveItem.call(this, key);

    if (this === window.localStorage && STORAGE_KEY_LIST.includes(key)) {
      scheduleSave();
    }
  };
}
