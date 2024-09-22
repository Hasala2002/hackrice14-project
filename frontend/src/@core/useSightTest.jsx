import { useCallback } from 'react';
import useGameObject from './useGameObject';
import useCollisionTest from './useCollisionTest';
import tileUtils from './utils/tileUtils';

export default function useSightTest(options = { sight: true }) {
    const test = useCollisionTest(options);
    const { transform: selfTransform } = useGameObject() || {}; // optional
    const transform = options.origin?.transform || selfTransform;

    return useCallback(
        (targetObjectOrPosition, range) => {
            const target = targetObjectOrPosition.transform || targetObjectOrPosition;

            // transform might be deprecated when this function is called
            const base = tileUtils(transform);
            if (base.distance(target) > range) return false;

            const line = base.lineTo(target).slice(1, -1);
            for (const tile of line) {
                // break 'line of sight' if not walkable
                if (!test(tile)) return false;
            }
            return true;
        },
        [test, transform]
    );
}
