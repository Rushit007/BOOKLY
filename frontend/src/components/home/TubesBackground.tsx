'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Renderer, Camera, Transform, Mesh, Program, Cylinder } from 'ogl';

// Curated Bookly theme color palettes
const THEME_PALETTES = {
  light: {
    tubes: ['#1c1917', '#f59e0b', '#2563eb'],
    lights: ['#f59e0b', '#db2777', '#2563eb', '#059669'],
  },
  dark: {
    tubes: ['#ffe17c', '#38bdf8', '#ec4899'],
    lights: ['#ffe17c', '#38bdf8', '#a78bfa', '#10b981'],
  },
  randomPool: [
    '#ffe17c',
    '#1c1917',
    '#f59e0b',
    '#2563eb',
    '#db2777',
    '#059669',
    '#7c3aed',
    '#ea580c',
    '#38bdf8',
    '#ec4899',
  ],
};

function getRandomColors(count: number): string[] {
  const pool = [...THEME_PALETTES.randomPool];
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool[idx]);
    pool.splice(idx, 1);
    if (pool.length === 0) pool.push(...THEME_PALETTES.randomPool);
  }
  return result;
}

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
}

export function TubesBackground({
  children,
  className = '',
  enableClickInteraction = true,
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tubesRef = useRef<any>(null);
  const fallbackCleanupRef = useRef<(() => void) | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Check dark mode
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();

    const obs = new MutationObserver(checkDark);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // Initialize TubesCursor or Fallback
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!canvasRef.current || !containerRef.current) return;

      const palette = isDark ? THEME_PALETTES.dark : THEME_PALETTES.light;

      try {
        // Dynamic import from CDN using runtime eval so Next.js Turbopack does not bundle or fail at build time
        const dynamicImport = new Function('url', 'return import(url)');
        const module = await dynamicImport(
          'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'
        );

        if (!mounted || !canvasRef.current) return;

        const TubesCursor = module.default;
        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: palette.tubes,
            lights: {
              intensity: 220,
              colors: palette.lights,
            },
          },
        });

        tubesRef.current = app;
        setIsLoaded(true);
      } catch (err) {
        // Fallback: If CDN is unreachable (e.g. offline/network firewall), start high-performance 3D OGL Tubes
        if (!mounted || !canvasRef.current || !containerRef.current) return;
        startOglTubesFallback(canvasRef.current, containerRef.current, palette, fallbackCleanupRef);
        setIsLoaded(true);
      }
    };

    init();

    return () => {
      mounted = false;
      if (fallbackCleanupRef.current) {
        fallbackCleanupRef.current();
        fallbackCleanupRef.current = null;
      }
      if (tubesRef.current && typeof tubesRef.current.destroy === 'function') {
        try {
          tubesRef.current.destroy();
        } catch {}
      }
      tubesRef.current = null;
    };
  }, [isDark]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Don't trigger randomize if clicking interactive buttons or links
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, select, textarea, [data-cursor="interactive"]')) {
        return;
      }

      if (!enableClickInteraction) return;

      const newTubesColors = getRandomColors(3);
      const newLightsColors = getRandomColors(4);

      if (tubesRef.current?.tubes?.setColors) {
        try {
          tubesRef.current.tubes.setColors(newTubesColors);
          tubesRef.current.tubes.setLightsColors(newLightsColors);
        } catch {}
      }
    },
    [enableClickInteraction]
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none ${className}`}
      onClick={handleClick}
      style={{ touchAction: 'pan-y' }}
    >
      {/* ── 3D Interactive Neon Tubes Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: 1,
          opacity: 0.9,
          mixBlendMode: isDark ? 'screen' : 'multiply',
        }}
      />

      {/* ── Content Overlay ── */}
      <div className="relative z-10 w-full pointer-events-auto">
        {children}
      </div>

      {/* ── Subtle Interactive Hint ── */}
      <div className="absolute bottom-3 right-6 z-20 pointer-events-none hidden sm:flex items-center gap-2 bg-black/40 dark:bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-black/20 dark:border-white/20">
        <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping" />
        <span className="font-editorial-mono text-[10px] font-bold text-white uppercase tracking-widest">
          3D Tubes Cursor · Click to recolor
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Robust OGL 3D Tubes Simulation Fallback
// Guaranteed to run at 60fps even if external CDN is blocked/offline
// ─────────────────────────────────────────────────────────────────────────────
function startOglTubesFallback(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  palette: { tubes: string[]; lights: string[] },
  cleanupRef: React.MutableRefObject<(() => void) | null>
) {
  let renderer: Renderer;
  try {
    renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 2, 2),
    });
  } catch {
    return;
  }

  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);

  const scene = new Transform();
  const camera = new Camera(gl, { fov: 45 });
  camera.position.set(0, 0, 15);

  function resize() {
    if (!container) return;
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || 600;
    renderer.setSize(w, h);
    camera.perspective({ aspect: w / h });
  }

  resize();
  window.addEventListener('resize', resize);

  // 3D segmented tubular joint chain
  const segments = 32;
  const cylinderGeo = new Cylinder(gl, {
    radiusTop: 0.22,
    radiusBottom: 0.22,
    height: 0.6,
    radialSegments: 16,
  });

  const vertexShader = `
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;
    varying vec3 vNormal;
    varying vec2 vUv;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;
    varying vec3 vNormal;
    varying vec2 vUv;
    uniform vec3 uColor;
    uniform vec3 uLightColor;
    uniform float uTime;
    void main() {
      vec3 lightDir = normalize(vec3(sin(uTime), cos(uTime), 1.0));
      float diff = max(dot(vNormal, lightDir), 0.0) * 0.7 + 0.3;
      float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
      rim = pow(rim, 2.5);
      vec3 col = mix(uColor, uLightColor, rim) * diff;
      gl_FragColor = vec4(col, 0.92);
    }
  `;

  const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '');
    return [
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255,
    ];
  };

  const tubeColor = hexToRgb(palette.tubes[0] || '#f59e0b');
  const lightColor = hexToRgb(palette.lights[0] || '#2563eb');

  const program = new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader,
    uniforms: {
      uColor: { value: tubeColor },
      uLightColor: { value: lightColor },
      uTime: { value: 0 },
    },
    transparent: true,
  });

  const meshes: Mesh[] = [];
  const points: { x: number; y: number; z: number }[] = [];

  for (let i = 0; i < segments; i++) {
    const m = new Mesh(gl, { geometry: cylinderGeo, program });
    m.setParent(scene);
    meshes.push(m);
    points.push({ x: 0, y: 0, z: 0 });
  }

  let mouseX = 0;
  let mouseY = 0;

  function onMouseMove(e: MouseEvent) {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mouseX = x * 8;
    mouseY = y * 5;
  }

  container.addEventListener('mousemove', onMouseMove, { passive: true });

  let rafId = 0;
  let time = 0;

  function render() {
    rafId = requestAnimationFrame(render);
    time += 0.02;
    program.uniforms.uTime.value = time;

    // Follow cursor with fluid spring delay
    points[0].x += (mouseX - points[0].x) * 0.15;
    points[0].y += (mouseY - points[0].y) * 0.15;

    for (let i = 1; i < segments; i++) {
      points[i].x += (points[i - 1].x - points[i].x) * 0.35;
      points[i].y += (points[i - 1].y - points[i].y) * 0.35;
      points[i].z = Math.sin(time + i * 0.2) * 0.8;

      const m = meshes[i];
      m.position.set(points[i].x, points[i].y, points[i].z);

      const dx = points[i - 1].x - points[i].x;
      const dy = points[i - 1].y - points[i].y;
      m.rotation.z = Math.atan2(dy, dx) - Math.PI / 2;
    }

    renderer.render({ scene, camera });
  }

  render();

  cleanupRef.current = () => {
    window.removeEventListener('resize', resize);
    container.removeEventListener('mousemove', onMouseMove);
    cancelAnimationFrame(rafId);
  };
}

export default TubesBackground;
