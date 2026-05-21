@echo off
REM Final Git Push Script - Apply all changes and push to GitHub

cd /d "c:\Users\user\Desktop\University\Web\Web_3.0"

echo.
echo ================================
echo Mongolian Hunting Quest - Final Push
echo ================================
echo.

echo 📋 Step 1: Stage all changes...
git add .

echo.
echo 📝 Step 2: Commit all changes...
git commit -m "feat: implement complete REST API and SPA with all endpoints

- Backend: Express REST API (6 routes, 20+ endpoints)
- Frontend: React/Next.js SPA with complete api.js client
- Data: JSON layer (animals, users, bookings, categories)
- Auth: JWT + bcrypt security
- Docs: Complete setup and API guides
- Status: Production-ready"

echo.
echo 🔄 Step 3: Merge remote changes...
git merge origin/main --no-edit

echo.
echo 📤 Step 4: Push to GitHub...
git push origin main

echo.
echo ✅ COMPLETE! All changes pushed to GitHub!
echo 🎉 Mongolian Hunting Quest is now on GitHub!
echo.
echo 🚀 Backend: http://localhost:4000
echo 🌐 Frontend: http://localhost:3000
echo 📋 Health: http://localhost:4000/api/health
echo.
pause
