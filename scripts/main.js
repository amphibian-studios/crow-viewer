import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById("scene-container").appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = true;

// Loading manager
const loadingManager = new THREE.LoadingManager();
const loadingElement = document.getElementById("loading");

loadingManager.onLoad = () => {
  loadingElement.style.display = "none";
};

loadingManager.onError = (url) => {
  loadingElement.textContent = "Error loading model!";
  console.error("Error loading:", url);
};

// Post-processing setup - B&W Dithering effect
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Custom B&W Dithering shader with fixed values
const bwDitheringShader = {
  uniforms: {
    "tDiffuse": { value: null },
    "resolution": { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    "threshold": { value: 0.7 }, // Fixed dithering intensity
    "noiseSize": { value: 1.0 } // Fixed dithering pattern size
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float threshold;
    uniform float noiseSize;
    varying vec2 vUv;
    
    // Pseudo random function
    float random(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    // Simple ordered dithering
    float dither8x8(vec2 position, float brightness) {
      // Normalized position
      vec2 normalizedPos = floor(mod(position * resolution / noiseSize, 8.0));
      int x = int(normalizedPos.x);
      int y = int(normalizedPos.y);
      
      // Ordered dithering matrix
      int index = x + y * 8;
      float limit = 0.0;
      
      if(index == 0) limit = 0.015625;
      if(index == 1) limit = 0.515625;
      if(index == 2) limit = 0.140625;
      if(index == 3) limit = 0.640625;
      if(index == 4) limit = 0.046875;
      if(index == 5) limit = 0.546875;
      if(index == 6) limit = 0.171875;
      if(index == 7) limit = 0.671875;
      if(index == 8) limit = 0.765625;
      if(index == 9) limit = 0.265625;
      if(index == 10) limit = 0.890625;
      if(index == 11) limit = 0.390625;
      if(index == 12) limit = 0.796875;
      if(index == 13) limit = 0.296875;
      if(index == 14) limit = 0.921875;
      if(index == 15) limit = 0.421875;
      if(index == 16) limit = 0.203125;
      if(index == 17) limit = 0.703125;
      if(index == 18) limit = 0.078125;
      if(index == 19) limit = 0.578125;
      if(index == 20) limit = 0.234375;
      if(index == 21) limit = 0.734375;
      if(index == 22) limit = 0.109375;
      if(index == 23) limit = 0.609375;
      if(index == 24) limit = 0.953125;
      if(index == 25) limit = 0.453125;
      if(index == 26) limit = 0.828125;
      if(index == 27) limit = 0.328125;
      if(index == 28) limit = 0.984375;
      if(index == 29) limit = 0.484375;
      if(index == 30) limit = 0.859375;
      if(index == 31) limit = 0.359375;
      if(index == 32) limit = 0.0625;
      if(index == 33) limit = 0.5625;
      if(index == 34) limit = 0.1875;
      if(index == 35) limit = 0.6875;
      if(index == 36) limit = 0.03125;
      if(index == 37) limit = 0.53125;
      if(index == 38) limit = 0.15625;
      if(index == 39) limit = 0.65625;
      if(index == 40) limit = 0.8125;
      if(index == 41) limit = 0.3125;
      if(index == 42) limit = 0.9375;
      if(index == 43) limit = 0.4375;
      if(index == 44) limit = 0.78125;
      if(index == 45) limit = 0.28125;
      if(index == 46) limit = 0.90625;
      if(index == 47) limit = 0.40625;
      if(index == 48) limit = 0.25;
      if(index == 49) limit = 0.75;
      if(index == 50) limit = 0.125;
      if(index == 51) limit = 0.625;
      if(index == 52) limit = 0.21875;
      if(index == 53) limit = 0.71875;
      if(index == 54) limit = 0.09375;
      if(index == 55) limit = 0.59375;
      if(index == 56) limit = 1.0;
      if(index == 57) limit = 0.5;
      if(index == 58) limit = 0.875;
      if(index == 59) limit = 0.375;
      if(index == 60) limit = 0.96875;
      if(index == 61) limit = 0.46875;
      if(index == 62) limit = 0.84375;
      if(index == 63) limit = 0.34375;
      
      return brightness < limit ? 0.0 : 1.0;
    }
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      
      // Convert to grayscale
      float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      
      // Mix with random noise to create dithering effect
      float dithered = dither8x8(vUv, luminance) * threshold + random(vUv) * (1.0 - threshold) * 0.1;
      
      // Final output
      gl_FragColor = vec4(vec3(dithered), 1.0);
    }
  `
};

const bwDitheringPass = new ShaderPass(bwDitheringShader);
composer.addPass(bwDitheringPass);

// Load HDRI environment map
const hdriLoader = new RGBELoader(loadingManager);
hdriLoader.load(
  'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloofendal_48d_partly_cloudy_1k.hdr',
  function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
    
    // Load GLB model now that environment is set
    loadModel();
  }
);

// Rain particle system
function createRaindrops() {
  const rainCount = 15000;
  const rainGeometry = new THREE.BufferGeometry();
  const rainPositions = new Float32Array(rainCount * 3);
  const rainVelocities = new Float32Array(rainCount);
  
  for (let i = 0; i < rainCount; i++) {
    const i3 = i * 3;
    
    const radius = 20;
    const theta = Math.random() * Math.PI * 2;
    
    rainPositions[i3] = Math.cos(theta) * radius * (0.1 + Math.random() * 0.9);
    rainPositions[i3 + 1] = 30 + Math.random() * 15;
    rainPositions[i3 + 2] = Math.sin(theta) * radius * (0.1 + Math.random() * 0.9);
    
    rainVelocities[i] = 0.15 + Math.random() * 0.3;
  }
  
  rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
  rainGeometry.setAttribute('velocity', new THREE.BufferAttribute(rainVelocities, 1));
  
  const rainMaterial = new THREE.PointsMaterial({
    color: 0xaaaaff,
    size: 0.1,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  });
  
  const rain = new THREE.Points(rainGeometry, rainMaterial);
  scene.add(rain);
  
  return rain;
}

const rain = createRaindrops();

function updateRain() {
  const positions = rain.geometry.attributes.position.array;
  const velocities = rain.geometry.attributes.velocity.array;
  const rainCount = velocities.length;
  
  for (let i = 0; i < rainCount; i++) {
    const i3 = i * 3;
    
    positions[i3 + 1] -= velocities[i];
    
    if (positions[i3 + 1] < -20) {
      positions[i3 + 1] = 30 + Math.random() * 15;
    }
  }
  
  rain.geometry.attributes.position.needsUpdate = true;
}

// Load GLB model
function loadModel() {
  const modelPath = "../assets/crow.glb";
  const loader = new GLTFLoader(loadingManager);

  loader.load(
    modelPath,
    (gltf) => {
      const model = gltf.scene;

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      model.position.x = -center.x;
      model.position.y = -center.y;
      model.position.z = -center.z;

      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 5) {
        const scale = 5 / maxDim;
        model.scale.set(scale, scale, scale);
      }

      model.traverse((child) => {
        if (child.isMesh) {
          child.material.envMap = scene.environment;
          child.material.envMapIntensity = 1;
          child.material.needsUpdate = true;
        }
      });

      scene.add(model);

      const dist = maxDim * 1.5;
      camera.position.set(0, 0, dist);
      controls.update();
    },
    (xhr) => {
      const percent = Math.floor((xhr.loaded / xhr.total) * 100);
      loadingElement.textContent = `Loading model: ${percent}%`;
    },
    (error) => {
      loadingElement.textContent = "Error loading model!";
      console.error("Error loading model:", error);
    }
  );
}

// Handle arrow key controls
document.addEventListener("keydown", (event) => {
  const keyCode = event.keyCode;
  if (keyCode === 37) {
    scene.rotation.y -= 0.1;
  } else if (keyCode === 39) {
    scene.rotation.y += 0.1;
  } else if (keyCode === 38) {
    scene.rotation.x -= 0.1;
  } else if (keyCode === 40) {
    scene.rotation.x += 0.1;
  }
  else if (keyCode === 107 || keyCode === 187) {
    camera.position.z -= 0.3;
  } else if (keyCode === 109 || keyCode === 189) {
    camera.position.z += 0.3;
  }
});

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  
  // Update uniform resolution
  bwDitheringPass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  updateRain();
  
  // Use composer instead of renderer
  composer.render();
}
animate();