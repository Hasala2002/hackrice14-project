/* eslint-disable no-unused-vars */
import React, { useRef } from "react";
import Collider from "../../@core/Collider";
import GameObject from "../../@core/GameObject";
import Interactable from "../../@core/Interactable";
import Sprite from "../../@core/Sprite";
import useGameObject from "../../@core/useGameObject";
import useGameObjectEvent from "../../@core/useGameObjectEvent";
import waitForMs from "../../@core/utils/waitForMs";
import spriteData from "../../spriteData";

function WorkstationScript() {
  const { getComponent } = useGameObject();
  const workState = useRef(false);

  useGameObjectEvent("interaction", () => {
    workState.current = !workState.current;

    if (workState.current) {
      getComponent("Sprite").setState("workstation-2");
    } else {
      getComponent("Sprite").setState("workstation-1");
    }

    return waitForMs(400);
  });

  return null;
}

export default function Workstation(props) {
  return (
    <GameObject {...props}>
      <Sprite {...spriteData.objects} state="workstation-1" />
      <Collider isComp={true} />
      <Interactable />
      <WorkstationScript />
    </GameObject>
  );
}
