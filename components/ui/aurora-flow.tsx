"use client";

import React, { useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface AuroraFlowProps {
  colors?: string[];
  speed?: number;
}

export function AuroraFlow({ 
  colors = ["rgba(91, 155, 213, 0.15)", "rgba(125, 211, 192, 0.15)", "rgba(155, 143, 184, 0.15)"],
  speed = 0.5
}: AuroraFlowProps) {
  return (
    <div className="absolute inset-0" style={{ zIndex: 0, width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true
        }}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
      >
        <AuroraBackground colors={colors} speed={speed} />
      </Canvas>
    </div>
  );
}

// Aurora-like flowing background
const AuroraBackground = ({ colors, speed }: { colors: string[]; speed: number }) => {
  const { scene, size, viewport } = useThree();
  
  useEffect(() => {
    // Create a plane that covers the entire viewport
    const geometry = new THREE.PlaneGeometry(viewport.width * 2, viewport.height * 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        speed: { value: speed },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        color1: { value: new THREE.Color(colors[0] || "#5b9bd5") },
        color2: { value: new THREE.Color(colors[1] || "#7dd3c0") },
        color3: { value: new THREE.Color(colors[2] || "#9b8fb8") }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float speed;
        uniform vec2 resolution;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        varying vec2 vUv;
        
        // Simplex noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                             -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {
          vec2 uv = vUv;
          
          // Create flowing aurora-like patterns with adjustable speed
          float flow1 = snoise(vec2(uv.x * 2.0 + time * 0.1 * speed, uv.y * 0.5 + time * 0.05 * speed));
          float flow2 = snoise(vec2(uv.x * 1.5 + time * 0.08 * speed, uv.y * 0.8 + time * 0.03 * speed));
          float flow3 = snoise(vec2(uv.x * 3.0 + time * 0.12 * speed, uv.y * 0.3 + time * 0.07 * speed));
          
          // Create streaky patterns like in the image
          float streaks = sin((uv.x + flow1 * 0.3) * 8.0 + time * 0.2 * speed) * 0.5 + 0.5;
          streaks *= sin((uv.y + flow2 * 0.2) * 12.0 + time * 0.15 * speed) * 0.5 + 0.5;
          
          // Combine flows for aurora effect
          float aurora = (flow1 + flow2 + flow3) * 0.33 + 0.5;
          aurora = pow(aurora, 2.0);
          
          // Create flowing color transitions with custom colors
          vec3 color = vec3(0.04, 0.06, 0.1); // Dark background
          
          // Add color1 flows (Blue)
          float color1Flow = smoothstep(0.3, 0.7, aurora + streaks * 0.3);
          color = mix(color, color1 * 0.3, color1Flow * 0.5);
          
          // Add color2 highlights (Teal)
          float color2Flow = smoothstep(0.6, 0.9, aurora + flow1 * 0.4);
          color = mix(color, color2 * 0.4, color2Flow * 0.6);
          
          // Add color3 streaks (Purple)
          float color3Flow = smoothstep(0.7, 0.95, flow3 + streaks * 0.2);
          color = mix(color, color3 * 0.35, color3Flow * 0.5);
          
          // Add subtle noise texture
          float noise = snoise(uv * 100.0) * 0.02;
          color += noise;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -1;
    scene.add(mesh);
    
    const animate = () => {
      material.uniforms.time.value += 0.01 * speed;
      requestAnimationFrame(animate);
    };
    animate();
    
    return () => {
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
    };
  }, [scene, speed, colors, viewport.width, viewport.height]);
  
  return null;
};
