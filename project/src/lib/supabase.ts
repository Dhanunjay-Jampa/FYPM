import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

// Demo mode fallback
const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || supabaseUrl === 'https://demo-project.supabase.co';

export const supabase = isDemoMode ? null : createClient<Database>(supabaseUrl, supabaseAnonKey);

// Demo data for when Supabase is not configured
const demoUsers = [
  { id: '1', email: 'principal@demo.com', password: 'demo123', role: 'principal', name: 'Demo Principal' },
  { id: '2', email: 'guide@demo.com', password: 'demo123', role: 'guide', name: 'Demo Guide' },
  { id: '3', email: 'student@demo.com', password: 'demo123', role: 'student', name: 'Demo Student' },
  { id: '4', email: 'lead@demo.com', password: 'demo123', role: 'team_lead', name: 'Demo Team Lead' }
];

const demoStudents = [
  {
    id: '1',
    profiles: { full_name: 'John Doe', email: 'student@demo.com' },
    roll_number: '21CS001',
    percentage: 85,
    domain: 'web-development',
    backlogs: 0,
    skills: ['React', 'Node.js'],
    academic_year: '2024-25',
    department: 'computer-science',
    team_id: 'team-1',
    is_team_lead: true
  }
];

const demoTeams = [
  {
    id: 'team-1',
    name: 'Team Alpha',
    project_title: 'E-commerce Platform',
    domain: 'web-development',
    status: 'active',
    average_percentage: 85,
    members: demoStudents,
    guide: { profiles: { full_name: 'Demo Guide', email: 'guide@demo.com' } }
  }
];

const demoGuides = [
  {
    id: '1',
    profiles: { full_name: 'Demo Guide', email: 'guide@demo.com' },
    department: 'computer-science',
    expertise: ['Web Development', 'AI/ML'],
    max_teams: 3,
    current_teams: 1,
    qualification: 'Ph.D',
    experience: 10
  }
];

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, options?: { data?: any }) => {
    if (isDemoMode) {
      // Demo mode - simulate signup
      return { 
        data: { user: { id: Date.now().toString(), email } }, 
        error: null 
      };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    if (isDemoMode) {
      // Demo mode - check credentials
      const user = demoUsers.find(u => u.email === email && u.password === password);
      if (user) {
        return { 
          data: { user: { id: user.id, email: user.email } }, 
          error: null 
        };
      }
      return { data: null, error: { message: 'Invalid credentials' } };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    if (isDemoMode) {
      return { error: null };
    }
    
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    if (isDemoMode) {
      return { user: null, error: null };
    }
    
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    if (isDemoMode) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const db = {
  // Profiles
  getProfile: async (userId: string) => {
    if (isDemoMode) {
      const user = demoUsers.find(u => u.id === userId);
      return { 
        data: user ? { 
          id: user.id, 
          email: user.email, 
          full_name: user.name, 
          role: user.role 
        } : null, 
        error: null 
      };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  updateProfile: async (userId: string, updates: any) => {
    if (isDemoMode) {
      return { data: { id: userId, ...updates }, error: null };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Students
  getStudents: async () => {
    if (isDemoMode) {
      return { data: demoStudents, error: null };
    }
    
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        profiles!inner(full_name, email),
        teams(name, project_title)
      `)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createStudent: async (studentData: any) => {
    if (isDemoMode) {
      const newStudent = { 
        id: Date.now().toString(), 
        ...studentData,
        profiles: { full_name: 'Demo Student', email: studentData.email || 'demo@example.com' }
      };
      demoStudents.push(newStudent);
      return { data: newStudent, error: null };
    }
    
    const { data, error } = await supabase
      .from('students')
      .insert(studentData)
      .select(`
        *,
        profiles!inner(full_name, email)
      `)
      .single();
    return { data, error };
  },

  updateStudent: async (studentId: string, updates: any) => {
    if (isDemoMode) {
      return { data: { id: studentId, ...updates }, error: null };
    }
    
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', studentId)
      .select(`
        *,
        profiles!inner(full_name, email),
        teams(name, project_title)
      `)
      .single();
    return { data, error };
  },

  getStudentByUserId: async (userId: string) => {
    if (isDemoMode) {
      const student = demoStudents.find(s => s.id === userId);
      return { data: student || null, error: null };
    }
    
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        profiles!inner(full_name, email),
        teams(*)
      `)
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  // Guides
  getGuides: async () => {
    if (isDemoMode) {
      return { data: demoGuides, error: null };
    }
    
    const { data, error } = await supabase
      .from('guides')
      .select(`
        *,
        profiles!inner(full_name, email)
      `)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createGuide: async (guideData: any) => {
    if (isDemoMode) {
      const newGuide = { 
        id: Date.now().toString(), 
        ...guideData,
        profiles: { full_name: 'Demo Guide', email: guideData.email || 'guide@example.com' }
      };
      demoGuides.push(newGuide);
      return { data: newGuide, error: null };
    }
    
    const { data, error } = await supabase
      .from('guides')
      .insert(guideData)
      .select(`
        *,
        profiles!inner(full_name, email)
      `)
      .single();
    return { data, error };
  },

  getGuideByUserId: async (userId: string) => {
    if (isDemoMode) {
      const guide = demoGuides.find(g => g.id === userId);
      return { data: guide || null, error: null };
    }
    
    const { data, error } = await supabase
      .from('guides')
      .select(`
        *,
        profiles!inner(full_name, email)
      `)
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  // Teams
  getTeams: async () => {
    if (isDemoMode) {
      return { data: demoTeams, error: null };
    }
    
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_lead:students!team_lead_id(*, profiles!inner(full_name, email)),
        guide:guides!guide_id(*, profiles!inner(full_name, email)),
        members:students!team_id(*, profiles!inner(full_name, email))
      `)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createTeam: async (teamData: any) => {
    if (isDemoMode) {
      const newTeam = { 
        id: Date.now().toString(), 
        ...teamData,
        members: [],
        guide: null
      };
      demoTeams.push(newTeam);
      return { data: newTeam, error: null };
    }
    
    const { data, error } = await supabase
      .from('teams')
      .insert(teamData)
      .select(`
        *,
        team_lead:students!team_lead_id(*, profiles!inner(full_name, email)),
        members:students!team_id(*, profiles!inner(full_name, email))
      `)
      .single();
    return { data, error };
  },

  updateTeam: async (teamId: string, updates: any) => {
    if (isDemoMode) {
      return { data: { id: teamId, ...updates }, error: null };
    }
    
    const { data, error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', teamId)
      .select(`
        *,
        team_lead:students!team_lead_id(*, profiles!inner(full_name, email)),
        guide:guides!guide_id(*, profiles!inner(full_name, email)),
        members:students!team_id(*, profiles!inner(full_name, email))
      `)
      .single();
    return { data, error };
  },

  assignStudentsToTeam: async (teamId: string, studentIds: string[], teamLeadId: string) => {
    if (isDemoMode) {
      return { error: null };
    }
    
    // Update students to assign them to team
    const { error: updateError } = await supabase
      .from('students')
      .update({ team_id: teamId, is_team_lead: false })
      .in('id', studentIds);

    if (updateError) return { error: updateError };

    // Set team lead
    const { error: leadError } = await supabase
      .from('students')
      .update({ is_team_lead: true })
      .eq('id', teamLeadId);

    return { error: leadError };
  },

  // Weekly Logs
  getWeeklyLogs: async (teamId?: string) => {
    if (isDemoMode) {
      return { data: [], error: null };
    }
    
    let query = supabase
      .from('weekly_logs')
      .select(`
        *,
        teams!inner(name, project_title),
        submitted_by_student:students!submitted_by(*, profiles!inner(full_name, email)),
        approved_by_guide:guides!approved_by(*, profiles!inner(full_name, email))
      `)
      .order('week_number', { ascending: false });

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    const { data, error } = await query;
    return { data, error };
  },

  createWeeklyLog: async (logData: any) => {
    if (isDemoMode) {
      return { data: { id: Date.now().toString(), ...logData }, error: null };
    }
    
    const { data, error } = await supabase
      .from('weekly_logs')
      .insert(logData)
      .select(`
        *,
        teams!inner(name, project_title),
        submitted_by_student:students!submitted_by(*, profiles!inner(full_name, email))
      `)
      .single();
    return { data, error };
  },

  updateWeeklyLog: async (logId: string, updates: any) => {
    if (isDemoMode) {
      return { data: { id: logId, ...updates }, error: null };
    }
    
    const { data, error } = await supabase
      .from('weekly_logs')
      .update(updates)
      .eq('id', logId)
      .select(`
        *,
        teams!inner(name, project_title),
        submitted_by_student:students!submitted_by(*, profiles!inner(full_name, email)),
        approved_by_guide:guides!approved_by(*, profiles!inner(full_name, email))
      `)
      .single();
    return { data, error };
  },

  // Documents
  getDocuments: async (teamId?: string) => {
    if (isDemoMode) {
      return { data: [], error: null };
    }
    
    let query = supabase
      .from('documents')
      .select(`
        *,
        teams!inner(name, project_title),
        uploaded_by_student:students!uploaded_by(*, profiles!inner(full_name, email))
      `)
      .order('created_at', { ascending: false });

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    const { data, error } = await query;
    return { data, error };
  },

  createDocument: async (documentData: any) => {
    if (isDemoMode) {
      return { data: { id: Date.now().toString(), ...documentData }, error: null };
    }
    
    const { data, error } = await supabase
      .from('documents')
      .insert(documentData)
      .select(`
        *,
        teams!inner(name, project_title),
        uploaded_by_student:students!uploaded_by(*, profiles!inner(full_name, email))
      `)
      .single();
    return { data, error };
  },

  // Evaluations
  getEvaluations: async (teamId?: string) => {
    if (isDemoMode) {
      return { data: [], error: null };
    }
    
    let query = supabase
      .from('evaluations')
      .select(`
        *,
        teams!inner(name, project_title),
        evaluator:guides!evaluator_id(*, profiles!inner(full_name, email))
      `)
      .order('evaluation_date', { ascending: false });

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    const { data, error } = await query;
    return { data, error };
  },

  createEvaluation: async (evaluationData: any) => {
    if (isDemoMode) {
      return { data: { id: Date.now().toString(), ...evaluationData }, error: null };
    }
    
    const { data, error } = await supabase
      .from('evaluations')
      .insert(evaluationData)
      .select(`
        *,
        teams!inner(name, project_title),
        evaluator:guides!evaluator_id(*, profiles!inner(full_name, email))
      `)
      .single();
    return { data, error };
  }
};

// Storage helpers
export const storage = {
  uploadFile: async (bucket: string, path: string, file: File) => {
    if (isDemoMode) {
      return { data: { path }, error: null };
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    return { data, error };
  },

  downloadFile: async (bucket: string, path: string) => {
    if (isDemoMode) {
      return { data: null, error: { message: 'Demo mode - file download not available' } };
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);
    return { data, error };
  },

  getPublicUrl: (bucket: string, path: string) => {
    if (isDemoMode) {
      return '#demo-file-url';
    }
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  deleteFile: async (bucket: string, path: string) => {
    if (isDemoMode) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    return { data, error };
  }
};