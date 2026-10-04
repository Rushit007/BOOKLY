'use client';

/**
 * Ribbons Component
 * High-performance WebGL interactive ribbon effect using OGL Polyline.
 * Features fluid, spring-based motion that follows the mouse/touch position.
 * Optimized with zero-teardown WebGL lifecycle and dynamic uniform updates.
 */

import React, { useEffect, useRef } from 'react';
import { Renderer, Transform, Vec3, Color, Polyline } from 'ogl';

export interface RibbonsProps {
  /** Array of hex color strings for the ribbons */
  colors?: string[];
  /** Spring tension for the movement (lower = more fluid) */
  baseSpring?: number;
  /** Friction for the movement (lower = more drift) */
  baseFriction?: number;
  /** Thickness of the ribbons in pixels */
  baseThickness?: number;
  /** Horizontal offset factor between multiple ribbons */
  offsetFactor?: number;
  /** Max lifetime/length of the trail */
  maxAge?: number;
  /** Number of points defining each ribbon curve */
  pointCount?: number;
  /** Speed multiplier for movement interpolation */
  speedMultiplier?: number;
  /** Enable transparency fade at the end of the ribbon */
  enableFade?: boolean;
  /** Enable wave-like shader distortion effect */
  enableShaderEffect?: boolean;
  /** Amplitude of the shader distortion */
  effectAmplitude?: number;
  /** Background clear color [r, g, b, a] */
  backgroundColor?: number[];
  /** Whether mouse events track across the entire window (for global cursor trail) */
  isGlobal?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Ribbons: React.FC<RibbonsProps> = ({
  colors = ['#1A1A1B', '#ffe17c'],
  baseSpring = 0.035,
  baseFriction = 0.88,
  baseThickness = 32,
  offsetFactor = 0.04,
  maxAge = 550,
  pointCount = 50,
  speedMultiplier = 0.55,
  enableFade = true,
  enableShaderEffect = true,
  effectAmplitude = 1.5,
  backgroundColor = [0, 0, 0, 0],
  isGlobal = false,
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep latest prop values in refs so WebGL loop updates live WITHOUT tearing down context
  const propsRef = useRef({
    colors,
    baseSpring,
    baseFriction,
    baseThickness,
    offsetFactor,
    maxAge,
    speedMultiplier,
    enableShaderEffect,
    effectAmplitude,
    enableFade,
  });

  useEffect(() => {
    propsRef.current = {
      colors,
      baseSpring,
      baseFriction,
      baseThickness,
      offsetFactor,
      maxAge,
      speedMultiplier,
      enableShaderEffect,
      effectAmplitude,
      enableFade,
    };
  }, [
    colors,
    baseSpring,
    baseFriction,
    baseThickness,
    offsetFactor,
    maxAge,
    speedMultiplier,
    enableShaderEffect,
    effectAmplitude,
    enableFade,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio || 2, 2),
        alpha: true,
        premultipliedAlpha: false,
      });
    } catch {
      return;
    }

    const gl = renderer.gl;

    if (Array.isArray(backgroundColor) && backgroundColor.length === 4) {
      gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], backgroundColor[3]);
    } else {
      gl.clearColor(0, 0, 0, 0);
    }

    gl.canvas.style.position = 'absolute';
    gl.canvas.style.top = '0';
    gl.canvas.style.left = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.pointerEvents = 'none';
    container.appendChild(gl.canvas);

    const scene = new Transform();
    const lines: {
      spring: number;
      friction: number;
      mouseVelocity: Vec3;
      mouseOffset: Vec3;
      points: Vec3[];
      polyline: Polyline;
    }[] = [];

    const vertex = `
      precision highp float;
      
      attribute vec3 position;
      attribute vec3 next;
      attribute vec3 prev;
      attribute vec2 uv;
      attribute float side;
      
      uniform vec2 uResolution;
      uniform float uDPR;
      uniform float uThickness;
      uniform float uTime;
      uniform float uEnableShaderEffect;
      uniform float uEffectAmplitude;
      
      varying vec2 vUV;
      
      vec4 getPosition() {
          vec4 current = vec4(position, 1.0);
          vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
          vec2 nextScreen = next.xy * aspect;
          vec2 prevScreen = prev.xy * aspect;
          vec2 diff = nextScreen - prevScreen;
          float len = length(diff);
          vec2 tangent = len > 0.0001 ? diff / len : vec2(1.0, 0.0);
          vec2 normal = vec2(-tangent.y, tangent.x);
          normal /= aspect;
          normal *= mix(1.0, 0.2, pow(abs(uv.y - 0.5) * 2.0, 2.0));
          float dist = len;
          normal *= mix(0.4, 1.0, smoothstep(0.0, 0.015, dist));
          float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
          float pixelWidth = current.w * pixelWidthRatio;
          normal *= pixelWidth * uThickness * 1.5;
          current.xy -= normal * side;
          if(uEnableShaderEffect > 0.5) {
            current.xy += normal * sin(uTime + current.x * 10.0) * uEffectAmplitude;
          }
          return current;
      }
      
      void main() {
          vUV = uv;
          gl_Position = getPosition();
      }
    `;

    const fragment = `
      precision highp float;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uEnableFade;
      varying vec2 vUV;
      void main() {
          float fadeFactor = 1.0;
          if(uEnableFade > 0.5) {
              fadeFactor = 1.0 - smoothstep(0.15, 1.0, vUV.y);
          }
          gl_FragColor = vec4(uColor, uOpacity * fadeFactor);
      }
    `;

    function resize() {
      if (!container) return;
      const width = isGlobal ? window.innerWidth : (container.clientWidth || window.innerWidth);
      const height = isGlobal ? window.innerHeight : (container.clientHeight || window.innerHeight);
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height);
      lines.forEach(line => line.polyline.resize());
    }

    window.addEventListener('resize', resize);

    const initialColors = propsRef.current.colors;
    const center = (initialColors.length - 1) / 2;

    initialColors.forEach((color, index) => {
      const spring = baseSpring + (Math.random() - 0.5) * 0.01;
      const friction = baseFriction + (Math.random() - 0.5) * 0.02;
      const thickness = baseThickness + (Math.random() - 0.5) * 4;
      const mouseOffset = new Vec3(
        (index - center) * offsetFactor,
        (Math.random() - 0.5) * 0.02,
        0
      );

      const count = pointCount;
      const points: Vec3[] = [];
      for (let i = 0; i < count; i++) {
        points.push(new Vec3(0, 0, 0));
      }

      const polyline = new Polyline(gl, {
        points,
        vertex,
        fragment,
        uniforms: {
          uColor: { value: new Color(color) },
          uThickness: { value: thickness },
          uOpacity: { value: 0.95 },
          uTime: { value: 0.0 },
          uEnableShaderEffect: { value: enableShaderEffect ? 1.0 : 0.0 },
          uEffectAmplitude: { value: effectAmplitude },
          uEnableFade: { value: enableFade ? 1.0 : 0.0 },
        },
      });

      polyline.mesh.setParent(scene);

      lines.push({
        spring,
        friction,
        mouseVelocity: new Vec3(),
        mouseOffset,
        points,
        polyline,
      });
    });

    resize();

    const mouse = new Vec3(0, 0, 0);
    let hasMoved = false;

    function updateMouse(e: MouseEvent | TouchEvent) {
      if (!container) return;
      const width = isGlobal ? window.innerWidth : (container.clientWidth || window.innerWidth);
      const height = isGlobal ? window.innerHeight : (container.clientHeight || window.innerHeight);
      const rect = isGlobal ? { left: 0, top: 0 } : container.getBoundingClientRect();

      let clientX = 0;
      let clientY = 0;
      if ('changedTouches' in e && e.changedTouches.length) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      mouse.set((x / width) * 2 - 1, (y / height) * -2 + 1, 0);

      if (!hasMoved) {
        hasMoved = true;
        lines.forEach(line => {
          line.points.forEach(p => p.copy(mouse).add(line.mouseOffset));
          line.polyline.updateGeometry();
        });
      }
    }

    const targetElement = isGlobal ? window : container;
    targetElement.addEventListener('mousemove', updateMouse as EventListener, { passive: true });
    targetElement.addEventListener('touchstart', updateMouse as EventListener, { passive: true });
    targetElement.addEventListener('touchmove', updateMouse as EventListener, { passive: true });

    let frameId: number;
    let lastTime = performance.now();

    function update() {
      frameId = requestAnimationFrame(update);
      const currentTime = performance.now();
      const dt = currentTime - lastTime;
      lastTime = currentTime;

      const p = propsRef.current;

      if (hasMoved) {
        lines.forEach((line, index) => {
          // Dynamic color update if colors changed
          if (p.colors[index] && line.polyline.mesh.program.uniforms.uColor) {
            line.polyline.mesh.program.uniforms.uColor.value.set(p.colors[index]);
          }
          if (line.polyline.mesh.program.uniforms.uThickness) {
            line.polyline.mesh.program.uniforms.uThickness.value = p.baseThickness;
          }

          const tmp = new Vec3();
          tmp.copy(mouse).add(line.mouseOffset).sub(line.points[0]).multiply(line.spring);
          line.mouseVelocity.add(tmp).multiply(line.friction);
          line.points[0].add(line.mouseVelocity);

          for (let i = 1; i < line.points.length; i++) {
            if (isFinite(p.maxAge) && p.maxAge > 0) {
              const segmentDelay = p.maxAge / (line.points.length - 1);
              const alpha = Math.min(1, (dt * p.speedMultiplier) / segmentDelay);
              line.points[i].lerp(line.points[i - 1], alpha);
            } else {
              line.points[i].lerp(line.points[i - 1], 0.9);
            }
          }

          if (line.polyline.mesh.program.uniforms.uTime) {
            line.polyline.mesh.program.uniforms.uTime.value = currentTime * 0.001;
          }
          line.polyline.updateGeometry();
        });
      }

      renderer.render({ scene });
    }

    update();

    return () => {
      window.removeEventListener('resize', resize);
      targetElement.removeEventListener('mousemove', updateMouse as EventListener);
      targetElement.removeEventListener('touchstart', updateMouse as EventListener);
      targetElement.removeEventListener('touchmove', updateMouse as EventListener);
      cancelAnimationFrame(frameId);
      if (gl.canvas && gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
    };
  }, []); // Mount ONCE - properties update live via propsRef without tearing down WebGL!

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full pointer-events-none select-none ${className}`}
      style={style}
    />
  );
};

export default Ribbons;
