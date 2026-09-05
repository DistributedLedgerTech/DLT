/* DLT intro, variant A "Signal".
   three.js r128 globe: lime land point field on a dark glass sphere, thin
   graticule, fresnel rim, starfield, great-circle arcs between mining cities
   carrying traveling packets, ping rings where packets land, two orbit rings,
   a slow camera dolly from wide to close, and on "System ready" a snap to
   wireframe where every node fires at once, then a blur-dissolve into the page.

   This file owns the boot sequence for intro-a.html: terminal lines, progress
   bar, percent, skip button, Enter / Escape, the 10 s cap, the exit transition,
   prefers-reduced-motion (static frame, fast finish). It takes the [data-boot]
   element over from dlt-site.js before that script runs. When WebGL or three.js
   is unavailable it leaves the canvas to the 2D dot globe in dlt-site.js. */
(() => {
  'use strict';

  const boot = document.querySelector('[data-boot]');
  if (!boot) return;

  /* 1440 x 720 equirectangular land mask (1-bit PNG) rasterised once from
     world-atlas land-50m, so the point field needs no runtime fetch. */
  const LAND_MASK = 'data:image/png;base64,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';

  let finished = false;
  let hidden = false;
  let snapped = false;

  /* dlt-site.js keys its own boot driver on [data-boot]; hand this one to us. */
  boot.removeAttribute('data-boot');
  boot.setAttribute('data-boot-signal', '');
  const relock = () => { if (!finished) document.body.classList.add('boot-locked'); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', relock);
  else window.setTimeout(relock, 0);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* review hook: intro-a.html#t=3500 freezes the intro clock at 3500 ms */
  const FROZEN = (() => {
    const match = /(?:^|[#?&])t=(\d+)/.exec(window.location.hash) || /(?:^|[?&])t=(\d+)/.exec(window.location.search);
    return match ? Number(match[1]) : null;
  })();
  const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 700 || window.innerWidth < 680;

  const lines = [...boot.querySelectorAll('[data-boot-line]')];
  const progress = boot.querySelector('[data-boot-progress]');
  const percent = boot.querySelector('[data-boot-percent]');
  const skip = boot.querySelector('[data-boot-skip]');
  const frame = boot.querySelector('[data-intro-frame]');
  const labelA = boot.querySelector('[data-intro-label-a]');
  const labelB = boot.querySelector('[data-intro-label-b]');
  const readout = boot.querySelector('[data-intro-readout]');
  const flash = boot.querySelector('[data-intro-flash]');
  const canvas = boot.querySelector('canvas.boot-globe');

  /* timeline (ms) */
  const DURATION = reduceMotion ? 350 : 6200;   /* 0% to 100% */
  const SNAP_FRAC = 0.87;                       /* "System ready" + wireframe snap */
  const HOLD_MS = reduceMotion ? 0 : 380;       /* sit on 100% before the exit */
  const EXIT_MS = reduceMotion ? 0 : 820;       /* blur-dissolve length, matches the CSS */
  const CAP_MS = 10000;
  const lineFracs = lines.map((_, i) => (lines.length > 1 ? (i / (lines.length - 1)) * SNAP_FRAC : 0));
  const SNAP_T = SNAP_FRAC * DURATION / 1000;  /* seconds, scheduled snap */

  const started = performance.now();
  let lastValue = -1;
  let holdTimer = 0;
  let capTimer = 0;
  let raf = 0;

  /* ------------------------------------------------------------------ */
  /* WebGL scene                                                          */
  /* ------------------------------------------------------------------ */

  const probeWebGL = () => {
    try {
      const probe = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (probe.getContext('webgl') || probe.getContext('experimental-webgl')));
    } catch (error) { return false; }
  };
  const useGL = !!canvas && !!frame && typeof THREE !== 'undefined' && probeWebGL();
  if (useGL) {
    canvas.removeAttribute('data-globe');       /* keep dlt-site.js off this canvas */
  } else {
    boot.classList.add('is-2d');                /* dlt-site.js draws its 2D globe here */
    if (canvas && frame) frame.prepend(canvas);
  }

  const gl = useGL ? createSignalGlobe() : null;

  function createSignalGlobe() {
    const R = 1.5;
    const LIME = 'const vec3 LIME = vec3(0.780, 1.0, 0.180);';
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    const FOV = 40;

    const NODES = [
      [40.7, -74.0], [43.7, -79.4], [41.9, -87.6], [32.8, -96.8], [39.7, -105.0], [37.8, -122.4],
      [47.6, -122.3], [19.4, -99.1], [4.7, -74.1], [-23.5, -46.6], [-34.6, -58.4], [64.1, -21.9],
      [51.5, -0.1], [48.9, 2.3], [50.1, 8.7], [59.3, 18.1], [40.4, -3.7], [52.2, 21.0],
      [25.3, 55.3], [6.5, 3.4], [-1.3, 36.8], [-33.9, 18.4], [19.1, 72.9], [1.3, 103.8],
      [22.3, 114.2], [35.7, 139.7], [37.6, 127.0], [-33.9, 151.2], [-36.8, 174.8], [-6.2, 106.8],
      [51.2, 71.4], [52.3, 104.3]
    ];
    const LINKS = [
      [0, 12], [0, 11], [1, 12], [11, 15], [0, 14], [9, 19], [9, 16], [8, 16],
      [0, 2], [2, 4], [4, 5], [5, 6], [3, 7], [0, 3], [7, 8], [8, 9], [9, 10], [1, 2], [6, 1], [0, 1],
      [12, 13], [13, 14], [14, 17], [14, 15], [16, 13], [12, 14], [12, 16],
      [12, 19], [19, 20], [20, 21], [20, 18], [14, 18], [18, 22], [21, 9], [16, 19],
      [22, 23], [23, 24], [24, 25], [25, 26], [26, 24], [23, 29], [17, 30], [30, 31], [31, 26], [30, 18], [22, 30],
      [25, 5], [25, 6], [23, 27], [27, 28], [28, 5], [29, 27], [24, 27], [10, 21]
    ];
    const N_NODES = NODES.length;

    const toVec = (latDeg, lonDeg) => {
      const lat = latDeg * Math.PI / 180;
      const lon = lonDeg * Math.PI / 180;
      return new THREE.Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), -Math.cos(lat) * Math.sin(lon));
    };
    const nodeVecs = NODES.map((n) => toVec(n[0], n[1]));

    let seed = 1337;
    const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(pr);
    renderer.setClearColor(0x0a0a0a, 1);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.5, 200);
    const world = new THREE.Group();
    world.rotation.x = 0.28;
    scene.add(world);
    const rig = new THREE.Group();
    rig.rotation.x = 0.28;
    scene.add(rig);

    const fire = new Float32Array(N_NODES).fill(-100);
    const U = {
      uTime: { value: 0 }, uSweepX: { value: -9 }, uNdcR: { value: 0.5 }, uSnap: { value: 0 },
      uFlash: { value: 0 }, uSize: { value: pr }, uMotion: { value: reduceMotion ? 0 : 1 },
      uFire: { value: fire }, uSnapT: { value: -100 }, uHalo: { value: 1 }, uMode: { value: 0 }
    };
    const share = (...keys) => { const out = {}; keys.forEach((k) => { out[k] = U[k]; }); return out; };

    /* dark glass sphere with a lime fresnel rim */
    const ocean = new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.992, 72, 48),
      new THREE.ShaderMaterial({
        uniforms: share('uSnap'),
        vertexShader: `varying vec3 vN; varying vec3 vV;
          void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `${LIME} uniform float uSnap; varying vec3 vN; varying vec3 vV;
          void main(){ float f = pow(1.0 - max(dot(vN, vV), 0.0), 3.2); vec3 col = mix(vec3(0.014), LIME * 0.5, f); gl_FragColor = vec4(col, 1.0 - uSnap); }`
      })
    );
    ocean.renderOrder = 0;
    world.add(ocean);

    /* exterior halo, a pure rim so it survives the sphere going transparent */
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.19, 64, 40),
      new THREE.ShaderMaterial({
        uniforms: share('uHalo'),
        vertexShader: `varying vec3 vN; varying vec3 vV;
          void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `${LIME} uniform float uHalo; varying vec3 vN; varying vec3 vV;
          void main(){ float k = 1.0 + dot(vN, vV); float outside = smoothstep(0.42, 0.49, k); float i = pow(clamp((1.0 - k) / 0.55, 0.0, 1.0), 3.2); gl_FragColor = vec4(LIME * i * outside * 0.42 * uHalo, 1.0); }`,
        side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false
      })
    );
    halo.renderOrder = 8;
    world.add(halo);

    /* graticule (30 deg) and the wire that appears at the snap (10 deg) */
    const buildGrid = (step, radius) => {
      const pts = [];
      const push = (a, b) => { pts.push(a.x * radius, a.y * radius, a.z * radius, b.x * radius, b.y * radius, b.z * radius); };
      for (let lat = -90 + step; lat < 90; lat += step) {
        for (let lon = -180; lon < 180; lon += 4) push(toVec(lat, lon), toVec(lat, lon + 4));
      }
      for (let lon = -180; lon < 180; lon += step) {
        for (let lat = -88; lat < 88; lat += 4) push(toVec(lat, lon), toVec(Math.min(88, lat + 4), lon));
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      return geo;
    };
    const gratMat = new THREE.LineBasicMaterial({ color: 0xc7ff2e, transparent: true, opacity: 0.11, depthWrite: false });
    const grat = new THREE.LineSegments(buildGrid(30, R * 1.002), gratMat);
    grat.renderOrder = 1;
    world.add(grat);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xc7ff2e, transparent: true, opacity: 0, depthWrite: false });
    const wire = new THREE.LineSegments(buildGrid(10, R * 0.998), wireMat);
    wire.renderOrder = 1;
    wire.visible = false;
    world.add(wire);

    /* land point field, filled once the mask decodes */
    const landMat = new THREE.ShaderMaterial({
      uniforms: share('uTime', 'uSweepX', 'uNdcR', 'uSnap', 'uFlash', 'uSize', 'uMotion'),
      vertexShader: `${LIME}
        uniform float uTime, uSweepX, uNdcR, uSnap, uFlash, uSize, uMotion;
        attribute float aSeed, aEdge;
        varying float vA; varying vec3 vC;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vec3 vn = normalize(normalMatrix * normalize(position));
          float facing = dot(vn, normalize(-mv.xyz));
          vec4 clip = projectionMatrix * mv;
          float dn = (uSweepX - clip.x / clip.w) / uNdcR;
          float lit = smoothstep(-0.03, 0.09, dn);
          float edge = exp(-abs(dn) * 9.0);
          float front = smoothstep(-0.02, 0.24, facing);
          float back = (1.0 - front) * 0.3 * uSnap;
          float vis = max(front, back) * lit;
          float twinkle = 1.0 - 0.14 * uMotion * (0.5 + 0.5 * sin(uTime * (1.2 + aSeed * 2.4) + aSeed * 60.0));
          float base = 0.7 + 0.3 * aEdge;
          vA = min(1.0, vis * base * twinkle * (1.0 + uFlash * 0.7));
          vC = mix(LIME, vec3(1.0), clamp(edge * 0.75 + uFlash * 0.6, 0.0, 1.0));
          gl_PointSize = uSize * (0.85 + 0.4 * aEdge) * (0.72 + 0.45 * front) * (1.0 + edge * 1.4 + uFlash * 0.8) * (1.0 - 0.15 * uSnap);
          gl_Position = clip;
        }`,
      fragmentShader: `varying float vA; varying vec3 vC;
        void main(){ vec2 c = gl_PointCoord - 0.5; float m = max(abs(c.x), abs(c.y)); float a = vA * (1.0 - smoothstep(0.3, 0.5, m)); if (a < 0.01) discard; gl_FragColor = vec4(vC, a); }`,
      transparent: true, depthWrite: false
    });
    let land = null;
    const setLand = (positions, seeds, edges) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('aSeed', new THREE.Float32BufferAttribute(seeds, 1));
      geo.setAttribute('aEdge', new THREE.Float32BufferAttribute(edges, 1));
      if (land) { world.remove(land); land.geometry.dispose(); }
      land = new THREE.Points(geo, landMat);
      land.renderOrder = 2;
      world.add(land);
    };
    const buildLand = (data, w, h) => {
      const N = smallScreen ? 17000 : 54000;
      const golden = Math.PI * (3 - Math.sqrt(5));
      const spacing = Math.sqrt(4 * Math.PI / N);
      const isLand = (px, py) => {
        px = ((px % w) + w) % w;
        py = Math.max(0, Math.min(h - 1, py));
        return data[(py * w + px) * 4] > 127;
      };
      const positions = [];
      const seeds = [];
      const edges = [];
      for (let i = 0; i < N; i += 1) {
        const y = 1 - 2 * (i + 0.5) / N;
        let lat = Math.asin(y);
        let lon = (golden * i) % (Math.PI * 2) - Math.PI;
        lat += (rand() - 0.5) * spacing * 0.55;
        lon += (rand() - 0.5) * spacing * 0.55 / Math.max(0.2, Math.cos(lat));
        const px = Math.floor((lon + Math.PI) / (Math.PI * 2) * w);
        const py = Math.floor((Math.PI / 2 - lat) / Math.PI * h);
        if (!isLand(px, py)) continue;
        const edge = !(isLand(px + 3, py) && isLand(px - 3, py) && isLand(px, py + 3) && isLand(px, py - 3));
        const cl = Math.cos(lat);
        positions.push(cl * Math.cos(lon) * R, Math.sin(lat) * R, -cl * Math.sin(lon) * R);
        seeds.push(rand());
        edges.push(edge ? 1 : 0);
      }
      setLand(positions, seeds, edges);
    };
    const fallbackLand = () => {
      const N = smallScreen ? 1400 : 3200;
      const golden = Math.PI * (3 - Math.sqrt(5));
      const positions = [];
      const seeds = [];
      const edges = [];
      for (let i = 0; i < N; i += 1) {
        const y = 1 - 2 * (i + 0.5) / N;
        const lat = Math.asin(y);
        const lon = (golden * i) % (Math.PI * 2) - Math.PI;
        const cl = Math.cos(lat);
        positions.push(cl * Math.cos(lon) * R, Math.sin(lat) * R, -cl * Math.sin(lon) * R);
        seeds.push(rand());
        edges.push(0);
      }
      setLand(positions, seeds, edges);
    };
    try {
      const img = new Image();
      img.onload = () => {
        try {
          const c = document.createElement('canvas');
          c.width = img.width; c.height = img.height;
          const g = c.getContext('2d', { willReadFrequently: true });
          g.drawImage(img, 0, 0);
          buildLand(g.getImageData(0, 0, c.width, c.height).data, c.width, c.height);
        } catch (error) { fallbackLand(); }
      };
      img.onerror = fallbackLand;
      img.src = LAND_MASK;
    } catch (error) { fallbackLand(); }

    /* arcs as bead point strips along lifted great circles */
    const arcs = [];
    {
      const positions = [];
      const aT = [];
      const aBorn = [];
      const aPeriod = [];
      const aTravel = [];
      const aOffset = [];
      const order = LINKS.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i -= 1) { const j = Math.floor(rand() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      LINKS.forEach((link, k) => {
        const A = nodeVecs[link[0]];
        const B = nodeVecs[link[1]];
        const delta = Math.acos(Math.max(-1, Math.min(1, A.dot(B))));
        const lift = 0.08 + delta * 0.15;
        const beads = Math.round(64 + delta * 70);
        const travel = (delta * (1 + lift * 1.3) * R) / (1.25 * R) * (0.85 + rand() * 0.3);
        const idle = 1.2 + rand() * 2.4;
        const period = travel + idle;
        const born = 1.05 + order[k] * 0.045;
        const offset = rand();
        const so = Math.sin(delta);
        for (let i = 0; i <= beads; i += 1) {
          const u = i / beads;
          const wa = Math.sin((1 - u) * delta) / so;
          const wb = Math.sin(u * delta) / so;
          const r = R * (1 + lift * Math.sin(Math.PI * u));
          positions.push((A.x * wa + B.x * wb) * r, (A.y * wa + B.y * wb) * r, (A.z * wa + B.z * wb) * r);
          aT.push(u); aBorn.push(born); aPeriod.push(period); aTravel.push(travel); aOffset.push(offset);
        }
        arcs.push({ to: link[1], from: link[0], born, period, travel, offset, lastLanding: -1 });
      });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('aT', new THREE.Float32BufferAttribute(aT, 1));
      geo.setAttribute('aBorn', new THREE.Float32BufferAttribute(aBorn, 1));
      geo.setAttribute('aPeriod', new THREE.Float32BufferAttribute(aPeriod, 1));
      geo.setAttribute('aTravel', new THREE.Float32BufferAttribute(aTravel, 1));
      geo.setAttribute('aOffset', new THREE.Float32BufferAttribute(aOffset, 1));
      const mat = new THREE.ShaderMaterial({
        uniforms: share('uTime', 'uFlash', 'uSize', 'uMotion', 'uSnap'),
        vertexShader: `${LIME}
          uniform float uTime, uFlash, uSize, uMotion, uSnap;
          attribute float aT, aBorn, aPeriod, aTravel, aOffset;
          varying float vA; varying vec3 vC;
          void main(){
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vec3 vn = normalize(normalMatrix * normalize(position));
            float facing = dot(vn, normalize(-mv.xyz));
            float life = uTime - aBorn;
            float drawn = clamp(life / 1.1, 0.0, 1.0);
            float vis = step(aT, drawn);
            float head = exp(-abs(drawn - aT) * 30.0) * (1.0 - step(0.999, drawn));
            float pos = mod(uTime + aOffset * aPeriod, aPeriod);
            float u = pos / aTravel;
            float carrying = step(0.999, drawn) * (1.0 - step(1.0, u)) * uMotion;
            float d = u - aT;
            float tail = carrying * exp(-d * 14.0) * step(0.0, d);
            float backDim = mix(1.0, 0.35, (1.0 - smoothstep(-0.15, 0.2, facing)) * uSnap);
            float glow = tail + head + uFlash * 0.9;
            vA = min(1.0, vis * (0.2 + glow) * backDim);
            vC = mix(LIME, vec3(1.0), clamp(tail * 0.8 + head * 0.7 + uFlash * 0.6, 0.0, 1.0));
            gl_PointSize = uSize * (0.95 + tail * 2.4 + head * 2.2 + uFlash * 1.2);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `varying float vA; varying vec3 vC;
          void main(){ vec2 c = gl_PointCoord - 0.5; float r = dot(c, c) * 4.0; float a = vA * (1.0 - smoothstep(0.35, 1.0, r)); if (a < 0.01) discard; gl_FragColor = vec4(vC, a); }`,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
      });
      const points = new THREE.Points(geo, mat);
      points.renderOrder = 3;
      world.add(points);
    }

    /* node markers: white core in a lime square frame */
    {
      const positions = [];
      const aNode = [];
      nodeVecs.forEach((v, i) => { positions.push(v.x * R * 1.006, v.y * R * 1.006, v.z * R * 1.006); aNode.push(i); });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('aNode', new THREE.Float32BufferAttribute(aNode, 1));
      const mat = new THREE.ShaderMaterial({
        uniforms: share('uTime', 'uFire', 'uFlash', 'uSize', 'uSnap', 'uMotion'),
        vertexShader: `uniform float uTime, uFlash, uSize, uSnap, uMotion; uniform float uFire[${N_NODES}];
          attribute float aNode;
          varying float vA; varying float vHit;
          void main(){
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vec3 vn = normalize(normalMatrix * normalize(position));
            float facing = dot(vn, normalize(-mv.xyz));
            float age = uTime - uFire[int(aNode + 0.5)];
            float hit = (age < 0.0) ? 0.0 : exp(-age * 3.5);
            float pulse = 0.5 + 0.5 * sin(uTime * 2.2 + aNode * 1.7);
            float front = smoothstep(-0.05, 0.2, facing);
            vA = max(front, (1.0 - front) * 0.3 * uSnap) * (0.8 + 0.2 * pulse * uMotion);
            vHit = hit + uFlash;
            gl_PointSize = uSize * (5.2 + 1.0 * pulse * uMotion + hit * 4.5 + uFlash * 4.0);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `${LIME} varying float vA; varying float vHit;
          void main(){ vec2 c = gl_PointCoord - 0.5; float m = max(abs(c.x), abs(c.y));
            float core = 1.0 - smoothstep(0.16, 0.22, m);
            float ring = smoothstep(0.34, 0.38, m) * (1.0 - smoothstep(0.46, 0.5, m));
            float a = vA * max(core, ring * 0.95); if (a < 0.01) discard;
            vec3 col = mix(LIME, vec3(1.0), core * 0.9 + vHit * 0.5);
            gl_FragColor = vec4(col, a); }`,
        transparent: true, depthWrite: false
      });
      const points = new THREE.Points(geo, mat);
      points.renderOrder = 4;
      world.add(points);
    }

    /* ping rings hugging the surface, one geometry, two passes (packet landings, snap) */
    const ringShader = {
      vertexShader: `uniform float uTime, uMode, uSnapT; uniform float uFire[${N_NODES}];
        attribute vec3 aCenter, aU, aV; attribute float aAng, aEdge, aNode;
        varying float vA;
        void main(){
          float t0 = (uMode > 0.5) ? uSnapT : uFire[int(aNode + 0.5)];
          float life = (uMode > 0.5) ? 1.5 : 0.85;
          float span = (uMode > 0.5) ? 0.3 : 0.17;
          float age = uTime - t0;
          float p = clamp(age / life, 0.0, 1.0);
          float e = 1.0 - pow(1.0 - p, 3.0);
          float th = 0.015 + e * span + aEdge * 0.0065;
          vec3 dir = aCenter * cos(th) + (aU * cos(aAng) + aV * sin(aAng)) * sin(th);
          vec3 pos = dir * ${R.toFixed(3)} * 1.004;
          vA = (age < 0.0 || age > life) ? 0.0 : pow(1.0 - p, 1.4) * 0.9;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }`,
      fragmentShader: `${LIME} varying float vA; void main(){ if (vA < 0.01) discard; gl_FragColor = vec4(LIME, vA); }`
    };
    {
      const segs = 40;
      const positions = [];
      const aCenter = [];
      const aU = [];
      const aV = [];
      const aAng = [];
      const aEdge = [];
      const aNode = [];
      const index = [];
      let vi = 0;
      nodeVecs.forEach((c, ni) => {
        const up = Math.abs(c.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
        const u = new THREE.Vector3().crossVectors(up, c).normalize();
        const v = new THREE.Vector3().crossVectors(c, u).normalize();
        const base = vi;
        for (let s = 0; s <= segs; s += 1) {
          const a = s / segs * Math.PI * 2;
          for (let e = 0; e < 2; e += 1) {
            positions.push(c.x * R, c.y * R, c.z * R);
            aCenter.push(c.x, c.y, c.z);
            aU.push(u.x, u.y, u.z);
            aV.push(v.x, v.y, v.z);
            aAng.push(a); aEdge.push(e); aNode.push(ni);
            vi += 1;
          }
        }
        for (let s = 0; s < segs; s += 1) {
          const i0 = base + s * 2;
          index.push(i0, i0 + 1, i0 + 2, i0 + 1, i0 + 3, i0 + 2);
        }
      });
      const geo = new THREE.BufferGeometry();
      geo.setIndex(index);
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('aCenter', new THREE.Float32BufferAttribute(aCenter, 3));
      geo.setAttribute('aU', new THREE.Float32BufferAttribute(aU, 3));
      geo.setAttribute('aV', new THREE.Float32BufferAttribute(aV, 3));
      geo.setAttribute('aAng', new THREE.Float32BufferAttribute(aAng, 1));
      geo.setAttribute('aEdge', new THREE.Float32BufferAttribute(aEdge, 1));
      geo.setAttribute('aNode', new THREE.Float32BufferAttribute(aNode, 1));
      [0, 1].forEach((mode) => {
        const mat = new THREE.ShaderMaterial({
          uniforms: Object.assign(share('uTime', 'uFire', 'uSnapT'), { uMode: { value: mode } }),
          vertexShader: ringShader.vertexShader, fragmentShader: ringShader.fragmentShader,
          transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.renderOrder = 5 + mode;
        mesh.frustumCulled = false;
        world.add(mesh);
      });
    }

    /* two orbit rings with satellites, a 3D take on the CSS axis rings */
    const orbits = [];
    {
      const orbitGeo = (() => {
        const pts = [];
        for (let i = 0; i < 180; i += 1) {
          const a = i / 180 * Math.PI * 2;
          const b = (i + 1) / 180 * Math.PI * 2;
          pts.push(Math.cos(a), 0, Math.sin(a), Math.cos(b), 0, Math.sin(b));
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        return geo;
      })();
      const satGeo = new THREE.BufferGeometry();
      satGeo.setAttribute('position', new THREE.Float32BufferAttribute([1, 0, 0], 3));
      const satMat = new THREE.ShaderMaterial({
        uniforms: share('uSize', 'uFlash'),
        vertexShader: `uniform float uSize, uFlash; void main(){ gl_PointSize = uSize * (4.2 + uFlash * 3.0); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `${LIME} void main(){ vec2 c = gl_PointCoord - 0.5; float m = max(abs(c.x), abs(c.y)); if (m > 0.5) discard; float core = 1.0 - smoothstep(0.18, 0.26, m); gl_FragColor = vec4(mix(LIME, vec3(1.0), core), 1.0); }`,
        transparent: true, depthWrite: false
      });
      [[0.42, 0.15, 0.0, 1.32, 0.12], [0.1, 0.4, 1.5708, 1.42, -0.09]].forEach((cfg, i) => {
        const pivot = new THREE.Group();
        pivot.rotation.set(cfg[0], cfg[1], cfg[2]);
        const spin = new THREE.Group();
        spin.scale.setScalar(R * cfg[3]);
        const line = new THREE.LineSegments(orbitGeo, new THREE.LineBasicMaterial({ color: 0xc7ff2e, transparent: true, opacity: 0.26, depthWrite: false }));
        line.renderOrder = 7;
        spin.add(line);
        const sat = new THREE.Points(satGeo, satMat);
        sat.renderOrder = 7;
        sat.frustumCulled = false;
        spin.add(sat);
        pivot.add(spin);
        rig.add(pivot);
        orbits.push({ spin, line, speed: cfg[4], phase: i * 2.1 });
      });
    }

    /* starfield */
    const stars = (() => {
      const N = smallScreen ? 380 : 900;
      const positions = [];
      const aSize = [];
      const aSeed = [];
      const aLime = [];
      for (let i = 0; i < N; i += 1) {
        const r = 30 + rand() * 40;
        const th = rand() * Math.PI * 2;
        const ph = Math.acos(2 * rand() - 1);
        positions.push(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th));
        aSize.push(0.9 + Math.pow(rand(), 2.2) * 1.9);
        aSeed.push(rand());
        aLime.push(rand() < 0.3 ? 1 : 0);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('aSize', new THREE.Float32BufferAttribute(aSize, 1));
      geo.setAttribute('aSeed', new THREE.Float32BufferAttribute(aSeed, 1));
      geo.setAttribute('aLime', new THREE.Float32BufferAttribute(aLime, 1));
      const mat = new THREE.ShaderMaterial({
        uniforms: share('uTime', 'uMotion', 'uFlash'),
        vertexShader: `${LIME} uniform float uTime, uMotion, uFlash; attribute float aSize, aSeed, aLime;
          varying float vA; varying vec3 vC;
          void main(){
            float tw = 1.0 - 0.45 * uMotion * (0.5 + 0.5 * sin(uTime * (0.8 + aSeed * 2.2) + aSeed * 80.0));
            vA = (0.35 + 0.55 * aSeed) * tw + uFlash * 0.3;
            vC = mix(vec3(1.0), LIME, aLime);
            gl_PointSize = aSize * ${pr.toFixed(2)} * (1.0 + uFlash * 0.6);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `varying float vA; varying vec3 vC;
          void main(){ vec2 c = gl_PointCoord - 0.5; float r = dot(c, c) * 4.0; float a = vA * (1.0 - smoothstep(0.2, 1.0, r)); if (a < 0.01) discard; gl_FragColor = vec4(vC, a); }`,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
      });
      const points = new THREE.Points(geo, mat);
      points.renderOrder = -1;
      scene.add(points);
      return points;
    })();

    /* layout: globe centred in the frame, sized from the frame */
    let W = 1;
    let H = 1;
    let dWide = 10;
    let dClose = 6;
    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      const fr = frame.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      renderer.setSize(W, H, false);
      const cx = fr.left + fr.width / 2 - rect.left;
      const cy = fr.top + fr.height / 2 - rect.top;
      const fit = Math.max(120, Math.min(fr.width, fr.height));
      const distFor = (rPx) => R / Math.sin(Math.atan(rPx * Math.tan(FOV * Math.PI / 360) / (H / 2)));
      dClose = distFor(fit * 0.44);
      dWide = distFor(fit * 0.3);
      camera.aspect = W / H;
      camera.setViewOffset(W, H, W / 2 - cx, H / 2 - cy, W, H);
      camera.updateProjectionMatrix();
    };
    layout();
    const observer = new ResizeObserver(layout);
    observer.observe(frame);
    window.addEventListener('resize', layout);

    canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); lost = true; });
    let lost = false;

    const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const origin = new THREE.Vector3();
    const ndc = new THREE.Vector3();
    const rot0 = -1.45;
    let snapT = -100;
    let packets = 0;
    let readoutValue = '';
    const fireNode = (i, t) => { if (t > fire[i]) fire[i] = t; };

    const REVEAL_START = 0.45;
    const REVEAL_END = 2.35;

    const render = (t, now) => {
      if (lost) return;
      const T = reduceMotion ? 14 : t;
      U.uTime.value = T;

      /* camera: dolly wide to close, lateral arc-in, gentle sway, snap punch */
      const e = reduceMotion ? 1 : ease(Math.min(1, t / 5.4));
      let dist = dWide + (dClose - dWide) * e;
      const age = snapped ? t - snapT : -1;
      if (age >= 0) dist *= 1 - 0.05 * Math.exp(-age * 6);
      const sway = reduceMotion ? 0 : 1;
      camera.position.set(
        (Math.sin(t * 0.31) * 0.06 + (1 - e) * -0.9) * sway,
        (Math.cos(t * 0.23) * 0.05 + (1 - e) * 0.25) * sway,
        dist
      );
      camera.lookAt(origin);
      camera.updateMatrixWorld();
      camera.matrixWorldInverse.copy(camera.matrixWorld).invert();

      /* world spin + snap jolt */
      const jolt = age >= 0 ? 0.17 * (1 - Math.exp(-age * 5)) : 0;
      world.rotation.y = rot0 + (reduceMotion ? 0.6 : t * 0.10) + jolt;
      stars.rotation.y = -t * 0.006;
      stars.rotation.x = 0.1 + t * 0.002;
      orbits.forEach((o) => { o.spin.rotation.y = o.phase + T * o.speed; });

      /* screen-space scan sweep for the land reveal */
      ndc.copy(origin).project(camera);
      const rNdc = Math.tan(Math.asin(R / dist)) / Math.tan(FOV * Math.PI / 360) * (H / W);
      const reveal = reduceMotion ? 1 : Math.max(0, Math.min(1, (t - REVEAL_START) / (REVEAL_END - REVEAL_START)));
      U.uNdcR.value = Math.max(0.05, rNdc);
      U.uSweepX.value = ndc.x + (reveal * 2.6 - 1.3) * rNdc;

      /* size scale grows mildly as the camera closes in */
      U.uSize.value = pr * 1.75 * Math.sqrt(dWide / dist) * (smallScreen ? 0.85 : 1);

      /* snap state */
      if (snapped) {
        const s = Math.min(1, age / 0.14);
        U.uSnap.value = s;
        U.uFlash.value = Math.exp(-age * 2.6);
        wire.visible = true;
        wireMat.opacity = 0.24 * s;
        gratMat.opacity = 0.11 + 0.32 * s;
        U.uHalo.value = (1 + U.uFlash.value * 0.8) * (1 - 0.4 * s);
        orbits.forEach((o) => { o.line.material.opacity = 0.26 + 0.4 * U.uFlash.value; });
      }

      /* packet landings ring the destination node, timed from the exact arrival */
      if (!reduceMotion) {
        for (let i = 0; i < arcs.length; i += 1) {
          const a = arcs[i];
          const live = a.born + 1.1;
          if (t < live) continue;
          const k = Math.floor((t - a.travel + a.offset * a.period) / a.period);
          const landed = a.travel - a.offset * a.period + k * a.period;
          if (landed > a.lastLanding && landed >= live) {
            a.lastLanding = landed;
            fireNode(a.to, landed);
            packets += 1;
          }
        }
        if (readout && !snapped) {
          const text = `PACKETS ${String(packets).padStart(4, '0')}`;
          if (text !== readoutValue) { readoutValue = text; readout.textContent = text; }
        }
      }

      renderer.render(scene, camera);
    };

    const snap = (t) => {
      snapT = t;
      U.uSnapT.value = t;
      for (let i = 0; i < N_NODES; i += 1) fire[i] = t;
      ocean.material.transparent = true;
      ocean.material.depthWrite = false;
      ocean.material.needsUpdate = true;
      if (readout) readout.textContent = `NODES ${N_NODES} / ALL FIRED`;
    };

    const dispose = () => {
      observer.disconnect();
      window.removeEventListener('resize', layout);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      try { renderer.dispose(); renderer.forceContextLoss(); } catch (error) { /* context already gone */ }
    };

    if (labelA) labelA.textContent = `SIGNAL / ${LINKS.length} ARCS`;
    if (labelB) labelB.textContent = 'MESH / SYNC';
    if (readout) readout.textContent = 'PACKETS 0000';

    return { render, snap, dispose };
  }

  /* ------------------------------------------------------------------ */
  /* boot driver                                                          */
  /* ------------------------------------------------------------------ */

  const GLYPHS = '01<>/#[]:;=+*';
  const scrambleTo = (el, text) => {
    if (!el) return;
    if (reduceMotion) { el.textContent = text; return; }
    let step = 0;
    const run = () => {
      step += 1;
      if (step > 7) { el.textContent = text; return; }
      el.textContent = text.split('').map((ch, i) => (ch === ' ' || ch === '/' || i < step * 2 - 2 ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join('');
      window.setTimeout(run, 36);
    };
    run();
  };

  const snap = (t) => {
    if (snapped) return;
    snapped = true;
    boot.classList.add('is-snapped');
    if (gl && !reduceMotion) gl.snap(t);
    if (FROZEN !== null && labelB) labelB.textContent = 'MESH / READY';
    else scrambleTo(labelB, 'MESH / READY');
    if (flash && !reduceMotion && FROZEN === null) {
      flash.classList.add('is-on');
      void flash.offsetWidth;
      flash.classList.remove('is-on');
    }
  };

  const onKeydown = (event) => {
    if (event.key === 'Enter' || event.key === 'Escape') finish();
  };

  function finish() {
    if (finished) return;
    finished = true;
    window.clearTimeout(capTimer);
    window.clearTimeout(holdTimer);
    document.removeEventListener('keydown', onKeydown);
    lines.forEach((line) => line.classList.add('is-visible'));
    if (progress) progress.style.width = '100%';
    if (percent) percent.textContent = '100%';
    if (!snapped && !reduceMotion) snap(introTime(performance.now()));
    boot.classList.add('is-done');
    document.body.classList.remove('boot-locked');
    document.body.classList.add('boot-exited');
    window.setTimeout(() => {
      boot.setAttribute('hidden', '');
      hidden = true;
    }, EXIT_MS);
  }

  const introTime = (now) => (FROZEN !== null ? FROZEN : now - started) / 1000;

  const tick = (now) => {
    if (hidden) {
      window.cancelAnimationFrame(raf);
      if (gl) gl.dispose();
      return;
    }
    raf = window.requestAnimationFrame(tick);
    const t = introTime(now);
    if (!finished) {
      const ratio = Math.min(1, t * 1000 / DURATION);
      const value = Math.round(ratio * 100);
      if (value !== lastValue) {
        lastValue = value;
        if (progress) progress.style.width = `${value}%`;
        if (percent) percent.textContent = `${value}%`;
      }
      for (let i = 0; i < lines.length; i += 1) {
        if (ratio >= lineFracs[i] && !lines[i].classList.contains('is-visible')) lines[i].classList.add('is-visible');
      }
      if (ratio >= SNAP_FRAC && !snapped) snap(SNAP_T);
      if (ratio >= 1 && !holdTimer) holdTimer = window.setTimeout(finish, HOLD_MS);
    }
    if (gl) gl.render(t, now);
  };

  if (skip) skip.addEventListener('click', finish);
  document.addEventListener('keydown', onKeydown);
  if (FROZEN === null) capTimer = window.setTimeout(finish, CAP_MS);
  raf = window.requestAnimationFrame(tick);
})();
