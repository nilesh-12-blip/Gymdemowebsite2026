# APEX GYM Backend 🚀

## Quick Start

1. **Setup Environment**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env: set DB_URI=mongodb://localhost:27017/apexgym
   # Set JWT_SECRET=your-super-secret-key (keep safe!)
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Seed Admin User** (one-time)
   ```bash
   curl -X POST http://localhost:5000/api/auth/admin/register \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@apexgym.com","password":"admin123"}'
   ```

4. **Run Server**
   ```bash
   npm run dev  # Development (nodemon)
   # or
   npm start    # Production
   ```

5. **Test API**
   - Base URL: `http://localhost:5000`
   - Frontend served at same URL
   - Test: `curl http://localhost:5000`

## API Endpoints
- `POST /api/auth/register` - User signup
- `POST /api/auth/login` - User login (JWT)
- `POST /api/auth/admin/register` - Admin seed

**Next:** Frontend integration after backend APIs complete.

## Tech Stack
- Express.js
- MongoDB/Mongoose
- JWT Auth
- bcrypt
- CORS

