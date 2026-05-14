# Mongolian Hunting Quest 🦌

Монголын зэрлэг амьтдын нэгдсэн мэдээллийн платформ — амьтдын каталог, интерактив газрын зураг, зургийн сан.

---

## Технологи

| Давхарга | Технологи |
|---|---|
| Frontend | React + Next.js 16 (App Router) |
| Хэв маяг | CSS (custom design system) |
| Өгөгдөл | JSON → Wikipedia API |
| Газрын зураг | Leaflet.js |
| Backend | Node.js + Express *(тусдаа `server/` фолдер)* |
| Мэдээллийн сан | MySQL |

---

## Хуудаснууд

| URL | Тайлбар |
|---|---|
| `/` | Нүүр хуудас — хайлт, амьтдын карт |
| `/animals` | Амьтдын каталог — шүүлт, бүс нутаг |
| `/gallery` | Зургийн сан — lightbox |
| `/map` | Интерактив газрын зураг |
| `/login` | Нэвтрэх |
| `/signup` | Бүртгүүлэх |

---

## Суулгах заавар

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Хөтөч дээр: **http://localhost:3000**

### Backend (Express)

```bash
cd server
npm install
# server/.env файлд DB тохиргоо хийнэ
node index.js
```

---

## Фолдерийн бүтэц

```
mongolian-hunting-quest/
│
├── frontend/               ← Next.js app
│   └── src/
│       ├── app/            ← Хуудаснууд (App Router)
│       ├── components/     ← React компонентууд
│       ├── data/           ← JSON өгөгдөл
│       ├── services/       ← Өгөгдөл татах логик
│       └── hooks/          ← Custom hooks
│
├── server/                 ← Express backend
│   ├── routes/
│   └── middleware/
│
├── data/                   ← Эх JSON өгөгдөл
├── images/                 ← Зурагнууд
└── js/                     ← Хуучин vanilla JS (лавлагаа болгон)
```

---

## Орчин хувьсагч

`server/.env` файл үүсгэж дараах утгуудыг тохируулна:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mongolian_hunting_quest
JWT_SECRET=your_secret_key
PORT=3000
```

> ⚠️ `.env` файлыг **хэзээ ч** git-д оруулахгүй. `.gitignore`-д бүртгэлтэй.

---

## Хувь нэмэр оруулах

1. Repo-г fork хийнэ
2. Feature branch үүсгэнэ: `git checkout -b feature/your-feature`
3. Commit хийнэ: `git commit -m "feat: describe your change"`
4. Push хийнэ: `git push origin feature/your-feature`
5. Pull Request нээнэ
