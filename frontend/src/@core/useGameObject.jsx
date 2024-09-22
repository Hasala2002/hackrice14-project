import { useContext } from 'react';
import { GameObjectContext } from './GameObject';

export default function useGameObject() {
    return useContext(GameObjectContext);
}
