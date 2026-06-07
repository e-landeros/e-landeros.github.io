(() => {
  const categoryTarget = document.querySelector("#blog-categories");
  const categorySidebar = document.querySelector("#quarto-margin-sidebar");
  const categoryTitle = categorySidebar?.querySelector(".quarto-listing-category-title");
  const categoryList = categorySidebar?.querySelector(".quarto-listing-category");

  if (categoryTarget && categoryTitle && categoryList) {
    categoryTarget.append(categoryTitle, categoryList);
    categorySidebar.classList.add("categories-moved");
  }

  const hero = document.querySelector(".home-hero");
  const canvas = document.querySelector(".hero-birds");

  if (!hero || !canvas) {
    return;
  }

  const context = canvas.getContext("2d");
  const pointer = { x: 0, y: 0, active: false };
  const birds = [];
  const birdCount = 28;

  let width = 0;
  let height = 0;
  let animationFrame = 0;

  const random = (min, max) => min + Math.random() * (max - min);

  function resize() {
    const bounds = hero.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    width = bounds.width;
    height = bounds.height;
    canvas.width = Math.max(1, Math.floor(width * ratio));
    canvas.height = Math.max(1, Math.floor(height * ratio));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createBird() {
    return {
      x: random(0, width),
      y: random(0, height),
      vx: random(0.35, 0.9),
      vy: random(-0.25, 0.25),
      size: random(8, 15),
      phase: random(0, Math.PI * 2),
    };
  }

  function seedBirds() {
    birds.length = 0;

    for (let index = 0; index < birdCount; index += 1) {
      birds.push(createBird());
    }
  }

  function drawBird(bird, index) {
    const wing = Math.sin(bird.phase) * bird.size * 0.45;

    context.save();
    context.translate(bird.x, bird.y);
    context.rotate(Math.atan2(bird.vy, bird.vx) * 0.4);
    context.strokeStyle = index % 3 === 0
      ? "rgba(103, 232, 249, 0.72)"
      : "rgba(255, 255, 255, 0.62)";
    context.lineWidth = 1.4;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(-bird.size, wing);
    context.quadraticCurveTo(-bird.size * 0.35, -bird.size * 0.35, 0, 0);
    context.quadraticCurveTo(bird.size * 0.35, -bird.size * 0.35, bird.size, wing);
    context.stroke();
    context.restore();
  }

  function updateBird(bird) {
    if (pointer.active) {
      const dx = bird.x - pointer.x;
      const dy = bird.y - pointer.y;
      const distance = Math.hypot(dx, dy);
      const radius = 130;

      if (distance < radius && distance > 0) {
        const force = (radius - distance) / radius;
        bird.vx += (dx / distance) * force * 0.08;
        bird.vy += (dy / distance) * force * 0.08;
      }
    }

    bird.vx += 0.002;
    bird.vx = Math.max(0.25, Math.min(1.25, bird.vx));
    bird.vy *= 0.985;
    bird.x += bird.vx;
    bird.y += bird.vy;
    bird.phase += 0.18 + bird.vx * 0.04;

    if (bird.x > width + bird.size) {
      bird.x = -bird.size;
      bird.y = random(20, height - 20);
      bird.vx = random(0.35, 0.9);
      bird.vy = random(-0.25, 0.25);
    }

    if (bird.y < 10 || bird.y > height - 10) {
      bird.vy *= -0.8;
    }
  }

  function animate() {
    context.clearRect(0, 0, width, height);

    for (const [index, bird] of birds.entries()) {
      updateBird(bird);
      drawBird(bird, index);
    }

    animationFrame = window.requestAnimationFrame(animate);
  }

  function updatePointer(event) {
    const bounds = hero.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
  }

  resize();
  seedBirds();
  animate();

  window.addEventListener("resize", () => {
    resize();
    seedBirds();
  });
  hero.addEventListener("pointermove", updatePointer);
  hero.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationFrame);
      return;
    }

    animate();
  });
})();
