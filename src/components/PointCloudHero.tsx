import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// ── Shaders ──────────────────────────────────────────────────────────────────
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

// ── Height-based color gradient ───────────────────────────────────────────────
type RGB = [number, number, number];
const STOPS: [number, RGB][] = [
	[0.00, [0.05, 0.10, 0.40]],  // deep blue   (low ground)
	[0.25, [0.08, 0.42, 0.85]],  // blue
	[0.50, [0.10, 0.78, 0.82]],  // cyan
	[0.75, [0.55, 0.92, 0.96]],  // light cyan
	[1.00, [1.00, 1.00, 1.00]],  // white       (peaks)
];

function heightColor(t: number): RGB {
	const s = Math.max(0, Math.min(1, t));
	for (let i = 0; i < STOPS.length - 1; i++) {
		const [t0, c0] = STOPS[i];
		const [t1, c1] = STOPS[i + 1];
		if (s <= t1) {
			const f = (s - t0) / (t1 - t0);
			return [c0[0] + (c1[0] - c0[0]) * f,
			c0[1] + (c1[1] - c0[1]) * f,
			c0[2] + (c1[2] - c0[2]) * f];
		}
	}
	return STOPS[STOPS.length - 1][1];
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PointCloudHero() {
	const mountRef = useRef<HTMLDivElement>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const mount = mountRef.current;
		if (!mount) return;

		if (!window.WebGLRenderingContext) {
			setLoading(false);
			return;
		}

		const W = mount.clientWidth;
		const H = mount.clientHeight;

		const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(W, H);
		renderer.setClearColor(0x000000, 0);
		mount.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000);
		camera.position.set(0, 0, 8);
		camera.lookAt(0, 0, 0);

		let animId: number;
		let paused = false;
		let pointsMesh: THREE.Points | null = null;
		let tick = 0;

		const onVisibility = () => { paused = document.hidden; };
		document.addEventListener('visibilitychange', onVisibility);

		const animate = () => {
			animId = requestAnimationFrame(animate);
			if (paused) return;
			tick++;
			if (pointsMesh) {
				pointsMesh.rotation.y += 0.0007;
				pointsMesh.position.y = -2.0 + Math.sin(tick * 0.006) * 0.1;
			}
			renderer.render(scene, camera);
		};
		animate();

		const onResize = () => {
			const w = mount.clientWidth;
			const h = mount.clientHeight;
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.setSize(w, h);
		};
		window.addEventListener('resize', onResize);

		// ── Load & parse CSV ────────────────────────────────────────────────────
		fetch(import.meta.env.BASE_URL + 'pointcloud.csv')
			.then(r => r.text())
			.then(text => {
				const lines = text.split('\n');

				// First pass — find coordinate bounds
				let xMin = Infinity, xMax = -Infinity;
				let yMin = Infinity, yMax = -Infinity;
				let zMin = Infinity, zMax = -Infinity;

				const raw: [number, number, number, number][] = []; // x,y,z, normalC

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
				const WORLD = 6.5;                    // desired half-extent in world units
				const scale = WORLD / xyzRange;
				const zRange = zMax - zMin || 1;
				const zScale = (WORLD * 0.4) / zRange; // height stretched less than width

				// Second pass — build typed arrays
				const positions = new Float32Array(n * 3);
				const aColors = new Float32Array(n * 3);
				const sizes = new Float32Array(n);

				for (let i = 0; i < n; i++) {
					const [x, y, z, normalC] = raw[i];

					positions[i * 3] = (x - cx) * scale;
					positions[i * 3 + 1] = (z - zMin) * zScale - WORLD * 0.15;
					positions[i * 3 + 2] = (y - cy) * scale;

					// Height colour + slight brightness from upward-facing normal
					const t = (z - zMin) / zRange;
					const brightness = 0.72 + Math.abs(normalC) * 0.28;
					const [r, g, b] = heightColor(t);
					aColors[i * 3] = r * brightness;
					aColors[i * 3 + 1] = g * brightness;
					aColors[i * 3 + 2] = b * brightness;

					// Random size with bias toward small — occasional large flakes pop out
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
				setLoading(false);
			})
			.catch(() => setLoading(false));

		return () => {
			cancelAnimationFrame(animId);
			document.removeEventListener('visibilitychange', onVisibility);
			window.removeEventListener('resize', onResize);
			renderer.dispose();
			if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
		};
	}, []);

	return (
		<div className="hero">
			<div ref={mountRef} className="hero-canvas" aria-hidden="true" />
			{loading && <div className="hero-loading" aria-hidden="true" />}
			<div className="hero-top">
				<img src={import.meta.env.BASE_URL + 'G3MS.svg'} alt="G3MS Lab" className="hero-logo" />
				<div className="hero-title-group">
					<h1 className="hero-title">G3MS Lab</h1>
					<p className="hero-sub">Geometric, Game and Graphics Modeling and Simulation Laboratory</p>
					<p className="hero-dept">CPE · KMUTT</p>
				</div>
			</div>
		</div>
	);
}
