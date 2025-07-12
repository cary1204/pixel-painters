const canvas = document.getElementById('canvas');
const colorPicker = document.getElementById('colorPicker');
const toggleGrid = document.getElementById('toggleGrid');

for (let i = 0; i < 128 * 64; i++) {
  const pixel = document.createElement('div');
  pixel.classList.add('pixel');
  pixel.addEventListener('click', () => {
    pixel.style.backgroundColor = colorPicker.value;
  });
  canvas.appendChild(pixel);
}

canvas.classList.add('show-grid');

toggleGrid.addEventListener('change', () => {
  canvas.classList.toggle('show-grid', toggleGrid.checked);
});
