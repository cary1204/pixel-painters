const canvas = document.getElementById('canvas');
const colorPicker = document.getElementById('colorPicker');

for (let i = 0; i < 1024; i++) {
  const pixel = document.createElement('div');
  pixel.classList.add('pixel');
  pixel.addEventListener('click', () => {
    pixel.style.backgroundColor = colorPicker.value;
  });
  canvas.appendChild(pixel);
}
