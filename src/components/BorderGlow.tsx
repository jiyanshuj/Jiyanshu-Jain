import * as React from 'react';
import { useEffect, useRef, useState, type FC } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

/* ─────────────────────────────────────────────────────────────
   Theme hook: follows <html data-theme> so components rendered
   inside lazy sections still react when the theme is toggled.
───────────────────────────────────────────────────────────── */

type SiteTheme = 'light' | 'dark';

const readTheme = (): SiteTheme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

function useSiteTheme(): SiteTheme {
  const [theme, setTheme] = useState<SiteTheme>(readTheme);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

/* ─────────────────────────────────────────────────────────────
   Liquid Sculpture background
   Source: @gughigug/liquid-sculpture-hero (21st.dev)
   ~100k GPU-simulated particles rebuilt from the sculpture's own
   pixels. The cursor turns the material liquid; it settles back
   into the crisp image. Without WebGL2 the static image is shown.
───────────────────────────────────────────────────────────── */

type Rect = { x: number; y: number; w: number; h: number };
type RGB = [number, number, number];

interface EngineOptions {
  interactive: boolean;
  strength: number;
  radius: number;
  density: number;
  dotSize: number;
  spread: number;
  turbulence: number;
  returnSpeed: number;
  streaks: boolean;
  ambient: boolean;
  ambientIntensity: number;
  speed: number;
  intro: boolean;
  reducedMotion: boolean;
  bg: RGB;
  /** null = detected from the image corners */
  imgBg: RGB | null;
  /** 0 – 2: how much the whole sculpture flows while the cursor is over it */
  liquid: number;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function hexToUnitRgb(value: string, fallback: RGB): RGB {
  const s = value.trim();
  let m = s.match(/^#?([0-9a-f]{3})$/i);
  if (m) {
    const [r, g, b] = m[1].split('').map((c) => parseInt(c + c, 16) / 255);
    return [r, g, b];
  }
  m = s.match(/^#?([0-9a-f]{6})([0-9a-f]{2})?$/i);
  if (m) {
    const n = parseInt(m[1], 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  return fallback;
}

const NOISE = `
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); vec2 u=f*f*f*(f*(f*6.0-15.0)+10.0);
  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x), mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x), u.y); }
vec2 ambientField(vec2 uv, float t){
  vec2 q = uv*vec2(3.2,1.7);
  vec2 a = vec2(vnoise(q+vec2(t*0.11,0.0))-0.5, vnoise(q+vec2(5.2,t*0.08)+3.1)-0.5);
  vec2 q2 = uv*vec2(7.5,4.0) + vec2(-t*0.19, t*0.13);
  vec2 b = vec2(vnoise(q2+1.7)-0.5, vnoise(q2+9.3)-0.5);
  return a + b*0.45;
}
`;

/* energy of the material at a point: shared by image and particles so the cross-fade is exactly complementary */
const ENERGY = `
float energyAt(vec2 rectPx, vec2 mouse, float radius, float presence, float wakeEnergy){
  vec2 d = rectPx - mouse;
  float f = exp(-dot(d,d)/(radius*radius))*presence;
  return smoothstep(0.06, 0.5, f*1.15 + wakeEnergy*1.7);
}
`;

const QUAD_VS = `#version 300 es
layout(location=0) in vec2 aPos;
out vec2 vUv;
void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.0,1.0); }
`;

/* Flow map (cursor wake). RGBA8: velocity encoded around 128, energy in B. */
const FLOW_FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D uPrev;
uniform vec2 uTexel;
uniform vec2 uMouse;
uniform vec2 uVel;
uniform vec2 uSize;
uniform float uRadius;
uniform float uPresence;
uniform float uDecay;
vec2 decV(vec4 c){ return (c.rg*255.0-128.0)/127.0; }
void main(){
  vec2 v0 = decV(texture(uPrev, vUv));
  vec2 uv = vUv - v0*uTexel*2.5;
  vec4 c = texture(uPrev, uv)*0.52
    + 0.12*(texture(uPrev, uv+vec2(uTexel.x,0.0)) + texture(uPrev, uv-vec2(uTexel.x,0.0))
          + texture(uPrev, uv+vec2(0.0,uTexel.y)) + texture(uPrev, uv-vec2(0.0,uTexel.y)));
  vec2 v = decV(c);
  float p = c.b;
  vec2 d = (vUv-uMouse)*uSize;
  float f = exp(-dot(d,d)/(uRadius*uRadius))*uPresence;
  float sp = clamp(length(uVel)*2.5, 0.0, 1.0);
  v += uVel*f*0.22;
  p = max(p, f*sp);
  v *= uDecay;
  p *= uDecay;
  v = sign(v)*max(abs(v)-1.2/127.0, 0.0);
  p = max(p-1.2/255.0, 0.0);
  v = clamp(v, -1.0, 1.0);
  o = vec4((v*127.0+128.0)/255.0, p, 1.0);
}
`;

/* GPGPU step: state = (offset.xy, velocity.xy) in rect CSS px. */
const SIM_FS = `#version 300 es
precision highp float;
out vec4 o;
uniform sampler2D uState;
uniform sampler2D uHome;
uniform sampler2D uFlow;
uniform vec2 uSize;
uniform vec2 uMouse;
uniform float uRadius;
uniform float uPresence;
uniform float uStrength;
uniform float uSpread;
uniform float uTurb;
uniform float uReturn;
uniform float uTime;
uniform float uDt;
uniform float uIntro;
${NOISE}
vec2 curl(vec2 p){
  const float e = 0.35;
  float a = vnoise(p+vec2(0.0,e)) - vnoise(p-vec2(0.0,e));
  float b = vnoise(p+vec2(e,0.0)) - vnoise(p-vec2(e,0.0));
  return vec2(a, -b)/(2.0*e);
}
void main(){
  ivec2 ij = ivec2(gl_FragCoord.xy);
  vec4 hm = texelFetch(uHome, ij, 0);
  if(hm.w <= 0.0){ o = vec4(0.0); return; }
  vec4 st = texelFetch(uState, ij, 0);
  vec2 off = st.xy;
  vec2 vel = st.zw;
  float sd = hm.z;
  float light = 0.45 + sd*1.1;

  vec2 p = hm.xy*uSize + off;
  vec4 fl = texture(uFlow, clamp(p/uSize, 0.0, 1.0));
  vec2 wake = (fl.rg*255.0-128.0)/127.0;
  float pr = fl.b;

  vec2 toM = p - uMouse;
  float r2 = dot(toM,toM);
  float f = exp(-r2/(uRadius*uRadius))*uPresence;
  vec2 n = toM*inversesqrt(r2+1.0);
  float e = clamp(pr*2.0 + f, 0.0, 1.0);

  vec2 acc = vec2(0.0);
  // blown outward and swirled around the cursor
  acc += n*f*1.25*uStrength*uSpread*light;
  acc += vec2(-n.y, n.x)*f*1.45*uStrength*uSpread*(0.4+sd);
  // carried by the liquid wake
  acc += (wake*42.0*uSpread*light - vel)*e*0.08;
  // curl-noise turbulence where the material is disturbed (and during the intro)
  vec2 q = p*0.0095 + vec2(uTime*0.35, -uTime*0.2);
  vec2 c = curl(q) + 0.5*curl(q*2.3 + 7.1);
  acc += c*(e*1.2*uSpread + uIntro*1.5)*uTurb*light;
  // elastic return home
  float k = (0.006 + 0.02*uReturn)*(0.65+sd*0.7)*(1.0 - uIntro*0.75);
  acc -= off*k;

  vel += acc*uDt;
  vel *= pow(mix(0.93, 0.955, e), uDt);
  off += vel*uDt;
  if(dot(off,off) < 0.0004 && dot(vel,vel) < 0.0004){ off = vec2(0.0); vel = vec2(0.0); }
  o = vec4(off, vel);
}
`;

/* Particles: one instanced quad per particle, a capsule stretched along velocity. */
const PART_VS = `#version 300 es
precision highp float;
layout(location=0) in vec2 aCorner;
uniform sampler2D uState;
uniform sampler2D uHome;
uniform sampler2D uCol;
uniform sampler2D uFlow;
uniform int uTexW;
uniform vec4 uRect;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uRadius;
uniform float uPresence;
uniform float uDot;
uniform float uTime;
uniform float uAmbient;
uniform float uStreak;
uniform float uIntroVis;
uniform vec3 uTint;
out vec2 vLocal;
out float vHalfLen;
out float vR;
out vec3 vCol;
out float vA;
${NOISE}
${ENERGY}
void main(){
  int id = gl_InstanceID;
  ivec2 ij = ivec2(id % uTexW, id / uTexW);
  vec4 hm = texelFetch(uHome, ij, 0);
  vec4 st = texelFetch(uState, ij, 0);
  vec4 cl = texelFetch(uCol, ij, 0);

  float wakeE = texture(uFlow, hm.xy).b;
  float E = energyAt(hm.xy*uRect.zw, uMouse, uRadius, uPresence, wakeE);
  float lift = smoothstep(0.35, 2.5, length(st.xy));
  float a = max(max(E, lift), 1.0-uIntroVis);
  if(a < 0.01 || hm.w <= 0.0){ gl_Position = vec4(2.0,2.0,2.0,1.0); return; }

  vec2 base = uRect.xy + hm.xy*uRect.zw + st.xy;
  base -= ambientField(hm.xy, uTime)*10.0*uAmbient;

  vec2 v = st.zw;
  float sp = length(v);
  vec2 dir = sp > 0.001 ? v/sp : vec2(1.0,0.0);
  float r = uDot*hm.w*0.5;
  float len = min(sp*1.25, 18.0)*uStreak;
  vec2 lc = aCorner*vec2(r + len*0.5 + 1.0, r + 1.0);
  vec2 center = base - dir*len*0.5;
  vec2 world = center + dir*lc.x + vec2(-dir.y, dir.x)*lc.y;

  vec2 clip = world/uRes*2.0-1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  vLocal = lc;
  vHalfLen = len*0.5;
  vR = r;
  vec3 col = cl.rgb*uTint;
  // fast material catches the light, like liquid metal
  float glint = smoothstep(2.0, 16.0, sp);
  col = mix(col, min(col*1.18 + vec3(0.07,0.075,0.085), vec3(1.0)), glint*0.75);
  vCol = col;
  vA = a;
}
`;

const PART_FS = `#version 300 es
precision highp float;
in vec2 vLocal;
in float vHalfLen;
in float vR;
in vec3 vCol;
in float vA;
uniform float uDpr;
out vec4 o;
void main(){
  vec2 q = vec2(max(abs(vLocal.x)-vHalfLen, 0.0), vLocal.y);
  float d = length(q) - vR;
  float a = clamp(0.5 - d*uDpr, 0.0, 1.0);
  // comet tail: the trailing end thins out
  float tail = vHalfLen > 0.0 ? clamp(0.5 - vLocal.x/(2.0*(vHalfLen+vR)), 0.0, 1.0) : 0.0;
  a *= 1.0 - tail*0.55;
  a *= vA;
  if(a < 0.004) discard;
  o = vec4(vCol*a, a);
}
`;

/* Image pass: the crisp sculpture, gently lensed, fading out where the material has turned liquid. */
const IMAGE_FS = `#version 300 es
precision highp float;
out vec4 o;
uniform sampler2D uImg;
uniform sampler2D uFlow;
uniform vec2 uRes;
uniform float uDpr;
uniform vec4 uRect;
uniform vec3 uBg;
uniform vec3 uImgBg;
uniform vec2 uMouse;
uniform float uPresence;
uniform float uRadius;
uniform float uStrength;
uniform float uTime;
uniform float uAmbient;
uniform float uIntroVis;
uniform float uAlphaMode;
${NOISE}
${ENERGY}
void main(){
  vec2 px = vec2(gl_FragCoord.x, uRes.y*uDpr - gl_FragCoord.y)/uDpr;
  vec2 size = uRect.zw;
  vec2 uv = (px-uRect.xy)/size;
  if(uv.x < -0.05 || uv.x > 1.05 || uv.y < -0.12 || uv.y > 1.12){ o = vec4(0.0); return; }
  vec4 fl = texture(uFlow, clamp(uv,0.0,1.0));
  vec2 vel = (fl.rg*255.0-128.0)/127.0;
  vec2 rp = uv*size;
  vec2 toM = rp - uMouse;
  float fall = exp(-dot(toM,toM)/(uRadius*uRadius))*uPresence;
  vec2 disp = -toM*0.22*uStrength*fall - vel*10.0*uStrength;
  disp += ambientField(uv, uTime)*10.0*uAmbient;
  vec2 suv = uv + disp/size;
  vec4 tx = texture(uImg, suv);
  vec3 col = tx.rgb;
  vec2 e = smoothstep(vec2(0.0), vec2(0.004,0.01), suv) * smoothstep(vec2(1.0), vec2(0.996,0.99), suv);
  // cut-out images carry their own alpha; flat-background images are keyed by colour
  float key = uAlphaMode > 0.5 ? tx.a : smoothstep(0.012, 0.05, length(col-uImgBg));
  float k = key*e.x*e.y;
  float E = energyAt(rp, uMouse, uRadius, uPresence, fl.b);
  float show = (1.0 - E)*uIntroVis;
  vec3 mat = uAlphaMode > 0.5 ? col : col*(uBg/max(uImgBg, vec3(0.001)));
  // premultiplied: empty areas stay transparent so the page shows through
  float A = k*show;
  o = vec4(mat*A, A);
}
`;

type Prog = { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };

function compile(gl: WebGL2RenderingContext, vs: string, fs: string): Prog {
  const make = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(sh);
      gl.deleteShader(sh);
      throw new Error('Shader: ' + log);
    }
    return sh;
  };
  const p = gl.createProgram()!;
  const v = make(gl.VERTEX_SHADER, vs);
  const f = make(gl.FRAGMENT_SHADER, fs);
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.bindAttribLocation(p, 0, 'aPos');
  gl.linkProgram(p);
  gl.deleteShader(v);
  gl.deleteShader(f);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('Link: ' + gl.getProgramInfoLog(p));
  const u: Record<string, WebGLUniformLocation | null> = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(p, i);
    if (info) u[info.name] = gl.getUniformLocation(p, info.name);
  }
  return { p, u };
}

const TEX_W = 1024;
const SETTLE_FRAMES = 270;

class LiquidEngine {
  lastImage: HTMLImageElement | null = null;
  /** Called once, after the first frame has actually been drawn. */
  onFirstFrame: (() => void) | null = null;

  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private opts: EngineOptions;
  private onFail: () => void;
  private lowPower = false;
  private stateFormat = { internal: 0, type: 0 };

  private pFlow!: Prog;
  private pSim!: Prog;
  private pPart!: Prog;
  private pImg!: Prog;
  private vao!: WebGLVertexArrayObject;
  private quad!: WebGLBuffer;

  private imgTex: WebGLTexture | null = null;
  private flowTex: WebGLTexture[] = [];
  private flowFb: WebGLFramebuffer[] = [];
  private flowW = 256;
  private flowH = 104;
  private flowIdx = 0;
  private flowDirty = false;

  private homeTex: WebGLTexture | null = null;
  private homeData: Float32Array | null = null;
  private colTex: WebGLTexture | null = null;
  private stateTex: WebGLTexture[] = [];
  private stateFb: WebGLFramebuffer[] = [];
  private stateIdx = 0;
  private texH = 1;
  private n = 0;
  private gridW = 1;
  private stateDirty = false;
  private alphaMode = false;
  private imgBg: RGB = [0.918, 0.914, 0.906];
  private flowing = 0;

  private aspect = 2.5;
  private rect: Rect = { x: 0, y: 0, w: 1, h: 1 };
  private cssW = 1;
  private cssH = 1;

  private target = { x: -9999, y: -9999 };
  private mouse = { x: -9999, y: -9999 };
  private prevMouse = { x: -9999, y: -9999 };
  private mvel = { x: 0, y: 0 };
  private presence = 0;
  private presenceTarget = 0;
  private settle = 1e9;

  private time = 0;
  private introT = 1;
  private raf = 0;
  private running = false;
  private last = 0;
  private skip = 0;
  private visible = true;
  private ready = false;
  private destroyed = false;
  private lost = false;

  constructor(canvas: HTMLCanvasElement, opts: EngineOptions, onFail: () => void) {
    this.canvas = canvas;
    this.opts = opts;
    this.onFail = onFail;
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    }) as WebGL2RenderingContext | null;
    if (!gl) throw new Error('WebGL2 unavailable');
    this.gl = gl;
    const nav = navigator as Navigator & { deviceMemory?: number };
    this.lowPower =
      (nav.hardwareConcurrency || 8) <= 4 ||
      (nav.deviceMemory || 8) <= 4 ||
      window.matchMedia('(pointer: coarse)').matches;
    this.initGL();
    canvas.addEventListener('webglcontextlost', this.onLost, false);
  }

  private onLost = (e: Event) => {
    e.preventDefault();
    this.lost = true;
    this.stop();
    this.onFail();
  };

  private initGL() {
    const gl = this.gl;
    // float render targets: RGBA16F is enough (offsets in px, sub-pixel precision)
    const full = gl.getExtension('EXT_color_buffer_float');
    const half = full ? null : gl.getExtension('EXT_color_buffer_half_float');
    if (!full && !half) throw new Error('No float render targets');
    this.stateFormat = { internal: gl.RGBA16F, type: gl.HALF_FLOAT };

    this.pFlow = compile(gl, QUAD_VS, FLOW_FS);
    this.pSim = compile(gl, QUAD_VS, SIM_FS);
    this.pPart = compile(gl, PART_VS, PART_FS);
    this.pImg = compile(gl, QUAD_VS, IMAGE_FS);

    this.vao = gl.createVertexArray()!;
    gl.bindVertexArray(this.vao);
    this.quad = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    for (let i = 0; i < 2; i++) {
      const t = this.makeTex(gl.RGBA8, this.flowW, this.flowH, gl.RGBA, gl.UNSIGNED_BYTE, null, gl.LINEAR);
      const fb = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      this.flowTex.push(t);
      this.flowFb.push(fb);
    }
    this.clearFlow();
  }

  private makeTex(
    internal: number,
    w: number,
    h: number,
    format: number,
    type: number,
    data: ArrayBufferView | null,
    filter: number,
  ) {
    const gl = this.gl;
    const t = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  private clearFlow() {
    const gl = this.gl;
    for (const fb of this.flowFb) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.viewport(0, 0, this.flowW, this.flowH);
      gl.clearColor(128 / 255, 128 / 255, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.flowDirty = false;
  }

  private clearState() {
    const gl = this.gl;
    for (const fb of this.stateFb) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.viewport(0, 0, TEX_W, this.texH);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.stateDirty = false;
  }

  setImage(img: HTMLImageElement) {
    if (this.destroyed || this.lost) return;
    const gl = this.gl;
    this.lastImage = img;
    this.aspect = img.naturalWidth / img.naturalHeight || 2.5;
    this.flowH = Math.max(32, Math.round(this.flowW / this.aspect));
    for (const t of this.flowTex) {
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, this.flowW, this.flowH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }
    this.clearFlow();
    if (this.imgTex) gl.deleteTexture(this.imgTex);
    this.imgTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.imgTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.buildParticles(img);
    this.ready = true;
    if (this.opts.intro && !this.opts.reducedMotion) this.startIntro();
    this.wake();
  }

  /** One particle per material pixel of a grid laid over the image. */
  private buildParticles(img: HTMLImageElement) {
    const gl = this.gl;
    const baseGrid = this.lowPower ? 640 : 1000;
    const gw = Math.round(baseGrid * Math.sqrt(clamp(this.opts.density, 0.15, 2)));
    const gh = Math.max(1, Math.round(gw / this.aspect));
    this.gridW = gw;
    let data: Uint8ClampedArray;
    try {
      const c = document.createElement('canvas');
      c.width = gw;
      c.height = gh;
      const ctx = c.getContext('2d', { willReadFrequently: true })!;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, gw, gh);
      data = ctx.getImageData(0, 0, gw, gh).data;
    } catch {
      throw new Error('Image is not CORS-readable');
    }
    // a cut-out (transparent) image is sampled by alpha, a flat one by colour distance
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4 * 7) if (data[i] < 250) transparent++;
    this.alphaMode = transparent > data.length / (4 * 7) / 20;
    if (this.opts.imgBg) this.imgBg = this.opts.imgBg;
    else if (!this.alphaMode) {
      // flat background: average the four corners
      let r = 0, g = 0, b = 0, n = 0;
      const pw = Math.max(2, Math.round(gw * 0.012));
      for (const [cx, cy] of [[0, 0], [gw - pw, 0], [0, gh - pw], [gw - pw, gh - pw]]) {
        for (let y = cy; y < cy + pw; y++)
          for (let x = cx; x < cx + pw; x++) {
            const i = (y * gw + x) * 4;
            r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
          }
      }
      this.imgBg = [r / n / 255, g / n / 255, b / n / 255];
    }
    const home: number[] = [];
    const col: number[] = [];
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        const i = (y * gw + x) * 4;
        const r = data[i] / 255;
        const g = data[i + 1] / 255;
        const b = data[i + 2] / 255;
        if (this.alphaMode) {
          const a = data[i + 3] / 255;
          if (a < 0.12) continue;
          if (a < 0.5 && Math.random() > a * 2) continue;
        } else {
          const dev = Math.hypot(r - this.imgBg[0], g - this.imgBg[1], b - this.imgBg[2]);
          if (dev < 0.03) continue;
          if (dev < 0.07 && Math.random() > (dev - 0.03) / 0.04) continue;
        }
        const jx = (Math.random() - 0.5) * 0.6;
        const jy = (Math.random() - 0.5) * 0.6;
        home.push((x + 0.5 + jx) / gw, (y + 0.5 + jy) / gh, Math.random(), 0.85 + Math.random() * 0.3);
        col.push(data[i], data[i + 1], data[i + 2], 255);
      }
    }
    const n = home.length / 4;
    this.n = n;
    this.texH = Math.max(1, Math.ceil(n / TEX_W));
    const total = TEX_W * this.texH;
    const homeArr = new Float32Array(total * 4);
    homeArr.set(home);
    const colArr = new Uint8Array(total * 4);
    colArr.set(col);

    for (const t of [this.homeTex, this.colTex, ...this.stateTex]) if (t) gl.deleteTexture(t);
    for (const f of this.stateFb) gl.deleteFramebuffer(f);
    this.stateTex = [];
    this.stateFb = [];
    this.homeTex = this.makeTex(gl.RGBA32F, TEX_W, this.texH, gl.RGBA, gl.FLOAT, homeArr, gl.NEAREST);
    this.colTex = this.makeTex(gl.RGBA8, TEX_W, this.texH, gl.RGBA, gl.UNSIGNED_BYTE, colArr, gl.NEAREST);
    for (let i = 0; i < 2; i++) {
      const t = this.makeTex(this.stateFormat.internal, TEX_W, this.texH, gl.RGBA, this.stateFormat.type, null, gl.NEAREST);
      const fb = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('Float FBO incomplete');
      this.stateTex.push(t);
      this.stateFb.push(fb);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.homeData = homeArr;
    this.clearState();
  }

  private startIntro() {
    const gl = this.gl;
    const home = this.homeData;
    if (!home) return;
    const w = this.rect.w > 10 ? this.rect.w : 1300;
    const total = TEX_W * this.texH;
    const st = new Float32Array(total * 4);
    for (let i = 0; i < this.n; i++) {
      const hx = home[i * 4] - 0.5;
      const hy = home[i * 4 + 1] - 0.5;
      const sd = home[i * 4 + 2];
      const ang = (Math.random() - 0.5) * 0.9 + (hx > 0 ? 0 : Math.PI);
      const dist = w * (0.04 + Math.random() * 0.14) * (0.5 + Math.abs(hx) * 1.4);
      st[i * 4] = Math.cos(ang) * dist + hx * w * 0.25 * sd;
      st[i * 4 + 1] = Math.sin(ang) * dist * 0.55 + hy * 120 * (Math.random() - 0.5);
    }
    gl.bindTexture(gl.TEXTURE_2D, this.stateTex[this.stateIdx]);
    gl.texImage2D(gl.TEXTURE_2D, 0, this.stateFormat.internal, TEX_W, this.texH, 0, gl.RGBA, gl.FLOAT, st);
    this.introT = 0;
    this.stateDirty = true;
  }

  setOptions(o: Partial<EngineOptions>) {
    const rebuild =
      (o.density !== undefined && o.density !== this.opts.density) ||
      (o.imgBg !== undefined && String(o.imgBg) !== String(this.opts.imgBg));
    this.opts = { ...this.opts, ...o };
    if (rebuild && this.ready && this.lastImage) {
      try {
        this.buildParticles(this.lastImage);
      } catch {
        this.onFail();
      }
    }
    this.wake();
  }

  resize(cssW: number, cssH: number, rect: Rect) {
    this.cssW = Math.max(1, cssW);
    this.cssH = Math.max(1, cssH);
    this.rect = rect;
    let dpr = Math.min(window.devicePixelRatio || 1, this.lowPower ? 1.5 : 2);
    const px = this.cssW * this.cssH * dpr * dpr;
    if (px > 4.5e6) dpr = Math.max(1, Math.sqrt(4.5e6 / (this.cssW * this.cssH)));
    const w = Math.round(this.cssW * dpr);
    const h = Math.round(this.cssH * dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.draw();
  }

  setVisible(v: boolean) {
    this.visible = v;
    if (v) this.wake();
    else this.stop();
  }

  pointer(type: 'move' | 'leave', x: number, y: number) {
    if (!this.opts.interactive || this.lost) return;
    if (type === 'leave') {
      this.presenceTarget = 0;
      this.wake();
      return;
    }
    if (this.mouse.x < -9000) {
      this.mouse.x = this.prevMouse.x = x;
      this.mouse.y = this.prevMouse.y = y;
    }
    this.target.x = x;
    this.target.y = y;
    this.presenceTarget = 1;
    this.settle = 0;
    this.wake();
  }

  private wake() {
    if (!this.ready || this.running || !this.visible || this.destroyed || this.lost) {
      if (this.ready && !this.running) this.draw();
      return;
    }
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private radiusPx() {
    return this.opts.radius * clamp(this.rect.w / 1400, 0.6, 1.25);
  }

  private strength() {
    return this.opts.strength * (this.opts.reducedMotion ? 0.5 : 1);
  }

  private frame = (now: number) => {
    if (!this.running) return;
    const rawMs = now - this.last;
    const dt = clamp(rawMs / 16.6667, 0.25, 3);
    this.last = now;
    const o = this.opts;
    const ambientOn = o.ambient && !o.reducedMotion;

    const ease = 1 - Math.pow(1 - 0.22, dt);
    this.mouse.x += (this.target.x - this.mouse.x) * ease;
    this.mouse.y += (this.target.y - this.mouse.y) * ease;
    const vx = (this.mouse.x - this.prevMouse.x) / dt;
    const vy = (this.mouse.y - this.prevMouse.y) / dt;
    this.prevMouse.x = this.mouse.x;
    this.prevMouse.y = this.mouse.y;
    this.mvel.x += (clamp(vx, -60, 60) - this.mvel.x) * 0.5;
    this.mvel.y += (clamp(vy, -60, 60) - this.mvel.y) * 0.5;
    const pk = this.presenceTarget > this.presence ? 0.1 : 0.035;
    this.presence += (this.presenceTarget - this.presence) * (1 - Math.pow(1 - pk, dt));
    if (this.presence < 0.001 && this.presenceTarget === 0) this.presence = 0;
    const fk = this.presenceTarget > this.flowing ? 0.05 : 0.018;
    this.flowing += (this.presenceTarget - this.flowing) * (1 - Math.pow(1 - fk, dt));
    if (this.flowing < 0.002 && this.presenceTarget === 0) this.flowing = 0;
    if (this.introT < 1) this.introT = Math.min(1, this.introT + Math.min(rawMs, 100) / 3200);

    const interacting = this.presence > 0.001;
    // settle is counted in simulated frames, so slow devices never snap mid-return
    this.settle = interacting ? 0 : this.settle + dt;
    const active = interacting || this.settle < SETTLE_FRAMES || this.introT < 1;

    if (!active) {
      if (this.flowDirty) this.clearFlow();
      if (this.stateDirty) this.clearState();
      if (!ambientOn) {
        this.draw();
        this.firstFrame();
        this.stop();
        return;
      }
      this.raf = requestAnimationFrame(this.frame);
      if (this.skip++ % 2) return;
      this.time += (dt * 2 * o.speed) / 60;
      this.draw();
      this.firstFrame();
      return;
    }
    this.raf = requestAnimationFrame(this.frame);
    // the field speeds up while the material is being stirred
    this.time += (dt * o.speed * (1 + this.flowing * 1.6)) / 60;
    this.stepFlow(dt);
    this.stepSim(dt);
    this.draw();
    this.firstFrame();
  };

  private firstFrame() {
    if (!this.onFirstFrame) return;
    const cb = this.onFirstFrame;
    this.onFirstFrame = null;
    // one more frame so the compositor has presented the canvas
    requestAnimationFrame(() => cb());
  }

  private stepFlow(dt: number) {
    const gl = this.gl;
    const P = this.pFlow;
    const dst = 1 - this.flowIdx;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.flowFb[dst]);
    gl.viewport(0, 0, this.flowW, this.flowH);
    gl.disable(gl.BLEND);
    gl.useProgram(P.p);
    gl.bindVertexArray(this.vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.flowTex[this.flowIdx]);
    gl.uniform1i(P.u.uPrev, 0);
    gl.uniform2f(P.u.uTexel, 1 / this.flowW, 1 / this.flowH);
    const r = this.rect;
    gl.uniform2f(P.u.uMouse, (this.mouse.x - r.x) / r.w, (this.mouse.y - r.y) / r.h);
    gl.uniform2f(P.u.uVel, clamp(this.mvel.x / 40, -1, 1), clamp(this.mvel.y / 40, -1, 1));
    gl.uniform2f(P.u.uSize, r.w, r.h);
    gl.uniform1f(P.u.uRadius, this.radiusPx());
    gl.uniform1f(P.u.uPresence, this.presence);
    gl.uniform1f(P.u.uDecay, Math.pow(0.968, dt));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.flowIdx = dst;
    this.flowDirty = true;
  }

  private stepSim(dt: number) {
    if (!this.n) return;
    const gl = this.gl;
    const P = this.pSim;
    const o = this.opts;
    const r = this.rect;
    const dst = 1 - this.stateIdx;
    const intro = o.reducedMotion || !o.intro ? 0 : Math.pow(1 - this.introT, 2);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.stateFb[dst]);
    gl.viewport(0, 0, TEX_W, this.texH);
    gl.disable(gl.BLEND);
    gl.useProgram(P.p);
    gl.bindVertexArray(this.vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.stateTex[this.stateIdx]);
    gl.uniform1i(P.u.uState, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.homeTex);
    gl.uniform1i(P.u.uHome, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.flowTex[this.flowIdx]);
    gl.uniform1i(P.u.uFlow, 2);
    gl.uniform2f(P.u.uSize, r.w, r.h);
    gl.uniform2f(P.u.uMouse, this.mouse.x - r.x, this.mouse.y - r.y);
    gl.uniform1f(P.u.uRadius, this.radiusPx());
    gl.uniform1f(P.u.uPresence, this.presence);
    gl.uniform1f(P.u.uStrength, this.strength());
    gl.uniform1f(P.u.uSpread, clamp(o.spread, 0, 2));
    gl.uniform1f(P.u.uTurb, clamp(o.turbulence, 0, 2) * (o.reducedMotion ? 0.3 : 1));
    gl.uniform1f(P.u.uReturn, clamp(o.returnSpeed, 0, 2));
    gl.uniform1f(P.u.uTime, this.time);
    gl.uniform1f(P.u.uDt, dt);
    gl.uniform1f(P.u.uIntro, intro);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.stateIdx = dst;
    this.stateDirty = true;
  }

  private draw() {
    if (!this.ready || this.lost || this.destroyed) return;
    const gl = this.gl;
    const o = this.opts;
    const r = this.rect;
    const rm = o.reducedMotion;
    const introVis = rm || !o.intro ? 1 : Math.pow(this.introT, 2.2);
    const base = o.ambient && !rm ? clamp(o.ambientIntensity, 0, 2) : 0;
    const amb = base + this.flowing * 0.85 * clamp(o.liquid, 0, 2) * (rm ? 0.3 : 1);
    const [br, bg, bb] = o.bg;
    const [ir, ig, ib] = this.imgBg;
    const dpr = this.canvas.width / this.cssW;
    const mx = this.mouse.x - r.x;
    const my = this.mouse.y - r.y;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.bindVertexArray(this.vao);
    gl.disable(gl.BLEND);

    const I = this.pImg;
    gl.useProgram(I.p);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.imgTex);
    gl.uniform1i(I.u.uImg, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.flowTex[this.flowIdx]);
    gl.uniform1i(I.u.uFlow, 1);
    gl.uniform2f(I.u.uRes, this.cssW, this.cssH);
    gl.uniform1f(I.u.uDpr, dpr);
    gl.uniform4f(I.u.uRect, r.x, r.y, r.w, r.h);
    gl.uniform3f(I.u.uBg, br, bg, bb);
    gl.uniform3f(I.u.uImgBg, ir, ig, ib);
    gl.uniform2f(I.u.uMouse, mx, my);
    gl.uniform1f(I.u.uPresence, this.presence);
    gl.uniform1f(I.u.uRadius, this.radiusPx());
    gl.uniform1f(I.u.uStrength, this.strength());
    gl.uniform1f(I.u.uTime, this.time);
    gl.uniform1f(I.u.uAmbient, amb);
    gl.uniform1f(I.u.uIntroVis, introVis);
    gl.uniform1f(I.u.uAlphaMode, this.alphaMode ? 1 : 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // particles are invisible at rest: skip them entirely
    if (!this.n || (!this.stateDirty && introVis >= 1)) return;

    const P = this.pPart;
    gl.useProgram(P.p);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.stateTex[this.stateIdx]);
    gl.uniform1i(P.u.uState, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.homeTex);
    gl.uniform1i(P.u.uHome, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.colTex);
    gl.uniform1i(P.u.uCol, 2);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, this.flowTex[this.flowIdx]);
    gl.uniform1i(P.u.uFlow, 3);
    gl.uniform1i(P.u.uTexW, TEX_W);
    gl.uniform4f(P.u.uRect, r.x, r.y, r.w, r.h);
    gl.uniform2f(P.u.uRes, this.cssW, this.cssH);
    gl.uniform2f(P.u.uMouse, mx, my);
    gl.uniform1f(P.u.uRadius, this.radiusPx());
    gl.uniform1f(P.u.uPresence, this.presence);
    const spacing = r.w / this.gridW;
    gl.uniform1f(P.u.uDot, spacing * 1.45 * clamp(o.dotSize, 0.2, 3));
    gl.uniform1f(P.u.uTime, this.time);
    gl.uniform1f(P.u.uAmbient, amb);
    gl.uniform1f(P.u.uStreak, (o.streaks ? 1 : 0) * (0.45 + 0.55 * introVis));
    gl.uniform1f(P.u.uIntroVis, introVis);
    gl.uniform1f(P.u.uDpr, dpr);
    if (this.alphaMode) gl.uniform3f(P.u.uTint, 1, 1, 1);
    else gl.uniform3f(P.u.uTint, br / Math.max(ir, 0.001), bg / Math.max(ig, 0.001), bb / Math.max(ib, 0.001));
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.n);
    gl.disable(gl.BLEND);
  }

  destroy() {
    this.destroyed = true;
    this.stop();
    this.canvas.removeEventListener('webglcontextlost', this.onLost);
    const gl = this.gl;
    if (!this.lost) {
      gl.deleteBuffer(this.quad);
      gl.deleteVertexArray(this.vao);
      for (const t of [...this.flowTex, ...this.stateTex, this.imgTex, this.homeTex, this.colTex]) if (t) gl.deleteTexture(t);
      for (const f of [...this.flowFb, ...this.stateFb]) gl.deleteFramebuffer(f);
      for (const p of [this.pFlow, this.pSim, this.pPart, this.pImg]) if (p) gl.deleteProgram(p.p);
    }
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}

/* ── Sculpture images (light / dark, desktop / phone) ───────────────── */

const SCULPTURE_SRC = {
  light: 'https://cdn.21st.dev/assets/mirror/ae/ae8c3de9003460e59182e950ccd345f68f27f9d0e4808b64c92c962a4eca7120.webp',
  dark: 'https://cdn.21st.dev/assets/mirror/a1/a1fa387b6e417b26a25f317559c87cce4d241c1052c52a2b3bc2966b2aaf9b65.webp',
  mobileLight: 'https://cdn.21st.dev/assets/mirror/b0/b0c8d8e5d64b8cec906a3b390e3dc7c9a5af08334bf0632873c601782cb4bc46.webp',
  mobileDark: 'https://cdn.21st.dev/assets/mirror/9a/9a82cb59be1bfde59855b79d7a565e487155a89f4d52eac74dcc10e267b2b6d1.webp',
} as const;

const BACKDROP_TEXT = 'jiyanshu';
const HEADER_OFFSET = 72;

/** The sculpture sits centred in the hero band, as wide as the viewport (it may bleed off the sides on phones). */
function computeRect(w: number, h: number, aspect: number): Rect {
  const bandH = Math.max(80, h - HEADER_OFFSET - 24);
  let rw: number;
  let maxH: number;
  if (w >= 1024) {
    rw = w * 1.02;
    maxH = bandH * 1.1;
  } else if (w >= 640) {
    rw = w * 1.3;
    maxH = bandH * 1.15;
  } else if (aspect < 1.3) {
    rw = w;
    maxH = bandH;
  } else {
    rw = w * 1.9;
    maxH = bandH * 1.2;
  }
  if (rw / aspect > maxH) rw = maxH * aspect;
  const rh = rw / aspect;
  return { x: w / 2 - rw / 2, y: HEADER_OFFSET + bandH / 2 - rh / 2, w: rw, h: rh };
}

export const LiquidSculptureBackground: FC = () => {
  const reduced = usePrefersReducedMotion();
  const theme = useSiteTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<LiquidEngine | null>(null);
  const aspectRef = useRef(1983 / 793);
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const [isMobile, setIsMobile] = useState(false);
  const mobileRef = useRef(false);

  const activeSrc = isMobile
    ? theme === 'dark' ? SCULPTURE_SRC.mobileDark : SCULPTURE_SRC.mobileLight
    : theme === 'dark' ? SCULPTURE_SRC.dark : SCULPTURE_SRC.light;

  /** Page background as 0–1 RGB, so the sculpture blends into the exact theme colour. */
  const readBg = (): RGB => hexToUnitRgb(getComputedStyle(document.documentElement).getPropertyValue('--bg'), [0.92, 0.91, 0.9]);

  const relayout = React.useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const w = root.clientWidth;
    const h = root.clientHeight;
    const mobile = w < 640;
    if (mobile !== mobileRef.current) {
      mobileRef.current = mobile;
      setIsMobile(mobile);
    }
    const rect = computeRect(w, h, aspectRef.current);
    const backdrop = backdropRef.current;
    if (backdrop) {
      const bandH = h - HEADER_OFFSET - 24;
      backdrop.style.fontSize = Math.min(bandH * 0.95, (w * 0.92) / (BACKDROP_TEXT.length * 0.56)) + 'px';
      backdrop.style.top = HEADER_OFFSET + bandH / 2 + 'px';
    }
    const img = imgRef.current;
    if (img) {
      img.style.left = rect.x + 'px';
      img.style.top = rect.y + 'px';
      img.style.width = rect.w + 'px';
      img.style.height = rect.h + 'px';
    }
    engineRef.current?.resize(w, h, rect);
  }, []);

  // engine lifecycle: created once, listens to the whole window so the hero copy never blocks the cursor
  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    // a fresh canvas per engine: a released WebGL context can never be reused
    const canvas = document.createElement('canvas');
    canvas.className = 'sculpt-canvas';
    stage.appendChild(canvas);
    const fail = () => { root.dataset.gl = 'off'; };
    let engine: LiquidEngine | null = null;
    try {
      engine = new LiquidEngine(canvas, {
        interactive: true,
        strength: 1,
        radius: 220,
        density: 1,
        dotSize: 1,
        spread: 1,
        turbulence: 1,
        returnSpeed: 1,
        streaks: true,
        ambient: false,
        ambientIntensity: 1,
        speed: 1,
        intro: false,
        liquid: 1,
        reducedMotion: reducedRef.current,
        bg: readBg(),
        imgBg: null,
      }, fail);
      engineRef.current = engine;
    } catch {
      fail();
    }

    const ro = new ResizeObserver(relayout);
    ro.observe(root);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) engine?.setVisible(e.isIntersecting && !document.hidden);
    });
    io.observe(root);
    const onVisibility = () => engine?.setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const b = root.getBoundingClientRect();
      const inside = e.clientY >= b.top && e.clientY <= b.bottom && e.clientX >= b.left && e.clientX <= b.right;
      if (inside) engine?.pointer('move', e.clientX - b.left, e.clientY - b.top);
      else engine?.pointer('leave', 0, 0);
    };
    const onLeave = () => engine?.pointer('leave', 0, 0);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      engine?.destroy();
      engineRef.current = null;
      canvas.remove();
      delete root.dataset.gl;
    };
  }, [relayout]);

  // load the sculpture whenever the theme or layout asks for another image;
  // the canvas dips out while the static image covers the swap
  useEffect(() => {
    const root = rootRef.current;
    const engine = engineRef.current;
    if (!root) return;
    let cancelled = false;
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    const swapping = root.dataset.gl === 'on';
    if (swapping) root.dataset.swap = '1';
    image.onload = () => {
      if (cancelled) return;
      aspectRef.current = image.naturalWidth / image.naturalHeight || aspectRef.current;
      relayout();
      if (engine && root.dataset.gl !== 'off') {
        try {
          engine.onFirstFrame = () => {
            if (cancelled) return;
            root.dataset.gl = 'on';
            delete root.dataset.swap;
          };
          engine.setImage(image);
          relayout();
        } catch {
          root.dataset.gl = 'off';
        }
      } else delete root.dataset.swap;
    };
    image.onerror = () => { delete root.dataset.swap; };
    // let the fade-out start before the GPU upload
    const t = window.setTimeout(() => { image.src = activeSrc; }, swapping ? 280 : 0);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      image.onload = null;
      image.onerror = null;
    };
  }, [activeSrc, relayout]);

  // theme colour and reduced-motion changes are applied live, without re-creating the engine
  useEffect(() => {
    engineRef.current?.setOptions({ bg: readBg(), reducedMotion: reduced });
  }, [theme, reduced]);

  return (
    <div ref={rootRef} className="sculpt-root" aria-hidden="true">
      <div ref={backdropRef} className="sculpt-backdrop">{BACKDROP_TEXT}</div>
      <div ref={stageRef} className="sculpt-stage">
        <img ref={imgRef} className="sculpt-fallback" src={activeSrc} alt="" crossOrigin="anonymous" draggable={false} />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Glass Folder Cards Engine & Component
   Official implementation from @kedhareswer/glass-folder-cards
   Complete 3D Hinged Folder, PRNG Noise Art, Frosted Glass & Files
───────────────────────────────────────────────────────────── */

export type ArtPreset = 'aurora' | 'ember' | 'dusk' | 'glacier' | 'verdant';

export type ArtRecipe = {
  style: 'marble' | 'streak';
  colors: string[];
  scale?: number;
  warp?: number;
  angle?: number;
  gloss?: number;
  veins?: number;
};

export type FolderArt = ArtPreset | ArtRecipe | 'none';

export type FolderFile = {
  name: string;
  meta?: string;
  art?: ArtPreset | ArtRecipe;
  image?: string;
  href?: string;
};

export type FolderMenuItem = {
  label: string;
  onSelect?: () => void;
  danger?: boolean;
};

export type GlassFolderProps = {
  label?: string;
  meta?: string;
  tone?: 'light' | 'dark';
  art?: FolderArt;
  seed?: number;
  image?: string;
  files?: FolderFile[];
  action?: 'add' | 'more' | 'none';
  onAdd?: (files: FolderFile[]) => FolderFile | void;
  onFilesChange?: (files: FolderFile[]) => void;
  menu?: FolderMenuItem[];
  labelPlacement?: 'bottom-left' | 'top-left' | 'top-right';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onFileSelect?: (file: FolderFile, index: number) => void;
  width?: number;
  appear?: boolean;
  appearDelay?: number;
  className?: string;
  style?: React.CSSProperties;
};

const ART_PRESETS: Record<ArtPreset, ArtRecipe> = {
  aurora: {
    style: 'streak',
    colors: ['#f4efe9', '#e9c2b8', '#c2433f', '#2a1e2a', '#22395e', '#6f97c2', '#e5edf4'],
    scale: 0.7,
    warp: 1.4,
    angle: -0.62,
    gloss: 0.18,
    veins: 0,
  },
  ember: {
    style: 'marble',
    colors: ['#07090c', '#16252c', '#3d5f68', '#1a1416', '#a3201a', '#ef4a2b', '#ff8a5c'],
    scale: 0.62,
    warp: 3.2,
    angle: -0.5,
    gloss: 0.55,
    veins: 0.6,
  },
  dusk: {
    style: 'marble',
    colors: ['#120c18', '#3e2850', '#8f6c9c', '#2b1a24', '#b3502f', '#eab08a', '#fbe7d2'],
    scale: 0.75,
    warp: 3.6,
    angle: 0.8,
    gloss: 0.5,
    veins: 0.5,
  },
  glacier: {
    style: 'streak',
    colors: ['#f7f8fa', '#d9e2ea', '#9fb4c7', '#e8edf2', '#bccbd8', '#ffffff'],
    scale: 0.7,
    warp: 1.6,
    angle: 0.35,
    gloss: 0.25,
    veins: 0,
  },
  verdant: {
    style: 'marble',
    colors: ['#070b08', '#173024', '#4f7a5a', '#141812', '#a7843a', '#e9cf87', '#fbf3d6'],
    scale: 0.7,
    warp: 3.4,
    angle: 2.1,
    gloss: 0.5,
    veins: 0.5,
  },
};

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = /^[0-9a-f]{6}$/i.test(h) ? parseInt(h, 16) : 0x808080;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function makeFbm(seed: number): (x: number, y: number, octaves: number) => number {
  const r = rng(seed);
  const perm = new Uint8Array(512);
  const grad = new Float32Array(512);
  const p: number[] = [];
  for (let i = 0; i < 256; i++) p.push(i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    const t = p[i];
    p[i] = p[j];
    p[j] = t;
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  for (let i = 0; i < 256; i++) {
    const a = r() * Math.PI * 2;
    grad[i * 2] = Math.cos(a);
    grad[i * 2 + 1] = Math.sin(a);
  }
  const noise = (x: number, y: number): number => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const X = xi & 255;
    const Y = yi & 255;
    const h00 = perm[X + perm[Y]] * 2;
    const h10 = perm[X + 1 + perm[Y]] * 2;
    const h01 = perm[X + perm[Y + 1]] * 2;
    const h11 = perm[X + 1 + perm[Y + 1]] * 2;
    const d00 = grad[h00] * xf + grad[h00 + 1] * yf;
    const d10 = grad[h10] * (xf - 1) + grad[h10 + 1] * yf;
    const d01 = grad[h01] * xf + grad[h01 + 1] * (yf - 1);
    const d11 = grad[h11] * (xf - 1) + grad[h11 + 1] * (yf - 1);
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10);
    const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
    return d00 + u * (d10 - d00) + v * (d01 - d00 + u * (d11 - d01 - d10 + d00));
  };
  return (x, y, octaves) => {
    let sum = 0;
    let amp = 0.5;
    for (let i = 0; i < octaves; i++) {
      sum += amp * noise(x, y);
      const nx = 1.6 * x + 1.2 * y + 7.1;
      y = -1.2 * x + 1.6 * y + 3.3;
      x = nx;
      amp *= 0.5;
    }
    return sum;
  };
}

export type ArtJob = {
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
  step: (rows: number) => boolean;
};

function createArtJob(width: number, height: number, recipe: ArtRecipe, seed: number): ArtJob {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  const colors = recipe.colors.length >= 2 ? recipe.colors : ['#111111', '#eeeeee'];
  const stops = colors.map((c, i) => ({ t: i / (colors.length - 1), c: hexToRgb(c) }));
  const scale = recipe.scale ?? 0.7;
  const warp = recipe.warp ?? 3;
  const gloss = recipe.gloss ?? 0.4;
  const veins = recipe.veins ?? 0;
  const streak = recipe.style === 'streak';
  const fbm = makeFbm(seed * 977 + 13);
  const r = rng(seed + 1);
  const ox = r() * 50;
  const oy = r() * 50;
  const angle = (recipe.angle ?? 0) + (r() - 0.5) * 0.5;
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const m = Math.min(w, h);
  const gw = Math.ceil(w / 2) + 3;
  const gh = Math.ceil(h / 2) + 3;
  const G = new Float32Array(gw * gh);
  const GQ = new Float32Array(gw * gh);
  const F = new Float32Array(w * h);
  const Q = new Float32Array(w * h);
  const pixels = new Uint8ClampedArray(w * h * 4);
  let row = 0;

  const field = (gy: number) => {
    for (let gx = 0; gx < gw; gx++) {
      const u = ((gx - 1) * 2 - w / 2) / m;
      const v = ((gy - 1) * 2 - h / 2) / m;
      let px = (u * ca - v * sa) * scale;
      let py = (u * sa + v * ca) * scale;
      if (streak) {
        px *= 0.14;
        py *= 2.2;
      }
      px += ox;
      py += oy;
      const qx = fbm(px, py, 3);
      const qy = fbm(px + 5.2, py + 1.3, 3);
      const rx = fbm(px + warp * qx + 1.7, py + warp * qy + 9.2, 3);
      const ry = fbm(px + warp * qx + 8.3, py + warp * qy + 2.8, 3);
      G[gy * gw + gx] = fbm(px + warp * rx, py + warp * ry, 4);
      GQ[gy * gw + gx] = Math.sqrt(qx * qx + qy * qy);
    }
  };

  const upsample = () => {
    const cr = (a: number, b: number, c: number, d: number) => (-a + 9 * b + 9 * c - d) / 16;
    const T = new Float32Array(w * gh);
    for (let gy = 0; gy < gh; gy++) {
      const r_row = gy * gw;
      for (let x = 0; x < w; x++) {
        const c = (x >> 1) + 1;
        T[gy * w + x] = x & 1 ? cr(G[r_row + c - 1], G[r_row + c], G[r_row + c + 1], G[r_row + c + 2]) : G[r_row + c];
      }
    }
    for (let y = 0; y < h; y++) {
      const c = (y >> 1) + 1;
      for (let x = 0; x < w; x++) {
        F[y * w + x] = y & 1 ? cr(T[(c - 1) * w + x], T[c * w + x], T[(c + 1) * w + x], T[(c + 2) * w + x]) : T[c * w + x];
        const gx = (x >> 1) + 1;
        const q0 = GQ[c * gw + gx];
        const qx = x & 1 ? (q0 + GQ[c * gw + gx + 1]) / 2 : q0;
        const q1 = y & 1 ? (x & 1 ? (GQ[(c + 1) * gw + gx] + GQ[(c + 1) * gw + gx + 1]) / 2 : GQ[(c + 1) * gw + gx]) : qx;
        Q[y * w + x] = (qx + q1) / 2;
      }
    }
  };

  const colorize = () => {
    const sample: number[] = [];
    const stride = Math.max(1, Math.floor(F.length / 4096));
    for (let i = 0; i < F.length; i += stride) sample.push(F[i]);
    sample.sort((a, b) => a - b);
    const lo = sample[Math.floor(sample.length * 0.02)];
    const hi = sample[Math.floor(sample.length * 0.98)];
    const k = 1 / (hi - lo || 1);
    const lx = -0.55;
    const ly = -0.65;
    const lz = 0.52;
    const slope = k * m * 0.012;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        let t = (F[i] - lo) * k;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        let j = 1;
        while (j < stops.length - 1 && stops[j].t < t) j++;
        const a = stops[j - 1];
        const b = stops[j];
        let f = (t - a.t) / (b.t - a.t || 1);
        f = f < 0 ? 0 : f > 1 ? 1 : f;
        f = f * f * (3 - 2 * f);
        const gx = (F[x < w - 1 ? i + 1 : i] - F[x > 0 ? i - 1 : i]) * slope;
        const gy = (F[y < h - 1 ? i + w : i] - F[y > 0 ? i - w : i]) * slope;
        const nd = (-gx * lx - gy * ly + lz) / Math.sqrt(gx * gx + gy * gy + 1);
        const spec = Math.pow(nd > 0 ? nd : 0, 24) * gloss * 255;
        const silk = 1 + 0.035 * Math.sin(t * 150 + Q[i] * 24);
        const vein = veins * Math.max(0, 1 - Math.abs(Q[i] - 0.42) * 14) * 0.6;
        const lit = (0.82 + 0.28 * nd) * silk * (1 - vein);
        pixels[i * 4] = (a.c[0] + (b.c[0] - a.c[0]) * f) * lit + spec;
        pixels[i * 4 + 1] = (a.c[1] + (b.c[1] - a.c[1]) * f) * lit + spec;
        pixels[i * 4 + 2] = (a.c[2] + (b.c[2] - a.c[2]) * f) * lit + spec;
        pixels[i * 4 + 3] = 255;
      }
    }
  };

  const step = (rows: number): boolean => {
    if (row >= gh) return true;
    const end = Math.min(gh, row + Math.max(1, rows));
    while (row < end) field(row++);
    if (row < gh) return false;
    upsample();
    colorize();
    return true;
  };

  return { width: w, height: h, pixels, step };
}

function fanSlot(index: number, count: number): number {
  return count <= 1 ? 0 : (index / (count - 1)) * 2 - 1;
}

const recipeOf = (art: ArtPreset | ArtRecipe): ArtRecipe => (typeof art === 'string' ? ART_PRESETS[art] : art);

type Painted = HTMLCanvasElement;
const artCache = new Map<string, Promise<Painted>>();
const queue: { job: ArtJob; priority: number; done: (c: Painted) => void }[] = [];
let pumping = false;

function pump() {
  if (pumping) return;
  pumping = true;
  const tick = () => {
    const until = performance.now() + 7;
    while (queue.length && performance.now() < until) {
      const head = queue[0];
      if (head.job.step(4)) {
        queue.shift();
        const c = document.createElement('canvas');
        c.width = head.job.width;
        c.height = head.job.height;
        const context = c.getContext('2d');
        if (context) {
          const image = context.createImageData(c.width, c.height);
          image.data.set(head.job.pixels);
          context.putImageData(image, 0, 0);
        }
        head.done(c);
      }
    }
    if (queue.length) requestAnimationFrame(tick);
    else pumping = false;
  };
  requestAnimationFrame(tick);
}

function paint(recipe: ArtRecipe, seed: number, w: number, h: number, priority: number): Promise<Painted> {
  const key = JSON.stringify([recipe, seed, w, h]);
  let p = artCache.get(key);
  if (!p) {
    p = new Promise<Painted>((done) => {
      let at = queue.length;
      while (at > 1 && queue[at - 1].priority > priority) at--;
      queue.splice(at, 0, { job: createArtJob(w, h, recipe, seed), priority, done });
      pump();
    });
    artCache.set(key, p);
  }
  return p;
}

function ArtCanvas({
  art,
  seed,
  w,
  h,
  density,
  priority,
  className,
}: {
  art: ArtPreset | ArtRecipe;
  seed: number;
  w: number;
  h: number;
  density: number;
  priority: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = React.useState(false);
  const recipe = recipeOf(art);
  const key = JSON.stringify(recipe);
  const pw = Math.round(w * density);
  const ph = Math.round(h * density);

  React.useEffect(() => {
    let live = true;
    setReady(false);
    try {
      paint(JSON.parse(key) as ArtRecipe, seed, pw, ph, priority)
        .then((src) => {
          const c = ref.current;
          if (!live || !c) return;
          c.width = src.width;
          c.height = src.height;
          c.getContext('2d')?.drawImage(src, 0, 0);
          setReady(true);
        })
        .catch(() => {
          if (live) setReady(false);
        });
    } catch {
      if (live) setReady(false);
    }
    return () => {
      live = false;
    };
  }, [key, seed, pw, ph, priority]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      data-ready={ready || undefined}
      style={{ width: w, height: h, maxWidth: 'none' }}
    />
  );
}

const W = 340;
const H = 272;
const HEADROOM = 54;
const FRONT_TOP = 74;
const FRONT_H = H - FRONT_TOP;
const SHEET_W = 272;
const SHEET_H = 184;

const BACK_PATH =
  'M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z';
const FRONT_PATH =
  'M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 ' +
  (FRONT_H - 22) +
  'A22 22 0 0 1 318 ' +
  FRONT_H +
  'L22 ' +
  FRONT_H +
  'A22 22 0 0 1 0 ' +
  (FRONT_H - 22) +
  'Z';

const MAX_VISIBLE = 4;

export const GlassFolder: FC<GlassFolderProps> = ({
  label = 'My Files',
  meta,
  tone = 'light',
  art = 'aurora',
  seed = 3,
  image,
  files: initialFiles = [],
  action = 'more',
  onAdd,
  onFilesChange,
  menu = [],
  labelPlacement = 'bottom-left',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onFileSelect,
  width = 320,
  appear = true,
  appearDelay = 0,
  className,
  style,
}) => {
  const uid = React.useId().replace(/:/g, '');
  const rootRef = React.useRef<HTMLDivElement>(null);
  const filesRef = React.useRef<HTMLDivElement>(null);
  const hitRef = React.useRef<HTMLButtonElement>(null);
  const keyRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const [files, setFiles] = React.useState<FolderFile[]>(initialFiles);
  const ids = React.useRef<number[]>(initialFiles.map((_, i) => i));
  const nextId = React.useRef(initialFiles.length);
  const [dropped, setDropped] = React.useState<number | null>(null);
  const [bump, setBump] = React.useState(0);

  const [openState, setOpenState] = React.useState(defaultOpen);
  const open = openProp ?? openState;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange]
  );
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [entered, setEntered] = React.useState(!appear);

  const k = width / W;
  const density = Math.min(1.5, Math.max(1, typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1)) * k;

  React.useEffect(() => {
    if (!appear) return;
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setEntered(true);
      return;
    }
    let t = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        t = window.setTimeout(() => setEntered(true), appearDelay);
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [appear, appearDelay]);

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const write = () => {
      raf = 0;
      el.style.setProperty('--gf-px', px.toFixed(3));
      el.style.setProperty('--gf-py', py.toFixed(3));
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width) * 2 - 1;
      py = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(write);
    };
    const leave = () => {
      px = 0;
      py = 0;
      if (!raf) raf = requestAnimationFrame(write);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  React.useEffect(() => {
    filesRef.current?.toggleAttribute('inert', !open);
  }, [open]);

  React.useEffect(() => {
    if (!open && !menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (menuOpen) {
        setMenuOpen(false);
        keyRef.current?.focus();
      } else {
        setOpen(false);
        hitRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (menuOpen && !menuRef.current?.contains(t) && !keyRef.current?.contains(t)) setMenuOpen(false);
      if (open && !menuOpen && !rootRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open, menuOpen, setOpen]);

  const addFile = () => {
    const made = onAdd?.(files);
    const file: FolderFile = made || { name: 'Item ' + (files.length + 1), meta: 'Just added' };
    const next = [...files, file];
    const id = nextId.current++;
    ids.current = [...ids.current, id];
    setFiles(next);
    setDropped(id);
    setBump((b) => b + 1);
    onFilesChange?.(next);
  };

  const menuItems: FolderMenuItem[] = [
    { label: open ? 'Close dossier' : 'Open dossier', onSelect: () => setOpen(!open) },
    ...menu,
  ];

  const onMenuKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? []);
    const at = items.indexOf(document.activeElement as HTMLElement);
    const go = (i: number) => {
      e.preventDefault();
      items[(i + items.length) % items.length]?.focus();
    };
    if (e.key === 'ArrowDown') go(at + 1);
    else if (e.key === 'ArrowUp') go(at - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(items.length - 1);
    else if (e.key === 'Tab') setMenuOpen(false);
  };

  const start = Math.max(0, files.length - MAX_VISIBLE);
  const visible = files.slice(start);
  const count = files.length;
  const metaLine = meta ?? count + (count === 1 ? ' credential' : ' credentials');

  return (
    <div
      ref={rootRef}
      className={'gf-root' + (className ? ' ' + className : '')}
      data-tone={tone}
      data-open={open || undefined}
      data-entered={entered || undefined}
      data-place={labelPlacement}
      style={{ width, height: (H + HEADROOM) * k, ...style }}
    >
      <style>{GF_CSS}</style>
      <div className="gf-stage" style={{ transform: 'translateY(' + HEADROOM * k + 'px) scale(' + k + ')' }}>
        <div className="gf-tilt">
          <div className="gf-shadow" aria-hidden="true" />

          {/* Back panel & art */}
          <div className="gf-back" style={{ clipPath: "path('" + BACK_PATH + "')" }} aria-hidden="true">
            {image ? (
              <img className="gf-art" src={image} alt="" width={W + 24} height={H + 24} draggable={false} />
            ) : art !== 'none' ? (
              <ArtCanvas className="gf-art" art={art} seed={seed} w={W + 24} h={H + 24} density={density} priority={0} />
            ) : null}
            <div className="gf-back-sheen" />
          </div>
          <svg className="gf-rim gf-back-rim" viewBox={'0 0 ' + W + ' ' + H} aria-hidden="true">
            <path d={BACK_PATH} />
          </svg>

          {/* Frosted front glass panel */}
          <div
            key={bump}
            className={'gf-front' + (bump ? ' gf-front--bump' : '')}
            style={{ clipPath: "path('" + FRONT_PATH + "')" }}
          >
            <div className="gf-tint" aria-hidden="true" />
            <div className="gf-spec" aria-hidden="true" />
            <svg className="gf-rim gf-front-rim" viewBox={'0 0 ' + W + ' ' + FRONT_H} aria-hidden="true">
              <defs>
                <linearGradient id={'gf-rim-' + uid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
                  <stop offset="0.35" stopColor="#fff" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.12" />
                </linearGradient>
              </defs>
              <path d={FRONT_PATH} stroke={'url(#gf-rim-' + uid + ')'} />
            </svg>
            <button
              ref={hitRef}
              type="button"
              className="gf-hit"
              aria-expanded={open}
              aria-label={(open ? 'Close ' : 'Open ') + label + ', ' + count + (count === 1 ? ' item' : ' items')}
              onClick={() => {
                setMenuOpen(false);
                setOpen(!open);
              }}
            />
            <div className="gf-label">
              <span className="gf-title">{label}</span>
              <span className="gf-meta" key={metaLine}>
                {metaLine}
              </span>
            </div>
          </div>

          {/* Contents stack (fanned out files) */}
          <div ref={filesRef} className="gf-files" role="list" aria-label={label + ' contents'}>
            {visible.map((file, v) => {
              const id = ids.current[start + v];
              const slot = fanSlot(v, visible.length);
              const jitter = rng(hashString(file.name) + id);
              const picture = !!(file.art || file.image);
              const inner = (
                <>
                  {picture ? (
                    file.image ? (
                      <img className="gf-sheet-art" src={file.image} alt="" width={SHEET_W} height={SHEET_H} draggable={false} />
                    ) : (
                      <ArtCanvas
                        className="gf-sheet-art"
                        art={file.art as ArtPreset | ArtRecipe}
                        seed={hashString(file.name) % 997}
                        w={SHEET_W}
                        h={SHEET_H}
                        density={Math.min(density, 1.25)}
                        priority={1}
                      />
                    )
                  ) : (
                    <span className="gf-lines" aria-hidden="true">
                      <i style={{ width: '86%' }} />
                      <i style={{ width: '92%' }} />
                      <i style={{ width: '64%' }} />
                      <i style={{ width: '88%' }} />
                      <i style={{ width: '42%' }} />
                    </span>
                  )}
                  {file.image ? null : (
                    <span className="gf-sheet-head">
                      <span className="gf-sheet-name">{file.name}</span>
                      {file.meta ? <span className="gf-sheet-meta">{file.meta}</span> : null}
                    </span>
                  )}
                </>
              );
              const common = {
                className: 'gf-sheet' + (picture ? ' gf-sheet--art' : '') + (id === dropped ? ' gf-sheet--drop' : ''),
                style: {
                  '--gf-slot': slot,
                  '--gf-depth': visible.length - 1 - v,
                  '--gf-jx': ((jitter() - 0.5) * 10).toFixed(2) + 'px',
                  '--gf-jr': ((jitter() - 0.5) * 3.2).toFixed(2) + 'deg',
                  zIndex: visible.length - v,
                } as React.CSSProperties,
                onAnimationEnd: id === dropped ? () => setDropped(null) : undefined,
              };

              const handleSheetClick = (e: React.MouseEvent) => {
                e.stopPropagation();
                if (file.href) {
                  if (file.href.startsWith('#')) {
                    const el = document.querySelector(file.href);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.open(file.href, '_blank', 'noopener,noreferrer');
                  }
                }
                onFileSelect?.(file, start + v);
              };

              return (
                <div key={id} role="listitem" className="gf-sheet-slot">
                  {file.href ? (
                    <a
                      {...common}
                      href={file.href}
                      title={file.name}
                      target={file.href.startsWith('#') ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      onClick={handleSheetClick}
                    >
                      {inner}
                    </a>
                  ) : (
                    <button {...common} type="button" title={file.name} onClick={handleSheetClick}>
                      {inner}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {action !== 'none' ? (
            <button
              ref={keyRef}
              type="button"
              className={'gf-key gf-key--' + action}
              aria-label={action === 'add' ? 'Add item to ' + label : 'More options for ' + label}
              aria-haspopup={action === 'more' ? 'menu' : undefined}
              aria-expanded={action === 'more' ? menuOpen : undefined}
              aria-controls={action === 'more' ? 'gf-menu-' + uid : undefined}
              onClick={() => (action === 'add' ? addFile() : setMenuOpen((m) => !m))}
            >
              {action === 'add' ? (
                <svg key={bump} className="gf-glyph gf-glyph--plus" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 4.5v15M4.5 12h15" />
                </svg>
              ) : (
                <svg className="gf-glyph gf-glyph--more" viewBox="0 0 30 12" aria-hidden="true">
                  <rect x="1" y="1.5" width="8" height="9" rx="3.4" />
                  <rect x="11" y="1.5" width="8" height="9" rx="3.4" />
                  <rect x="21" y="1.5" width="8" height="9" rx="3.4" />
                </svg>
              )}
            </button>
          ) : null}

          {action === 'more' ? (
            <div
              ref={menuRef}
              id={'gf-menu-' + uid}
              role="menu"
              aria-label={label + ' options'}
              className="gf-menu"
              data-open={menuOpen || undefined}
              onKeyDown={onMenuKey}
            >
              {menuItems.map((item, i) => (
                <button
                  key={item.label + i}
                  type="button"
                  role="menuitem"
                  tabIndex={menuOpen ? -1 : undefined}
                  disabled={!menuOpen}
                  className={'gf-menu-item' + (item.danger ? ' gf-menu-item--danger' : '')}
                  onClick={() => {
                    setMenuOpen(false);
                    keyRef.current?.focus();
                    item.onSelect?.();
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   FolderCard: GlassFolder fed with portfolio items
───────────────────────────────────────────────────────────── */

export type FolderItem = {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  image?: string;
  url?: string;
  liveUrl?: string;
  githubUrl?: string;
  [key: string]: unknown;
};

const FILE_ART: ArtPreset[] = ['ember', 'dusk', 'verdant', 'aurora', 'glacier'];

export const FolderCard: FC<{
  categoryTitle: string;
  countLabel?: string;
  items: FolderItem[];
  artPreset?: ArtPreset;
  className?: string;
}> = ({ categoryTitle, countLabel, items, artPreset = 'aurora', className = '' }) => {
  const theme = useSiteTheme();
  const [folderWidth, setFolderWidth] = useState(330);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setFolderWidth(Math.min(330, Math.max(270, window.innerWidth - 32)));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const files: FolderFile[] = items.map((item, i) => ({
    name: item.title,
    meta: item.image ? undefined : (item.date || item.subtitle),
    href: (item.url || (item.pdf as string) || item.liveUrl || item.githubUrl || (item.image as string) || (item.id ? `#${item.id}` : undefined)),
    image: item.image,
    art: item.image ? undefined : i % 2 === 0 ? FILE_ART[(i + 1) % FILE_ART.length] : undefined,
  }));

  return (
    <div className={`flex justify-center max-w-full overflow-hidden ${className}`}>
      <GlassFolder
        label={categoryTitle}
        meta={countLabel}
        tone={theme}
        art={items.some((item) => item.image) ? 'none' : artPreset}
        image={items.find((item) => item.image)?.image}
        action="none"
        width={folderWidth}
        files={files}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Scoped CSS Styles for Glass Folder Cards
───────────────────────────────────────────────────────────── */

const GF_CSS = `
.gf-root {
  --gf-px: 0;
  --gf-py: 0;
  --gf-ease: cubic-bezier(.2, .8, .2, 1);
  --gf-spring: cubic-bezier(.34, 1.36, .5, 1);
  --gf-hinge: 0deg;
  --gf-lift: 42px;
  --gf-spread: 0px;
  --gf-fan: 0deg;
  --gf-stack: 15px;
  --gf-ink: #141416;
  --gf-ink-soft: rgba(20, 20, 22, .55);
  position: relative;
  display: inline-block;
  flex: none;
  vertical-align: top;
  font-family: 'Geist', ui-sans-serif, system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  isolation: isolate;
}
.gf-root[data-tone="dark"] { --gf-ink: #f5f5f7; --gf-ink-soft: rgba(245, 245, 247, .58); }
.gf-root:hover, .gf-root:focus-within { --gf-hinge: -18deg; --gf-lift: -76px; --gf-spread: 32px; --gf-fan: 4.2deg; --gf-stack: 20px; }
.gf-root[data-open] { --gf-hinge: -26deg; --gf-lift: -98px; --gf-spread: 42px; --gf-fan: 5.2deg; --gf-stack: 32px; }
.gf-root:hover .gf-files,
.gf-root:focus-within .gf-files,
.gf-root[data-open] .gf-files {
  z-index: 25;
  pointer-events: auto;
}

.gf-stage {
  position: absolute;
  left: 0;
  top: 0;
  width: 340px;
  height: 272px;
  transform-origin: 0 0;
}
.gf-tilt {
  position: absolute;
  inset: 0;
  transform: perspective(1400px) rotateX(calc(var(--gf-py) * -3deg)) rotateY(calc(var(--gf-px) * 4deg));
  transition: transform .9s var(--gf-ease);
}

.gf-shadow {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: -6px;
  height: 60px;
  border-radius: 40px;
  background: rgba(16, 18, 24, .34);
  filter: blur(22px);
  transform: translateX(calc(var(--gf-px) * -8px));
  transition: transform .9s var(--gf-ease), opacity .9s var(--gf-ease);
}
.gf-root[data-tone="dark"] .gf-shadow { background: rgba(0, 0, 0, .62); }

.gf-back {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(180deg, #f3f3f4 0%, #e3e3e6 100%);
}
.gf-root[data-tone="dark"] .gf-back { background: linear-gradient(180deg, #2a2a2e 0%, #121214 100%); }
.gf-art {
  position: absolute;
  left: -12px;
  top: -12px;
  max-width: none;
  object-fit: cover;
  transform: translate(calc(var(--gf-px) * -7px), calc(var(--gf-py) * -6px)) scale(1.02);
  transition: transform 1.1s var(--gf-ease), opacity 1.2s var(--gf-ease), filter 1.2s var(--gf-ease);
}
canvas.gf-art { opacity: 0; filter: blur(14px) saturate(.6); }
canvas.gf-art[data-ready] { opacity: 1; filter: none; }
.gf-back-sheen {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, .22) 0%, rgba(255, 255, 255, 0) 22%),
    radial-gradient(120% 80% at 80% 0%, rgba(255, 255, 255, .16), rgba(255, 255, 255, 0) 60%);
  pointer-events: none;
}

.gf-rim {
  position: absolute;
  left: 0;
  top: 0;
  max-width: none;
  overflow: visible;
  pointer-events: none;
  fill: none;
}
.gf-back-rim { width: 340px; height: 272px; }
.gf-back-rim path { stroke: rgba(255, 255, 255, .45); stroke-width: 1; }
.gf-root[data-tone="dark"] .gf-back-rim path { stroke: rgba(255, 255, 255, .16); }

/* Files */
.gf-files {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  clip-path: inset(-400px -400px 10px -400px);
}
.gf-sheet-slot { display: contents; }
.gf-sheet {
  all: unset;
  box-sizing: border-box;
  position: absolute;
  left: 34px;
  top: 96px;
  width: 272px;
  height: 184px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  pointer-events: auto;
  background: linear-gradient(180deg, #ffffff 0%, #f2f2f0 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .9),
    0 0 0 .5px rgba(0, 0, 0, .1),
    0 10px 26px -8px rgba(10, 12, 20, .28);
  transform-origin: 50% 100%;
  transform:
    translate(calc(var(--gf-jx) + var(--gf-slot) * var(--gf-spread)), calc(var(--gf-lift) + var(--gf-depth) * var(--gf-stack) * -1))
    rotate(calc(var(--gf-jr) + var(--gf-slot) * var(--gf-fan)));
  transition:
    transform .75s var(--gf-spring) calc(var(--gf-depth) * 40ms),
    box-shadow .4s var(--gf-ease),
    translate .9s var(--gf-ease),
    opacity .9s var(--gf-ease);
}
.gf-root[data-tone="dark"] .gf-sheet { background: linear-gradient(180deg, #2c2c30 0%, #1c1c1f 100%); box-shadow: inset 0 1px 0 rgba(255, 255, 255, .14), 0 0 0 .5px rgba(255, 255, 255, .08), 0 12px 28px -8px rgba(0, 0, 0, .7); }
.gf-sheet--art { background: #1a1a1d; }
.gf-sheet:hover,
.gf-sheet:focus-visible {
  z-index: 60 !important;
  transform:
    translate(calc(var(--gf-jx) + var(--gf-slot) * var(--gf-spread)), calc(var(--gf-lift) + var(--gf-depth) * var(--gf-stack) * -1 - 22px))
    scale(1.06) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .9), 0 0 0 1.5px #38bdf8, 0 24px 44px -10px rgba(56, 189, 248, .45) !important;
  transition-duration: .15s !important;
  transition-delay: 0s !important;
}
.gf-sheet:focus-visible { outline: 2px solid #38bdf8; outline-offset: 2px; }
.gf-sheet-art {
  position: absolute;
  left: 0;
  top: 0;
  width: 272px;
  height: 184px;
  max-width: none;
  object-fit: cover;
  pointer-events: none;
  transition: opacity .9s var(--gf-ease), filter .9s var(--gf-ease);
}
canvas.gf-sheet-art { opacity: 0; filter: blur(10px); }
canvas.gf-sheet-art[data-ready] { opacity: 1; filter: none; }
.gf-sheet--art::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .18);
  pointer-events: none;
}
.gf-sheet-head {
  position: absolute;
  left: 14px;
  right: 14px;
  top: 11px;
  z-index: 1;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  white-space: nowrap;
}
.gf-sheet-name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12.5px;
  font-weight: 560;
  letter-spacing: -.005em;
  color: #18181b;
}
.gf-sheet-meta {
  flex: none;
  font-family: ui-monospace, "SF Mono", monospace;
  font-size: 10px;
  letter-spacing: .02em;
  color: rgba(24, 24, 27, .5);
}
.gf-root[data-tone="dark"] .gf-sheet-name, .gf-sheet--art .gf-sheet-name { color: #fafafa; }
.gf-root[data-tone="dark"] .gf-sheet-meta, .gf-sheet--art .gf-sheet-meta { color: rgba(250, 250, 250, .66); }
.gf-lines {
  position: absolute;
  left: 14px;
  right: 14px;
  top: 40px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.gf-lines i {
  display: block;
  height: 5px;
  border-radius: 3px;
  background: rgba(24, 24, 27, .08);
}
.gf-lines i:first-child { height: 9px; margin-bottom: 4px; background: rgba(24, 24, 27, .14); }
.gf-root[data-tone="dark"] .gf-lines i { background: rgba(255, 255, 255, .08); }
.gf-root[data-tone="dark"] .gf-lines i:first-child { background: rgba(255, 255, 255, .16); }

.gf-sheet--drop { animation: gf-drop .85s var(--gf-ease) both; }
@keyframes gf-drop {
  0% { translate: 0 -190px; rotate: -9deg; opacity: 0; }
  35% { opacity: 1; }
  72% { translate: 0 10px; rotate: 1deg; }
  100% { translate: 0 0; rotate: 0deg; opacity: 1; }
}

/* Front glass */
.gf-front {
  position: absolute;
  left: 0;
  top: 74px;
  width: 340px;
  height: 198px;
  z-index: 10;
  -webkit-backdrop-filter: blur(22px) saturate(1.5);
  backdrop-filter: blur(22px) saturate(1.5);
  transform-origin: 50% 100%;
  transform: perspective(760px) rotateX(var(--gf-hinge));
  transition: transform .8s var(--gf-spring), translate 1s var(--gf-ease), opacity 1s var(--gf-ease);
}
.gf-front--bump { animation: gf-bump .7s var(--gf-ease) .38s both; }
@keyframes gf-bump {
  0% { scale: 1; }
  35% { scale: 1.018 .975; }
  70% { scale: .996 1.006; }
  100% { scale: 1; }
}
.gf-tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, .16) 0%, rgba(255, 255, 255, .5) 42%, rgba(252, 252, 252, .93) 100%);
}
.gf-root[data-tone="dark"] .gf-tint {
  background: linear-gradient(180deg, rgba(18, 18, 20, .18) 0%, rgba(14, 14, 16, .62) 46%, rgba(8, 8, 10, .94) 100%);
}
.gf-spec {
  position: absolute;
  inset: 0;
  background: radial-gradient(260px 200px at calc(50% + var(--gf-px) * 46%) calc(30% + var(--gf-py) * 40%), rgba(255, 255, 255, .5), rgba(255, 255, 255, 0) 70%);
  mix-blend-mode: soft-light;
  opacity: .9;
  transition: background-position .6s var(--gf-ease);
  pointer-events: none;
}
.gf-root[data-tone="dark"] .gf-spec { mix-blend-mode: screen; opacity: .16; }
.gf-front-rim { width: 340px; height: 198px; }
.gf-front-rim path { stroke-width: 2.4; transition: stroke-width .3s var(--gf-ease); }
.gf-root[data-tone="dark"] .gf-front-rim { opacity: .55; }

.gf-hit {
  all: unset;
  position: absolute;
  inset: 0;
  z-index: 1;
  cursor: pointer;
}
.gf-hit:focus-visible ~ .gf-label .gf-title { text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 4px; }
.gf-front:has(.gf-hit:focus-visible) .gf-front-rim path { stroke-width: 5; }

.gf-label {
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 200px;
  pointer-events: none;
  color: var(--gf-ink);
}
.gf-root[data-place="bottom-left"] .gf-label { left: 28px; bottom: 32px; }
.gf-root[data-place="top-left"] .gf-label { left: 28px; top: 34px; }
.gf-root[data-place="top-right"] .gf-label { right: 32px; top: 52px; align-items: flex-start; }
.gf-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -.012em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gf-meta {
  font-family: ui-monospace, "SF Mono", monospace;
  font-size: 12px;
  letter-spacing: .03em;
  color: var(--gf-ink-soft);
  white-space: nowrap;
}

/* Key button */
.gf-key {
  all: unset;
  box-sizing: border-box;
  position: absolute;
  right: 22px;
  bottom: 22px;
  z-index: 12;
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform .35s var(--gf-spring), box-shadow .35s var(--gf-ease), background .35s var(--gf-ease);
}
.gf-key:hover { transform: translateY(-2px); }
.gf-key:active { transform: translateY(0) scale(.93); transition-duration: .12s; }
.gf-key:focus-visible { outline: 2px solid #4c8dff; outline-offset: 3px; }
.gf-key--add {
  color: #fff;
  background: radial-gradient(120% 90% at 50% 0%, #3a3a3f 0%, #121214 55%, #050506 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .22),
    inset 0 -3px 8px rgba(0, 0, 0, .7),
    0 0 0 1px rgba(0, 0, 0, .75),
    0 14px 22px -8px rgba(0, 0, 0, .55),
    0 3px 6px -2px rgba(0, 0, 0, .35);
}
.gf-root[data-tone="dark"] .gf-key--add {
  color: #111113;
  background: radial-gradient(120% 90% at 50% 0%, #ffffff 0%, #ececee 55%, #d2d2d6 100%);
  box-shadow: inset 0 1px 0 #fff, inset 0 -3px 8px rgba(0, 0, 0, .14), 0 0 0 1px rgba(0, 0, 0, .4), 0 14px 22px -8px rgba(0, 0, 0, .7);
}
.gf-key--more {
  color: #111113;
  background: linear-gradient(180deg, rgba(255, 255, 255, .92) 0%, rgba(226, 226, 230, .82) 100%);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow:
    inset 0 1px 0 #fff,
    inset 0 -2px 4px rgba(0, 0, 0, .06),
    0 0 0 1px rgba(0, 0, 0, .16),
    0 10px 18px -8px rgba(0, 0, 0, .3);
}
.gf-root[data-tone="dark"] .gf-key--more {
  color: #f5f5f7;
  background: linear-gradient(180deg, rgba(255, 255, 255, .16) 0%, rgba(255, 255, 255, .06) 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .22), 0 0 0 1px rgba(255, 255, 255, .1), 0 10px 18px -8px rgba(0, 0, 0, .6);
}
.gf-glyph { display: block; max-width: none; fill: none; stroke: currentColor; stroke-linecap: round; }
.gf-glyph--plus { width: 26px; height: 26px; stroke-width: 1.6; }
.gf-glyph--more { width: 30px; height: 12px; stroke-width: 1.7; }

/* Menu */
.gf-menu {
  position: absolute;
  right: 22px;
  bottom: 90px;
  z-index: 20;
  min-width: 176px;
  padding: 6px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  background: rgba(252, 252, 253, .88);
  -webkit-backdrop-filter: blur(24px) saturate(1.6);
  backdrop-filter: blur(24px) saturate(1.6);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .9), 0 0 0 .5px rgba(0, 0, 0, .14), 0 24px 48px -16px rgba(10, 12, 20, .4);
  transform-origin: 100% 100%;
  opacity: 0;
  visibility: hidden;
  transform: translateY(6px) scale(.94);
  transition: opacity .2s var(--gf-ease), transform .32s var(--gf-spring), visibility 0s .32s;
}
.gf-menu[data-open] { opacity: 1; visibility: visible; transform: none; transition-delay: 0s; }
.gf-root[data-tone="dark"] .gf-menu { background: rgba(30, 30, 34, .88); box-shadow: inset 0 1px 0 rgba(255, 255, 255, .1), 0 0 0 .5px rgba(255, 255, 255, .1), 0 24px 48px -16px rgba(0, 0, 0, .8); }
.gf-menu-item {
  all: unset;
  box-sizing: border-box;
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 500;
  color: #18181b;
  cursor: pointer;
}
.gf-root[data-tone="dark"] .gf-menu-item { color: #f4f4f5; }
.gf-menu-item:hover, .gf-menu-item:focus-visible { background: rgba(24, 24, 27, .07); }
.gf-root[data-tone="dark"] .gf-menu-item:hover, .gf-root[data-tone="dark"] .gf-menu-item:focus-visible { background: rgba(255, 255, 255, .09); }
.gf-menu-item--danger { color: #d92d20; }
.gf-root[data-tone="dark"] .gf-menu-item--danger { color: #ff6b5e; }

/* Entrance */
.gf-root:not([data-entered]) .gf-back,
.gf-root:not([data-entered]) .gf-back-rim { translate: 0 22px; opacity: 0; }
.gf-root:not([data-entered]) .gf-sheet { translate: 0 -120px; opacity: 0; }
.gf-root:not([data-entered]) .gf-front { translate: 0 46px; opacity: 0; }
.gf-root:not([data-entered]) .gf-key { opacity: 0; scale: .6; }
.gf-root:not([data-entered]) .gf-shadow { opacity: 0; }
.gf-back, .gf-back-rim { transition: translate 1s var(--gf-ease), opacity .9s var(--gf-ease); }
.gf-root[data-entered] .gf-sheet { transition-delay: calc(var(--gf-depth) * 40ms), 0s, calc(.18s + var(--gf-depth) * 90ms), calc(.18s + var(--gf-depth) * 90ms); }
.gf-root[data-entered] .gf-front { transition-delay: 0s, .42s, .42s; }
.gf-key { transition: transform .35s var(--gf-spring), box-shadow .35s var(--gf-ease), opacity .6s var(--gf-ease) .7s, scale .7s var(--gf-spring) .7s; }

@media (prefers-reduced-motion: reduce) {
  .gf-root *, .gf-root *::before, .gf-root *::after {
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    animation: none !important;
  }
  .gf-tilt { transform: none; }
}
`;
