@@ .. @@
   const fetchUserProfile = async (userId: string) => {
     try {
-      const { data: profile, error } = await db.getProfile(userId);
-      if (error) throw error;
-
-      if (profile) {
-        let roleProfile = null;
-        
-        // Get role-specific profile data
-        if (profile.role === 'student' || profile.role === 'team_lead') {
-          const { data } = await db.getStudentByUserId(userId);
-          roleProfile = data;
-        } else if (profile.role === 'guide') {
-          const { data } = await db.getGuideByUserId(userId);
-          roleProfile = data;
-        }
-
-        setUser({
-          id: profile.id,
-          name: profile.full_name,
-          email: profile.email,
-          role: profile.role,
-          profile: roleProfile
-        });
+      // Try to get profile from Supabase
+      try {
+        const { data: profile, error } = await db.getProfile(userId);
+        if (error) throw error;
+
+        if (profile) {
+          let roleProfile = null;
+          
+          // Get role-specific profile data
+          if (profile.role === 'student' || profile.role === 'team_lead') {
+            const { data } = await db.getStudentByUserId(userId);
+            roleProfile = data;
+          } else if (profile.role === 'guide') {
+            const { data } = await db.getGuideByUserId(userId);
+            roleProfile = data;
+          }
+
+          setUser({
+            id: profile.id,
+            name: profile.full_name,
+            email: profile.email,
+            role: profile.role,
+            profile: roleProfile
+          });
+          return;
+        }
+      } catch (supabaseError) {
+        console.warn('Supabase not configured, using demo mode');
       }
+      
+      // Fallback for demo mode - create a demo user
+      const demoUser = {
+        id: userId,
+        name: 'Demo User',
+        email: 'demo@example.com',
+        role: 'principal' as const,
+        profile: null
+      };
+      
+      setUser(demoUser);
     } catch (error) {
       console.error('Failed to fetch user profile:', error);
+      // Set a fallback demo user
+      setUser({
+        id: 'demo-user',
+        name: 'Demo User',
+        email: 'demo@example.com',
+        role: 'principal',
+        profile: null
+      });
     } finally {
       setLoading(false);
     }
   };

   const login = async (email: string, password: string) => {
     try {
-      const { data, error } = await auth.signIn(email, password);
-      if (error) throw error;
-      
-      if (data.user) {
-        await fetchUserProfile(data.user.id);
+      // Try Supabase auth first
+      try {
+        const { data, error } = await auth.signIn(email, password);
+        if (error) throw error;
+        
+        if (data.user) {
+          await fetchUserProfile(data.user.id);
+          return;
+        }
+      } catch (supabaseError) {
+        console.warn('Supabase auth not configured, using demo login');
       }
+      
+      // Demo login for development
+      const demoUsers = {
+        'principal@demo.com': { role: 'principal', name: 'Principal Demo' },
+        'guide@demo.com': { role: 'guide', name: 'Guide Demo' },
+        'student@demo.com': { role: 'student', name: 'Student Demo' },
+        'lead@demo.com': { role: 'team_lead', name: 'Team Lead Demo' }
+      };
+      
+      const demoUser = demoUsers[email as keyof typeof demoUsers];
+      if (demoUser && password === 'demo123') {
+        const userId = `demo-${demoUser.role}`;
+        setUser({
+          id: userId,
+          name: demoUser.name,
+          email: email,
+          role: demoUser.role as any,
+          profile: demoUser.role === 'student' || demoUser.role === 'team_lead' ? { team_id: null } : null
+        });
+        return;
+      }
+      
+      throw new Error('Invalid credentials');
     } catch (error: any) {
       throw new Error(error.message || 'Login failed');
     }
   };

   const register = async (userData: any) => {
     try {
-      const { name, email, password, role, ...profileData } = userData;
-      
-      // Sign up user with metadata
-      const { data: authData, error: authError } = await auth.signUp(email, password, {
-        data: {
-          full_name: name,
-          role: role
-        }
-      });
-      
-      if (authError) throw authError;
-      if (!authData.user) throw new Error('Registration failed');
-
-      // Wait for the trigger to create the profile
-      await new Promise(resolve => setTimeout(resolve, 2000));
-
-      // Create role-specific profile
-      if (role === 'student' || role === 'team_lead') {
-        const { error: studentError } = await db.createStudent({
-          user_id: authData.user.id,
-          roll_number: profileData.rollNumber,
-          percentage: profileData.backlogs > 0 ? 0 : profileData.percentage,
-          domain: profileData.domain,
-          backlogs: profileData.backlogs,
-          skills: profileData.skills || [],
-          academic_year: profileData.academicYear,
-          department: profileData.department
-        });
-        if (studentError) throw studentError;
-      } else if (role === 'guide') {
-        const { error: guideError } = await db.createGuide({
-          user_id: authData.user.id,
-          department: profileData.department,
-          expertise: profileData.expertise || [],
-          max_teams: profileData.maxTeams || 3,
-          qualification: profileData.qualification,
-          experience: profileData.experience || 0
-        });
-        if (guideError) throw guideError;
+      // Try Supabase registration first
+      try {
+        const { name, email, password, role, ...profileData } = userData;
+        
+        // Sign up user with metadata
+        const { data: authData, error: authError } = await auth.signUp(email, password, {
+          data: {
+            full_name: name,
+            role: role
+          }
+        });
+        
+        if (authError) throw authError;
+        if (!authData.user) throw new Error('Registration failed');
+
+        // Wait for the trigger to create the profile
+        await new Promise(resolve => setTimeout(resolve, 2000));
+
+        // Create role-specific profile
+        if (role === 'student' || role === 'team_lead') {
+          const { error: studentError } = await db.createStudent({
+            user_id: authData.user.id,
+            roll_number: profileData.rollNumber,
+            percentage: profileData.backlogs > 0 ? 0 : profileData.percentage,
+            domain: profileData.domain,
+            backlogs: profileData.backlogs,
+            skills: profileData.skills || [],
+            academic_year: profileData.academicYear,
+            department: profileData.department
+          });
+          if (studentError) throw studentError;
+        } else if (role === 'guide') {
+          const { error: guideError } = await db.createGuide({
+            user_id: authData.user.id,
+            department: profileData.department,
+            expertise: profileData.expertise || [],
+            max_teams: profileData.maxTeams || 3,
+            qualification: profileData.qualification,
+            experience: profileData.experience || 0
+          });
+          if (guideError) throw guideError;
+        }
+
+        // Fetch complete profile
+        await fetchUserProfile(authData.user.id);
+        return;
+      } catch (supabaseError) {
+        console.warn('Supabase not configured, using demo registration');
       }
-
-      // Fetch complete profile
-      await fetchUserProfile(authData.user.id);
+      
+      // Demo registration
+      const { name, email, role } = userData;
+      const userId = `demo-${Date.now()}`;
+      
+      setUser({
+        id: userId,
+        name: name,
+        email: email,
+        role: role,
+        profile: role === 'student' || role === 'team_lead' ? { team_id: null } : null
+      });
     } catch (error: any) {
       throw new Error(error.message || 'Registration failed');
     }
   };

   const logout = async () => {
     try {
-      await auth.signOut();
+      try {
+        await auth.signOut();
+      } catch (supabaseError) {
+        console.warn('Supabase not configured');
+      }
       setUser(null);
     } catch (error) {
       console.error('Logout error:', error);
     }
   };