@@ .. @@
   assignStudentsToTeam: async (teamId: string, studentIds: string[], teamLeadId: string) => {
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

+    if (leadError) return { error: leadError };
+
+    // Update team's team_lead_id
+    const { error: teamError } = await supabase
+      .from('teams')
+      .update({ team_lead_id: teamLeadId })
+      .eq('id', teamId);

-    return { error: leadError };
+    return { error: teamError };
   },