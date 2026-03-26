import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

    export interface CreateModSelection{
        mode: "Solitaire" | "Duel" | "Auto";
    }

    export interface CreateNumberOfMinion{
        numberOfMinion: number;
        gameID: string;
    }

    export interface CreteUpdateMinionInfo{
        gameID: string;
        minionTypeID: string;
        minionName: string;
        defenseFactor: number;
    }

    export interface CreateUpdateMinionStrategy {
        gameID: string;
        minionTypeID: string;
        file: File;
    }

    export interface CreateConfig{
        gameID: string;
        startingGold: number;
        maxGold: number;
        goldPerRound: number;
        interestRate: number;
        hexCost: number;
        turnLimit: number;
        minionHp: number;
        maxMinions: number;
        minionCost: number;
    }

    export interface CreateStartResponse{
        PlaterOne: string;
        PlaterTwo: string;
    }

    export interface CreateHexRespond {
        row: number;
        col: number;
        playerId: string;
        minionId: string;
    }

    export interface CreateMinionRespond {
        playerId: string;
        minionId: string;
        minionTypeId: string;
    }

    export interface CreateBudgetPlayer {
        budget: number;
    }

    export interface CreateBuyHex {
        gameId: string;
        playerId: string;
        row: number;
        col: number;
    }

    export interface CreateBuyMinion {
        gameId: string;
        minionTypeId: string;
        playerId: string;
        row: number;
        col: number;
    }

    export interface CreateCurrentTurn {
        currentTurn: number;
    }

    export interface CreateEndTurn {
        gameId: string;
        playerId: string;
        endTurn: boolean;
    }

    export interface CreateFindMinionTypeParams {
        gameID: string;
        minionTypeID: string;
    }

    export interface CreateFindMinionParams {
        gameID: string;
        minionID: string;
        playerID: string;
    }

    const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL ?? "/ws";
    const APPLICATION_DESTINATION_PREFIX = import.meta.env.VITE_STOMP_PREFIX ?? "/app";

    const createTopicClient = () => {
        let client: Client | null = null;
        let connectPromise: Promise<Client> | null = null;

        const ensureClient = () => {
            if (client) {
                return client;
            }

            client = new Client({
                webSocketFactory: () => new SockJS(WEBSOCKET_URL),
                reconnectDelay: 5000,
                debug: () => undefined,
            });

            return client;
        };

        const connect = async () => {
            const stompClient = ensureClient();

            if (stompClient.connected) {
                return stompClient;
            }

            if (!connectPromise) {
                connectPromise = new Promise<Client>((resolve, reject) => {
                    stompClient.onConnect = () => {
                        resolve(stompClient);
                        connectPromise = null;
                    };

                    stompClient.onStompError = (frame) => {
                        reject(new Error(frame.headers.message || "WebSocket connection failed"));
                        connectPromise = null;
                    };

                    stompClient.onWebSocketError = (event) => {
                        reject(event.error instanceof Error ? event.error : new Error("WebSocket error"));
                        connectPromise = null;
                    };

                    stompClient.activate();
                });
            }

            return connectPromise;
        };

        const send = async (destination: string, payload: unknown) => {
            const stompClient = await connect();
            stompClient.publish({
                destination: `${APPLICATION_DESTINATION_PREFIX}${destination}`,
                body: JSON.stringify(payload),
            });
        };

        const subscribe = async <T>(destination: string, handler: (payload: T) => void): Promise<StompSubscription> => {
            const stompClient = await connect();

            return stompClient.subscribe(destination, (message: IMessage) => {
                handler(JSON.parse(message.body) as T);
            });
        };

        return {
            connect,
            send,
            subscribe,
        };
    };

    const gameSocket = createTopicClient();


    export const API = {

        // --- Mode Selection ---
        createModeSelection: async (data: CreateModSelection) => {
            const response = await fetch("/select-mode/new-game", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            return response.json();
        }

        // --- Number of Minions ---
        , createNumberOfMinion: async (data: CreateNumberOfMinion) => {
            const response = await fetch("/minion/minion-number", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            return response.json();
        }

        // --- Update Minion Info ---
        , createUpdateMinionInfo: async (data: CreteUpdateMinionInfo) => {
            // ส่งเฉพาะ field ที่ DTO ฝั่ง Spring ต้องการ
            const response = await fetch("/minion/info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            return response.json();
        }

        // --- Update Minion Strategy File ---
        , createUpdateMinionStrategy: async (data: CreateUpdateMinionStrategy) => {
            const formData = new FormData();
            // Spring Boot: @RequestPart("File") MultipartFile file
            // ส่งเฉพาะส่วนที่จำเป็นคือไฟล์
            formData.append("File", data.file);

            // backend mapping: POST /strategy/{gameID}/{minionTypeID}
            const response = await fetch(`/minion/strategy/${data.gameID}/${data.minionTypeID}`, {
                method: "POST",
                body: formData,
            });
            return response.json();
        }

        // --- Configuration ---
        , createConfig: async (data: CreateConfig) => {
            const response = await fetch("/config/setup-config", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            return response.json();
        }

        // --- Start Game ---
        , createStart: async (gameID: string) => {
            const response = await fetch(`/start/${gameID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.json();
        }

        // --- Minion Lookup ---
        , getMinionType: async (data: CreateFindMinionTypeParams) => {
            const response = await fetch(`/minion/find-minion-type/${data.gameID}/${data.minionTypeID}`, {
                method: "GET",
            });
            return response.json() as Promise<unknown>;
        }

        , getMinionInBoard: async (data: CreateFindMinionParams) => {
            const response = await fetch(`/minion/find-minion/${data.gameID}/${data.minionID}/${data.playerID}`, {
                method: "GET",
            });
            return response.json() as Promise<CreateMinionRespond>;
        }

        // --- Info ---
        , getCurrentTurn: async (gameID: string) => {
            const response = await fetch(`/info/turn/${gameID}`, {
                method: "GET",
            });
            return response.json() as Promise<CreateCurrentTurn>;
        }

        , getAllHexes: async (gameID: string) => {
            const response = await fetch(`/info/all-hex/${gameID}`, {
                method: "GET",
            });
            return response.json() as Promise<CreateHexRespond[]>;
        }

        , getOwnHexes: async (gameID: string, playerID: string) => {
            const response = await fetch(`/info/own-hex/${gameID}/${playerID}`, {
                method: "GET",
            });
            return response.json() as Promise<CreateHexRespond[]>;
        }

        , getOwnMinions: async (gameID: string, playerID: string) => {
            const response = await fetch(`/info/own-minion/${gameID}/${playerID}`, {
                method: "GET",
            });
            return response.json() as Promise<CreateMinionRespond[]>;
        }

        , getBudgetPlayer: async (gameID: string, playerID: string) => {
            const response = await fetch(`/info/budget/${gameID}/${playerID}`, {
                method: "GET",
            });
            return response.json() as Promise<CreateBudgetPlayer>;
        }

        , getAvailableHexes: async (gameID: string, playerID: string) => {
            const response = await fetch(`/info/available-hex/${gameID}/${playerID}`, {
                method: "GET",
            });
            return response.json() as Promise<CreateHexRespond[]>;
        }

        // --- Buy Hex ---
        , createBuyHex: async (data: CreateBuyHex) => {
            await gameSocket.send("/buy-hex", data);
        }

        // --- Buy Minion ---
        , createBuyMinion: async (data: CreateBuyMinion) => {
            await gameSocket.send("/buy-minion", data);
        }

        // --- End Turn ---
        , createEndTurn: async (data: CreateEndTurn) => {
            await gameSocket.send("/end-turn", data);
        }

        // --- Subscribe Game Topics ---
        , subscribeAllHex: async (handler: (data: CreateHexRespond) => void) => {
            return gameSocket.subscribe<CreateHexRespond>("/topic/all-hex", handler);
        }

        , subscribePlayerBudget: async (handler: (data: CreateBudgetPlayer) => void) => {
            return gameSocket.subscribe<CreateBudgetPlayer>("/topic/player-budget", handler);
        }

        , subscribeCurrentTurn: async (handler: (data: CreateCurrentTurn) => void) => {
            return gameSocket.subscribe<CreateCurrentTurn>("/topic/current-turn", handler);
        }

    }