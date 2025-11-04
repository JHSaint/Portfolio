// =============================================
// HOW TO UPDATE YOUR PROJECTS
// 1) Edit the projectsData array below. Each object represents a project.
// 2) Fields:
//    - title (string)
//    - description (string)
//    - image (string URL or relative path)
//    - tags (array of strings, used for filters)
//    - demoUrl (string URL) optional
//    - codeUrl (string URL) optional
// 3) Save. The UI updates automatically.
// =============================================

const projectsData = [
    {
        title: "Stock Dashboard",
        description: "A concise summary of what this project does and why it’s interesting.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
        tags: ["Web", "Frontend", "JavaScript"],
        demoUrl: "https://jamaica-watch-news.lovable.app/",
        codeUrl: "https://github.com/your/repo"
    },
    {
        title: "Analytics Dashboard",
        description: "Clean, responsive dashboard with charts and dark mode.",
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop",
        tags: ["Web", "Data", "Bootstrap"],
        demoUrl: "#",
        codeUrl: "#"
    },
    {
        title: "Mobile Companion",
        description: "A lightweight progressive web app for on-the-go tasks.",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2069&auto=format&fit=crop",
        tags: ["PWA", "Frontend"],
        demoUrl: "#",
        codeUrl: "#"
    }
];

// Render year
document.getElementById('year').textContent = new Date().getFullYear();

// Build unique tag filters from data
function getAllTags(data) {
    const set = new Set();
    data.forEach(p => (p.tags || []).forEach(t => set.add(t)));
    return Array.from(set).sort();
}

function renderFilters(tags) {
    const container = document.getElementById('filters');
    if (!container) return;
    container.innerHTML = '';
    const select = document.createElement('select');
    select.id = 'filterSelect';
    select.className = 'form-select form-select-sm';
    const allOption = document.createElement('option');
    allOption.value = 'All';
    allOption.textContent = 'All projects';
    select.appendChild(allOption);
    tags.forEach(tag => {
        const opt = document.createElement('option');
        opt.value = tag;
        opt.textContent = tag;
        select.appendChild(opt);
    });
    container.appendChild(select);
}

function wireFilterClicks() {
    const select = document.getElementById('filterSelect');
    if (!select) return;
    select.addEventListener('change', () => {
        applyPlanetFilter(select.value);
    });
}

function applyPlanetFilter(tag) {
    const system = document.getElementById('solarSystem');
    if (!system) return;
    const planets = Array.from(system.querySelectorAll('.planet'));
    if (tag === 'All') {
        planets.forEach(p => { p.classList.remove('glow', 'dim'); });
        return;
    }
    planets.forEach(p => {
        const tags = (p.dataset.tags || '').split(',').map(s => s.trim()).filter(Boolean);
        const match = tags.includes(tag);
        p.classList.toggle('glow', match);
        p.classList.toggle('dim', !match);
    });
}

// Solar system rendering
function randomHexColor() {
    const c = Math.floor(Math.random() * 0xffffff);
    return '#' + c.toString(16).padStart(6, '0');
}

function renderSolarSystem(projects) {
    const system = document.getElementById('solarSystem');
    if (!system) return;
    // Remove previous orbits except the sun
    Array.from(system.querySelectorAll('.orbit')).forEach(n => n.remove());
    const baseRadius = 100; // first orbit radius
    const gap = 60; // distance between orbits
    const baseDuration = 30; // seconds for outermost
    projects.forEach((proj, idx) => {
        const radius = baseRadius + idx * gap;
        const diameter = radius * 2;
        const orbit = document.createElement('div');
        orbit.className = 'orbit';
        orbit.style.width = diameter + 'px';
        orbit.style.height = diameter + 'px';
        const duration = Math.max(10, baseDuration - idx * 3);
        orbit.style.animationDuration = duration + 's';

        const planet = document.createElement('div');
        planet.className = 'planet';
        const base = randomHexColor();
        planet.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.75), rgba(255,255,255,0.2) 35%, ${base} 80%)`;
        const offset = radius;
        planet.style.transform = `translate(-50%, calc(-50% - ${offset}px))`;
        planet.dataset.index = idx;
        planet.dataset.tags = (proj.tags || []).join(',');

        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = proj.title;
        label.style.animationDuration = duration + 's';
        planet.appendChild(label);

        planet.addEventListener('click', () => showProjectCardAtPlanet(planet, proj));

        orbit.appendChild(planet);
        system.appendChild(orbit);
    });
}

function showProjectCardAtPlanet(planetEl, project) {
    const system = document.getElementById('solarSystem');
    const existing = system.querySelector('.project-card');
    if (existing) existing.remove();

    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
        <button type="button" class="btn-close" aria-label="Close"></button>
        <h5 class="mb-2">${project.title}</h5>
        <p class="mb-3 text-secondary">${project.description}</p>
        <div class="d-flex gap-2 flex-wrap mb-3">${(project.tags||[]).map(t=>`<span class='badge rounded-pill'>${t}</span>`).join('')}</div>
        <div class="d-flex gap-2">
            ${project.demoUrl ? `<a class='btn btn-sm btn-primary' target='_blank' rel='noopener' href='${project.demoUrl}'><i class="bi bi-box-arrow-up-right me-1"></i> Demo</a>` : ''}
            ${project.codeUrl ? `<a class='btn btn-sm btn-outline-light' target='_blank' rel='noopener' href='${project.codeUrl}'><i class="bi bi-github me-1"></i> Code</a>` : ''}
        </div>
    `;

    const systemRect = system.getBoundingClientRect();
    const planetRect = planetEl.getBoundingClientRect();
    const leftInside = planetRect.left - systemRect.left;
    const topInside = planetRect.top - systemRect.top;
    card.style.left = Math.min(system.clientWidth - 340, leftInside + 24 + 16) + 'px';
    card.style.top = Math.max(0, topInside - 16) + 'px';
    if (leftInside > system.clientWidth - 360) {
        card.style.left = Math.max(0, leftInside - 16 - 320) + 'px';
        const arrow = document.createElement('div');
        arrow.style.position = 'absolute';
        arrow.style.width = '0';
        arrow.style.height = '0';
        arrow.style.border = '8px solid transparent';
        arrow.style.borderLeftColor = '#121626';
        arrow.style.right = '-16px';
        arrow.style.top = '16px';
        card.appendChild(arrow);
    }

    system.appendChild(card);

    // Close interactions
    card.querySelector('.btn-close').addEventListener('click', () => card.remove());
    const handleOutside = (ev) => {
        if (!card.contains(ev.target) && !planetEl.contains(ev.target)) {
            card.remove();
            system.removeEventListener('pointerdown', handleOutside);
            document.removeEventListener('keydown', handleEsc);
        }
    };
    const handleEsc = (ev) => {
        if (ev.key === 'Escape') {
            card.remove();
            system.removeEventListener('pointerdown', handleOutside);
            document.removeEventListener('keydown', handleEsc);
        }
    };
    system.addEventListener('pointerdown', handleOutside);
    document.addEventListener('keydown', handleEsc);
}

// Modal logic (kept for future use)
const modalElement = document.getElementById('projectModal');
const bsModal = new bootstrap.Modal(modalElement);
function openProjectModal(project) {
    document.getElementById('projectModalLabel').textContent = project.title;
    document.getElementById('modalImage').src = project.image;
    document.getElementById('modalImage').alt = project.title + ' screenshot';
    document.getElementById('modalDescription').textContent = project.description;
    const tagsWrap = document.getElementById('modalTags');
    tagsWrap.innerHTML = '';
    (project.tags || []).forEach(t => {
        const s = document.createElement('span');
        s.className = 'badge rounded-pill';
        s.textContent = t;
        tagsWrap.appendChild(s);
    });
    const demo = document.getElementById('modalDemo');
    const code = document.getElementById('modalCode');
    if (project.demoUrl) { demo.href = project.demoUrl; demo.classList.remove('disabled'); } else { demo.href = '#'; demo.classList.add('disabled'); }
    if (project.codeUrl) { code.href = project.codeUrl; code.classList.remove('disabled'); } else { code.href = '#'; code.classList.add('disabled'); }
    bsModal.show();
}

// Smooth-scroll active link highlighting
const sections = ['about', 'projects', 'contact'].map(id => document.getElementById(id));
const navLinks = Array.from(document.querySelectorAll('.navbar .nav-link'));
function onScroll() {
    const scrollPos = window.scrollY + 120;
    sections.forEach((sec) => {
        const link = navLinks.find(a => a.getAttribute('href') === '#' + sec.id);
        if (!link) return;
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
            navLinks.forEach(a => a.classList.remove('active'));
            link.classList.add('active');
        }
    });
}
document.addEventListener('scroll', onScroll);

// Back to top
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
function toggleBackToTop() {
    if (window.scrollY > 300) { backToTop.style.display = 'inline-flex'; } else { backToTop.style.display = 'none'; }
}
document.addEventListener('scroll', toggleBackToTop);

// Background audio via <audio> element (local mp3)
const audioBtn = document.getElementById('audioToggle');
const audioEl = document.createElement('audio');
audioEl.id = 'bgAudio';
audioEl.src = 'assets/Main.mp3';
audioEl.loop = true;
audioEl.preload = 'auto';
audioEl.muted = false;
document.body.appendChild(audioEl);

function syncAudioButtonUIFromState(isMuted) {
    if (isMuted) {
        audioBtn.innerHTML = '<i class="bi bi-volume-mute"></i> Sound Off';
        audioBtn.classList.remove('btn-dark');
        audioBtn.classList.add('btn-outline-dark');
    } else {
        audioBtn.innerHTML = '<i class="bi bi-volume-up"></i> Sound On';
        audioBtn.classList.remove('btn-outline-dark');
        audioBtn.classList.add('btn-dark');
    }
}

(async () => {
    try { await audioEl.play(); } catch (_) {}
    syncAudioButtonUIFromState(audioEl.muted);
})();

audioBtn.addEventListener('click', async () => {
    if (audioEl.paused) { try { await audioEl.play(); } catch (_) {} }
    audioEl.muted = !audioEl.muted;
    syncAudioButtonUIFromState(audioEl.muted);
});

// Init
(function init() {
    renderFilters(getAllTags(projectsData));
    renderSolarSystem(projectsData);
    onScroll();
    toggleBackToTop();
    wireFilterClicks();
})();


