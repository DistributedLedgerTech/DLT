(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class AcidGlobe {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
      this.speed = options.speed || 0.00022;
      this.rotation = options.rotation || 0;
      this.points = [];
      this.nodes = [];
      this.frame = 0;
      this.last = performance.now();
      this.visible = true;
      this.createPoints(options.points || 900);
      this.resize = this.resize.bind(this);
      this.draw = this.draw.bind(this);
      this.observer = new ResizeObserver(this.resize);
      this.observer.observe(canvas);
      this.visibilityObserver = new IntersectionObserver(([entry]) => {
        this.visible = entry.isIntersecting;
      });
      this.visibilityObserver.observe(canvas);
      this.resize();
      this.frame = requestAnimationFrame(this.draw);
    }

    createPoints(count) {
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let index = 0; index < count; index += 1) {
        const y = 1 - (index / (count - 1)) * 2;
        const radius = Math.sqrt(1 - y * y);
        const theta = golden * index;
        this.points.push({ x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius });
      }
      [
        [40.7, -74], [37.8, -122.4], [51.5, -.1], [35.7, 139.7],
        [1.3, 103.8], [22.3, 114.2], [-23.5, -46.6], [-33.9, 151.2]
      ].forEach(([lat, lon]) => {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (lon + 180) * Math.PI / 180;
        this.nodes.push({ x: -Math.sin(phi) * Math.cos(theta), y: Math.cos(phi), z: Math.sin(phi) * Math.sin(theta) });
      });
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      this.width = Math.max(1, rect.width);
      this.height = Math.max(1, rect.height);
      this.canvas.width = Math.round(this.width * ratio);
      this.canvas.height = Math.round(this.height * ratio);
      this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    project(point, angle, radius) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = point.x * cos - point.z * sin;
      const z = point.x * sin + point.z * cos;
      return { x: this.width / 2 + x * radius, y: this.height / 2 + point.y * radius, z };
    }

    draw(now) {
      if (this.visible) {
        const elapsed = Math.min(40, now - this.last);
        if (!reduceMotion) this.rotation += elapsed * this.speed;
        const ctx = this.context;
        const radius = Math.min(this.width, this.height) * .36;
        ctx.clearRect(0, 0, this.width, this.height);

        ctx.strokeStyle = 'rgba(199,255,46,.18)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        ctx.stroke();

        this.points.forEach((point) => {
          const p = this.project(point, this.rotation, radius);
          const depth = (p.z + 1) / 2;
          ctx.fillStyle = `rgba(199,255,46,${.12 + depth * .78})`;
          const size = .65 + depth * 1.4;
          ctx.fillRect(p.x, p.y, size, size);
        });

        this.nodes.forEach((node, index) => {
          const p = this.project(node, this.rotation, radius * 1.01);
          if (p.z < -.05) return;
          const pulse = reduceMotion ? 1 : 1 + Math.sin(now * .004 + index) * .35;
          ctx.strokeStyle = 'rgba(199,255,46,.75)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4 * pulse, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#c7ff2e';
          ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
        });
      }
      this.last = now;
      this.frame = requestAnimationFrame(this.draw);
    }
  }

  document.querySelectorAll('[data-globe]').forEach((canvas) => {
    new AcidGlobe(canvas, {
      points: canvas.dataset.globe === 'intro' ? 1150 : 1500,
      speed: canvas.dataset.globe === 'intro' ? .0003 : .00018,
      rotation: canvas.dataset.globe === 'identity' ? 1.1 : 0
    });
  });

  const boot = document.querySelector('[data-boot]');
  if (boot) {
    const lines = [...boot.querySelectorAll('[data-boot-line]')];
    const progress = boot.querySelector('[data-boot-progress]');
    const percent = boot.querySelector('[data-boot-percent]');
    const skip = boot.querySelector('[data-boot-skip]');
    const duration = reduceMotion ? 350 : 2850;
    let finished = false;
    let animationFrame;
    const started = performance.now();

    const onKeydown = (event) => {
      if (event.key === 'Enter' || event.key === 'Escape') finish();
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      document.removeEventListener('keydown', onKeydown);
      cancelAnimationFrame(animationFrame);
      lines.forEach((line) => line.classList.add('is-visible'));
      progress.style.width = '100%';
      percent.textContent = '100%';
      boot.classList.add('is-done');
      document.body.classList.remove('boot-locked');
      window.setTimeout(() => boot.setAttribute('hidden', ''), reduceMotion ? 0 : 560);
    };

    const tick = (now) => {
      const ratio = Math.min(1, (now - started) / duration);
      const value = Math.round(ratio * 100);
      progress.style.width = `${value}%`;
      percent.textContent = `${value}%`;
      lines.forEach((line, index) => line.classList.toggle('is-visible', ratio >= index / lines.length));
      if (ratio >= 1) window.setTimeout(finish, reduceMotion ? 0 : 260);
      else animationFrame = requestAnimationFrame(tick);
    };

    skip.addEventListener('click', finish);
    document.addEventListener('keydown', onKeydown);
    animationFrame = requestAnimationFrame(tick);
  } else {
    document.body.classList.remove('boot-locked');
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  const menu = document.querySelector('[data-mobile-menu]');
  if (menu) {
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => menu.removeAttribute('open')));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') menu.removeAttribute('open');
    });
    document.addEventListener('click', (event) => {
      if (menu.open && !menu.contains(event.target)) menu.removeAttribute('open');
    });
  }

  const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${visible.target.id}`) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-24% 0px -62% 0px', threshold: [0, .2, .5] });
    sections.forEach((section) => observer.observe(section));
  }
})();
