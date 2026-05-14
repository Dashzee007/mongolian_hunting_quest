const TOKEN_KEY = 'mhq_token';

// ── JWT helpers ─────────────────────────────────────────────────
function decodeToken(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch { return null; }
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getSession() {
    const token   = getToken();
    if (!token) return null;
    const payload = decodeToken(token);
    if (!payload || payload.exp * 1000 < Date.now()) {
        localStorage.removeItem(TOKEN_KEY);
        return null;
    }
    return payload; // { id, username, email, role }
}

function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
}

// ── API helpers ─────────────────────────────────────────────────
async function apiPost(path, body) {
    let res;
    try {
        res = await fetch(path, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(body),
        });
    } catch {
        throw new Error('Сервертэй холбогдох боломжгүй байна. Сервер ажиллаж байгаа эсэхийг шалгана уу.');
    }
    let data = {};
    try {
        data = await res.json();
    } catch {
        throw new Error(`Серверийн алдаа (${res.status})`);
    }
    if (!res.ok) throw new Error(data.error || 'Серверийн алдаа');
    return data;
}

// ── Auth actions ────────────────────────────────────────────────
export async function login(identifier, password) {
    const data = await apiPost('/api/auth/login', { identifier, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    return data.user;
}

export async function register({ username, email, password }) {
    if (!username || !email || !password) throw new Error('Бүх талбарыг бөглөнө үү');
    const data = await apiPost('/api/auth/register', { username, email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    return data.user;
}

export function logout() {
    clearSession();
    window.location.href = 'index.html';
}

// ── Navbar ──────────────────────────────────────────────────────
export function initNavAuth() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const user = getSession();
    const div  = document.createElement('div');
    div.className = 'nav-auth';

    if (user) {
        const span = document.createElement('span');
        span.className   = 'nav-user';
        span.textContent = `👤 ${user.username}`;

        const btn = document.createElement('button');
        btn.className   = 'nav-btn nav-btn-outline';
        btn.textContent = 'Гарах';
        btn.addEventListener('click', () => {
            clearSession();
            window.location.href = 'index.html';
        });

        div.appendChild(span);
        div.appendChild(btn);
    } else {
        const loginLink = document.createElement('a');
        loginLink.href        = 'login.html';
        loginLink.className   = 'nav-btn nav-btn-outline';
        loginLink.textContent = 'Нэвтрэх';

        const signupLink = document.createElement('a');
        signupLink.href        = 'signup.html';
        signupLink.className   = 'nav-btn nav-btn-solid';
        signupLink.textContent = 'Бүртгүүлэх';

        div.appendChild(loginLink);
        div.appendChild(signupLink);
    }

    navbar.appendChild(div);
}
