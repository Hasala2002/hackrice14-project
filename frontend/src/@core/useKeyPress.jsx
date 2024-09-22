import { useCallback, useEffect, useState } from 'react';
import useGame from './useGame';

export default function useKeyPress(key) {
    const { paused } = useGame();
    const [isDown, set] = useState(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const keys = Array.isArray(key) ? key : [key];

    const handleKeyDown = useCallback(
        (event) => {
            if (paused) return;
            if (!isDown && keys.includes(event.key)) {
                set(true);
            }
        },
        [keys, isDown, paused]
    );

    const handleKeyUp = useCallback(
        (event) => {
            if (isDown && keys.includes(event.key)) {
                set(false);
            }
        },
        [keys, isDown]
    );

    const handleWindowBlur = useCallback(() => {
        set(false);
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleWindowBlur);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleWindowBlur);
        };
    }, [handleKeyDown, handleKeyUp, handleWindowBlur]);

    return isDown;
}
