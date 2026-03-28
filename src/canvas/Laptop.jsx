import React, { useState, useRef, useEffect } from "react";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useFrame } from "@react-three/fiber";
import { Decal, useTexture, useGLTF } from "@react-three/drei";
import { useDrag } from "react-use-gesture";

import state from "../store";

const Laptop = (props) => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF("/laptop.glb");
  const group = useRef();

  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  const [alternateColor, setAlternateColor] = useState(false);

  const bind = useDrag(({ offset: [x, y] }) => {
    group.current.rotation.y = x / 100;
    group.current.rotation.x = y / 100;
  });

  useFrame((state, delta) => {
    easing.dampC(materials.screen.color, snap.color, 0.25, delta);
    if (alternateColor) {
      materials.glow.color.set(0x000000);
    } else {
      materials.glow.color.set(snap.color);
    }
  });

  useInterval(() => {
    setAlternateColor((prev) => !prev);
  }, 1000);

  const stateString = JSON.stringify(snap);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  return (
    <group key={stateString} {...props} ref={group} dispose={null} {...bind()}>
      <mesh
        geometry={nodes.screen.geometry}
        material={materials.screen}
        position={[0, -0.09, 0.048]}
        rotation={[1.942, 0.011, 2.224]}
        scale={0.794}
      >
        {snap.isFullTexture && (
          <>
            <Decal
              position={[0, -3.358, -0.8]}
              rotation={[1.5155, 0.0001, 3.14]}
              scale={4.6}
              map={fullTexture}
            >
              <meshStandardMaterial
                map={fullTexture}
                polygonOffset
                polygonOffsetFactor={-1}
              />
            </Decal>
          </>
        )}
        {snap.isLogoTexture && (
          <Decal
            position={[0, -1.43, -1]}
            rotation={[1.5, 0, 3.14]}
            scale={0.7}
            map={logoTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
      <mesh
        geometry={nodes.body.geometry}
        material={materials.body}
        position={[0, -0.09, 0.048]}
        rotation={[1.942, 0.011, 2.224]}
        scale={0.794}
      />
      <mesh
        geometry={nodes.webcam.geometry}
        material={materials.webcam}
        position={[0, -0.09, 0.048]}
        rotation={[1.942, 0.011, 2.224]}
        scale={0.794}
      />
      <group
        position={[0, -0.09, 0.048]}
        rotation={[1.942, 0.011, 2.224]}
        scale={0.794}
      >
        <mesh geometry={nodes.kayboard.geometry} material={materials.keycaps} />
        <mesh geometry={nodes.kayboard_1.geometry} material={materials.glow} />
      </group>
    </group>
  );
};

export default Laptop;
useGLTF.preload("/laptop.glb");
