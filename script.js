import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
  getDatabase, 
  ref, 
  set, 
  get 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";



const firebaseConfig = {

  apiKey: "AIzaSyD7YEekM7T2HIW10_pawzr1T01_SLCTq1U",
  authDomain: "cha-casa-nova-b1737.firebaseapp.com",
  databaseURL: "https://cha-casa-nova-b1737-default-rtdb.firebaseio.com",
  projectId: "cha-casa-nova-b1737",
  storageBucket: "cha-casa-nova-b1737.firebasestorage.app",
  messagingSenderId: "771482897059",
  appId: "1:771482897059:web:8738a230581a12deef0d16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* Create loading overlay */
const loadingOverlay = document.createElement("div");
loadingOverlay.className = "loading-overlay";
loadingOverlay.innerHTML = `
  <div class="loading-spinner">
    <div class="spinner"></div>
    <p>Carregando...</p>
  </div>
`;
document.body.appendChild(loadingOverlay);

/* Function to check and hide selected gifts on page load */
async function checkSelectedGifts() {
  const cards = document.querySelectorAll(".item");
  
  // Show loading
  loadingOverlay.style.display = "flex";
  
  for (const card of cards) {
    const id = card.dataset.id;
    const snap = await get(ref(db, `presentes/${id}`));
    
    if (snap.exists()) {
      // Gift already selected, hide it
      card.style.display = "none";
    }
  }
  
  // Hide loading with fade out
  loadingOverlay.style.opacity = "0";
  setTimeout(() => {
    loadingOverlay.style.display = "none";
  }, 300);
}

// Call on page load
checkSelectedGifts();

/* Modal */
const modal = document.createElement("div");
modal.innerHTML = `
  <div class="modal-backdrop">
    <div class="modal">
      <p>Deseja confirmar este presente?</p>
      <textarea maxlength="500" placeholder="Deixe uma mensagem (opcional)"></textarea>
      <div class="actions">
        <button id="confirmar">Confirmar</button>
        <button id="cancelar">Cancelar</button>
      </div>
    </div>
  </div>
`;
document.body.appendChild(modal);

const backdrop = modal.querySelector(".modal-backdrop");
const textarea = modal.querySelector("textarea");
let currentId = null;

/* Eventos dos cards */
document.querySelectorAll(".item").forEach(card => {
  card.addEventListener("click", async () => {
    
    currentId = card.dataset.id;;
    textarea.value = "";
    backdrop.classList.add("active");
  });
});

/* Cancelar */
modal.querySelector("#cancelar").onclick = () => {
  backdrop.classList.remove("active");
  currentId = null;
};

/* Confirmar */
modal.querySelector("#confirmar").onclick = async () => {
  if (!currentId) return;
  
  const mensagem = textarea.value.trim();
  
  await set(ref(db, `presentes/${currentId}`), {
    mensagem: mensagem || null,
    timestamp: Date.now(),
  });
  
  const card = document.querySelector(`[data-id="${currentId}"]`);
  backdrop.classList.remove("active");
  currentId = null;
  
  card.style.transition = "opacity .3s ease, transform .3s ease";
  card.style.opacity = "0";
  card.style.transform = "scale(.9)";
  
  setTimeout(() => {
    card.style.display = "none";
  }, 300);
};
