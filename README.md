# Final Year Project Management Platform

A comprehensive web application for managing final year projects in educational institutions, built with React, TypeScript, and Supabase.

## Features

### 🔐 Authentication & Authorization
- Role-based access control (Principal, Guide, Team Lead, Student)
- Secure login/registration system
- Profile management

### 👥 User Management
- **Principal Dashboard**: Complete system oversight
- **Guide Dashboard**: Team supervision and evaluation
- **Student Dashboard**: Project tracking and submissions
- **Team Lead Dashboard**: Enhanced team management capabilities

### 🎯 Core Functionality

#### For Principals
- Student and guide management
- AI-powered team formation based on skills and performance
- Intelligent guide assignment to teams
- System analytics and reporting
- Complete oversight of all projects

#### For Guides
- Team supervision and mentoring
- Weekly log review and approval
- Student evaluation and grading
- Progress tracking and feedback

#### For Students & Team Leads
- Team collaboration tools
- Weekly progress log submissions
- Document upload and management
- Project timeline tracking
- Performance monitoring

### 🤖 AI-Powered Features
- **Smart Team Formation**: Automatically creates balanced teams based on:
  - Academic performance
  - Domain expertise
  - Skill complementarity
  - Backlog considerations
- **Intelligent Guide Assignment**: Matches guides to teams based on:
  - Domain expertise
  - Workload capacity
  - Experience level

### 📊 Project Management
- Weekly progress tracking
- Document version control
- Evaluation and grading system
- Timeline management
- Performance analytics

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **State Management**: React Context API
- **Routing**: React Router v6
- **UI Components**: Custom component library
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (optional for demo)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fyp-management-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure Supabase (optional):
   - Create a new Supabase project
   - Update `.env` with your Supabase URL and anon key
   - Run the database migrations from `supabase/migrations/`

5. Start the development server:
```bash
npm run dev
```

## Demo Mode

The application includes a demo mode that works without Supabase configuration:

### Demo Credentials
- **Principal**: principal@demo.com / demo123
- **Guide**: guide@demo.com / demo123  
- **Student**: student@demo.com / demo123
- **Team Lead**: lead@demo.com / demo123

## Database Schema

The application uses a comprehensive PostgreSQL schema with:

- **Users & Profiles**: Authentication and role management
- **Students**: Academic records and team assignments
- **Guides**: Expertise and capacity management
- **Teams**: Project details and member management
- **Weekly Logs**: Progress tracking and approvals
- **Documents**: File management with versioning
- **Evaluations**: Assessment and grading system

## Key Features in Detail

### AI Team Formation Algorithm
- Analyzes student performance, skills, and domain preferences
- Creates balanced teams with complementary skill sets
- Considers academic standing and backlog status
- Ensures fair distribution of high and low performers

### Guide Assignment System
- Matches guides based on domain expertise
- Considers current workload and capacity
- Optimizes for balanced distribution
- Provides assignment recommendations

### Progress Tracking
- Weekly log submissions with structured format
- Guide review and approval workflow
- Progress visualization and analytics
- Automated reminders and notifications

### Document Management
- Secure file upload and storage
- Version control and history tracking
- Team-based access control
- Multiple document types support

### Evaluation System
- Multi-criteria assessment framework
- Automated grade calculation
- Feedback and improvement suggestions
- Progress tracking over time

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── lib/               # Utility libraries and configurations
├── pages/             # Main application pages
├── types/             # TypeScript type definitions
├── utils/             # Helper functions and algorithms
├── views/             # Dashboard views for different roles
└── styles/            # Global styles and Tailwind config
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.