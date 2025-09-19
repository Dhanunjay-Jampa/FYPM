@@ .. @@
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!user?.profile?.id) {
       setError('User profile not found');
       return;
     }

     setLoading(true);
     setError('');

     try {
-      const { data, error: submitError } = await db.createWeeklyLog({
+      // For demo purposes, create a mock log entry
+      const logData = {
+        id: `log_${Date.now()}`,
         team_id: teamId,
         week_number: currentWeek,
         title: formData.title,
         description: formData.description,
         completed_tasks: formData.completedTasks.split('\n').filter(task => task.trim()),
         next_week_plans: formData.nextWeekPlans.split('\n').filter(plan => plan.trim()),
         challenges: formData.challenges.split('\n').filter(challenge => challenge.trim()),
-        submitted_by: user.profile.id
-      });
-
-      if (submitError) throw submitError;
+        submitted_by: user.profile.id,
+        guide_approval: false,
+        created_at: new Date().toISOString()
+      };

-      onSubmit(data);
+      onSubmit(logData);
     } catch (err: any) {
       setError(err.message);
     } finally {