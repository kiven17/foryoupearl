const girlfriendName = "hello po";

const messageLines = [
  "hi pearl good morning sinakto ko to ng 12 am para me the first one,",
  "or kahit hindi man first but atleast one of them na nauna, ",
  "i just wanna say happy birth day, you're at your best age na,your 18 legal age na sya oh HHAHHAHA and i hope you have the best day ever.",
  "i hope you get to eat a lot of cheese cake dahil nga fav mo ang cheesy flavor and have fun with your friends and family.",
  "i hope you get to receive a lot of gifts and love from the people around you.",
  "now its your day, I just want you to feel even a little of how deeply you are loved.",
  "Happy birthday, sweetie pearl. im here lang palagi if you need me i wont hesitate to help you hehe — today, tomorrow, always.",
  "and im so grateful that i meet you even na kahit ganto im so grateful parin,",
  "just enjoy your day forget the negative thoughts always smile yk naman na you have a great smile wag itago ang treasure nayan okay?.",
   "youre not a yamashita treasure na dapat naka tago, youre kinda worth showing off.",
   "labya pearl, and i hope you have the best birthday ever, and i hope this year will be the best year for you," ,
   "and i hope all your dreams come true, and i hope you get to achieve all your goals, and i hope you get to be happy always.",
  "happy birthday again, and enjoy your day to the fullest, and eat a lot of cake for me hehe."
];

const sections = {
  landing: document.getElementById("landing"),
  inbox: document.getElementById("inbox"),
  message: document.getElementById("message"),
  memories: document.getElementById("memories"),
  ending: document.getElementById("ending")
};

const topbar = document.getElementById("topbar");
const openExperienceBtn = document.getElementById("open-experience");
const photoInputOne = document.getElementById("girlfriend-photo-1");
const photoInputTwo = document.getElementById("girlfriend-photo-2");
const uploadStatus = document.getElementById("upload-status");
const memoryUserPhoto = document.getElementById("memory-user-photo");
const memoryUserPhotoTwo = document.getElementById("memory-user-photo-2");
const openMessageBtn = document.getElementById("open-message");
const toMemoriesBtn = document.getElementById("to-memories");
const toEndingBtn = document.getElementById("to-ending");
const typingLines = document.getElementById("typing-lines");
const nameSlot = document.getElementById("name-slot");
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const galleryImages = document.querySelectorAll(".gallery .polaroid img");
const imageModal = document.getElementById("image-modal");
const imageModalPreview = document.getElementById("image-modal-preview");
const imageModalClose = document.getElementById("image-modal-close");

const urlName = new URLSearchParams(window.location.search).get("name");
nameSlot.textContent = urlName || girlfriendName;

Object.values(sections).forEach((section, index) => {
  if (index !== 0) {
    section.classList.add("hidden");
  }
});

openExperienceBtn.disabled = true;

let uploadedImageUrlOne = "";
let uploadedImageUrlTwo = "";

function validateAndSetImage(fileInput, targetImage, slot) {
  const [file] = fileInput.files;

  if (!file) {
    return false;
  }

  if (!file.type.startsWith("image/")) {
    fileInput.value = "";
    uploadStatus.textContent = `Photo ${slot} is not an image. Please pick a valid photo.`;
    uploadStatus.classList.remove("ready");
    return false;
  }

  if (slot === 1 && uploadedImageUrlOne) {
    URL.revokeObjectURL(uploadedImageUrlOne);
  }
  if (slot === 2 && uploadedImageUrlTwo) {
    URL.revokeObjectURL(uploadedImageUrlTwo);
  }

  const objectUrl = URL.createObjectURL(file);
  targetImage.src = objectUrl;
  targetImage.alt = `${nameSlot.textContent}'s photo ${slot}`;

  if (slot === 1) uploadedImageUrlOne = objectUrl;
  if (slot === 2) uploadedImageUrlTwo = objectUrl;

  return true;
}

function handlePhotoUpload() {
  const hasFirst = validateAndSetImage(photoInputOne, memoryUserPhoto, 1);
  const hasSecond = validateAndSetImage(photoInputTwo, memoryUserPhotoTwo, 2);

  openExperienceBtn.disabled = !(hasFirst && hasSecond);

  if (hasFirst && hasSecond) {
    uploadStatus.textContent = "Perfect. Your 2 photos are ready 💖";
    uploadStatus.classList.add("ready");
    return;
  }

  uploadStatus.textContent = "Please choose 2 photos to continue.";
  uploadStatus.classList.remove("ready");
}

function revealCardInSection(sectionEl) {
  const target = sectionEl.querySelector(".reveal");
  if (!target) return;

  gsap.fromTo(
    target,
    { opacity: 0, y: 22, scale: 0.97 },
    { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "power3.out" }
  );
}

function goToSection(nextKey) {
  Object.values(sections).forEach((section) => section.classList.add("hidden"));
  const nextSection = sections[nextKey];
  nextSection.classList.remove("hidden");
  nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
  revealCardInSection(nextSection);
}

async function typeMessageLines() {
  typingLines.innerHTML = "";

  for (const line of messageLines) {
    const p = document.createElement("p");
    p.className = "typing-line";
    typingLines.appendChild(p);
    await typeText(p, line, 22);
    await delay(250);
  }
}

function typeText(element, text, speed = 28) {
  return new Promise((resolve) => {
    let i = 0;
    const timer = setInterval(() => {
      element.textContent += text[i] || "";
      i += 1;

      if (i > text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function openImageModal(sourceImage) {
  imageModalPreview.src = sourceImage.src;
  imageModalPreview.alt = sourceImage.alt || "Expanded memory photo";
  imageModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeImageModal() {
  imageModal.classList.add("hidden");
  imageModalPreview.src = "";
  document.body.style.overflow = "";
}

let musicOn = false;

function setMusicButtonState() {
  musicToggle.textContent = musicOn ? "🎵 Music: On" : "🎵 Music: Off";
}

async function toggleMusic() {
  if (musicOn) {
    music.pause();
    musicOn = false;
    setMusicButtonState();
    return;
  }

  try {
    await music.play();
    musicOn = true;
  } catch {
    musicOn = false;
  }

  setMusicButtonState();
}

openExperienceBtn.addEventListener("click", async () => {
  goToSection("inbox");
  await toggleMusic();
});
photoInputOne.addEventListener("change", handlePhotoUpload);
photoInputTwo.addEventListener("change", handlePhotoUpload);

openMessageBtn.addEventListener("click", async () => {
  goToSection("message");
  await delay(420);
  await typeMessageLines();
});

toMemoriesBtn.addEventListener("click", () => goToSection("memories"));
toEndingBtn.addEventListener("click", () => {
  goToSection("ending");
  launchConfettiBurst(220);
});
musicToggle.addEventListener("click", toggleMusic);

galleryImages.forEach((image) => {
  image.addEventListener("click", () => openImageModal(image));
});

imageModalClose.addEventListener("click", closeImageModal);
imageModal.addEventListener("click", (event) => {
  if (event.target === imageModal) {
    closeImageModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !imageModal.classList.contains("hidden")) {
    closeImageModal();
  }
});

if (topbar) {
  gsap.fromTo(topbar, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
}

revealCardInSection(sections.landing);

const canvas = document.getElementById("fx-canvas");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
const particles = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function spawnAmbientParticles(count = 36) {
  particles.length = 0;
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.6,
      speed: Math.random() * 0.6 + 0.15,
      alpha: Math.random() * 0.7 + 0.2
    });
  }
}

function drawAmbient() {
  ctx.clearRect(0, 0, width, height);

  for (const p of particles) {
    p.y -= p.speed;
    p.x += Math.sin(p.y / 60) * 0.24;

    if (p.y < -8) {
      p.y = height + 10;
      p.x = Math.random() * width;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
    ctx.fill();
  }

  requestAnimationFrame(drawAmbient);
}

function launchConfettiBurst(amount = 120) {
  const confetti = [];
  const cx = width / 2;
  const cy = height * 0.55;
  const colors = ["#ff70ad", "#b58bff", "#ffd978", "#ffffff", "#ff9bc6"];

  for (let i = 0; i < amount; i += 1) {
    confetti.push({
      x: cx,
      y: cy,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 1.1) * 10,
      g: 0.12 + Math.random() * 0.08,
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 90 + Math.floor(Math.random() * 40)
    });
  }

  function animateConfetti() {
    ctx.save();
    for (let i = confetti.length - 1; i >= 0; i -= 1) {
      const p = confetti[i];
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;

      ctx.globalAlpha = Math.max(p.life / 130, 0);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size * 1.6);

      if (p.life <= 0) confetti.splice(i, 1);
    }
    ctx.restore();

    if (confetti.length) {
      requestAnimationFrame(animateConfetti);
    }
  }

  animateConfetti();
}

window.addEventListener("resize", () => {
  resizeCanvas();
  spawnAmbientParticles(42);
});

resizeCanvas();
spawnAmbientParticles();
drawAmbient();
