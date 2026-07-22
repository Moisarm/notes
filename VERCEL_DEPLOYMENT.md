# Vercel Environment Variables Configuration

## Required Environment Variables

For the backend to work correctly on Vercel, you need to set the following environment variables:

### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

```
NODE_ENV=production
PORT=3000  # Vercel automatically sets this
SECRET=your-jwt-secret-key-here
DATABASE_URL=your-postgresql-connection-string
```

### For CORS Configuration:
```
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## Important Notes

1. **Database**: You'll need to set up a PostgreSQL database on a service like:
   - Neon (PostgreSQL serverless)
   - Supabase
   - Railway
   - Heroku Postgres
   - AWS RDS

2. **CORS**: Update the CORS configuration in `backend/src/infrastructure/config/server/cors.config.ts`:
   ```typescript
   export const cors_options = {
     origin: process.env.FRONTEND_URL || "http://localhost:5173",
     credentials: true,
     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
     allowedHeaders: ["Content-Type", "Authorization"],
   };
   ```

3. **Build Commands**: Vercel will automatically run:
   - `npm install` in frontend directory
   - `bun install` in backend directory
   - `npm run build` in frontend directory

## Deployment Steps

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

## Alternative: Separate Frontend/Backend Deployment

If you prefer to deploy frontend and backend separately:

### Frontend-only deployment:
- Deploy only the `frontend/` directory
- Update API base URL in `frontend/src/services/api.ts`:
  ```typescript
  const api = axios.create({
    baseURL: 'https://your-backend-api.vercel.app/api',
    // ...
  });
  ```

### Backend-only deployment:
- Deploy only the `backend/` directory
- Set up proper CORS for your frontend domain
