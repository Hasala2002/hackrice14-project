/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";
import useAsset from "./useAsset";
import useGameLoop from "./useGameLoop";

// create geometry once and reuse
const geometry = new THREE.PlaneGeometry(1, 1);

export default memo(
  forwardRef(function Graphic(
    {
      src,
      sheet = {
        default: [[0, 0]],
      },
      state = "default",
      frameWidth = 16,
      frameHeight = 16,
      frameTime = 200,
      scale = 1,
      flipX = 1,
      color = "#fff",
      opacity = 1,
      offset = { x: 0, y: 0 },
      basic,
      blending = THREE.NormalBlending,
      magFilter = THREE.NearestFilter,
      onIteration,
    },
    ref
  ) {
    if (!sheet[state]) {
      console.warn(
        `Sprite state '${state}' does not exist in sheet '${src}':`,
        Object.keys(sheet)
      );
    }

    const image = useAsset(src);
    const textureRef = useRef(new THREE.Texture());
    const mounted = useRef(true);
    const interval = useRef();
    const prevFrame = useRef(-1);
    const frame = useRef(0);
    const frames = sheet[state];
    const [firstFrame, lastFrame = firstFrame] = frames;
    const frameLength = lastFrame[0] + 1 - firstFrame[0];

    const handleFrameUpdate = useCallback(() => {
      const currentFrame = firstFrame[0] + frame.current;
      const textureOffsetX = (currentFrame * frameWidth) / image.width;
      const textureOffsetY = (firstFrame[1] * frameHeight) / image.height;
      textureRef.current.offset.set(textureOffsetX, textureOffsetY);
    }, [firstFrame, frameHeight, frameWidth, image]);

    useEffect(() => handleFrameUpdate(), [handleFrameUpdate]);

    useGameLoop((time) => {
      if (!mounted.current) return;
      if (interval.current == null) interval.current = time;

      if (time >= interval.current + frameTime) {
        interval.current = time;
        prevFrame.current = frame.current;
        frame.current = (frame.current + 1) % frameLength;

        handleFrameUpdate();

        if (prevFrame.current > 0 && frame.current === 0) {
          onIteration?.();
        }
      }
    }, frameLength > 1);

    const iterationCallback = useRef();
    iterationCallback.current = onIteration;
    useEffect(
      () => () => {
        mounted.current = false;
        iterationCallback.current?.();
      },
      []
    );

    const materialProps = useMemo(
      () => ({
        color: new THREE.Color(color),
        opacity,
        blending,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        fog: false,
        flatShading: true,
        precision: "lowp",
      }),
      [opacity, blending, color]
    );

    const textureProps = useMemo(() => {
      const size = {
        x: image.width / frameWidth,
        y: image.height / frameHeight,
      };
      return {
        image,
        repeat: new THREE.Vector2(1 / size.x, 1 / size.y),
        magFilter,
        minFilter: THREE.LinearMipMapLinearFilter,
      };
    }, [frameHeight, frameWidth, image, magFilter]);

    useFrame(() => {
      if (textureRef.current) {
        textureRef.current.needsUpdate = true; // Trigger texture update
      }
    });

    return (
      <mesh
        ref={ref}
        position={[offset.x, offset.y, -offset.y / 100]}
        scale={[flipX * scale, scale, 1]}
        geometry={geometry}
      >
        {basic ? (
          <meshBasicMaterial attach="material" {...materialProps}>
            <texture ref={textureRef} attach="map" {...textureProps} />
          </meshBasicMaterial>
        ) : (
          <meshLambertMaterial attach="material" {...materialProps}>
            <texture ref={textureRef} attach="map" {...textureProps} />
          </meshLambertMaterial>
        )}
      </mesh>
    );
  })
);
