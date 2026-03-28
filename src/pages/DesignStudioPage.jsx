import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture, Decal } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { easing } from "maath";
import state from "../store";
import {
  IoCloudUpload,
  IoDownload,
  IoColorPalette,
  IoCheckmarkCircle,
  IoSwapHorizontal,
} from "react-icons/io5";
import Laptop from "../canvas/Laptop";
import SimpleModel from "../canvas/SimpleModel";
import headphonesIcon from "../assets/headphones-choice-icon.png";
import laptopIcon from "../assets/laptop-choice-icon.png";

// Helper function to darken a color
function darkenColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

// Helper function to add alpha to hex color
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Enhanced Headphones component
function Headphones() {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF("/headphones.glb");
  const group = useRef();

  const defaultTexture = useTexture("/texture_default.png");
  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  useFrame((state, delta) => {
    if (materials.EarC) {
      easing.dampC(materials.EarC.color, snap.color, 0.25, delta);
    }
    if (materials.FabricC) {
      easing.dampC(materials.FabricC.color, snap.color, 0.25, delta);
    }
    if (materials.UpperFoamC) {
      easing.dampC(materials.UpperFoamC.color, snap.color, 0.25, delta);
    }
  });

  const meshParts = ["Lower", "Upper", "UpperFoam", "Ear", "Foam", "Fabric"];

  return (
    <group ref={group} scale={[8, 8, 8]} position={[0, 0, 0]} dispose={null}>
      {meshParts.map((partName) => {
        const meshNode = nodes[partName];
        const material = materials[`${partName}C`];

        if (!meshNode) return null;

        if (partName === "UpperFoam") {
          return (
            <mesh
              key={partName}
              geometry={meshNode.geometry}
              material={material}
              position={meshNode.position}
              rotation={meshNode.rotation}
              scale={meshNode.scale}
            >
              {snap.isFullTexture && (
                <Decal
                  position={[0, 0, 0]}
                  rotation={[0, 0, 0]}
                  scale={4.7}
                  map={fullTexture}
                >
                  <meshStandardMaterial
                    map={fullTexture}
                    polygonOffset
                    polygonOffsetFactor={-1}
                  />
                </Decal>
              )}
            </mesh>
          );
        }

        if (partName === "Ear") {
          return (
            <mesh
              key={partName}
              geometry={meshNode.geometry}
              material={material}
              position={meshNode.position}
              rotation={meshNode.rotation}
              scale={meshNode.scale}
            >
              {snap.isFullTexture && (
                <>
                  <Decal
                    position={[2, 0.3, 0]}
                    rotation={[1.2, 1, 2]}
                    scale={2.1}
                    map={fullTexture}
                  >
                    <meshStandardMaterial
                      map={fullTexture}
                      polygonOffset
                      polygonOffsetFactor={-1}
                    />
                  </Decal>
                  <Decal
                    position={[-2, -0.5, 0]}
                    rotation={[1.2, 1, 2]}
                    scale={2.1}
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
                <>
                  <Decal
                    position={[2.2, 0.5, 0]}
                    rotation={[0, 1.8, 0]}
                    scale={0.7}
                    map={logoTexture}
                    depthTest={false}
                    depthWrite={true}
                  />
                  <Decal
                    position={[-2.2, -0.7, 0]}
                    rotation={[4.1, -2.05, 4]}
                    scale={0.7}
                    map={logoTexture}
                    depthTest={false}
                    depthWrite={true}
                  />
                </>
              )}
            </mesh>
          );
        }

        return (
          <mesh
            key={partName}
            geometry={meshNode.geometry}
            material={material}
            position={meshNode.position}
            rotation={meshNode.rotation}
            scale={meshNode.scale}
          />
        );
      })}
    </group>
  );
}

// Model Selector Component
function ModelSelector() {
  const snap = useSnapshot(state);
  const primaryColor = snap.color;
  const primaryColorRgba = hexToRgba(primaryColor, 0.1);

  const mainModels = [
    { id: "headphones", name: "Headphones", icon: headphonesIcon },
    { id: "laptop", name: "Laptop", icon: laptopIcon },
  ];

  const additionalModels = [{ id: "cube", name: "Test Cube :)", icon: "" }];

  return (
    <div className="space-y-2">
      {/* Main models row */}
      <div className="flex gap-2 justify-center">
        {mainModels.map((model) => (
          <button
            key={model.id}
            onClick={() => (state.choice = model.id)}
            className={`flex items-center gap-2 border-2 transition-all duration-200 ${
              snap.choice === model.id
                ? "text-white"
                : "border-gray-200 hover:border-gray-300"
            }`}
            style={
              snap.choice === model.id
                ? {
                    borderColor: primaryColor,
                    backgroundColor: primaryColorRgba,
                    color: primaryColor,
                  }
                : {}
            }
          >
            <img
              src={model.icon}
              alt={model.name}
              className="w-auto h-32 object-contain"
              onError={(e) => {
                console.error(
                  `Failed to load icon for ${model.name}:`,
                  model.icon
                );
                e.target.style.display = "none";
                e.target.nextSibling.textContent = `${model.name} (No Icon)`;
              }}
            />
          </button>
        ))}
      </div>

      {/* Additional models row - stretched width */}
      <div className="flex justify-center">
        {additionalModels.map((model) => (
          <button
            key={model.id}
            onClick={() => (state.choice = model.id)}
            className={`flex items-center justify-center gap-2 px-6 py-4 rounded-lg border-2 transition-all duration-200 w-full max-w-md ${
              snap.choice === model.id
                ? "text-white"
                : "border-gray-200 hover:border-gray-300"
            }`}
            style={
              snap.choice === model.id
                ? {
                    borderColor: primaryColor,
                    backgroundColor: primaryColorRgba,
                    color: primaryColor,
                  }
                : {}
            }
          >
            <span className="text-2xl">{model.icon}</span>
            <span className="text-sm font-medium">{model.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Model Renderer Component
function ModelRenderer() {
  const snap = useSnapshot(state);

  switch (snap.choice) {
    case "headphones":
      return <Headphones />;
    case "laptop":
      return <Laptop />;
    case "cube":
      return <SimpleModel />;
    default:
      return <Headphones />;
  }
}

// Color Picker Component
function ColorPicker({ color, onChange }) {
  const predefinedColors = [
    "#8da291",
    "#6b8066",
    "#4a5a4e",
    "#2d3a2f",
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#f9ca24",
    "#f0932b",
    "#eb4d4b",
    "#6c5ce7",
    "#a29bfe",
    "#fd79a8",
    "#fdcb6e",
    "#e17055",
    "#00b894",
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-8 gap-2">
        {predefinedColors.map((presetColor) => (
          <button
            key={presetColor}
            onClick={() => onChange(presetColor)}
            className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
              color === presetColor
                ? "border-gray-800 ring-2 ring-gray-300"
                : "border-gray-200"
            }`}
            style={{ backgroundColor: presetColor }}
            title={presetColor}
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 rounded border-2 border-gray-200 cursor-pointer"
        />
        <div className="flex-1 text-center">
          <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {color.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DesignStudioPage() {
  const snap = useSnapshot(state);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic colors based on user selection
  const primaryColor = snap.color;
  const darkerColor = darkenColor(primaryColor, 20);
  const primaryColorRgba = hexToRgba(primaryColor, 0.1);

  const handleTextureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        fetch(dataUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            state.fullDecal = blobUrl;
            state.isFullTexture = true;
            console.log("Texture uploaded and converted to blob URL");
          })
          .catch((error) => {
            console.error("Error converting texture:", error);
            state.fullDecal = dataUrl;
            state.isFullTexture = true;
          });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        state.logoDecal = e.target.result;
        state.isLogoTexture = true;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: `${snap.color}10` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D Viewer with Model Selector underneath */}
          <div className="lg:col-span-2 space-y-4">
            {/* 3D Canvas */}
            <div
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
              style={{ boxShadow: `0 10px 25px ${snap.color}20` }}
            >
              <div className="h-96 md:h-[500px] lg:h-[600px]">
                <Canvas
                  shadows
                  camera={{
                    position: [0, 0, 4],
                    fov: 75,
                    near: 0.1,
                    far: 200,
                  }}
                  gl={{ antialias: true, preserveDrawingBuffer: true }}
                >
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight
                      position={[10, 10, 10]}
                      intensity={1}
                      castShadow
                      shadow-mapSize-width={2048}
                      shadow-mapSize-height={2048}
                    />
                    <pointLight position={[-10, -10, -10]} intensity={0.3} />
                    <pointLight position={[10, -10, 10]} intensity={0.2} />

                    <ModelRenderer />
                  </Suspense>
                  <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={4}
                    maxDistance={20}
                    target={[0, 0, 0]}
                    autoRotate={false}
                    enableDamping={true}
                    dampingFactor={0.05}
                  />
                </Canvas>
              </div>
            </div>

            {/* Model Selection Panel */}
            <ModelSelector />
          </div>

          {/* Dynamic Color Controls Panel */}
          <div className="space-y-4">
            {/* Color Selection */}
            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300"
              style={{ boxShadow: `0 4px 12px ${snap.color}15` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${snap.color}, ${snap.color}CC)`,
                  }}
                >
                  <IoColorPalette className="text-white text-sm" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Warna</h3>
              </div>

              <ColorPicker
                color={snap.color}
                onChange={(color) => (state.color = color)}
              />
            </div>

            {/* Texture Upload */}
            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300"
              style={{ boxShadow: `0 4px 12px ${snap.color}15` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${snap.color}, ${snap.color}CC)`,
                  }}
                >
                  <IoCloudUpload className="text-white text-sm" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Personalisasi
                </h3>
              </div>

              <div className="space-y-3">
                {/* Full Texture */}
                <div className="group">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Tekstur
                  </label>
                  <div
                    className="relative border-2 border-dashed border-gray-200 rounded-lg p-3 text-center transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: "rgb(229, 231, 235)",
                      ":hover": {
                        borderColor: snap.color,
                        backgroundColor: `${snap.color}08`,
                      },
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = snap.color;
                      e.target.style.backgroundColor = `${snap.color}08`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "rgb(229, 231, 235)";
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    <input
                      type="file"
                      id="texture-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleTextureUpload}
                    />
                    <label htmlFor="texture-upload" className="cursor-pointer">
                      <div
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 transition-all duration-200 group-hover:text-white"
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = snap.color;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "rgb(243, 244, 246)";
                        }}
                      >
                        <IoCloudUpload className="text-sm" />
                      </div>
                      <p
                        className="text-xs font-medium text-gray-700 transition-colors duration-200"
                        onMouseEnter={(e) => {
                          e.target.style.color = snap.color;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "rgb(55, 65, 81)";
                        }}
                      >
                        {snap.fullDecal !== "/texture_default.png"
                          ? "Ganti"
                          : "Upload"}
                      </p>
                    </label>
                  </div>

                  {snap.fullDecal !== "/texture_default.png" && (
                    <div
                      className="mt-2 flex items-center gap-1 text-xs font-medium px-2 py-1 rounded"
                      style={{
                        color: snap.color,
                        backgroundColor: `${snap.color}15`,
                      }}
                    >
                      <IoCheckmarkCircle className="text-sm" />
                      <span>Uploaded</span>
                    </div>
                  )}
                </div>

                {/* Logo Upload */}
                <div className="group">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Logo
                  </label>
                  <div
                    className="relative border-2 border-dashed border-gray-200 rounded-lg p-3 text-center transition-all duration-200 cursor-pointer"
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = snap.color;
                      e.target.style.backgroundColor = `${snap.color}08`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "rgb(229, 231, 235)";
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <div
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 transition-all duration-200 group-hover:text-white"
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = snap.color;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "rgb(243, 244, 246)";
                        }}
                      >
                        <IoCloudUpload className="text-sm" />
                      </div>
                      <p
                        className="text-xs font-medium text-gray-700 transition-colors duration-200"
                        onMouseEnter={(e) => {
                          e.target.style.color = snap.color;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "rgb(55, 65, 81)";
                        }}
                      >
                        {snap.logoDecal !== "/logo_default.png"
                          ? "Ganti"
                          : "Upload"}
                      </p>
                    </label>
                  </div>

                  {snap.logoDecal !== "/logo_default.png" && (
                    <div
                      className="mt-2 flex items-center gap-1 text-xs font-medium px-2 py-1 rounded"
                      style={{
                        color: snap.color,
                        backgroundColor: `${snap.color}15`,
                      }}
                    >
                      <IoCheckmarkCircle className="text-sm" />
                      <span>Uploaded</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Toggle Options */}
            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300"
              style={{ boxShadow: `0 4px 12px ${snap.color}15` }}
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Pengaturan
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${snap.color}, ${snap.color}CC)`,
                      }}
                    ></div>
                    <span className="text-xs font-medium text-gray-700">
                      Tekstur
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={snap.isFullTexture}
                      onChange={(e) => (state.isFullTexture = e.target.checked)}
                      className="sr-only peer"
                    />
                    <div
                      className="relative w-8 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"
                      style={{
                        backgroundColor: snap.isFullTexture
                          ? snap.color
                          : "rgb(229, 231, 235)",
                        boxShadow: snap.isFullTexture
                          ? `0 0 8px ${snap.color}40`
                          : "none",
                      }}
                    ></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${snap.color}, ${snap.color}CC)`,
                      }}
                    ></div>
                    <span className="text-xs font-medium text-gray-700">
                      Logo
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={snap.isLogoTexture}
                      onChange={(e) => (state.isLogoTexture = e.target.checked)}
                      className="sr-only peer"
                    />
                    <div
                      className="relative w-8 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"
                      style={{
                        backgroundColor: snap.isLogoTexture
                          ? snap.color
                          : "rgb(229, 231, 235)",
                        boxShadow: snap.isLogoTexture
                          ? `0 0 8px ${snap.color}40`
                          : "none",
                      }}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

useGLTF.preload("/headphones.glb");
useGLTF.preload("/laptop.glb");
