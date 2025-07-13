
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

const canvas = document.getElementById('canvas');
const colorPicker = document.getElementById('colorPicker');
const toggleGrid = document.getElementById('toggleGrid');

const WIDTH = 128;
const HEIGHT = 64;
const TOTAL_PIXELS = WIDTH * HEIGHT;

for (let i = 0; i < TOTAL_PIXELS; i++) {
  const pixel = document.createElement('div');
  pixel.classList.add('pixel');
  
  pixel.addEventListener('click', () => {
    const color = colorPicker.value;
    pixel.style.backgroundColor = color;

    db.ref(`pixels/${i}`).set(color);
  });

  canvas.appendChild(pixel);
}
canvas.classList.add('show-grid');
toggleGrid.checked = true;

toggleGrid.addEventListener('change', () => {
  canvas.classList.toggle('show-grid', toggleGrid.checked);
});

db.ref('pixels').on('value', snapshot => {
  const data = snapshot.val();
  if (!data) return;

  Object.entries(data).forEach(([index, color]) => {
    const pixel = canvas.children[index];
    if (pixel) {
      pixel.style.backgroundColor = color;
    }
  });
});
