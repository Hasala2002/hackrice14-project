/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import { css, Global } from "@emotion/react";
import React from "react";
import AssetLoader from "../../@core/AssetLoader";
import Game from "../../@core/Game";
import Scene from "../../@core/Scene";
import SceneManager from "../../@core/SceneManager";
import useWindowSize from "../../@core/useWindowSize";
import OfficeScene from "../scenes/OfficeScene";
import OtherScene from "../scenes/OtherScene";
import soundData from "../../soundData";
import spriteData from "../../spriteData";
import globalStyles from "../styles/global";

const styles = {
  root: (width, height) => css`
    display: flex;
    width: ${width - (width % 2)}px;
    height: ${height - (height % 2)}px;
    justify-content: center;
    align-items: center;
  `,
};

const urls = [
  ...Object.values(spriteData).map((data) => data.src),
  ...Object.values(soundData).map((data) => data.src),
  // flatten
].reduce((acc, val) => acc.concat(val), []);

function Classroom() {
  const [width, height] = useWindowSize();

  return (
    <>
      <Global styles={globalStyles} />
      <div css={styles.root(width, height)}>
        <Game cameraZoom={80}>
          <AssetLoader urls={urls} placeholder="Loading assets ...">
            <SceneManager defaultScene="office">
              <Scene id="office">
                <OfficeScene />
              </Scene>
              <Scene id="other">
                <OtherScene />
              </Scene>
            </SceneManager>
          </AssetLoader>
        </Game>
      </div>
    </>
  );
}
export default Classroom;
