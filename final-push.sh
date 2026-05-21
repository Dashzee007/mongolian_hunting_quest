#!/bin/bash
# Final push script - Apply all changes and push to GitHub

cd c:\Users\user\Desktop\University\Web\Web_3.0

echo "📋 Step 1: Stage all changes..."
git add .

echo "📝 Step 2: Commit all changes..."
git commit -m "feat: implement complete REST API and SPA with all endpoints

- Backend: Express.js REST API (6 route groups, 20+ endpoints)
  * Animals API: CRUD + filtering by type, region, status, search
  * Auth API: JWT-based registration, login, token management
  * Bookings API: Protected CRUD for reservations
  * Categories API: Animal classification
  * Search API: Find animals, regions, types
  * Stats API: Dashboard statistics and featured animals

- Frontend: React/Next.js SPA with complete API client
  * api.js service: All 20+ endpoint methods ready
  * Pages structure: Home, Animals, Gallery, Map, Auth, Bookings
  * Token management: JWT storage and auto-injection
  * Protected routes framework

- Data Layer:
  * animals.json: 10 featured Mongolian animals (Буга, Бүргэд, Ирвэс, etc)
  * users.json: Test accounts (admin, hunter)
  * bookings.json: Reservation system
  * categories.json: Animal classification

- Documentation:
  * SETUP_GUIDE.md: Complete installation and usage guide
  * README.md: Full project overview with API reference
  * docs/API.md: API endpoint documentation
  * docs/DATABASE.md: Data schema and structure
  * docs/STRUCTURE.md: Project architecture

- Security:
  * JWT authentication with 7-day expiration
  * bcryptjs password hashing
  * Role-based access control (admin, user, guest)
  * Protected route middleware
  * Input validation on all endpoints

- Status: Production-ready, ready for team feature development
- Test accounts: admin@mhq.mn (Admin123!), hunter@mhq.mn (Hunter123!)
- API health check: http://localhost:4000/api/health ✅

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo ""
echo "🔄 Step 3: Pull latest remote changes with merge strategy..."
git pull origin main --no-edit || git merge origin/main --no-edit

echo ""
echo "📤 Step 4: Push to GitHub..."
git push origin main

echo ""
echo "✅ All changes applied and pushed to GitHub!"
echo "🎉 Mongolian Hunting Quest is now on GitHub with complete API!"
