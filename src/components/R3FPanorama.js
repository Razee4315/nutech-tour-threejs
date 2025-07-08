import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';

// Helper function to convert pitch and yaw to 3D position
const sphericalToCartesian = (pitchPannellum, yawPannellum, radius) => {
  const phi = THREE.MathUtils.degToRad(90 - pitchPannellum);
  // theta calculation for correct orientation with sphere rotation and camera view:
  // yawPannellum = 0 (front of texture) should be on -Z axis (theta = PI or 180deg).
  // yawPannellum = 90 (right on texture) should be on +X axis (theta = PI/2 or 90deg).
  const theta = THREE.MathUtils.degToRad(180 - yawPannellum);

  // Standard spherical to Cartesian conversion:
  const x = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);
  return new THREE.Vector3(x, y, z);
};

const PanoramaSphere = ({ image, onLoad, autoRotate, autoRotateSpeed }) => {
  const texture = useLoader(THREE.TextureLoader, image);
  const meshRef = useRef();

  useEffect(() => {
    if (texture && onLoad) {
      onLoad();
    }
  }, [texture, onLoad]);

  useFrame((state, delta) => {
    if (autoRotate && meshRef.current) {
      // Y-axis rotation for auto-rotate. Speed is applied per frame.
      meshRef.current.rotation.y -= autoRotateSpeed * delta;
    }
  });

  return (
    // Rotate sphere by -90deg on Y so texture center (Pannellum yaw 0, assumed to be on local -X after scale) faces -Z (camera front).
    <mesh ref={meshRef} scale={[-1, 1, 1]} rotation={[0, -Math.PI / 2, 0]}> 
      <sphereGeometry args={[500, 60, 40]} />
      {texture && <meshBasicMaterial map={texture} side={THREE.BackSide} />}
    </mesh>
  );
};

const Hotspot = ({ spot, onHotspotClickCallback }) => {
  const { pitch, yaw, text, type } = spot;
  const position = useMemo(() => sphericalToCartesian(pitch, yaw, 480), [pitch, yaw]);
  const [isHovered, setIsHovered] = useState(false);

  const iconPath = process.env.PUBLIC_URL + '/icons/man-walking.png'; // Using process.env.PUBLIC_URL

  const handleInternalClick = (e) => {
    e.stopPropagation();
    if (type === 'custom' && onHotspotClickCallback) {
      onHotspotClickCallback(spot);
    }
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  };

  const baseStyle = {
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease-out', // Added transform transition for hover effect
    width: '36px', // Standard size for icon hotspots
    height: '36px',
    borderRadius: '50%',
    boxSizing: 'border-box',
    padding: '0',
  };

  const customHotspotStyle = {
    ...baseStyle,
    background: 'transparent', // Transparent background for image icon
    border: 'none', // No border for image icon
  };

  const infoHotspotStyle = {
    ...baseStyle,
    background: 'rgba(0, 0, 0, 0.6)', // Blackish background for info
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    border: '1px solid rgba(255,255,255,0.4)',
    width: '32px', // Reset size if different from custom
    height: '32px',
  };
  
  const tooltipStyle = {
    position: 'absolute',
    bottom: '130%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    color: 'white',
    padding: '7px 12px',
    borderRadius: '5px',
    fontSize: '14px',
    whiteSpace: 'normal',
    width: 'max-content',
    maxWidth: '230px',
    zIndex: 10000,
    textAlign: 'center',
    boxShadow: '0px 2px 6px rgba(0,0,0,0.25)',
    opacity: isHovered ? 1 : 0,
    visibility: isHovered ? 'visible' : 'hidden',
    transition: 'opacity 0.2s ease-out, visibility 0.2s ease-out',
  };

  let currentStyle = {};
  let content = null;
  let hoverEffectStyle = {};

  if (type === 'info') {
    currentStyle = infoHotspotStyle;
    content = 'i';
    hoverEffectStyle = { backgroundColor: 'rgba(0, 0, 0, 0.8)' };
  } else if (type === 'custom') {
    currentStyle = customHotspotStyle;
    content = <img src={iconPath} alt={text || 'Navigate'} style={{ width: '100%', height: '100%' }} />;
    hoverEffectStyle = { transform: 'scale(1.1)' }; // Scale up image on hover
  }

  const elementId = `hotspot-${type}-${spot.id || spot.yaw || spot.pitch}`;

  return (
    <group position={position}>
      <Html center>
        <div
          id={elementId}
          style={isHovered ? { ...currentStyle, ...hoverEffectStyle } : currentStyle}
          onClick={handleInternalClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          {content}
          <div style={tooltipStyle}>
            {text}
          </div>
        </div>
      </Html>
    </group>
  );
};

const R3FPanorama = ({
  image,
  initialPitch = 0,
  initialYaw = 0,
  hfov = 110,
  autoRotate = false,
  autoRotateSpeed = 0.005,
  hotSpots = [],
  onHotspotClick,
  onLoad,
}) => {
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      const phi = THREE.MathUtils.degToRad(90 - initialPitch);
      const theta = THREE.MathUtils.degToRad(-initialYaw);
      controlsRef.current.object.position.setFromSphericalCoords(1, phi, theta);
      controlsRef.current.update();
    }
  }, [initialPitch, initialYaw, controlsRef]);

  const cameraFov = useMemo(() => {
    const aspect = typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 16/9;
    const hfovRad = THREE.MathUtils.degToRad(hfov);
    const vfovRad = 2 * Math.atan(Math.tan(hfovRad / 2) * (1 / aspect));
    return THREE.MathUtils.radToDeg(vfovRad);
  }, [hfov]);

  return (
    <Canvas style={{ background: '#000' }}>
      <PerspectiveCamera makeDefault fov={cameraFov} position={[0, 0, 0.1]} />
      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={false}
        rotateSpeed={-0.5}
        minPolarAngle={THREE.MathUtils.degToRad(5)}
        maxPolarAngle={THREE.MathUtils.degToRad(175)}
        target={[0,0,0]}
      />
      <PanoramaSphere image={image} onLoad={onLoad} autoRotate={autoRotate} autoRotateSpeed={autoRotateSpeed} />
      {hotSpots.map((spot, index) => (
        <Hotspot
          key={spot.id || spot.yaw || spot.pitch || index} 
          spot={spot}
          onHotspotClickCallback={onHotspotClick}
        />
      ))}
    </Canvas>
  );
};

export default R3FPanorama; 