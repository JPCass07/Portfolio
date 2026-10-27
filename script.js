// Progressive enhancement only. The page reads fine without this file:
// write-ups show inline, everything is visible, and the theme follows the system.
const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Theme ---------- */
const themeButton = document.getElementById("theme");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)");

function currentTheme() {
  return root.dataset.theme || (prefersLight.matches ? "light" : "dark");
}

function labelThemeButton() {
  const next = currentTheme() === "light" ? "dark" : "light";
  themeButton.setAttribute("aria-label", `Switch to the ${next} theme`);
}

themeButton.addEventListener("click", () => {
  const next = currentTheme() === "light" ? "dark" : "light";
  root.dataset.theme = next;
  try { localStorage.setItem("jc-theme", next); } catch (e) {}
  labelThemeButton();
});
prefersLight.addEventListener("change", labelThemeButton);
labelThemeButton();

/* ---------- Reveal on scroll ---------- */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  revealItems.forEach((el) => observer.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- Glow card: the border lights up under the cursor ---------- */
document.querySelectorAll(".feature").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

/* ---------- Pressed buttons in a group ---------- */
function press(group, button) {
  group.querySelectorAll("[aria-pressed]").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
}

/* ---------- Lens: read the Tanium map for FDE, security or both ---------- */
const carry = document.getElementById("carry");

carry.querySelectorAll("button[data-lens]").forEach((button) => {
  button.addEventListener("click", () => {
    press(button.parentElement, button);
    carry.dataset.lens = button.dataset.lens;
    carry.classList.remove("is-switching");
    void carry.offsetWidth;
    carry.classList.add("is-switching");
  });
});

/* ---------- Sort projects, like the first version of this site ---------- */
const grid = document.getElementById("projects");
const count = document.getElementById("count");
const sorters = {
  recent: {
    label: "most recent first",
    fn: (a, b) => b.dataset.end.localeCompare(a.dataset.end) || b.dataset.start.localeCompare(a.dataset.start),
  },
  start: {
    label: "by start date",
    fn: (a, b) => a.dataset.start.localeCompare(b.dataset.start),
  },
  az: {
    label: "A to Z",
    fn: (a, b) => a.dataset.title.localeCompare(b.dataset.title, "en-GB"),
  },
};

function sortProjects(key) {
  const items = [...grid.children];
  const before = new Map(items.map((el) => [el, el.getBoundingClientRect()]));

  items.sort(sorters[key].fn).forEach((el) => grid.appendChild(el));
  count.textContent = `${items.length} projects · ${sorters[key].label}`;

  if (reduceMotion) return;

  // Slide each card from its old place to its new one (transform only)
  items.forEach((el) => {
    const a = before.get(el);
    const b = el.getBoundingClientRect();
    const dx = a.left - b.left;
    const dy = a.top - b.top;
    if (!dx && !dy) return;
    el.animate(
      [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0, 0)" }],
      { duration: 450, easing: "cubic-bezier(.2, .7, .2, 1)" }
    );
  });
}

document.querySelectorAll("[data-sort]").forEach((button) => {
  button.addEventListener("click", () => {
    press(button.parentElement, button);
    sortProjects(button.dataset.sort);
  });
});

/* ---------- Write-up sheet, like the pop-up project details on the first version ---------- */
const sheet = document.getElementById("sheet");
const sheetIdx = document.getElementById("sheet-idx");
const sheetTitle = document.getElementById("sheet-title");
const sheetBody = document.getElementById("sheet-body");
let opener = null;

grid.addEventListener("click", (e) => {
  const button = e.target.closest(".more");
  if (!button) return;
  const card = button.closest(".project");
  opener = button;
  sheetIdx.innerHTML = card.querySelector(".idx").innerHTML;
  sheetTitle.textContent = card.querySelector("h3").textContent;
  sheetBody.innerHTML = card.querySelector(".project__detail").innerHTML;
  sheet.showModal();
  sheet.scrollTop = 0;
});

sheet.addEventListener("click", (e) => {
  // A click on the backdrop lands on the dialog itself
  if (e.target === sheet || e.target.closest("[data-close]")) sheet.close();
});

sheet.addEventListener("close", () => {
  if (opener) opener.focus();
});
