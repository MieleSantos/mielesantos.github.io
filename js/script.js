const GITHUB_USER = 'MieleSantos';
const CACHE_TTL = 3600000;

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menu');
}

hamburger.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('active');
    hamburger.classList.toggle('active', isActive);
    hamburger.setAttribute('aria-expanded', String(isActive));
    hamburger.setAttribute('aria-label', isActive ? 'Fechar menu' : 'Abrir menu');
});

navLinks.forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
        hamburger.focus();
    }
});

function createScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.type = 'button';
    scrollBtn.setAttribute('aria-label', 'Voltar ao topo');
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0 });
    });
    document.body.appendChild(scrollBtn);
    return scrollBtn;
}

const scrollBtn = createScrollToTop();

function handleScroll() {
    const scrollY = window.scrollY;

    navbar.classList.toggle('scrolled', scrollY > 50);
    scrollBtn.classList.toggle('visible', scrollY > 300);

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const navLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
        const isCurrent = scrollY > sectionTop && scrollY <= sectionTop + section.offsetHeight;
        navLink?.classList.toggle('active', isCurrent);
    });
}

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.classList.contains('active')));

        button.addEventListener('click', () => {
            const selectedFilter = button.dataset.filter;

            filterButtons.forEach((btn) => {
                btn.classList.toggle('active', btn === button);
                btn.setAttribute('aria-pressed', String(btn === button));
            });

            projectCards.forEach((card) => {
                const shouldShow = selectedFilter === 'all' || selectedFilter === card.dataset.category;
                card.classList.toggle('hidden', !shouldShow);
            });
        });
    });
}

function getCachedData(key, ttl = CACHE_TTL) {
    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp > ttl) {
            localStorage.removeItem(key);
            return null;
        }
        return parsed.data;
    } catch {
        return null;
    }
}

function setCachedData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch {
        // localStorage indisponível ou cheio: segue sem cache
    }
}

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`GitHub API respondeu ${response.status}`);
    return response.json();
}

// Mantém só os campos usados para não estourar o localStorage
function slimRepo(repo) {
    return {
        name: repo.name,
        html_url: repo.html_url,
        language: repo.language,
        updated_at: repo.updated_at,
        fork: repo.fork,
        stargazers_count: repo.stargazers_count
    };
}

let reposPromise = null;

// Busca todos os repositórios (paginando) uma única vez por carregamento
function getRepos() {
    if (reposPromise) return reposPromise;

    reposPromise = (async () => {
        const cached = getCachedData('gh_repos');
        if (cached) return cached;

        const repos = [];
        for (let page = 1; page <= 10; page++) {
            const batch = await fetchJson(
                `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&direction=desc&per_page=100&page=${page}`
            );
            repos.push(...batch.map(slimRepo));
            if (batch.length < 100) break;
        }
        setCachedData('gh_repos', repos);
        return repos;
    })();

    reposPromise.catch(() => { reposPromise = null; });
    return reposPromise;
}

async function getUser() {
    const cached = getCachedData('gh_user');
    if (cached) return cached;

    const user = await fetchJson(`https://api.github.com/users/${GITHUB_USER}`);
    setCachedData('gh_user', user);
    return user;
}

async function loadRecentProjects() {
    const container = document.getElementById('recentProjectsList');
    if (!container) return;

    try {
        renderRecentProjects(await getRepos(), container);
    } catch {
        container.innerHTML = '<li>Não foi possível carregar os projetos recentes agora.</li>';
    }
}

function renderRecentProjects(repos, container) {
    const recentRepos = repos
        .filter((repo) => !repo.fork && repo.name.toLowerCase() !== GITHUB_USER.toLowerCase())
        .slice(0, 6);

    if (!recentRepos.length) {
        container.innerHTML = '<li>Nenhum repositório recente encontrado.</li>';
        return;
    }

    container.innerHTML = '';
    recentRepos.forEach((repo) => {
        const listItem = document.createElement('li');

        const link = document.createElement('a');
        link.href = repo.html_url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = repo.name;

        const meta = document.createElement('div');
        meta.className = 'recent-meta';
        meta.textContent = `${repo.language || 'Sem linguagem definida'} | Atualizado em ${new Date(repo.updated_at).toLocaleDateString('pt-BR')}`;

        listItem.appendChild(link);
        listItem.appendChild(meta);
        container.appendChild(listItem);
    });
}

async function loadUserStats() {
    let userData;
    try {
        userData = await getUser();
    } catch {
        return;
    }

    let totalStars = null;
    try {
        const repos = await getRepos();
        totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    } catch {
        // mantém os valores estáticos de stars
    }

    // Contadores da seção Sobre Mim
    const [reposEl, starsEl, followersEl] = document.querySelectorAll('.stat-number');
    if (reposEl) reposEl.textContent = String(userData.public_repos ?? 0);
    if (starsEl && totalStars !== null) starsEl.textContent = String(totalStars);
    if (followersEl) followersEl.textContent = String(userData.followers ?? 0);

    // Card de perfil do GitHub
    const ghAvatar = document.getElementById('ghAvatar');
    const ghName = document.getElementById('ghName');
    const ghBio = document.getElementById('ghBio');
    const ghReposVal = document.getElementById('ghReposVal');
    const ghStarsVal = document.getElementById('ghStarsVal');
    const ghFollowersVal = document.getElementById('ghFollowersVal');

    if (ghAvatar && userData.avatar_url) ghAvatar.src = userData.avatar_url;
    if (ghName && userData.name) ghName.textContent = userData.name;
    if (ghBio) ghBio.textContent = (userData.bio || 'Backend Engineer | Python • APIs • IA').replace(/\r\n/g, '\n');
    if (ghReposVal) ghReposVal.textContent = String(userData.public_repos ?? 0);
    if (ghStarsVal) ghStarsVal.textContent = totalStars !== null ? String(totalStars) : '—';
    if (ghFollowersVal) ghFollowersVal.textContent = String(userData.followers ?? 0);
}

const shouldAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.addEventListener('DOMContentLoaded', () => {
    if (shouldAnimate) {
        document.querySelectorAll('.project-card, .skill-category, .stat-card, .info-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    handleScroll();
    initProjectFilters();
    loadRecentProjects();
    loadUserStats();
});

console.log('%c👋 Olá! Bem-vindo ao portfólio de Miele Silva', 'color: #6366F1; font-size: 16px; font-weight: bold;');
console.log('%cBackend Engineer Python especializado em IA', 'color: #9CA3AF; font-size: 12px;');
