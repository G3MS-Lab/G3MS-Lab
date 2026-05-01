import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  attribute float size;
  attribute vec3 aColor;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (30.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = 0.95 * smoothstep(0.5, 0.38, d);
    gl_FragColor = vec4(vColor, alpha);
  }
`;

type RGB = [number, number, number];
const STOPS: [number, RGB][] = [
	[0.00, [0.05, 0.10, 0.40]],
	[0.25, [0.08, 0.42, 0.85]],
	[0.50, [0.10, 0.78, 0.82]],
	[0.75, [0.55, 0.92, 0.96]],
	[1.00, [1.00, 1.00, 1.00]],
];

function heightColor(t: number): RGB {
	const s = Math.max(0, Math.min(1, t));
	for (let i = 0; i < STOPS.length - 1; i++) {
		const [t0, c0] = STOPS[i];
		const [t1, c1] = STOPS[i + 1];
		if (s <= t1) {
			const f = (s - t0) / (t1 - t0);
			return [
				c0[0] + (c1[0] - c0[0]) * f,
				c0[1] + (c1[1] - c0[1]) * f,
				c0[2] + (c1[2] - c0[2]) * f,
			];
		}
	}
	return STOPS[STOPS.length - 1][1];
}

export default function PointCloudBackground() {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const mount = mountRef.current;
		if (!mount || !window.WebGLRenderingContext) return;

		const initW = Math.round(0.5 * window.innerWidth);
		const initH = window.innerHeight;

		const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(initW, initH);
		renderer.setClearColor(0x000000, 0);
		mount.appendChild(renderer.domElement);
		// Stretch canvas to always fill the container div regardless of render resolution
		renderer.domElement.style.width = '100%';
		renderer.domElement.style.height = '100%';

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(50, initW / initH, 0.1, 1000);
		camera.position.set(0, 0, 8);
		camera.lookAt(0, 0, 0);

		let animId: number;
		let paused = false;
		let pointsMesh: THREE.Points | null = null;
		let tick = 0;
		let lastWidthPct = 50;

		const onVisibility = () => { paused = document.hidden; };
		document.addEventListener('visibilitychange', onVisibility);

		const animate = () => {
			animId = requestAnimationFrame(animate);
			if (paused) return;
			tick++;

			const sy = window.scrollY;
			const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
			const progress = Math.min(sy / maxScroll, 1);

			// Fade in only after scrolling past the hero section to avoid visual conflict
			const hero = document.querySelector('.hero') as HTMLElement | null;
			const heroH = hero ? hero.offsetHeight : 0;
			const opacityFactor = heroH > 0
				? Math.min(1, Math.max(0, (sy - heroH * 0.4) / (heroH * 0.4)))
				: 1;
			mount.style.opacity = String(0.75 * opacityFactor);

			// Rotate around Y axis driven by scroll progress (one full rotation across the page)
			if (pointsMesh) {
				pointsMesh.rotation.y = progress * Math.PI * 2;
				pointsMesh.position.y = -1.5 + Math.sin(tick * 0.006) * 0.15;
			}

			// Expand from 50 vw (right side) → 100 vw (full width) as page is scrolled to bottom
			const widthPct = 50 + progress * 50;
			mount.style.width = `${widthPct}vw`;
			mount.style.left = `${100 - widthPct}vw`;

			// Update render resolution when width shifts by 2%+ to avoid per-frame resizes
			if (Math.abs(widthPct - lastWidthPct) > 2) {
				lastWidthPct = widthPct;
				const newW = Math.max(1, Math.round(widthPct * window.innerWidth / 100));
				camera.aspect = newW / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(newW, window.innerHeight);
				renderer.domElement.style.width = '100%';
				renderer.domElement.style.height = '100%';
			}

			renderer.render(scene, camera);
		};
		animate();

		const onResize = () => {
			const newW = Math.max(1, Math.round(lastWidthPct * window.innerWidth / 100));
			camera.aspect = newW / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(newW, window.innerHeight);
			renderer.domElement.style.width = '100%';
			renderer.domElement.style.height = '100%';
		};
		window.addEventListener('resize', onResize);

		fetch(import.meta.env.BASE_URL + 'pointcloud.csv')
			.then(r => r.text())
			.then(text => {
				const lines = text.split('\n');
				let xMin = Infinity, xMax = -Infinity;
				let yMin = Infinity, yMax = -Infinity;
				let zMin = Infinity, zMax = -Infinity;
				const raw: [number, number, number, number][] = [];

				for (let i = 1; i < lines.length; i++) {
					const line = lines[i].trim();
					if (!line) continue;
					const p = line.split(',');
					const x = +p[0], y = +p[1], z = +p[2], c = +p[5];
					if (!isFinite(x) || !isFinite(y) || !isFinite(z)) continue;
					raw.push([x, y, z, c]);
					if (x < xMin) xMin = x; if (x > xMax) xMax = x;
					if (y < yMin) yMin = y; if (y > yMax) yMax = y;
					if (z < zMin) zMin = z; if (z > zMax) zMax = z;
				}

				const n = raw.length;
				const cx = (xMin + xMax) / 2;
				const cy = (yMin + yMax) / 2;
				const xyzRange = Math.max(xMax - xMin, yMax - yMin);
				const WORLD = 6.5;
				const scale = WORLD / xyzRange;
				const zRange = zMax - zMin || 1;
				const zScale = (WORLD * 0.4) / zRange;

				const positions = new Float32Array(n * 3);
				const aColors = new Float32Array(n * 3);
				const sizes = new Float32Array(n);

				for (let i = 0; i < n; i++) {
					const [x, y, z, normalC] = raw[i];
					positions[i * 3] = (x - cx) * scale;
					positions[i * 3 + 1] = (z - zMin) * zScale - WORLD * 0.15;
					positions[i * 3 + 2] = (y - cy) * scale;
					const t = (z - zMin) / zRange;
					const brightness = 0.72 + Math.abs(normalC) * 0.28;
					const [r, g, b] = heightColor(t);
					aColors[i * 3] = r * brightness;
					aColors[i * 3 + 1] = g * brightness;
					aColors[i * 3 + 2] = b * brightness;
					sizes[i] = 0.8 + Math.random() * Math.random() * 2.2;
				}

				const geo = new THREE.BufferGeometry();
				geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
				geo.setAttribute('aColor', new THREE.BufferAttribute(aColors, 3));
				geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

				const mat = new THREE.ShaderMaterial({
					vertexShader,
					fragmentShader,
					transparent: true,
					depthWrite: false,
				});

				pointsMesh = new THREE.Points(geo, mat);
				scene.add(pointsMesh);
			})
			.catch(() => { });

		return () => {
			cancelAnimationFrame(animId);
			document.removeEventListener('visibilitychange', onVisibility);
			window.removeEventListener('resize', onResize);
			renderer.dispose();
			if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
		};
	}, []);

	return (
		<div
			ref={mountRef}
			style={{
				position: 'fixed',
				top: 0,
				left: '50vw',
				width: '50vw',
				height: '100vh',
				opacity: 0,
				pointerEvents: 'none',
				zIndex: 1,
			}}
			aria-hidden="true"
		/>
	);
}
