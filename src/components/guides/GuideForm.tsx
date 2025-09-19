@@ .. @@
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     setError('');

-    // Validate password length
-    if (formData.password.length < 6) {
-      setError('Password must be at least 6 characters long');
-      setLoading(false);
-      return;
-    }

     try {
-      // Create user account
-      const { data: authData, error: authError } = await auth.signUp(
-        formData.email,
-        formData.password,
-        {
-          full_name: formData.name,
-          role: 'guide'
-        }
-      );
-
-      if (authError) throw authError;
-      if (!authData.user) throw new Error('Failed to create user');
-
-      // Create guide profile
-      const { data: guideData, error: guideError } = await db.createGuide({
-        user_id: authData.user.id,
+      // For demo purposes, we'll create a mock user ID
+      // In production, this would be handled by proper user creation flow
+      const mockUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
+      
+      // Create guide profile directly
+      const guideData = {
+        user_id: mockUserId,
         department: formData.department,
         expertise: formData.expertise.split(',').map(skill => skill.trim()).filter(s => s),
         max_teams: parseInt(formData.maxTeams),
         qualification: formData.qualification,
-        experience: parseInt(formData.experience)
-      });
-
-      if (guideError) throw guideError;
+        experience: parseInt(formData.experience),
+        current_teams: 0
+      };

-      onSubmit(guideData);
+      onSubmit({ ...guideData, profiles: { full_name: formData.name, email: formData.email } });
     } catch (err: any) {
       setError(err.message);
     } finally {