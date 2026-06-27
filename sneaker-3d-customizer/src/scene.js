import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

export class SneakerScene {
  constructor(container, onPartSelected) {
    this.container = container;
    this.onPartSelected = onPartSelected;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    
    // Customizer state
    this.shoeParts = {};
    this.originalPositions = {};
    this.isExploded = false;
    this.isAutoRotating = false;

    // Raycaster for 3D clicks
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.init();
    this.createSneaker();
    this.createEnvironment();
    this.animate();
    
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.container.addEventListener('pointerdown', this.onPointerDown.bind(this));
  }

  init() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = null; // transparent to use CSS background gradient

    // Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(3, 1.8, 3.5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground
    this.controls.minDistance = 1.5;
    this.controls.maxDistance = 8;
    this.controls.target.set(0, 0.4, 0);
  }

  createSneaker() {
    this.shoeGroup = new THREE.Group();
    this.scene.add(this.shoeGroup);

    // Helper to create and track a mesh part
    const createPart = (name, geometry, position, rotation = null) => {
      // Default metalness and roughness values
      const material = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.5,
        metalness: 0.5,
        shadowSide: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      if (rotation) {
        mesh.rotation.set(rotation.x, rotation.y, rotation.z);
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.name = name;

      this.shoeGroup.add(mesh);
      this.shoeParts[name] = mesh;
      this.originalPositions[name] = position.clone();
      return mesh;
    };

    // 1. SOLE (Procedural chunky sole)
    const soleGeom = new THREE.BoxGeometry(2.2, 0.28, 0.88);
    // Bevel/soften edges slightly using helper positioning
    createPart('sole', soleGeom, new THREE.Vector3(0, 0.14, 0));

    // 2. UPPER (Main leather/canvas body)
    const upperGeom = new THREE.BoxGeometry(1.4, 0.52, 0.82);
    createPart('upper', upperGeom, new THREE.Vector3(-0.15, 0.54, 0));

    // 3. MESH (Front toe cap for ventilation)
    const meshGeom = new THREE.BoxGeometry(0.55, 0.32, 0.78);
    createPart('mesh', meshGeom, new THREE.Vector3(0.72, 0.44, 0));

    // 4. STRIPES (Side branding details)
    // Left Stripe
    const stripeLeftGeom = new THREE.BoxGeometry(0.75, 0.16, 0.04);
    createPart('stripes', stripeLeftGeom, new THREE.Vector3(-0.1, 0.52, 0.42), new THREE.Vector3(0.1, 0, 0.15));
    // Right Stripe
    const stripeRightGeom = new THREE.BoxGeometry(0.75, 0.16, 0.04);
    createPart('stripes_right', stripeRightGeom, new THREE.Vector3(-0.1, 0.52, -0.42), new THREE.Vector3(-0.1, 0, -0.15));

    // 5. LACES (Procedural shoelaces crossing over)
    const laceGroup = new THREE.Group();
    const laceGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.65);
    laceGeom.rotateX(Math.PI / 2); // align cylinders horizontally

    const lacePositions = [
      new THREE.Vector3(0.2, 0.76, 0),
      new THREE.Vector3(0.38, 0.72, 0),
      new THREE.Vector3(0.56, 0.68, 0),
    ];

    lacePositions.forEach((pos, idx) => {
      const mat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8, metalness: 0.1 });
      const laceMesh = new THREE.Mesh(laceGeom, mat);
      laceMesh.position.copy(pos);
      laceMesh.castShadow = true;
      laceMesh.name = `lace_${idx}`;
      laceGroup.add(laceMesh);
    });

    laceGroup.name = 'laces';
    this.shoeGroup.add(laceGroup);
    this.shoeParts['laces'] = laceGroup;
    this.originalPositions['laces'] = new THREE.Vector3(0, 0, 0);

    // 6. HEEL (Back collar structure)
    const heelGeom = new THREE.BoxGeometry(0.4, 0.6, 0.82);
    createPart('heel', heelGeom, new THREE.Vector3(-0.85, 0.58, 0));

    // Center the group slightly
    this.shoeGroup.position.set(0.1, 0.1, 0);
  }

  createEnvironment() {
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Key Light (Main illuminating light)
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(4, 5, 3);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.bias = -0.001;
    this.scene.add(mainLight);

    // Fill Light (Soften shadows)
    const fillLight = new THREE.DirectionalLight(0x00f2fe, 0.4); // Subtle cyan fill
    fillLight.position.set(-4, 3, 2);
    this.scene.add(fillLight);

    // Back Light (Outline halo effect)
    const backLight = new THREE.DirectionalLight(0xf355da, 0.6); // Subtle magenta back highlight
    backLight.position.set(0, 4, -4);
    this.scene.add(backLight);

    // Platform Base
    const platformGeom = new THREE.CylinderGeometry(1.6, 1.7, 0.08, 32);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x0f1123,
      roughness: 0.4,
      metalness: 0.8,
      bumpScale: 0.05
    });
    const platform = new THREE.Mesh(platformGeom, platformMat);
    platform.position.set(0, -0.04, 0);
    platform.receiveShadow = true;
    this.scene.add(platform);

    // Glowing platform ring
    const ringGeom = new THREE.RingGeometry(1.62, 1.66, 32);
    ringGeom.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.position.set(0, 0.01, 0);
    this.scene.add(ring);
  }

  // Set colors and materials
  setPartColor(partName, colorHex) {
    const applyColor = (mesh, color) => {
      if (mesh.material) {
        mesh.material.color.set(color);
        // Sync emissive color if it's in glowing neon mode
        if (mesh.material.emissiveIntensity > 0) {
          mesh.material.emissive.set(color);
        }
      }
    };

    if (partName === 'stripes') {
      applyColor(this.shoeParts['stripes'], colorHex);
      applyColor(this.shoeParts['stripes_right'], colorHex);
    } else if (partName === 'laces') {
      this.shoeParts['laces'].children.forEach(child => applyColor(child, colorHex));
    } else if (this.shoeParts[partName]) {
      applyColor(this.shoeParts[partName], colorHex);
    }
  }

  setPartFinish(partName, finish) {
    const applyFinish = (mesh) => {
      if (!mesh.material) return;
      const mat = mesh.material;

      // Reset emissive
      mat.emissive.setHex(0x000000);
      mat.emissiveIntensity = 0;

      switch(finish) {
        case 'matte':
          mat.roughness = 0.9;
          mat.metalness = 0.0;
          break;
        case 'glossy':
          mat.roughness = 0.15;
          mat.metalness = 0.1;
          break;
        case 'metallic':
          mat.roughness = 0.25;
          mat.metalness = 0.85;
          break;
        case 'neon':
          mat.roughness = 0.4;
          mat.metalness = 0.1;
          mat.emissive.copy(mat.color);
          mat.emissiveIntensity = 0.8;
          break;
      }
      mat.needsUpdate = true;
    };

    if (partName === 'stripes') {
      applyFinish(this.shoeParts['stripes']);
      applyFinish(this.shoeParts['stripes_right']);
    } else if (partName === 'laces') {
      this.shoeParts['laces'].children.forEach(child => applyFinish(child));
    } else if (this.shoeParts[partName]) {
      applyFinish(this.shoeParts[partName]);
    }
  }

  // Animation toggle setters
  setExploded(val) {
    this.isExploded = val;
  }

  setAutoRotate(val) {
    this.isAutoRotating = val;
    this.controls.autoRotate = val;
    this.controls.autoRotateSpeed = 2.0;
  }

  resetCamera() {
    this.controls.reset();
    this.camera.position.set(3, 1.8, 3.5);
    this.controls.target.set(0, 0.4, 0);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Handle exploded view smooth lerp
    const lerpSpeed = 0.08;
    const partsToLerp = ['sole', 'upper', 'mesh', 'stripes', 'stripes_right', 'heel'];

    partsToLerp.forEach(name => {
      const mesh = this.shoeParts[name];
      if (!mesh) return;

      let targetPos = this.originalPositions[name].clone();
      if (this.isExploded) {
        // Offset parts outwards
        if (name === 'sole') targetPos.y -= 0.35;
        if (name === 'upper') targetPos.y += 0.25;
        if (name === 'mesh') { targetPos.y += 0.25; targetPos.x += 0.25; }
        if (name === 'heel') { targetPos.y += 0.25; targetPos.x -= 0.25; }
        if (name === 'stripes') { targetPos.z += 0.2; targetPos.y += 0.1; }
        if (name === 'stripes_right') { targetPos.z -= 0.2; targetPos.y += 0.1; }
      }
      mesh.position.lerp(targetPos, lerpSpeed);
    });

    // Lerp laces group separately
    const laces = this.shoeParts['laces'];
    if (laces) {
      let targetLaces = new THREE.Vector3(0, 0, 0);
      if (this.isExploded) {
        targetLaces.y += 0.45;
        targetLaces.x += 0.1;
      }
      laces.position.lerp(targetLaces, lerpSpeed);
    }

    // Update controls
    this.controls.update();

    // Render
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  onPointerDown(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.shoeGroup.children, true);

    if (intersects.length > 0) {
      let clickedMesh = intersects[0].object;
      let partName = clickedMesh.name;

      // Handle nested structures
      if (partName.startsWith('lace_')) {
        partName = 'laces';
      } else if (partName === 'stripes_right') {
        partName = 'stripes';
      }

      // Check if it's a valid customizable part
      const validParts = ['sole', 'upper', 'mesh', 'stripes', 'laces', 'heel'];
      if (validParts.includes(partName)) {
        // Trigger callback
        this.onPartSelected(partName);
      }
    }
  }

  // Destroy resources
  destroy() {
    window.removeEventListener('resize', this.onWindowResize);
    this.container.removeEventListener('pointerdown', this.onPointerDown);
    this.container.removeChild(this.renderer.domElement);
    this.renderer.dispose();
  }
}
