import useGameObjectEvent from './useGameObjectEvent';

// This hook exists for legacy support
export default function useInteraction(callback) {
    useGameObjectEvent('interaction', callback, [callback]);
}
