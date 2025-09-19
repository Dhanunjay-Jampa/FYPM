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
-          role: 'student'
-        }
-      );
-
-      if (authError) throw authError;
-      if (!authData.user) throw new Error('Failed to create user');
-
-      // Create student profile
-      const percentage = parseInt(formData.backlogs) > 0 ? 0 : parseFloat(formData.percentage);
-      const { data: studentData, error: studentError } = await db.createStudent({
-        user_id: authData.user.id,
+      // For demo purposes, we'll create a mock user ID
+      // In production, this would be handled by proper user creation flow
+      const mockUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
+      
+      // Create student profile directly
+      const percentage = parseInt(formData.backlogs) > 0 ? 0 : parseFloat(formData.percentage);
+      const studentData = {
+        user_id: mockUserId,
         roll_number: formData.rollNumber,
         percentage,
         domain: formData.domain,
@@ -67,13 +55,8 @@
         skills: formData.skills.split(',').map(skill => skill.trim()).filter(s => s),
         academic_year: formData.academicYear,
         department: formData.department
-      });
-
-      if (studentError) throw studentError;
+      };

-      onSubmit(studentData);
+      onSubmit({ ...studentData, profiles: { full_name: formData.name, email: formData.email } });
     } catch (err: any) {
       setError(err.message);
     } finally {