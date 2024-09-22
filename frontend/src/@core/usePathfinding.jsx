import { useCallback } from 'react';
import findPath from './utils/findPath';
import useGameObject from './useGameObject';
import useMapSnapshot from './useMapSnapshot';

export default function usePathfinding() {
    const { transform } = useGameObject() || {}; // optional
    const createMap = useMapSnapshot();

    return useCallback(
        ({ from = transform, to }) => {
            return findPath({
                from,
                to,
                map: createMap(to),
            });
        },
        [createMap, transform]
    );
}
