import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Decal } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { easing } from "maath";
import state from "../store";

function SimpleModel() {
  const snap = useSnapshot(state);
  const meshRef = useRef();

  // Load textures
  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  // Animate colors
  useFrame((state, delta) => {
    if (meshRef.current) {
      easing.dampC(meshRef.current.material.color, snap.color, 0.25, delta);
    }
  });

  return (
    <group scale={[2, 2, 2]} position={[0, 0, 0]}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={snap.color} />

        {snap.isFullTexture && (
          <Decal
            position={[0, 0, 0.51]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          >
            <meshStandardMaterial
              map={fullTexture}
              polygonOffset
              polygonOffsetFactor={-1}
            />
          </Decal>
        )}

        {snap.isLogoTexture && (
          <Decal
            position={[0, 0, 0.52]}
            rotation={[0, 0, 0]}
            scale={0.5}
            map={logoTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
}

export default SimpleModel;
