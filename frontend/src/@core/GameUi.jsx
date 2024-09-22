/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { HTML } from "@react-three/drei";
import React from "react";
import { AssetLoaderProvider } from "./AssetLoader";
import { GameContext } from "./Game";
import useGame from "./useGame";

export default function GameUi({ children }) {
  const gameContextValue = useGame(); // forwarded to dom reconciler

  return (
    <HTML eps={1} zIndexRange={[0, 0]}>
      <GameContext.Provider value={gameContextValue}>
        <AssetLoaderProvider>{children}</AssetLoaderProvider>
      </GameContext.Provider>
    </HTML>
  );
}
