# APEX GYM Full-Stack Production Deployment
## Status: 🚀 Ready for Implementation

### ✅ Completed (Pre-work)
- [x] Preloader fix (3s fallback)
- [x] Backend API structure (Express + MongoDB)
- [x] Frontend assets in server/public/
- [x] Basic auth/register/login routes
- [x] Reviews, messages, bookings endpoints
- [x] Admin dashboard API

### 🔄 Step 1: Environment Setup (Current)
```
1a. Install MongoDB locally OR use MongoDB Atlas (free tier)
1b. cd server && npm install
1c. Create server/.env:
```
```
DB_URI=mongodb://localhost:27017/apexgym
JWT_SECRET=apexgym2026_supersecret_key_change_in_prod
PORT=5000
```
```
1d. POST http://localhost:5000/api/auth/admin/register (creates admin)
1e. npm run dev (or nodemon server.js)
```

### 🎯 Step 2: API Integration (Priority)
```
Update server/public/main.js (911 lines):
- Replace localStorage with fetch('/api/...')
  * Auth: /api/auth/register, /api/auth/login (+ token storage)
  * Reviews: POST/GET /api/reviews
  * Messages: POST /api/messages  
  * Admin: GET /api/admin/stats, /api/admin/*
  * Bookings: POST /api/bookings (JWT header)
- Fix login form ID (#password → #loginPassword)
- Add loading states + error handling
```

### 🛡️ Step 3: Production Hardening
```
server/server.js:
- Add helmet, compression, rate-limiter-flexible
- Global error handler
- Input validation (express-validator)

server/package.json: + deps
```

### 📱 Step 4: Frontend Optimizations
```
- Remove root/ duplicates (serve only server/public/)
- PWA manifest + service worker
- Lighthouse 90+ (perf/accessibility)
```

### 🚀 Step 5: Deploy & Test
```
Local: http://localhost:5000 (full-stack)
- Test: register→login→review→message→admin→book class
- Verify: MongoDB data persists
Prod: Render/Vercel + MongoDB Atlas + PM2
```

### ✅ Step 6: Verify Production-Ready
```
- [ ] No console errors
- [ ] All buttons/features work  
- [ ] Responsive/mobile perfect
- [ ] SEO meta tags
- [ ] 100% Lighthouse scores
```

**Current Progress: 40% → Target: 100% Production-Ready**

**Next Action**: Implement Step 2 (API integration in main.js)

