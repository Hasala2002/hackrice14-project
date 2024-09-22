/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Html } from '@react-three/drei'; // Corrected import
import React from 'react';
import { AssetLoaderProvider } from './AssetLoader';
import { GameContext } from './Game';
import useGame from './useGame';

export default function GameUi({ children }) {
    const gameContextValue = useGame(); // Forwarded to DOM reconciler

    return (
        <Html eps={1} zIndexRange={[0, 0]}> {/* Corrected from HTML to Html */}
            <GameContext.Provider value={gameContextValue}>
                <AssetLoaderProvider>{children}</AssetLoaderProvider>
            </GameContext.Provider>
        </Html>
    );
}
