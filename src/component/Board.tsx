import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BoardSVG from "../SVG/Board.svg";
import CustomAlert from "./CustomAlert";
import DesignedButton from "./DesignedButton";
import CoinShopSVG from "../SVG/CoinShop.svg";
import BuyHexSVG from "../SVG/BuyHex.svg";
import PaperSVG from "../SVG/Paper.svg";
import YellowBorderSVG from "../SVG/MinionCard/yellowBorder.svg";
import ShrekCardSVG from "../SVG/MinionCard/ShrekCard.svg";
import DonkeyCardSVG from "../SVG/MinionCard/DonkeyCard.svg";
import MrBeastCardSVG from "../SVG/MinionCard/MrBeastCard.svg";
import MarkiplierCardSVG from "../SVG/MinionCard/MarkiplierCard.svg";
import ItchBallCardSVG from "../SVG/MinionCard/ItchBallCard.svg";
import CoinSVG from "../SVG/Coin.svg";
import WinnerPageSVG from "../SVG/winnerPage.svg";
import Grid from "./Grid";
import { ALL_CHARACTERS } from "../constants/minionData";
import { type Cell } from "../constants/boardTypes";
import { type StrategyData } from "../constants/strategyTypes";
import { loadConfigFromStorage, type GameConfig } from "../constants/gameConfig";

const MINION_CARD_ASSETS: Record<string, string> = {
  Shrek: ShrekCardSVG,
  Donkey: DonkeyCardSVG,
  MrBeast: MrBeastCardSVG,
  Markiplier: MarkiplierCardSVG,
  Markipiler: MarkiplierCardSVG,
  ItchBall: ItchBallCardSVG,
};

const MINION_GRID_ASSETS: Record<string, string> = Object.fromEntries(
  ALL_CHARACTERS.map((minion) => [minion.name, minion.src]),
);

const GRID_HEX_WIDTH = 137;
const GRID_HEX_HEIGHT = 120;

const getCellKey = (r: number, c: number) => `${r}-${c}`;

const getBuyableCells = (grid: Cell[][], currentTurn: number) => {
  const buyable = new Set<string>();
  const horizontalNeighborDistance = GRID_HEX_WIDTH * 0.75;
  const diagonalNeighborOffset = GRID_HEX_HEIGHT / 2;

  grid.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell.owner !== null) return;

      const cellCenterX = columnIndex * horizontalNeighborDistance;
      const cellCenterY = rowIndex * GRID_HEX_HEIGHT + (columnIndex % 2 === 0 ? diagonalNeighborOffset : 0);

      for (let ownerRow = 0; ownerRow < grid.length; ownerRow += 1) {
        for (let ownerColumn = 0; ownerColumn < grid[ownerRow].length; ownerColumn += 1) {
          const neighbor = grid[ownerRow][ownerColumn];

          if (neighbor.owner !== currentTurn) continue;

          const neighborCenterX = ownerColumn * horizontalNeighborDistance;
          const neighborCenterY = ownerRow * GRID_HEX_HEIGHT + (ownerColumn % 2 === 0 ? diagonalNeighborOffset : 0);
          const deltaX = Math.abs(cellCenterX - neighborCenterX);
          const deltaY = Math.abs(cellCenterY - neighborCenterY);

          const isVerticalNeighbor = deltaX === 0 && deltaY === GRID_HEX_HEIGHT;
          const isDiagonalNeighbor =
            deltaX === horizontalNeighborDistance && deltaY === diagonalNeighborOffset;

          if (isVerticalNeighbor || isDiagonalNeighbor) {
            buyable.add(getCellKey(rowIndex, columnIndex));
            return;
          }
        }
      }
    });
  });

  return buyable;
};

const createGrid = () => {
  const rows = 8;
  const cols = 8;

  const grid: Cell[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];

    for (let c = 0; c < cols; c++) {
      row.push({
        owner: null,
        minion: null,
      });
    }

    grid.push(row);
  }

  // Player 0 territory
  grid[7][7].owner = 0;
  grid[7][6].owner = 0;
  grid[7][5].owner = 0;
  grid[6][7].owner = 0;
  grid[6][6].owner = 0;

  // Player 1 territory
  grid[0][0].owner = 1;
  grid[0][1].owner = 1;
  grid[0][2].owner = 1;
  grid[1][0].owner = 1;
  grid[1][1].owner = 1;

  return grid;
};

const getPlayers = (mode: string) => {
  if (mode === "Solitaire") return ["Player", "Bot"];
  if (mode === "Duel") return ["Player 1", "Player 2"];
  if (mode === "Auto") return ["Bot 1", "Bot 2"];

  return ["Player", "Bot"];
};

const FALLBACK_CONFIG: GameConfig = {
  startingGold: 0,
  maxGold: 0,
  goldPerRound: 0,
  interestRate: 0,
  hexCost: 0,
  turnLimit: 0,
  minionHp: 0,
  maxMinions: 0,
  minionCost: 0,
};

const Board = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.state?.mode || "Solitaire";
  const minionCount = location.state?.minionCount || 1;
  const strategies =
    (location.state?.strategies as Record<string, StrategyData | boolean> | undefined) || {};
  const routeConfig = location.state?.config as GameConfig | undefined;
  const config = routeConfig || loadConfigFromStorage() || FALLBACK_CONFIG;

  const players = getPlayers(mode);
  const initialGoldByPlayer = players.map(() => Math.min(config.maxGold, config.startingGold));

  const [turn, setTurn] = useState(0);
  const [turnCount, setTurnCount] = useState(0);
  const [goldByPlayer, setGoldByPlayer] = useState<number[]>(initialGoldByPlayer);
  const [grid, setGrid] = useState(createGrid());
  const [phase, setPhase] = useState("idle");
  const [showAlert, setShowAlert] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [showCoinShop, setShowCoinShop] = useState(true);
  const [showBuyHexPaper, setShowBuyHexPaper] = useState(false);
  const [turnLimitByPlayer, setTurnLimitByPlayer] = useState<number[]>(() =>
    players.map(() => config.turnLimit),
  );
  const [selectedMinionName, setSelectedMinionName] = useState<string | null>(null);
  const [hasPlacedMinionThisTurn, setHasPlacedMinionThisTurn] = useState(false);
  const [hasPurchasedHexThisTurn, setHasPurchasedHexThisTurn] = useState(false);
  const [selectedBuyHexCell, setSelectedBuyHexCell] = useState<string | null>(null);
  const [availableMinionsByPlayer, setAvailableMinionsByPlayer] = useState<number[]>(() =>
    players.map(() => config.maxMinions),
  );

  const currentPlayer = players[turn];
  const currentGold = goldByPlayer[turn] ?? 0;
  const isOpeningTurn = turnCount < players.length;
  const displayedMinionCost = isOpeningTurn ? 0 : config.minionCost;
  const displayedHexCost = config.hexCost;
  const activeMinions = ALL_CHARACTERS.slice(0, minionCount).map((minion) => {
    const strategy = strategies[minion.id];
    const customName =
      typeof strategy === "object" && strategy?.customName
        ? strategy.customName.trim()
        : "";

    return {
      ...minion,
      displayName: customName || minion.name,
      cardSrc: MINION_CARD_ASSETS[minion.name] || minion.src,
    };
  });

  // ตำแหน่ง UI
  const uiPos = {
    buyHex: {
      left: { top: 0, left: 340 },
      right: { top: 0, left: 1170 },
    },
    coin: {
      left: { top: 830, left: 40 },
      right: { top: 830, left: 1635 },
    },
    endTurn: {
      left: { top: 1000, left: 380 },
      right: { top: 1000, left: 1200 },
    },
    alert: {
      left: { top: 30, left: 950 },
      right: { top: 30, left: 115 },
    },
  };

  const side = flipped ? "right" : "left";
  const isPlacingMinion = selectedMinionName !== null;
  const isChoosingMinion = showCoinShop && !selectedMinionName && !hasPlacedMinionThisTurn;
  const isHexPurchaseForced = !isOpeningTurn && hasPlacedMinionThisTurn && !hasPurchasedHexThisTurn;
  const canOpenBuyHex = !hasPurchasedHexThisTurn && (!isOpeningTurn || hasPlacedMinionThisTurn);
  const isBuyHexOpen = canOpenBuyHex && (showBuyHexPaper || isHexPurchaseForced);
  const buyableCells = isBuyHexOpen ? getBuyableCells(grid, turn) : new Set<string>();
  const currentTurnLimitRemaining = turnLimitByPlayer[turn] ?? 0;
  const currentAvailableMinions = availableMinionsByPlayer[turn] ?? 0;
  const hasAnyTurnLimitRemaining = turnLimitByPlayer.some((limit) => limit > 0);

  const commitBuyHex = () => {
    if (!selectedBuyHexCell) {
      setAlertMessage("Select a hex first");
      return;
    }

    const [rowString, columnString] = selectedBuyHexCell.split("-");
    const row = Number(rowString);
    const column = Number(columnString);

    if (!Number.isInteger(row) || !Number.isInteger(column)) {
      setAlertMessage("Invalid hex selection");
      return;
    }

    setGrid((prevGrid) => {
      const nextGrid = prevGrid.map((gridRow) => gridRow.map((cell) => ({ ...cell })));
      nextGrid[row][column].owner = turn;
      return nextGrid;
    });

    if (displayedHexCost > 0) {
      setGoldByPlayer((prevGoldByPlayer) => {
        const next = [...prevGoldByPlayer];
        next[turn] = Math.max(0, (next[turn] ?? 0) - displayedHexCost);
        return next;
      });
    }

    setSelectedBuyHexCell(null);
    setHasPurchasedHexThisTurn(true);
    setShowBuyHexPaper(false);
    setShowCoinShop(!hasPlacedMinionThisTurn);
    setPhase("idle");
  };

  const buyHex = () => {
    if (isOpeningTurn && !hasPlacedMinionThisTurn) {
      setAlertMessage("Please buy and place minion first");
      return;
    }

    if (isPlacingMinion) return;

    if (hasPurchasedHexThisTurn) {
      setAlertMessage("You can buy only one hex per turn");
      return;
    }

    if (isHexPurchaseForced) {
      if (selectedBuyHexCell) {
        commitBuyHex();
      } else {
        setAlertMessage("Select a hex first");
      }
      return;
    }

    setShowBuyHexPaper((prev) => {
      const next = !prev;
      setPhase(next ? "buyHex" : "idle");
      if (!next) {
        setSelectedBuyHexCell(null);
      }
      return next;
    });
  };

  const openCoinShop = () => {
    if (isOpeningTurn && !hasPlacedMinionThisTurn) {
      return;
    }

    if (hasPlacedMinionThisTurn || isHexPurchaseForced) {
      return;
    }

    setShowCoinShop((prev) => !prev);
  };

  const handleSelectMinion = (minionName: string) => {
    if (isHexPurchaseForced) {
      setAlertMessage("Please buy hex first");
      return;
    }

    if (currentAvailableMinions <= 0) {
      setAlertMessage("No minion left to place");
      return;
    }

    if (hasPlacedMinionThisTurn) {
      setAlertMessage("You can buy only one minion per turn");
      return;
    }

    const cost = displayedMinionCost;

    if (selectedMinionName === minionName) {
      setGoldByPlayer((prevGoldByPlayer) => {
        const next = [...prevGoldByPlayer];
        next[turn] = Math.min(config.maxGold, (next[turn] ?? 0) + cost);
        return next;
      });

      setSelectedMinionName(null);
      setShowBuyHexPaper(false);
      setSelectedBuyHexCell(null);
      setPhase("idle");
      return;
    }

    if (!selectedMinionName) {
      if (currentGold < cost) {
        setAlertMessage("Not enough gold");
        return;
      }

      setGoldByPlayer((prevGoldByPlayer) => {
        const next = [...prevGoldByPlayer];
        next[turn] = Math.max(0, (next[turn] ?? 0) - cost);
        return next;
      });
    }

    setSelectedMinionName(minionName);
    setShowBuyHexPaper(false);
    setSelectedBuyHexCell(null);
    setPhase("idle");
  };

  const handleHexClick = (r: number, c: number) => {
    if (isBuyHexOpen) {
      const key = getCellKey(r, c);

      if (!buyableCells.has(key)) {
        return;
      }

      setSelectedBuyHexCell((prev) => (prev === key ? null : key));
      setShowBuyHexPaper(true);
      setPhase("buyHex");
      return;
    }

    if (isPlacingMinion) {
      const cell = grid[r]?.[c];

      if (!cell || cell.owner !== turn) {
        setAlertMessage("You can place minion only on your owned hex");
        return;
      }

      if (cell.minion) {
        setAlertMessage("This hex already has a minion");
        return;
      }

      const newGrid = grid.map((row) => row.map((cellItem) => ({ ...cellItem })));
      newGrid[r][c].minion = selectedMinionName;

      setGrid(newGrid);
      setSelectedMinionName(null);
      setShowBuyHexPaper(false);
      setShowCoinShop(false);
      setSelectedBuyHexCell(null);
      setPhase("idle");
      setHasPlacedMinionThisTurn(true);
      setAvailableMinionsByPlayer((prev) => {
        const next = [...prev];
        next[turn] = Math.max(0, (next[turn] ?? 0) - 1);
        return next;
      });
      return;
    }

    if (phase !== "buyHex") return;

    const cell = grid[r]?.[c];

    if (!cell || cell.owner === turn) return;

    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    newGrid[r][c].owner = turn;

    setGrid(newGrid);
    setPhase("buyMinion");
  };

  const buyMinion = openCoinShop;

  const openWinnerPage = (winnerName: string) => {
    navigate("/winner", {
      state: {
        mode,
        winnerName,
      },
    });
  };

  const endTurn = () => {
    if (isOpeningTurn && !hasPlacedMinionThisTurn) {
      setAlertMessage("Please buy and place minion first");
      return;
    }

    if (isHexPurchaseForced) {
      setAlertMessage("Please buy hex first");
      return;
    }

    const nextTurnLimit = Math.max(0, currentTurnLimitRemaining - 1);

    const nextTurnCount = turnCount + 1;

    setGoldByPlayer((prevGoldByPlayer) => {
      const next = [...prevGoldByPlayer];
      next[turn] = Math.min(config.maxGold, (next[turn] ?? 0) + config.goldPerRound);
      return next;
    });
    setTurn((prev) => (prev + 1) % players.length);
    setTurnCount(nextTurnCount);
    setFlipped((prev) => !prev);
    setPhase("idle");
    setSelectedMinionName(null);
    setHasPlacedMinionThisTurn(false);
    setHasPurchasedHexThisTurn(false);
    setSelectedBuyHexCell(null);
    setShowCoinShop(nextTurnCount < players.length);
    setShowBuyHexPaper(nextTurnCount >= players.length);
    setShowAlert(true);
    setTurnLimitByPlayer((prev) => {
      const next = [...prev];
      next[turn] = nextTurnLimit;
      return next;
    });

    const nextTurnLimits = turnLimitByPlayer.map((limit, index) =>
      index === turn ? nextTurnLimit : limit,
    );

    if (nextTurnLimits.every((limit) => limit <= 0)) {
      openWinnerPage(currentPlayer);
    }
  };

  const showActionPaper = isChoosingMinion || isPlacingMinion || isBuyHexOpen;

  return (
    <div>
      <div>
        <div className={flipped ? "board-playfield board-playfield--flipped" : "board-playfield"}>
          <img src={BoardSVG} className="background" />

          <Grid
            grid={grid}
            minionAssets={MINION_GRID_ASSETS}
            onHexClick={handleHexClick}
            buyableCells={buyableCells}
            selectedBuyHexCell={selectedBuyHexCell}
            canPlaceMinion={isPlacingMinion}
            isFlipped={flipped}
          />
        </div>
        
        {/* Buy Hex */}
        <div
          className="board-buy-trigger"
          style={{ top: uiPos.buyHex[side].top, left: uiPos.buyHex[side].left }}
          onClick={buyHex}
        >
          <div className="board-action-stack">
            <img
              src={showActionPaper ? PaperSVG : BuyHexSVG}
              alt={showActionPaper ? "Paper" : "Buy Hex"}
              className={showActionPaper ? "board-action-image board-paper-image" : "board-action-image"}
            />
            {isChoosingMinion ? (
              <div className="board-paper-copy">
                <span className="jacquard-24 fs-140" style={{ color: "var(--color-mahogany)" }}>
                  Order
                </span>
                <span className="medieval-Sharp fs-75">Choose</span>
                <span className="medieval-Sharp fs-75">Minion</span>
              </div>
            ) : isPlacingMinion ? (
              <div className="board-paper-copy">
                <span className="jacquard-24 fs-140" style={{ color: "var(--color-mahogany)" }}>
                  Order
                </span>
                <span className="medieval-Sharp fs-75">Place</span>
                <span className="medieval-Sharp fs-75">Minion</span>
              </div>
            ) : isBuyHexOpen ? (
              <div className="board-paper-copy">
                <span className="jacquard-24" style={{ color: "var(--color-mahogany)" }}>
                      {selectedBuyHexCell ? <span className="fs-120">Treaty</span> : <span className=" fs-140">Order</span>}
                  </span>
                <span className="medieval-Sharp fs-75" style={{ color: "var(--color-cream)" }}>
                  {selectedBuyHexCell ? (
                    <>
                      Hex
                      <img src={CoinSVG} alt="Coin" className="board-paper-coin-icon" />
                      {displayedHexCost}
                    </>
                  ) : (
                    "Choose"
                  )}
                </span>
                {selectedBuyHexCell ? (
                  <>
              
                    <DesignedButton
                      onClick={commitBuyHex}
                      color="#4C5921"
                      className="board-buy-inline-btn"
                      style={{ position: "relative" }}
                    >
                      <span className="medieval-Sharp confirm-text fs-60 ">Buy</span>
                    </DesignedButton>
                  </>
                ) : (
                  <span className="medieval-Sharp fs-75">Hex</span>
                )}
              </div>
            ) : null}
            <span className="medieval-Sharp fs-45"
            style={{ color: "var(--color-cream)" }}
            >
              Available: {currentAvailableMinions}
            </span>
            <span className="medieval-Sharp fs-45"
            style={{ color: "var(--color-cream)", marginTop: "-20px" }}
            >Turn Limit: {currentTurnLimitRemaining}</span>
          </div>
        </div>

            

        {/* Coin Shop */}
        <DesignedButton
          disableHover
          color="transparent"
          top={uiPos.coin[side].top}
          left={uiPos.coin[side].left}
          onClick={buyMinion}
          className="board-coinshop-trigger"
          style={{ padding: 0, backgroundColor: "transparent" }}
        >
          <div className="board-coin-stack">
            <img src={CoinShopSVG} alt="Coin" className="board-coin-image" />
            <div className="board-gold-label">
              <span>{currentGold}</span>
            </div>
          </div>
        </DesignedButton>

        {showCoinShop && (
          <div className={`coin-shop-panel coin-shop-panel--${side}`}>
            <img src={YellowBorderSVG} alt="Yellow Border" className="coin-shop-border-svg" />
            <div className="coin-shop-list">
              {activeMinions.map((minion) => (
                <div className="coin-shop-item" key={minion.name} onClick={() => handleSelectMinion(minion.name)}>
                  <div className="coin-shop-item-media">
                    <div className="coin-shop-item-name">{minion.displayName}</div>
                    <img
                      src={minion.cardSrc}
                      alt={minion.displayName}
                      className="coin-shop-item-image"
                    />
                    <div className="coin-shop-item-cost">{displayedMinionCost}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* End Turn */}
        {hasAnyTurnLimitRemaining ? (
          <DesignedButton
            color="#902E01"
            top={uiPos.endTurn[side].top}
            left={uiPos.endTurn[side].left}
            onClick={endTurn}
            className="medieval-Sharp fs-60"
          >
            End Turn
          </DesignedButton>
        ) : (
          <DesignedButton
            disableHover
            color="transparent"
            top={uiPos.endTurn[side].top - 10}
            left={uiPos.endTurn[side].left - 70}
            onClick={() => openWinnerPage(currentPlayer)}
            style={{ padding: 0, backgroundColor: "transparent" }}
          >
            <img
              src={WinnerPageSVG}
              alt="Winner Page"
              className="board-winner-page-image"
              style={{ width: "260px", height: "auto", objectFit: "contain" }}
            />
          </DesignedButton>
        )}

        {/* Alert */}
        {showAlert && (
          <CustomAlert
            message={`${currentPlayer} Turn`}
            fontSize="110px"
            fontColor="#D3B14D"
            top={uiPos.alert[side].top}
            left={uiPos.alert[side].left}
            fontClassName="jacquard-24"
            onClose={() => setShowAlert(false)}
          />
        )}

        {alertMessage && (
          <CustomAlert
            message={alertMessage}
            fontSize="72px"
            fontColor="#D3B14D"
            top={uiPos.alert[side].top }
            left={uiPos.alert[side].left}
            onClose={() => setAlertMessage(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Board;
