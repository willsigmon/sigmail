# AI Email Assistant Pro

A powerful, AI-driven email management platform that helps you write, manage, and optimize your email communications with advanced features like multi-persona support, automated follow-ups, email sequences, and comprehensive analytics.

## 🌟 Features

### Core Features
- **AI-Powered Email Composition** - Write emails 10x faster with context-aware AI
- **Multi-Persona System** - Switch between Work, Personal, Sales, and custom personas
- **"Sound Like Me!" Feature** - AI learns your unique writing style from past emails
- **Smart Contact Management** - Track relationships with automatic enrichment
- **Automated Follow-ups** - Never miss a follow-up with intelligent reminders
- **Email Templates Library** - Save and reuse your best emails
- **Email Sequences** - Automated drip campaigns and follow-up sequences
- **Analytics Dashboard** - Track open rates, response times, and performance
- **Priority Inbox** - AI-powered email prioritization
- **Semantic Search** - Natural language search across all your emails

### Advanced Features
- **Tone Customization** - Adjust formality, enthusiasm, brevity, and empathy
- **Quick Replies** - AI-suggested responses for common emails
- **Contact Intelligence** - Enrichment with LinkedIn and company data
- **Relationship Health Tracking** - Monitor communication patterns
- **Email Insights** - AI-generated insights about your email habits
- **Calendar Integration** - Schedule meetings directly from emails
- **Mobile-Responsive Design** - Works perfectly on all devices

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: Node.js, Express, tRPC 11
- **Database**: MySQL/TiDB with Drizzle ORM
- **AI**: Built-in LLM service (OpenAI-compatible)
- **Auth**: Manus OAuth
- **Email**: Gmail API integration
- **Storage**: S3-compatible storage

## 📋 Prerequisites

- Node.js 22+
- pnpm package manager
- MySQL/TiDB database
- Gmail API credentials (optional, for email integration)

## 🛠️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/willsigmon/newdash.git
cd newdash
git checkout email-assistant
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

The following environment variables are automatically injected by the Manus platform:

- `DATABASE_URL` - MySQL/TiDB connection string
- `JWT_SECRET` - Session cookie signing secret
- `VITE_APP_ID` - Manus OAuth application ID
- `OAUTH_SERVER_URL` - Manus OAuth backend base URL
- `VITE_OAUTH_PORTAL_URL` - Manus login portal URL
- `BUILT_IN_FORGE_API_URL` - Manus built-in APIs
- `BUILT_IN_FORGE_API_KEY` - Bearer token for Manus APIs

### 4. Initialize the database

```bash
pnpm db:push
```

This will create all necessary tables in your database.

### 5. Start the development server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📱 Usage

### Getting Started

1. **Log in** - Use the Manus OAuth login to access the application
2. **Create a Persona** - Go to Personas page and create your first writing persona
3. **Connect Email** - (Optional) Connect your Gmail account in Settings
4. **Compose Email** - Use the AI-powered composer to write your first email
5. **Explore Features** - Check out Templates, Follow-ups, Analytics, and more!

### Creating Personas

Personas allow you to customize how the AI writes emails for different contexts:

1. Navigate to **Personas** page
2. Click **New Persona**
3. Configure:
   - **Name**: e.g., "Professional Work", "Casual Personal"
   - **Type**: Work, Personal, Sales, Support, etc.
   - **Tone Settings**: Adjust formality, enthusiasm, brevity, empathy
4. Click **Sound Like Me!** to analyze your writing style from past emails

### Using AI Composition

1. Go to **Compose** page
2. Select a persona (optional)
3. Enter what you want to write in the AI instruction box
4. Click **Compose Email** to generate the email
5. Use **Refine** to make adjustments with natural language
6. Click **Suggest** to generate subject lines

### Managing Follow-ups

1. Navigate to **Follow-ups** page
2. View pending and overdue follow-ups
3. Mark as complete when done
4. AI will automatically suggest follow-ups based on your email patterns

### Creating Templates

1. Go to **Templates** page
2. Click **New Template**
3. Add variables using `{{variable_name}}` syntax
4. Save and reuse for similar emails

### Viewing Analytics

1. Navigate to **Analytics** page
2. View email performance metrics:
   - Total sent
   - Open rates
   - Click rates
   - Reply rates
3. See template performance statistics

## 🔧 Development

### Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # tRPC client
│   │   └── App.tsx        # Main app component
├── server/                # Backend Express + tRPC server
│   ├── routers.ts         # tRPC API routes
│   ├── db.ts              # Database queries
│   ├── services/          # External service integrations
│   └── _core/             # Framework core (don't modify)
├── drizzle/               # Database schema
│   └── schema.ts          # Table definitions
├── shared/                # Shared types and constants
└── storage/               # S3 storage helpers
```

### Adding New Features

1. **Database**: Update `drizzle/schema.ts` and run `pnpm db:push`
2. **Backend**: Add queries in `server/db.ts` and procedures in `server/routers.ts`
3. **Frontend**: Create components in `client/src/pages/` and use `trpc.*` hooks

### Testing

```bash
# Run TypeScript checks
pnpm tsc --noEmit

# Run tests (if configured)
pnpm test
```

## 🎨 Customization

### Changing App Title and Logo

Update these environment variables:
- `VITE_APP_TITLE` - Application title
- `VITE_APP_LOGO` - Logo image URL

### Customizing Theme

Edit `client/src/index.css` to modify:
- Color palette
- Typography
- Spacing
- Border radius
- Shadows

### Adding Integrations

1. Create a new service in `server/services/`
2. Add OAuth flow in Settings page
3. Store credentials in `integrations` table
4. Use the service in your tRPC procedures

## 📊 Database Schema

### Core Tables

- `users` - User accounts and authentication
- `email_accounts` - Connected email accounts (Gmail, etc.)
- `personas` - Writing personas with tone settings
- `templates` - Reusable email templates
- `contacts` - Contact database with enrichment
- `email_threads` - Email conversations
- `email_messages` - Individual emails
- `follow_ups` - Follow-up reminders
- `sequences` - Automated email sequences
- `analytics` - Email performance metrics
- `insights` - AI-generated insights
- `calendar_events` - Calendar integration
- `integrations` - External service connections

## 🔐 Security

- All API routes require authentication via Manus OAuth
- Sensitive data is encrypted at rest
- OAuth tokens are stored securely
- CSRF protection enabled
- Rate limiting on API endpoints

## 🚀 Deployment

### Deploy to Production

1. Set up your production database
2. Configure environment variables
3. Build the application:
   ```bash
   pnpm build
   ```
4. Deploy to your hosting platform (Vercel, Railway, etc.)

### Environment Variables for Production

Ensure all required environment variables are set in your hosting platform.

## 📝 API Documentation

The application uses tRPC for type-safe API calls. All procedures are defined in `server/routers.ts`.

### Key Endpoints

- `personas.*` - Persona management
- `templates.*` - Template CRUD operations
- `contacts.*` - Contact management
- `followUps.*` - Follow-up tracking
- `sequences.*` - Email sequence automation
- `ai.*` - AI composition and refinement
- `analytics.*` - Performance metrics
- `insights.*` - AI-generated insights

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

Private - All rights reserved

## 🙏 Acknowledgments

- Built with [Manus](https://manus.im) platform
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

## 📧 Support

For questions or issues, please contact the project owner.

---

**Built with ❤️ by Will Sigmon**

