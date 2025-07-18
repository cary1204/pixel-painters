const firebaseConfig = {
  apiKey: "AIzaSyCjK7KzMaGeTzc9ggZCiTDLEu3lI_ZUzeI",
  authDomain: "pixel-painters.firebaseapp.com",
  databaseURL: "https://pixel-painters-default-rtdb.firebaseio.com/",
  projectId: "pixel-painters",
  storageBucket: "pixel-painters.firebasestorage.app",
  messagingSenderId: "616331738763",
  appId: "1:616331738763:web:45d49ea938960393f7de8e",
  measurementId: "G-RMDN05YXV9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const width = 80;
const height = 40;

const canvas = document.getElementById('canvas');
const colorPicker = document.getElementById('colorPicker');
const gridToggle = document.getElementById('toggleGrid');
const themeToggle = document.getElementById('toggleTheme');
const zoomSlider = document.getElementById('zoomSlider');
const panToggle = document.getElementById('togglePan');
const container = document.getElementById('canvasContainer');

zoomSlider.value = 15;
canvas.style.setProperty('--pixel-size', `${zoomSlider.value}px`);

gridToggle.addEventListener('change', () => {
  canvas.classList.toggle('grid', gridToggle.checked);
});
canvas.classList.add('grid');

themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light', themeToggle.checked);
});

zoomSlider.addEventListener('input', () => {
  canvas.style.setProperty('--pixel-size', `${zoomSlider.value}px`);
});

let isDrawing = false;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const pixel = document.createElement('div');
    pixel.className = 'pixel';
    pixel.dataset.x = x;
    pixel.dataset.y = y;
    canvas.appendChild(pixel);

    pixel.addEventListener('mousedown', function() {
      if (panToggle.checked) return;
      drawPixel.call(this);
    });
    pixel.addEventListener('mouseover', function(e) {
      if (isDrawing && !panToggle.checked) drawPixel.call(this);
    });
  }
}
canvas.addEventListener('mousedown', function() {
  if (panToggle.checked) return;
  isDrawing = true;
});
canvas.addEventListener('mouseup', () => { isDrawing = false; });
canvas.addEventListener('mouseleave', () => { isDrawing = false; });

function drawPixel() {
  const x = this.dataset.x;
  const y = this.dataset.y;
  const color = colorPicker.value;
  this.style.background = color;
  db.ref(`pixels/${x}_${y}`).set(color);
}

db.ref('pixels').on('value', (snapshot) => {
  const data = snapshot.val();
  if (!data) return;
  Object.entries(data).forEach(([key, color]) => {
    const [x, y] = key.split('_');
    const pixel = document.querySelector(`.pixel[data-x="${x}"][data-y="${y}"]`);
    if (pixel) pixel.style.background = color;
  });
});

document.querySelectorAll('.color-swatch').forEach(swatch => {
  swatch.addEventListener('click', () => {
    const color = swatch.getAttribute('data-color');
    colorPicker.value = color;
  });
});

const saveButton = document.getElementById('saveCustomColor');
const customColorsContainer = document.getElementById('customColors');
let isSavingCustomColor = false;
const NUM_CUSTOM_COLORS = 6;

saveButton.addEventListener('click', () => {
  isSavingCustomColor = !isSavingCustomColor;
  saveButton.classList.toggle('active', isSavingCustomColor);
});

function setupCustomColors() {
  for (let i = 0; i < NUM_CUSTOM_COLORS; i++) {
    const slot = document.createElement('div');
    slot.classList.add('custom-color-swatch');
    slot.dataset.index = i;

    const saved = localStorage.getItem(`customColor_${i}`);
    if (saved) {
      slot.style.background = saved;
      slot.dataset.color = saved;
    }

    slot.addEventListener('click', () => {
      if (isSavingCustomColor) {
        const newColor = colorPicker.value;
        slot.style.background = newColor;
        slot.dataset.color = newColor;
        localStorage.setItem(`customColor_${i}`, newColor);
        isSavingCustomColor = false;
        saveButton.classList.remove('active');
      } else {
        if (slot.dataset.color) {
          colorPicker.value = slot.dataset.color;
        }
      }
    });

    customColorsContainer.appendChild(slot);
  }
}

setupCustomColors();

let isPanning = false;
let startX, startY, scrollLeft, scrollTop;

panToggle.addEventListener('change', () => {
  container.classList.toggle('panning', panToggle.checked);
});

container.addEventListener('mousedown', (e) => {
  if (!panToggle.checked) return;
  isPanning = true;
  container.classList.add('panning');
  startX = e.pageX - container.offsetLeft;
  startY = e.pageY - container.offsetTop;
  scrollLeft = container.scrollLeft;
  scrollTop = container.scrollTop;
});
container.addEventListener('mouseleave', () => {
  isPanning = false;
  container.classList.remove('panning');
});
container.addEventListener('mouseup', () => {
  isPanning = false;
  container.classList.remove('panning');
});
container.addEventListener('mousemove', (e) => {
  if (!isPanning) return;
  e.preventDefault();
  const x = e.pageX - container.offsetLeft;
  const y = e.pageY - container.offsetTop;
  const walkX = x - startX;
  const walkY = y - startY;
  container.scrollLeft = scrollLeft - walkX;
  container.scrollTop = scrollTop - walkY;
});

const saveBtn = document.getElementById('saveCanvasBtn');

saveBtn.addEventListener('click', () => {
  const scale = 20;

  const exportWidth = width * scale;
  const exportHeight = height * scale;

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = exportWidth;
  exportCanvas.height = exportHeight;
  const ctx = exportCanvas.getContext('2d');

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = document.querySelector(`.pixel[data-x="${x}"][data-y="${y}"]`);
      let color = pixel ? pixel.style.backgroundColor : null;

      if (!color || color === '' || color === 'transparent') {
        ctx.clearRect(x * scale, y * scale, scale, scale);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }

  exportCanvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pixel-painters.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
});


