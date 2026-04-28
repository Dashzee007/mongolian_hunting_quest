const USERS_KEY   = 'mhq_users';
const SESSION_KEY = 'mhq_session';

export async function loadAllUsers() {
    let seed = [];
    try {
        const res = await fetch('../data/users.json');
        if (res.ok) seed = await res.json();
    } catch { /* file:// CORS or network error — seed users unavailable */ }
    const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    // Local registrations take precedence; exclude seed duplicates by email
    const localEmails = new Set(local.map(u => u.email));
    return [...seed.filter(u => !localEmails.has(u.email)), ...local];
}

export function getSession() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
}

function setSession(user) {
    const { password, ...safe } = user;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(safe));
}

function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
}

export async function login(identifier, password) {
    const users = await loadAllUsers();
    const user = users.find(
        u => (u.email === identifier || u.username === identifier) && u.password === password
    );
    if (!user) throw new Error('Нэвтрэх нэр эсвэл нууц үг буруу байна');
    setSession(user);
    return user;
}

export async function register({ username, email, password }) {
    if (!username || !email || !password) throw new Error('Бүх талбарыг бөглөнө үү');
    const users = await loadAllUsers();
    if (users.find(u => u.email === email))     throw new Error('Энэ имэйл аль хэдийн бүртгэгдсэн');
    if (users.find(u => u.username === username)) throw new Error('Энэ хэрэглэгчийн нэр аль хэдийн авагдсан');

    const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const newUser = {
        id:        Date.now(),
        username,
        email,
        password,
        role:      'user',
        createdAt: new Date().toISOString().slice(0, 10)
    };
    local.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(local));
    setSession(newUser);
    return newUser;
}

export function logout() {
    clearSession();
    window.location.href = 'index.html';
}

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
        loginLink.href       = 'login.html';
        loginLink.className  = 'nav-btn nav-btn-outline';
        loginLink.textContent = 'Нэвтрэх';

        const signupLink = document.createElement('a');
        signupLink.href       = 'signup.html';
        signupLink.className  = 'nav-btn nav-btn-solid';
        signupLink.textContent = 'Бүртгүүлэх';

        div.appendChild(loginLink);
        div.appendChild(signupLink);
    }

    navbar.appendChild(div);
}
