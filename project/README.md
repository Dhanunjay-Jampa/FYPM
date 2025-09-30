@@ .. @@
 ### Installation

 1. Clone the repository:
 ```bash
 git clone <repository-url>
-cd fyp-management-platform/project
+cd project
 ```

 2. Install dependencies:
 ```bash
 npm install
 ```

 3. Set up environment variables:
 ```bash
 cp .env.example .env
 ```

-4. Configure Supabase (optional):
+4. Configure Supabase (optional for demo):
    - Create a new Supabase project
    - Update `.env` with your Supabase URL and anon key
    - Run the database migrations from `supabase/migrations/`

 5. Start the development server:
 ```bash
 npm run dev
 ```

 ## Demo Mode

-The application includes a demo mode that works without Supabase configuration:
+The application includes a demo mode that works without Supabase configuration.
+Simply start the development server and use the demo credentials:

 ### Demo Credentials
 - **Principal**: principal@demo.com / demo123
 - **Guide**: guide@demo.com / demo123  
 - **Student**: student@demo.com / demo123
 - **Team Lead**: lead@demo.com / demo123

+### Production Setup
+
+For production deployment with full functionality:
+
+1. **Supabase Setup**:
+   - Create a Supabase project at https://supabase.com
+   - Copy your project URL and anon key
+   - Update `.env` with your credentials
+   - Run the database migrations
+
+2. **Database Migrations**:
+   ```bash
+   # Install Supabase CLI
+   npm install -g @supabase/cli
+   
+   # Login to Supabase
+   supabase login
+   
+   # Link your project
+   supabase link --project-ref your-project-ref
+   
+   # Run migrations
+   supabase db push
+   ```
+
+3. **Environment Variables**:
+   ```bash
+   VITE_SUPABASE_URL=your_supabase_project_url
+   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
+   ```