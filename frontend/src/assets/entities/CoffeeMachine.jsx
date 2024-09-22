/* eslint-disable no-unused-vars */
import React, { useRef } from "react";
import Collider from "../../@core/Collider";
import GameObject from "../../@core/GameObject";
import Interactable from "../../@core/Interactable";
import { useSound } from "../../@core/Sound";
import Sprite from "../../@core/Sprite";
import useGameObject from "../../@core/useGameObject";
import useGameObjectEvent from "../../@core/useGameObjectEvent";
import soundData from "../../soundData";
import spriteData from "../../spriteData";

function CoffeeScript() {
  const { getComponent } = useGameObject();
  const fillState = useRef(true);
  const playSfx = useSound(soundData.drinking);

  useGameObjectEvent("interaction", () => {
    if (fillState.current) {
      fillState.current = false;
      getComponent("Sprite").setState("coffee-machine-empty");
      playSfx();
    }
  });

  return null;
}

export default function CoffeeMachine(props) {
  return (
    <GameObject {...props}>
      <Sprite {...spriteData.objects} state="coffee-machine" />
      <Collider isAssign={true} />
      <Interactable />
      <CoffeeScript />
    </GameObject>
  );
}
