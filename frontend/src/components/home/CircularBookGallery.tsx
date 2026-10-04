'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { Book } from '../../types/book';
import { generateBookCoverSvg, VERIFIED_BOOK_COVERS } from '../../utils/bookCovers';

type GL = Renderer['gl'];

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: any): void {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function getFontSize(font: string): number {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 28;
}

function createTextTexture(
  gl: GL,
  text: string,
  font: string = 'bold 26px "Cabinet Grotesk", sans-serif',
  color: string = '#ffe17c'
): { texture: Texture; width: number; height: number } {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get 2d context');

  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const fontSize = getFontSize(font);
  const textHeight = Math.ceil(fontSize * 1.3);

  canvas.width = textWidth + 30;
  canvas.height = textHeight + 20;

  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

interface TitleProps {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor?: string;
  font?: string;
}

class Title {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor: string;
  font: string;
  mesh!: Mesh;

  constructor({ gl, plane, renderer, text, textColor = '#ffe17c', font = 'bold 24px sans-serif' }: TitleProps) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeightScaled = this.plane.scale.y * 0.14;
    const textWidthScaled = textHeightScaled * aspect;
    this.mesh.scale.set(textWidthScaled, textHeightScaled, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeightScaled * 0.5 - 0.08;
    this.mesh.setParent(this.plane);
  }
}

interface ScreenSize {
  width: number;
  height: number;
}

interface Viewport {
  width: number;
  height: number;
}

interface GalleryItem {
  id: string;
  image: string;
  text: string;
  author: string;
  price: number;
  category: string;
}

interface MediaProps {
  geometry: Plane;
  gl: GL;
  item: GalleryItem;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius?: number;
  font?: string;
}

class Media {
  extra: number = 0;
  geometry: Plane;
  gl: GL;
  item: GalleryItem;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius: number;
  font?: string;
  program!: Program;
  plane!: Mesh;
  title!: Title;
  scale!: number;
  padding!: number;
  width!: number;
  widthTotal!: number;
  x!: number;
  speed: number = 0;
  isBefore: boolean = false;
  isAfter: boolean = false;

  constructor({
    geometry,
    gl,
    item,
    index,
    length,
    renderer,
    scene,
    screen,
    viewport,
    bend,
    textColor,
    borderRadius = 0.06,
    font,
  }: MediaProps) {
    this.geometry = geometry;
    this.gl = gl;
    this.item = item;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = item.text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: true,
    });

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          // Subtle warm tint matching neo-brutalist palette
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [600, 900] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });

    const fallbackCoverSvg = generateBookCoverSvg({
      title: this.item.text,
      author: this.item.author,
      category: this.item.category,
    });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth || 600, img.naturalHeight || 900];
    };
    img.onerror = () => {
      // Fallback instantly to high-res SVG cover
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        texture.image = fallbackImg;
        this.program.uniforms.uImageSizes.value = [600, 900];
      };
      fallbackImg.src = fallbackCoverSvg;
    };
    img.src = this.item.image || fallbackCoverSvg;
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    });
  }

  update(scroll: { current: number; last: number }, direction: 'right' | 'left') {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(Math.max(0.001, R * R - effectiveX * effectiveX));
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport }: { screen?: ScreenSize; viewport?: Viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    this.scale = this.screen.height / 1400;
    // 3:4 aspect ratio for book covers
    this.plane.scale.y = (this.viewport.height * (780 * this.scale)) / this.screen.height;
    this.plane.scale.x = this.plane.scale.y * 0.68;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 1.6;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

interface AppConfig {
  items: GalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  onActiveIndexChange?: (index: number) => void;
}

class AppCore {
  container: HTMLElement;
  scrollSpeed: number;
  scroll: {
    ease: number;
    current: number;
    target: number;
    last: number;
    position?: number;
  };
  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  medias: Media[] = [];
  galleryItems: GalleryItem[] = [];
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  raf: number = 0;
  isDown: boolean = false;
  start: number = 0;
  onActiveIndexChange?: (index: number) => void;
  lastActiveIdx: number = -1;

  boundOnResize!: () => void;
  boundOnWheel!: (e: Event) => void;
  boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchUp!: () => void;

  constructor(
    container: HTMLElement,
    {
      items,
      bend = 3,
      textColor = '#ffe17c',
      borderRadius = 0.06,
      font = 'bold 24px "Cabinet Grotesk", sans-serif',
      scrollSpeed = 2,
      scrollEase = 0.05,
      onActiveIndexChange,
    }: AppConfig
  ) {
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onActiveIndexChange = onActiveIndexChange;

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.renderer.gl.canvas as HTMLCanvasElement);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 40,
      widthSegments: 60,
    });
  }

  createMedias(
    items: GalleryItem[],
    bend: number,
    textColor: string,
    borderRadius: number,
    font: string
  ) {
    // Duplicate items for infinite seamless carousel
    this.galleryItems = items.concat(items).concat(items);
    this.medias = this.galleryItems.map((item, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        item,
        index,
        length: this.galleryItems.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
      });
    });
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = 'touches' in e ? e.touches[0].clientX : e.clientX;
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = (this.scroll.position ?? 0) + distance;
  }

  onTouchUp() {
    this.isDown = false;
  }

  onWheel(e: Event) {
    const wheelEvent = e as WheelEvent;
    // We let the page scroll driver handle vertical scroll, but horizontal wheel or shift-wheel works here
    if (Math.abs(wheelEvent.deltaX) > Math.abs(wheelEvent.deltaY)) {
      this.scroll.target += (wheelEvent.deltaX > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    }
  }

  setScrollTarget(target: number) {
    this.scroll.target = target;
  }

  addScrollDelta(delta: number) {
    this.scroll.target += delta;
  }

  onResize() {
    if (!this.container) return;
    this.screen = {
      width: this.container.clientWidth || window.innerWidth,
      height: this.container.clientHeight || window.innerHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height,
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };

    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction));

      // Calculate which book is currently centered (closest to position.x == 0)
      if (this.medias.length > 0 && this.onActiveIndexChange) {
        let closestDist = Infinity;
        let closestIdx = 0;
        this.medias.forEach((m, idx) => {
          const dist = Math.abs(m.plane.position.x);
          if (dist < closestDist) {
            closestDist = dist;
            closestIdx = idx % (this.galleryItems.length / 3);
          }
        });
        if (closestIdx !== this.lastActiveIdx) {
          this.lastActiveIdx = closestIdx;
          this.onActiveIndexChange(closestIdx);
        }
      }
    }

    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);

    window.addEventListener('resize', this.boundOnResize);
    window.addEventListener('wheel', this.boundOnWheel, { passive: true });
    this.container.addEventListener('mousedown', this.boundOnTouchDown);
    window.addEventListener('mousemove', this.boundOnTouchMove);
    window.addEventListener('mouseup', this.boundOnTouchUp);
    this.container.addEventListener('touchstart', this.boundOnTouchDown, { passive: true });
    window.addEventListener('touchmove', this.boundOnTouchMove, { passive: true });
    window.addEventListener('touchend', this.boundOnTouchUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.boundOnResize);
    window.removeEventListener('wheel', this.boundOnWheel);
    window.removeEventListener('mousemove', this.boundOnTouchMove);
    window.removeEventListener('mouseup', this.boundOnTouchUp);
    window.removeEventListener('touchmove', this.boundOnTouchMove);
    window.removeEventListener('touchend', this.boundOnTouchUp);
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas as HTMLCanvasElement);
    }
  }
}

interface CircularBookGalleryProps {
  books: Book[];
}

export function CircularBookGallery({ books }: CircularBookGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<AppCore | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const [activeBookIdx, setActiveBookIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Map books into GalleryItem structure with verified covers & fallback SVGs (memoized)
  const galleryItems: GalleryItem[] = useMemo(() => {
    return books.map(book => {
      const verifiedUrl = VERIFIED_BOOK_COVERS[book.id] || book.coverImage;
      const fallbackSvg = generateBookCoverSvg({
        title: book.title,
        author: book.author,
        category: book.category?.name || 'Edition',
      });
      return {
        id: book.id,
        image: verifiedUrl || fallbackSvg,
        text: book.title,
        author: book.author,
        price: book.price,
        category: book.category?.name || 'Curated',
      };
    });
  }, [books]);

  const activeBook = books[activeBookIdx % books.length] || books[0];

  // Initialize WebGL AppCore once mounted
  useEffect(() => {
    if (!mounted || !containerRef.current || galleryItems.length === 0) return;

    const app = new AppCore(containerRef.current, {
      items: galleryItems,
      bend: 3.2,
      textColor: '#ffe17c',
      borderRadius: 0.06,
      font: 'bold 24px "Cabinet Grotesk", sans-serif',
      scrollSpeed: 2.2,
      scrollEase: 0.05,
      onActiveIndexChange: (idx) => setActiveBookIdx(idx),
    });
    appRef.current = app;

    return () => {
      app.destroy();
      appRef.current = null;
    };
  }, [mounted, galleryItems]);

  // Premium Pinned Scroll Integration:
  // When scrolling through trackRef (260vh tall), the gallery is pinned in sticky viewport (h-screen).
  // The user only sees the gallery, and scrolling up/down rotates the circular carousel smoothly.
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      if (!trackRef.current || !appRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = trackRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Distance from top of track to top of viewport (works smoothly in both directions)
      const scrolled = -rect.top;
      const totalScrollable = trackHeight - viewportHeight;

      if (totalScrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      // Direct DOM update eliminates React re-renders during high-frequency scroll
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${Math.round(progress * 100)}%`;
      }
      if (progressTextRef.current) {
        progressTextRef.current.innerText = `${Math.round(progress * 100)}%`;
      }

      // Rotate gallery smoothly with scroll progress:
      // Map progress across total widths
      const singleItemWidth = appRef.current.medias[0]?.width || 4;
      const totalTravel = singleItemWidth * galleryItems.length * 1.5;
      appRef.current.setScrollTarget(progress * totalTravel);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted, galleryItems.length]);

  return (
    <div
      ref={trackRef}
      suppressHydrationWarning
      className="relative w-full border-b-2 border-black"
      style={{ height: '260vh', backgroundColor: '#171e19' }}
    >
      {/* Sticky Fullscreen Stage (User only sees this while scrolling) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">

        {/* Ambient Top HUD */}
        <div className="relative z-20 pt-8 px-6 lg:px-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pointer-events-none">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1 mb-2 pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-[#ffe17c] animate-pulse" />
              <span className="font-cabinet font-700 text-xs text-[#ffe17c] uppercase tracking-widest">
                WebGL Circular Showcase
              </span>
            </div>
            <h2
              className="font-cabinet font-800 text-white tracking-tight"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.1 }}
            >
              Curated Masterpieces in Orbit.
            </h2>
            <p className="font-cabinet text-[#b7c6c2]/70 text-xs sm:text-sm mt-1 max-w-md">
              Scroll down to spin the circular gallery. Each volume is hand-selected and verified.
            </p>
          </div>

          {/* Scroll Progress Meter */}
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-2 self-start sm:self-auto rounded-lg">
            <span className="font-cabinet font-700 text-xs text-white/50 uppercase tracking-widest">Scroll</span>
            <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-[#ffe17c] transition-all duration-75"
                style={{ width: '0%' }}
              />
            </div>
            <span ref={progressTextRef} className="font-cabinet font-800 text-xs text-[#ffe17c] w-9 text-right">
              0%
            </span>
          </div>
        </div>

        {/* WebGL Canvas Container */}
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10"
        />

        {/* Bottom Interactive HUD / Active Book Bar */}
        {activeBook && (
          <div className="relative z-20 pb-8 px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
            <div className="flex items-center gap-4 bg-[#1f2722]/90 backdrop-blur-md border-2 border-black p-3.5 sm:px-5 sm:py-3.5 shadow-hard-4 max-w-xl w-full sm:w-auto">
              <div className="w-10 h-14 bg-black/60 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center text-xs text-[#ffe17c] font-bold">
                {activeBookIdx + 1}/{books.length}
              </div>
              <div className="min-w-0">
                <p className="font-cabinet font-800 text-white text-base sm:text-lg truncate">
                  {activeBook.title}
                </p>
                <p className="font-cabinet text-[#b7c6c2] text-xs truncate">
                  by {activeBook.author} · <span className="text-[#ffe17c] font-bold">₹{activeBook.price}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/books/${activeBook.id}`}
                className="font-cabinet font-800 text-black bg-[#ffe17c] border-2 border-black px-6 py-3 text-xs sm:text-sm uppercase tracking-wider hover:bg-white transition-all shadow-hard-4"
              >
                Inspect Edition →
              </Link>
              <Link
                href="/books"
                className="font-cabinet font-700 text-white bg-black/70 border border-white/20 px-5 py-3 text-xs sm:text-sm uppercase tracking-wider hover:bg-white/10 transition-all"
              >
                Catalog
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
