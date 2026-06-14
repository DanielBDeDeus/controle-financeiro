import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  collectLocalState,
  restoreLocalState,
  STORAGE_KEYS,
} from "./cloudState";

function instalarLocalStorageFake() {
  const store = {};

  const localStorageFake = {
    getItem: vi.fn((key) => {
      return Object.prototype.hasOwnProperty.call(store, key)
        ? store[key]
        : null;
    }),

    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),

    removeItem: vi.fn((key) => {
      delete store[key];
    }),

    clear: vi.fn(() => {
      for (const key of Object.keys(store)) {
        delete store[key];
      }
    }),
  };

  Object.defineProperty(window, "localStorage", {
    value: localStorageFake,
    writable: true,
    configurable: true,
  });
}

describe("persistência em nuvem", () => {
  beforeEach(() => {
    instalarLocalStorageFake();
    window.localStorage.clear();
  });

  it("coleta somente as chaves usadas pelo DividimOS", () => {
    window.localStorage.setItem(
      STORAGE_KEYS.pessoas,
      JSON.stringify([{ nome: "Daniel" }])
    );

    window.localStorage.setItem(
      STORAGE_KEYS.gastos,
      JSON.stringify([{ nome: "Mercado", valor: 50 }])
    );

    window.localStorage.setItem("chave-estranha", "nao deve ir para o banco");

    const state = collectLocalState();

    expect(state[STORAGE_KEYS.pessoas]).toBe(
      JSON.stringify([{ nome: "Daniel" }])
    );

    expect(state[STORAGE_KEYS.gastos]).toBe(
      JSON.stringify([{ nome: "Mercado", valor: 50 }])
    );

    expect(state["chave-estranha"]).toBeUndefined();
  });

  it("restaura dados do banco para o localStorage", () => {
    restoreLocalState({
      [STORAGE_KEYS.pessoas]: JSON.stringify([{ nome: "Ana" }]),
      [STORAGE_KEYS.contas]: JSON.stringify([{ nome: "Internet" }]),
      "chave-invalida": "ignorar",
    });

    expect(window.localStorage.getItem(STORAGE_KEYS.pessoas)).toBe(
      JSON.stringify([{ nome: "Ana" }])
    );

    expect(window.localStorage.getItem(STORAGE_KEYS.contas)).toBe(
      JSON.stringify([{ nome: "Internet" }])
    );

    expect(window.localStorage.getItem("chave-invalida")).toBeNull();
  });
});
