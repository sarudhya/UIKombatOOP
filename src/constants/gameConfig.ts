export const GAME_CONFIG_STORAGE_KEY = "gameConfig";
export const GAME_CONFIG_DRAFT_STORAGE_KEY = "gameConfigDraft";

export const GAME_CONFIG_FIELDS = [
  { key: "startingGold", label: "Starting Gold" },
  { key: "maxGold", label: "Max Gold" },
  { key: "goldPerRound", label: "Gold per round" },
  { key: "interestRate", label: "Interest rate" },
  { key: "hexCost", label: "Hex cost" },
  { key: "turnLimit", label: "Turn Limit" },
  { key: "minionHp", label: "Hp Limit" },
  { key: "maxMinions", label: "Max Minions" },
  { key: "minionCost", label: "Minion cost" },
] as const;

export type GameConfigKey = (typeof GAME_CONFIG_FIELDS)[number]["key"];

export type GameConfig = Record<GameConfigKey, number>;
export type GameConfigForm = Record<GameConfigKey, string>;

export const createEmptyGameConfigForm = (): GameConfigForm => {
  return GAME_CONFIG_FIELDS.reduce((acc, field) => {
    acc[field.key] = "";
    return acc;
  }, {} as GameConfigForm);
};

export const createGameConfigFormFromConfig = (
  config?: Partial<GameConfig> | null,
): GameConfigForm => {
  const empty = createEmptyGameConfigForm();

  if (!config) return empty;

  return GAME_CONFIG_FIELDS.reduce((acc, field) => {
    const value = config[field.key];
    acc[field.key] = value === undefined || value === null ? "" : String(value);
    return acc;
  }, {} as GameConfigForm);
};

export const parseGameConfigForm = (form: GameConfigForm) => {
  const missing: string[] = [];
  const invalid: string[] = [];
  const config = {} as GameConfig;

  for (const field of GAME_CONFIG_FIELDS) {
    const raw = form[field.key].trim();

    if (!raw) {
      missing.push(field.label);
      continue;
    }

    const numericValue = Number(raw);
    if (!Number.isFinite(numericValue) || numericValue < 0) {
      invalid.push(field.label);
      continue;
    }

    config[field.key] = numericValue;
  }

  return {
    config,
    missing,
    invalid,
    isValid: missing.length === 0 && invalid.length === 0,
  };
};

export const isConfigComplete = (config?: Partial<GameConfig> | null): config is GameConfig => {
  if (!config) return false;

  return GAME_CONFIG_FIELDS.every((field) => {
    const value = config[field.key];
    return typeof value === "number" && Number.isFinite(value) && value >= 0;
  });
};

export const getMissingConfigLabels = (config?: Partial<GameConfig> | null): string[] => {
  if (!config) return GAME_CONFIG_FIELDS.map((field) => field.label);

  return GAME_CONFIG_FIELDS.filter((field) => {
    const value = config[field.key];
    return !(typeof value === "number" && Number.isFinite(value) && value >= 0);
  }).map((field) => field.label);
};

export const loadConfigFromStorage = (): GameConfig | null => {
  try {
    const raw = window.localStorage.getItem(GAME_CONFIG_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<GameConfig>;
    return isConfigComplete(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const saveConfigToStorage = (config: GameConfig) => {
  window.localStorage.setItem(GAME_CONFIG_STORAGE_KEY, JSON.stringify(config));
};

export const clearConfigStorage = () => {
  window.localStorage.removeItem(GAME_CONFIG_STORAGE_KEY);
};

export const loadConfigDraftFromStorage = (): GameConfigForm | null => {
  try {
    const raw = window.localStorage.getItem(GAME_CONFIG_DRAFT_STORAGE_KEY);
    if (!raw) return null;

    return JSON.parse(raw) as GameConfigForm;
  } catch {
    return null;
  }
};

export const saveConfigDraftToStorage = (config: GameConfigForm) => {
  window.localStorage.setItem(GAME_CONFIG_DRAFT_STORAGE_KEY, JSON.stringify(config));
};

export const clearConfigDraftStorage = () => {
  window.localStorage.removeItem(GAME_CONFIG_DRAFT_STORAGE_KEY);
};
