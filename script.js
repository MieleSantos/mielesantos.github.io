const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

hamburger.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(13, 17, 23, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.backgroundColor = 'rgba(13, 17, 23, 0.95)';
        navbar.style.boxShadow = 'none';
    }

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
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
});

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const selectedFilter = button.dataset.filter;

            filterButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');

            projectCards.forEach((card) => {
                const cardCategory = card.dataset.category;
                const shouldShow = selectedFilter === 'all' || selectedFilter === cardCategory;
                card.classList.toggle('hidden', !shouldShow);
            });
        });
    });
}

function getCachedData(key, ttl) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp > ttl) {
            localStorage.removeItem(key);
            return null;
        }
        return parsed.data;
    } catch {
        localStorage.removeItem(key);
        return null;
    }
}

function setCachedData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch {
    }
}

async function loadRecentProjects() {
    const recentProjectsList = document.getElementById('recentProjectsList');
    if (!recentProjectsList) return;

    const cacheKey = 'gh_repos';
    const cached = getCachedData(cacheKey, 3600000);

    if (cached) {
        renderRecentProjects(cached, recentProjectsList);
        return;
    }

    try {
        const response = await fetch('https://api.github.com/users/MieleSantos/repos?sort=updated&direction=desc&per_page=100');
        if (!response.ok) throw new Error('Erro ao buscar projetos recentes.');

        const repos = await response.json();
        setCachedData(cacheKey, repos);
        renderRecentProjects(repos, recentProjectsList);
    } catch {
        recentProjectsList.innerHTML = '<li>Não foi possível carregar os projetos recentes agora.</li>';
    }
}

function renderRecentProjects(repos, container) {
    const recentRepos = repos
        .filter((repo) => !repo.fork && repo.name.toLowerCase() !== 'mielesantos')
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
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const cacheKey = 'gh_user';
    const cached = getCachedData(cacheKey, 3600000);

    let userData;
    if (cached) {
        userData = cached;
    } else {
        try {
            const response = await fetch('https://api.github.com/users/MieleSantos');
            if (!response.ok) throw new Error('Erro ao buscar dados do usuário.');
            userData = await response.json();
            setCachedData(cacheKey, userData);
        } catch {
            return;
        }
    }

    let repos = getCachedData('gh_repos');
    if (!repos) {
        try {
            const res = await fetch('https://api.github.com/users/MieleSantos/repos?sort=updated&direction=desc&per_page=100');
            if (res.ok) {
                repos = await res.json();
                setCachedData('gh_repos', repos);
            }
        } catch {}
    }

    let totalStars = '...';
    if (repos) {
        totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    }

    const stats = [
        userData.public_repos + '+',
        totalStars,
        userData.followers ?? '...'
    ];

    statNumbers.forEach((el, i) => {
        if (stats[i] !== undefined) el.textContent = String(stats[i]);
    });
}

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const shouldAnimate = !motionQuery.matches;

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    if (shouldAnimate) {
        document.querySelectorAll('.project-card, .skill-category, .stat-card, .info-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    initProjectFilters();
    loadRecentProjects();
    loadUserStats();
});

function createScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Voltar ao topo');
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        z-index: 999;
        transition: transform 0.3s, background-color 0.3s;
        box-shadow: 0 4px 15px rgba(88, 166, 255, 0.3);
    `;

    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        scrollBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'scale(1.1)';
        scrollBtn.style.backgroundColor = 'var(--hover-color)';
    });

    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'scale(1)';
        scrollBtn.style.backgroundColor = 'var(--primary-color)';
    });
}

createScrollToTop();

const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
        position: relative;
    }
    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--primary-color);
    }
`;
document.head.appendChild(style);

console.log('%c👋 Olá! Bem-vindo ao portfólio de Miele Silva', 'color: #58A6FF; font-size: 16px; font-weight: bold;');
console.log('%cDesenvolvedor Back-end Python especializado em IA', 'color: #8B949E; font-size: 12px;');
