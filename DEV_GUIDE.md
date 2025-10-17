# Developer Guide - SigMail

## Quick Start

### 1. Run Setup Script
```bash
./setup.sh
```

This will:
- Create .env file with secure defaults
- Install dependencies
- Verify TypeScript compilation
- Test production build

### 2. Configure Environment

Edit `.env` and set:
```bash
DATABASE_URL=mysql://user:pass@localhost:3306/sigmail
VITE_APP_ID=your-manus-app-id
```

### 3. Initialize Database
```bash
pnpm db:push
```

### 4. Start Development Server
```bash
pnpm dev
```

Server will be available at http://localhost:3000

## Project Architecture

### Frontend (client/)
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter (lightweight React router)
- **API Client**: tRPC

### Backend (server/)
- **Runtime**: Node.js + Express
- **API**: tRPC 11 (type-safe RPC)
- **Database**: Drizzle ORM + MySQL/TiDB
- **Authentication**: Manus OAuth + JWT sessions

### Key Directories

```
├── client/src/
│   ├── pages/          # Route components
│   ├── components/     # Reusable UI components
│   ├── lib/           # tRPC client & utilities
│   └── hooks/         # Custom React hooks
│
├── server/
│   ├── _core/         # Framework core (don't modify)
│   ├── routers.ts     # tRPC API endpoints
│   ├── db.ts          # Database queries
│   └── services/      # External integrations (Gmail, etc.)
│
├── drizzle/
│   └── schema.ts      # Database schema definitions
│
├── shared/
│   ├── types.ts       # Shared TypeScript types
│   └── const.ts       # Shared constants
│
└── api/               # Vercel serverless functions
    ├── trpc/          # tRPC handler
    └── oauth/         # OAuth callback
```

## Development Workflow

### Adding a New Feature

1. **Define Database Schema** (if needed)
   ```typescript
   // drizzle/schema.ts
   export const myTable = mysqlTable("myTable", {
     id: varchar("id", { length: 64 }).primaryKey(),
     // ... other fields
   });
   ```

2. **Create Database Functions**
   ```typescript
   // server/db.ts
   export async function getMyData(userId: string) {
     const db = await getDb();
     if (!db) return [];
     return await db.select().from(myTable).where(eq(myTable.userId, userId));
   }
   ```

3. **Add tRPC Procedures**
   ```typescript
   // server/routers.ts
   myFeature: router({
     list: protectedProcedure.query(async ({ ctx }) => {
       return await db.getMyData(ctx.user.id);
     }),
   }),
   ```

4. **Use in Frontend**
   ```typescript
   // client/src/pages/MyFeature.tsx
   import { trpc } from '@/lib/trpc';

   export function MyFeature() {
     const { data } = trpc.myFeature.list.useQuery();
     // ... render component
   }
   ```

5. **Push Database Changes**
   ```bash
   pnpm db:push
   ```

### Working with AI Features

The project includes LLM integration for AI-powered features:

```typescript
// server/_core/llm.ts
import { invokeLLM } from './_core/llm';

const response = await invokeLLM({
  messages: [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: "Compose an email..." }
  ],
});
```

## Testing

### TypeScript Type Checking
```bash
pnpm check
```

### Run Tests
```bash
pnpm test
```

### Manual Testing
1. Start dev server: `pnpm dev`
2. Open http://localhost:3000
3. Check browser console for errors
4. Test API endpoints at http://localhost:3000/api/trpc

## Building for Production

```bash
pnpm build
```

This creates:
- `dist/public/` - Frontend static files
- `dist/index.js` - Backend server bundle
- `dist/server/runtime.js` - Serverless function runtime

## Deployment

### Vercel
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Required Environment Variables
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - Manus OAuth app ID
- `OAUTH_SERVER_URL` - Manus OAuth server URL
- `VITE_OAUTH_PORTAL_URL` - Manus login portal URL

## Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 pnpm dev
```

### Database Connection Failed
- Check DATABASE_URL is correct
- Ensure MySQL is running
- Verify database exists
- Check user permissions

### TypeScript Errors
```bash
# Clear TypeScript cache
rm -f node_modules/typescript/tsbuildinfo

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### OAuth Not Working
- Verify VITE_APP_ID is set correctly
- Check OAuth redirect URI matches your domain
- Ensure OAUTH_SERVER_URL is accessible
- Check browser console for CORS errors

## Database Schema

### Core Tables
- `users` - User accounts
- `personas` - Writing personas/styles
- `emailTemplates` - Saved email templates
- `contacts` - Contact management
- `followUps` - Follow-up reminders
- `emailSequences` - Automated sequences
- `analytics` - Email performance metrics
- `integrations` - External service connections

### Relationships
- User has many Personas
- User has many Templates
- User has many Contacts
- User has many Follow-ups
- Sequence has many Steps
- Contact can be enrolled in Sequences

## API Endpoints

### Authentication
- `auth.me` - Get current user
- `auth.logout` - Clear session

### Personas
- `personas.list` - Get all personas
- `personas.create` - Create new persona
- `personas.update` - Update persona
- `personas.analyzeWritingStyle` - Analyze writing samples

### Templates
- `templates.list` - Get templates
- `templates.create` - Create template
- `templates.use` - Use template with variables

### AI
- `ai.compose` - Generate email with AI
- `ai.refine` - Refine existing email
- `ai.suggestSubject` - Generate subject lines
- `ai.quickReply` - Generate quick replies

### Contacts
- `contacts.list` - Get contacts
- `contacts.search` - Search contacts
- `contacts.upsert` - Create/update contact

### Analytics
- `analytics.overview` - Get email metrics
- `analytics.byTemplate` - Template performance

## Performance Tips

1. **Use React Query cache effectively**
   ```typescript
   const { data } = trpc.personas.list.useQuery(
     undefined,
     { staleTime: 5 * 60 * 1000 } // Cache for 5 minutes
   );
   ```

2. **Optimize database queries**
   ```typescript
   // Use indexes for frequently queried fields
   // Add to schema.ts:
   (table) => ({
     userIdIdx: index("table_userId_idx").on(table.userId),
   })
   ```

3. **Lazy load heavy components**
   ```typescript
   import { lazy, Suspense } from 'react';
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

## Code Style

- Use TypeScript strictly (no `any` types)
- Follow existing naming conventions
- Add JSDoc comments for complex functions
- Keep functions small and focused
- Use meaningful variable names

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push and create PR
git push origin feature/my-feature
```

## Resources

- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [React 19 Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## Support

For issues or questions:
1. Check this guide first
2. Review the README.md
3. Check existing issues on GitHub
4. Create a new issue with details

---

**Happy coding! 🚀**
