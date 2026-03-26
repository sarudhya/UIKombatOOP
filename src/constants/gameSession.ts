import { type GameConfig } from "./gameConfig";
import { type StrategyData } from "./strategyTypes";

export const GAME_SESSION_STORAGE_KEY = "gameSession";

export interface GameSessionState {
  mode?: string;
  minionCount?: number;
  strategies?: Record<string, StrategyData | boolean>;
  config?: GameConfig;
  gameID?: string;
}

export const serializeGameStrategies = (
  strategies?: Record<string, StrategyData | boolean>,
): Record<string, Omit<StrategyData, "txtFile"> | boolean> | undefined => {
  if (!strategies) return undefined;

  return Object.entries(strategies).reduce<Record<string, Omit<StrategyData, "txtFile"> | boolean>>((acc, [name, value]) => {
    if (typeof value === "boolean") {
      acc[name] = value;
      return acc;
    }

    acc[name] = {
      completed: value.completed,
      customName: value.customName,
      fileText: value.fileText,
      defense: value.defense,
      minionTypeID: value.minionTypeID,
      // txtFile: null,
    };
    return acc;
  }, {});
};

const deserializeStrategies = (
  strategies?: Record<string, Omit<StrategyData, "txtFile"> | boolean>,
): Record<string, StrategyData | boolean> | undefined => {
  if (!strategies) return undefined;

  return Object.entries(strategies).reduce<Record<string, StrategyData | boolean>>((acc, [name, value]) => {
    if (typeof value === "boolean") {
      acc[name] = value;
      return acc;
    }

    acc[name] = {
      completed: Boolean(value.completed),
      customName: value.customName || "",
      fileText: value.fileText || "",
      txtFile: null,
      defense: value.defense ?? "",
      minionTypeID: value.minionTypeID,
    };
    return acc;
  }, {});
};

export const loadGameSessionFromStorage = (): GameSessionState | null => {
  try {
    const raw = window.sessionStorage.getItem(GAME_SESSION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as GameSessionState;
    return {
      ...parsed,
      strategies: deserializeStrategies(parsed.strategies),
    };
  } catch {
    return null;
  }
};

export const saveGameSessionToStorage = (state: GameSessionState) => {
  window.sessionStorage.setItem(
    GAME_SESSION_STORAGE_KEY,
    JSON.stringify({
      ...state,
      strategies: serializeGameStrategies(state.strategies),
    }),
  );
};

export const clearGameSessionStorage = () => {
  window.sessionStorage.removeItem(GAME_SESSION_STORAGE_KEY);
};