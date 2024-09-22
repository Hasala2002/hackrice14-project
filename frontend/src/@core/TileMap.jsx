// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo } from 'react';
import useGame from './useGame';

// eslint-disable-next-line react/prop-types
export default function TileMap({ data, resolver, definesMapSize = false }) {
    const { setMapSize, publish } = useGame();

    // Reversing the map data for display purposes
    // eslint-disable-next-line react/prop-types
    const mapData = useMemo(() => data.slice().reverse(), [data]);

    // Publishing a 'tile-map-update' event whenever the map data changes
    useEffect(() => {
        publish('tile-map-update');
    }, [mapData, publish]);

    // Setting the map size if the prop 'definesMapSize' is true
    useEffect(() => {
        if (definesMapSize && mapData.length) {
            const sizeX = mapData[0].length;
            const sizeY = mapData.length;
            setMapSize([sizeX, sizeY]);
        }
    }, [mapData, definesMapSize, setMapSize]);

    // Returning null if no resolver is provided, or rendering the map
    if (!resolver) return null;

    return (
        <>
            {mapData.map((row, y) =>
                row.map((type, x) => resolver(type, x, y))
            )}
        </>
    );
}
