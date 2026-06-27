import { SneakerScene } from './scene.js';

// Global customizer state
const state = {
  selectedPart: 'upper',
  parts: {
    upper: { color: '#131422', finish: 'matte' },
    sole: { color: '#00f2fe', finish: 'neon' },
    mesh: { color: '#0c0d1c', finish: 'matte' },
    stripes: { color: '#f355da', finish: 'neon' },
    laces: { color: '#ffffff', finish: 'matte' },
    heel: { color: '#7f00ff', finish: 'glossy' },
  },
  exploded: false,
  autoRotate: false,
  price: 189.99
};

// Preset styling configurations
const PRESETS = {
  cyberpunk: {
    upper: { color: '#0f051d', finish: 'metallic' },
    sole: { color: '#f355da', finish: 'neon' },
    mesh: { color: '#080914', finish: 'matte' },
    stripes: { color: '#00f2fe', finish: 'neon' },
    laces: { color: '#7f00ff', finish: 'matte' },
    heel: { color: '#00f2fe', finish: 'glossy' },
  },
  stealth: {
    upper: { color: '#1a1a1a', finish: 'matte' },
    sole: { color: '#0c0c0d', finish: 'glossy' },
    mesh: { color: '#2b2b2b', finish: 'matte' },
    stripes: { color: '#353535', finish: 'metallic' },
    laces: { color: '#111111', finish: 'matte' },
    heel: { color: '#1a1a1a', finish: 'matte' },
  },
  whitegold: {
    upper: { color: '#ffffff', finish: 'matte' },
    sole: { color: '#f3f3f3', finish: 'glossy' },
    mesh: { color: '#eaeaea', finish: 'matte' },
    stripes: { color: '#d4af37', finish: 'metallic' },
    laces: { color: '#ffffff', finish: 'matte' },
    heel: { color: '#d4af37', finish: 'metallic' },
  },
  sunset: {
    upper: { color: '#ff3e00', finish: 'glossy' },
    sole: { color: '#111111', finish: 'matte' },
    mesh: { color: '#ff8f00', finish: 'matte' },
    stripes: { color: '#ffeb3b', finish: 'neon' },
    laces: { color: '#111111', finish: 'matte' },
    heel: { color: '#ff3e00', finish: 'matte' },
  }
};

// Audio Engine utilizing HTML5 Web Audio API
let audioCtx = null;

function playSound(type = 'click') {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      // Clean high-tech click synth beep
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'toggle') {
      // Toggle sound
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.setValueAtTime(450, now + 0.06);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'checkout') {
      // Chime success chord
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch (err) {
    console.warn('Audio play blocked or unsupported', err);
  }
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('canvas-container');
  
  // Create Scene instance
  const scene = new SneakerScene(container, (partName) => {
    // 3D clicked callback
    selectPart(partName);
    playSound('click');
  });

  // Apply default state values
  applyCustomizationState(scene);

  // Bind Part Selector click handlers
  document.querySelectorAll('[data-part]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const part = e.currentTarget.getAttribute('data-part');
      selectPart(part);
      playSound('click');
    });
  });

  // Bind Preset click handlers
  document.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const presetName = e.currentTarget.getAttribute('data-preset');
      applyPreset(presetName, scene);
      playSound('checkout');
    });
  });

  // Bind Color dot click handlers
  document.querySelectorAll('[data-color]').forEach(dot => {
    dot.addEventListener('click', (e) => {
      const color = e.currentTarget.getAttribute('data-color');
      updateColor(color, scene);
      playSound('click');
    });
  });

  // Bind Custom Color Picker
  const customColorInput = document.getElementById('custom-color-picker');
  if (customColorInput) {
    customColorInput.addEventListener('input', (e) => {
      updateColor(e.target.value, scene, false);
    });
    customColorInput.addEventListener('change', () => {
      playSound('click');
    });
  }

  // Bind Finish click handlers
  document.querySelectorAll('[data-finish]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const finish = e.currentTarget.getAttribute('data-finish');
      updateFinish(finish, scene);
      playSound('click');
    });
  });

  // Bind Utility Toggles
  // Exploded View
  const explodedBtn = document.getElementById('btn-exploded');
  if (explodedBtn) {
    explodedBtn.addEventListener('click', () => {
      state.exploded = !state.exploded;
      scene.setExploded(state.exploded);
      explodedBtn.classList.toggle('border-cyan-400', state.exploded);
      explodedBtn.classList.toggle('text-cyan-400', state.exploded);
      playSound('toggle');
    });
  }

  // Auto Rotate
  const rotateBtn = document.getElementById('btn-rotate');
  if (rotateBtn) {
    rotateBtn.addEventListener('click', () => {
      state.autoRotate = !state.autoRotate;
      scene.setAutoRotate(state.autoRotate);
      rotateBtn.classList.toggle('border-cyan-400', state.autoRotate);
      rotateBtn.classList.toggle('text-cyan-400', state.autoRotate);
      playSound('toggle');
    });
  }

  // Reset Camera
  const resetCamBtn = document.getElementById('btn-reset-cam');
  if (resetCamBtn) {
    resetCamBtn.addEventListener('click', () => {
      scene.resetCamera();
      playSound('click');
    });
  }

  // Checkout Actions
  const checkoutBtn = document.getElementById('btn-checkout');
  const cartModal = document.getElementById('cart-modal');
  const cartSummaryList = document.getElementById('cart-summary-list');
  const closeCartBtn = document.getElementById('btn-close-cart');
  const totalDisplay = document.getElementById('cart-total-price');

  if (checkoutBtn && cartModal) {
    checkoutBtn.addEventListener('click', () => {
      // Build summary HTML
      cartSummaryList.innerHTML = '';
      Object.entries(state.parts).forEach(([partName, config]) => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between border-b border-white/5 py-2';
        item.innerHTML = `
          <span class="capitalize text-gray-400">${partName}</span>
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full border border-white/10" style="background-color: ${config.color}"></span>
            <span class="text-xs uppercase bg-white/5 px-2 py-0.5 rounded text-gray-300 font-mono">${config.finish}</span>
          </div>
        `;
        cartSummaryList.appendChild(item);
      });

      totalDisplay.textContent = `$${state.price}`;
      cartModal.classList.remove('hidden');
      cartModal.classList.add('flex');
      playSound('checkout');
    });
  }

  if (closeCartBtn && cartModal) {
    closeCartBtn.addEventListener('click', () => {
      cartModal.classList.add('hidden');
      cartModal.classList.remove('flex');
      playSound('click');
    });
  }
});

// Helper: Sync all UI state variables down to Three.js materials
function applyCustomizationState(scene) {
  Object.entries(state.parts).forEach(([partName, config]) => {
    scene.setPartColor(partName, config.color);
    scene.setPartFinish(partName, config.finish);
  });
}

// Select shoepart tab
function selectPart(partName) {
  state.selectedPart = partName;

  // Update tabs UI
  document.querySelectorAll('[data-part]').forEach(btn => {
    const part = btn.getAttribute('data-part');
    btn.classList.toggle('active-part', part === partName);
    btn.classList.toggle('border-white/10', part !== partName);
    btn.classList.toggle('text-gray-400', part !== partName);
    btn.classList.toggle('text-white', part === partName);
  });

  // Update details display
  const partLabel = document.getElementById('active-part-label');
  if (partLabel) partLabel.textContent = partName;

  // Sync color selection dot
  const currentConfig = state.parts[partName];
  syncColorDots(currentConfig.color);

  // Sync finish buttons
  syncFinishButtons(currentConfig.finish);
}

// Update color
function updateColor(colorHex, scene, updateInput = true) {
  state.parts[state.selectedPart].color = colorHex;
  scene.setPartColor(state.selectedPart, colorHex);

  if (updateInput) {
    const input = document.getElementById('custom-color-picker');
    if (input) input.value = colorHex;
  }

  syncColorDots(colorHex);
}

// Update finish
function updateFinish(finishName, scene) {
  state.parts[state.selectedPart].finish = finishName;
  scene.setPartFinish(state.selectedPart, finishName);
  syncFinishButtons(finishName);
}

// Apply pre-designed template presets
function applyPreset(presetName, scene) {
  const preset = PRESETS[presetName];
  if (!preset) return;

  state.parts = JSON.parse(JSON.stringify(preset));
  applyCustomizationState(scene);

  // Re-trigger visual selectors for the currently active tab
  selectPart(state.selectedPart);
}

// Sync UI components with state helper functions
function syncColorDots(activeColor) {
  document.querySelectorAll('[data-color]').forEach(dot => {
    const color = dot.getAttribute('data-color');
    const isActive = color.toLowerCase() === activeColor.toLowerCase();
    dot.classList.toggle('ring-2', isActive);
    dot.classList.toggle('ring-cyan-400', isActive);
  });
}

function syncFinishButtons(activeFinish) {
  document.querySelectorAll('[data-finish]').forEach(btn => {
    const finish = btn.getAttribute('data-finish');
    btn.classList.toggle('active-finish', finish === activeFinish);
    btn.classList.toggle('border-white/10', finish !== activeFinish);
  });
}
