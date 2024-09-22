import { useContext } from 'react';
import { GameContext } from './Game';

export default function useGame() {
    return useContext(GameContext);
}
