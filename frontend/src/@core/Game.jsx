/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { css } from "@emotion/react";
import React, { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import createPubSub from "./utils/createPubSub";

export const GameContext = React.createContext(null);

const styles = {
  root: css`
    position: relative;
    user-select: none;
    width: 100%;
    height: 100%;
  `,
};

export default function Game({
  movementDuration = 250,
  cameraZoom = 64,
  children,
}) {
  const [paused, setPaused] = useState(false);
  const [mapSize, setMapSize] = useState([1, 1]);
  const [registryById] = useState(() => new Map());
  const [registryByName] = useState(() => new Map());
  const [registryByXY] = useState(() => new Map());
  const [registryByLayer] = useState(() => new Map());
  const [pubSub] = useState(() => createPubSub());
  const [gameStore] = useState(() => new Map());

  const storeUtils = useMemo(
    () => ({
      setGameState(key, value) {
        gameStore.set(key, value);
      },
      getGameState(key) {
        return gameStore.get(key);
      },
    }),
    [gameStore]
  );

  useEffect(() => {
    return pubSub.subscribe("scene-exit", () => {
      registryById.clear();
      registryByName.clear();
      registryByXY.clear();
      registryByLayer.clear();
    });
  }, [pubSub, registryById, registryByLayer, registryByName, registryByXY]);

  const registryUtils = useMemo(
    () => ({
      registerGameObject(identifier, ref) {
        // register by id
        registryById.set(identifier, ref);
        // register by name
        registryByName.set(ref.name, ref);
        // register by x, y
        const { transform } = ref;
        const xy = `${transform.x},${transform.y}`;
        const xyList = registryByXY.get(xy) || [];
        xyList.push(ref);
        registryByXY.set(xy, xyList);
        // register by layer
        const layerList = registryByLayer.get(ref.layer) || [];
        layerList.push(ref);
        registryByLayer.set(ref.layer, layerList);
      },
      unregisterGameObject(identifier, ref) {
        // unregister by id
        registryById.delete(identifier);
        // unregister by name
        registryByName.delete(ref.name);
        // unregister by x, y
        const { transform } = ref;
        const xy = `${transform.x},${transform.y}`;
        const xyList = registryByXY.get(xy);
        xyList?.splice(xyList.indexOf(ref), 1);
        // unregister by layer
        const layerList = registryByLayer.get(ref.layer);
        layerList?.splice(layerList.indexOf(ref), 1);
      },
      findGameObjectById(id) {
        return registryById.get(id);
      },
      findGameObjectByName(name) {
        return registryByName.get(name);
      },
      findGameObjectsByXY(x, y) {
        return (
          registryByXY.get(`${x},${y}`)?.filter((obj) => !obj.disabled) || []
        );
      },
      findGameObjectsByLayer(layer) {
        return registryByLayer.get(layer)?.filter((obj) => !obj.disabled) || [];
      },
    }),
    [registryById, registryByLayer, registryByName, registryByXY]
  );

  const contextValue = {
    settings: {
      movementDuration,
      cameraZoom,
    },
    paused,
    setPaused,
    mapSize,
    setMapSize,
    ...storeUtils,
    ...registryUtils,
    ...pubSub,
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        backgroundColor: "#989489",
      }}
    >
      <Canvas
        style={{
          width: "100%",
          height: "100%",
        }}
        camera={{
          position: [0, 0, 32],
          zoom: cameraZoom,
          near: 0.1,
          far: 64,
        }}
        orthographic
        noEvents
        gl2
        gl={{ antialias: false }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <GameContext.Provider value={contextValue}>
          {children}
        </GameContext.Provider>
      </Canvas>
    </div>
  );
}
