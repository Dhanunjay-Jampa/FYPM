@@ .. @@
 import React, { useState } from 'react';
-import React, { useState, useEffect } from 'react';
+import { useEffect } from 'react';
 import { Users, BookOpen, BarChart3, Plus, Zap, UserCheck } from 'lucide-react';
 import { StatsCard } from '../components/dashboard/StatsCard';
 import { Button } from '../components/ui/Button';
 import { Card, CardContent, CardHeader } from '../components/ui/Card';
 import { StudentForm } from '../components/students/StudentForm';
 import { GuideForm } from '../components/guides/GuideForm';
 import { TeamCard } from '../components/teams/TeamCard';
 import { TeamDetailsModal } from '../components/teams/TeamDetailsModal';
 import { db } from '../lib/supabase';
+import { createBalancedTeams } from '../utils/teamFormation';
+import { assignGuidesToTeams } from '../utils/guideAssignment';

 export const PrincipalDashboard: React.FC = () => {
   const [currentView, setCurrentView] = useState<'overview' | 'students' | 'teams' | 'guides' | 'analytics'>('overview');
   const [showStudentForm, setShowStudentForm] = useState(false);
   const [showGuideForm, setShowGuideForm] = useState(false);
   const [selectedTeam, setSelectedTeam] = useState<any>(null);
   const [students, setStudents] = useState<any[]>([]);
   const [teams, setTeams] = useState<any[]>([]);
   const [guides, setGuides] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     loadData();
   }, []);

   const loadData = async () => {
     setLoading(true);
     try {
       const [studentsData, teamsData, guidesData] = await Promise.all([
         db.getStudents(),
         db.getTeams(),
         db.getGuides()
       ]);

       if (studentsData.data) setStudents(studentsData.data);
       if (teamsData.data) setTeams(teamsData.data);
       if (guidesData.data) setGuides(guidesData.data);
     } catch (error) {
       console.error('Error loading data:', error);
     } finally {
       setLoading(false);
     }
   };

   const handleAddStudent = (studentData: any) => {
     setStudents([...students, studentData]);
     setShowStudentForm(false);
     loadData(); // Refresh data
   };

   const handleAddGuide = (guideData: any) => {
     setGuides([...guides, guideData]);
     setShowGuideForm(false);
     loadData(); // Refresh data
   };

   const handleCreateTeams = async () => {
-    // This would implement team creation logic
-    // For now, just refresh data
-    await loadData();
+    try {
+      // Get unassigned students
+      const unassignedStudents = students.filter(s => !s.team_id).map(s => ({
+        id: s.id,
+        name: s.profiles?.full_name || 'Unknown',
+        email: s.profiles?.email || '',
+        rollNumber: s.roll_number,
+        percentage: s.percentage,
+        domain: s.domain,
+        backlogs: s.backlogs,
+        skills: s.skills || []
+      }));
+
+      if (unassignedStudents.length < 4) {
+        alert('Need at least 4 unassigned students to create teams');
+        return;
+      }
+
+      const { teams: newTeams } = createBalancedTeams(unassignedStudents);
+      
+      // Create teams in database
+      for (const team of newTeams) {
+        const { data: teamData, error } = await db.createTeam({
+          name: team.name,
+          project_title: team.projectTitle,
+          project_description: `${team.domain} project for team ${team.name}`,
+          domain: team.domain,
+          technologies: [],
+          team_lead_id: team.teamLeadId
+        });
+
+        if (error) throw error;
+
+        // Assign students to team
+        const memberIds = team.members.map(m => m.id);
+        await db.assignStudentsToTeam(teamData.id, memberIds, team.teamLeadId);
+      }
+
+      await loadData();
+      alert(`Successfully created ${newTeams.length} teams!`);
+    } catch (error) {
+      console.error('Error creating teams:', error);
+      alert('Failed to create teams. Please try again.');
+    }
   };

   const handleAssignGuides = async () => {
-    // This would implement guide assignment logic
-    // For now, just refresh data
-    await loadData();
+    try {
+      const unassignedTeams = teams.filter(t => !t.guide_id).map(t => ({
+        id: t.id,
+        name: t.name,
+        domain: t.domain,
+        members: [],
+        teamLeadId: t.team_lead_id,
+        guideId: '',
+        projectTitle: t.project_title,
+        averagePercentage: t.average_percentage || 0,
+        weeklyLogs: [],
+        documents: [],
+        evaluations: [],
+        status: t.status
+      }));
+
+      const availableGuides = guides.filter(g => g.current_teams < g.max_teams).map(g => ({
+        id: g.id,
+        name: g.profiles?.full_name || 'Unknown',
+        email: g.profiles?.email || '',
+        department: g.department,
+        expertise: g.expertise || [],
+        maxTeams: g.max_teams,
+        currentTeams: g.current_teams,
+        assignedTeamIds: []
+      }));
+
+      if (unassignedTeams.length === 0) {
+        alert('No unassigned teams found');
+        return;
+      }
+
+      if (availableGuides.length === 0) {
+        alert('No available guides found');
+        return;
+      }
+
+      const { assignments } = assignGuidesToTeams(unassignedTeams, availableGuides);
+      
+      // Update teams with assigned guides
+      for (const assignment of assignments) {
+        await db.updateTeam(assignment.teamId, { guide_id: assignment.guideId });
+      }
+
+      await loadData();
+      alert(`Successfully assigned guides to ${assignments.length} teams!`);
+    } catch (error) {
+      console.error('Error assigning guides:', error);
+      alert('Failed to assign guides. Please try again.');
+    }
   };

   if (loading) {
     return (
       <div className="flex items-center justify-center h-64">
         <div className="text-center">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
           <p className="mt-2 text-gray-600">Loading...</p>
         </div>
       </div>
     );
   }

   const renderOverview = () => (
     <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatsCard
           title="Total Students"
           value={students.length}
           icon={Users}
           color="blue"
         />
         <StatsCard
           title="Project Guides"
           value={guides.length}
           icon={UserCheck}
           color="green"
         />
         <StatsCard
           title="Active Teams"
           value={teams.length}
           icon={BookOpen}
           color="yellow"
         />
         <StatsCard
           title="Avg Team Performance"
-          value="0%"
+          value={teams.length > 0 ? `${(teams.reduce((sum, t) => sum + (t.average_percentage || 0), 0) / teams.length).toFixed(1)}%` : "0%"}
           icon={BarChart3}
           color="red"
         />
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card>
           <CardHeader>
             <h3 className="text-lg font-semibold">Quick Actions</h3>
           </CardHeader>
           <CardContent className="space-y-3">
             <Button 
               onClick={() => setShowStudentForm(true)}
               className="w-full justify-start"
               variant="outline"
             >
               <Plus className="w-4 h-4 mr-2" />
               Add New Student
             </Button>
             <Button 
               onClick={() => setShowGuideForm(true)}
               className="w-full justify-start"
               variant="outline"
             >
               <UserCheck className="w-4 h-4 mr-2" />
               Add Project Guide
             </Button>
             <Button 
               onClick={handleCreateTeams}
               className="w-full justify-start"
-              disabled={students.length < 4}
+              disabled={students.filter(s => !s.team_id).length < 4}
             >
               <Zap className="w-4 h-4 mr-2" />
               Create AI Teams
             </Button>
             <Button 
               onClick={() => handleAssignGuides()}
               className="w-full justify-start"
-              disabled={teams.length === 0 || guides.length === 0}
+              disabled={teams.filter(t => !t.guide_id).length === 0 || guides.filter(g => g.current_teams < g.max_teams).length === 0}
               variant="secondary"
             >
               <UserCheck className="w-4 h-4 mr-2" />
               Assign Guides
             </Button>
           </CardContent>
         </Card>

         <Card>
           <CardHeader>
             <h3 className="text-lg font-semibold">System Status</h3>
           </CardHeader>
           <CardContent>
             <div className="space-y-2">
-              <p className="text-sm text-gray-600">System is running smoothly</p>
-              <p className="text-xs text-gray-500">All services are operational</p>
+              <div className="flex justify-between">
+                <span className="text-sm text-gray-600">Unassigned Students:</span>
+                <span className="text-sm font-medium">{students.filter(s => !s.team_id).length}</span>
+              </div>
+              <div className="flex justify-between">
+                <span className="text-sm text-gray-600">Teams without Guides:</span>
+                <span className="text-sm font-medium">{teams.filter(t => !t.guide_id).length}</span>
+              </div>
+              <div className="flex justify-between">
+                <span className="text-sm text-gray-600">Available Guide Slots:</span>
+                <span className="text-sm font-medium">{guides.reduce((sum, g) => sum + (g.max_teams - g.current_teams), 0)}</span>
+              </div>
             </div>
           </CardContent>
         </Card>
       </div>
     </div>
   );

   const renderStudents = () => (
     <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h2 className="text-xl font-semibold">Students Management</h2>
         <Button onClick={() => setShowStudentForm(true)}>
           <Plus className="w-4 h-4 mr-2" />
           Add Student
         </Button>
       </div>

       {showStudentForm && (
         <Card>
           <CardHeader>
             <h3 className="text-lg font-semibold">Add New Student</h3>
           </CardHeader>
           <CardContent>
             <StudentForm
               onSubmit={handleAddStudent}
               onCancel={() => setShowStudentForm(false)}
             />
           </CardContent>
         </Card>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {students.map(student => (
           <Card key={student.id}>
             <CardContent className="p-4">
               <div className="flex items-center justify-between mb-2">
                 <h4 className="font-semibold">{student.profiles?.full_name}</h4>
                 <span className="text-sm text-gray-500">{student.percentage}%</span>
               </div>
               <p className="text-sm text-gray-600 mb-1">{student.roll_number}</p>
-              <p className="text-sm text-gray-600 mb-2">{student.domain}</p>
+              <p className="text-sm text-gray-600 mb-2 capitalize">{student.domain.replace('-', ' ')}</p>
               <div className="flex items-center justify-between">
                 <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                   {student.backlogs} backlogs
                 </span>
                 {student.backlogs > 0 && (
                   <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                     Performance: 0%
                   </span>
                 )}
                 {student.team_id && (
                   <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                     Team Assigned
                   </span>
                 )}
               </div>
             </CardContent>
           </Card>
         ))}
       </div>
     </div>
   );

   const renderTeams = () => (
     <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h2 className="text-xl font-semibold">Teams Management</h2>
         <div className="flex space-x-3">
           <Button onClick={handleCreateTeams} disabled={students.length < 4}>
             <Zap className="w-4 h-4 mr-2" />
             Create AI Teams
           </Button>
           <Button 
             onClick={() => handleAssignGuides()}
             disabled={teams.length === 0 || guides.length === 0}
             variant="secondary"
           >
             <UserCheck className="w-4 h-4 mr-2" />
             Assign Guides
           </Button>
         </div>
       </div>

-      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
-        {teams.map(team => (
-          <TeamCard
-            key={team.id}
-            team={team}
-            onClick={setSelectedTeam}
-          />
-        ))}
-      </div>
+      {teams.length > 0 ? (
+        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
+          {teams.map(team => (
+            <Card key={team.id} hover>
+              <CardContent className="p-4">
+                <div className="flex items-center justify-between mb-2">
+                  <h4 className="font-semibold">{team.name}</h4>
+                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
+                    {team.status}
+                  </span>
+                </div>
+                <p className="text-sm text-gray-600 mb-2">{team.project_title}</p>
+                <p className="text-sm text-gray-600 mb-3 capitalize">{team.domain.replace('-', ' ')}</p>
+                
+                <div className="space-y-2">
+                  <div className="flex justify-between text-sm">
+                    <span className="text-gray-500">Average:</span>
+                    <span className="font-medium">{team.average_percentage?.toFixed(1) || 0}%</span>
+                  </div>
+                  <div className="flex justify-between text-sm">
+                    <span className="text-gray-500">Guide:</span>
+                    <span className="font-medium">
+                      {team.guide?.profiles?.full_name || 'Not Assigned'}
+                    </span>
+                  </div>
+                </div>
+                
+                <button
+                  onClick={() => setSelectedTeam(team)}
+                  className="w-full mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
+                >
+                  View Details →
+                </button>
+              </CardContent>
+            </Card>
+          ))}
+        </div>
+      ) : (
+        <div className="text-center py-12">
+          <h3 className="text-lg font-medium text-gray-900 mb-2">No Teams Created</h3>
+          <p className="text-gray-600 mb-4">Create teams from available students to get started.</p>
+          <Button onClick={handleCreateTeams} disabled={students.filter(s => !s.team_id).length < 4}>
+            <Zap className="w-4 h-4 mr-2" />
+            Create AI Teams
+          </Button>
+        </div>
+      )}
     </div>
   );

   const renderGuides = () => (
     <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h2 className="text-xl font-semibold">Project Guides Management</h2>
         <Button onClick={() => setShowGuideForm(true)}>
           <Plus className="w-4 h-4 mr-2" />
           Add Guide
         </Button>
       </div>

       {showGuideForm && (
         <Card>
           <CardHeader>
             <h3 className="text-lg font-semibold">Add New Project Guide</h3>
           </CardHeader>
           <CardContent>
             <GuideForm
               onSubmit={handleAddGuide}
               onCancel={() => setShowGuideForm(false)}
             />
           </CardContent>
         </Card>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {guides.map(guide => (
           <Card key={guide.id}>
             <CardContent className="p-4">
               <div className="flex items-center justify-between mb-3">
                 <h4 className="font-semibold">{guide.profiles?.full_name}</h4>
                 <span className="text-sm text-gray-500">
                   {guide.current_teams}/{guide.max_teams} teams
                 </span>
               </div>
               <p className="text-sm text-gray-600 mb-1">{guide.profiles?.email}</p>
               <p className="text-sm text-gray-600 mb-3 capitalize">
                 {guide.department.replace('-', ' ')}
               </p>
               
               <div className="mb-3">
                 <p className="text-xs text-gray-500 mb-1">Utilization:</p>
                 <div className="flex items-center space-x-2">
                   <div className="flex-1 bg-gray-200 rounded-full h-2">
                     <div 
                       className="bg-blue-600 h-2 rounded-full" 
                       style={{ width: `${(guide.current_teams / guide.max_teams) * 100}%` }}
                     />
                   </div>
                   <span className="text-xs font-medium">
                     {((guide.current_teams / guide.max_teams) * 100).toFixed(0)}%
                   </span>
                 </div>
               </div>
               
               <div>
                 <p className="text-xs text-gray-500 mb-1">Expertise:</p>
                 <div className="flex flex-wrap gap-1">
                   {guide.expertise.slice(0, 3).map((skill, index) => (
                     <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                       {skill}
                     </span>
                   ))}
                   {guide.expertise.length > 3 && (
                     <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                       +{guide.expertise.length - 3} more
                     </span>
                   )}
                 </div>
               </div>
             </CardContent>
           </Card>
         ))}
       </div>
     </div>
   );

   const renderContent = () => {
     switch (currentView) {
       case 'students':
         return renderStudents();
       case 'teams':
         return renderTeams();
       case 'guides':
         return renderGuides();
       case 'analytics':
-        return <div>Analytics view coming soon...</div>;
+        return (
+          <div className="space-y-6">
+            <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
+            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
+              <Card>
+                <CardContent className="p-4 text-center">
+                  <h3 className="text-lg font-semibold text-blue-600">{students.length}</h3>
+                  <p className="text-sm text-gray-600">Total Students</p>
+                </CardContent>
+              </Card>
+              <Card>
+                <CardContent className="p-4 text-center">
+                  <h3 className="text-lg font-semibold text-green-600">{teams.length}</h3>
+                  <p className="text-sm text-gray-600">Active Teams</p>
+                </CardContent>
+              </Card>
+              <Card>
+                <CardContent className="p-4 text-center">
+                  <h3 className="text-lg font-semibold text-yellow-600">{guides.length}</h3>
+                  <p className="text-sm text-gray-600">Project Guides</p>
+                </CardContent>
+              </Card>
+              <Card>
+                <CardContent className="p-4 text-center">
+                  <h3 className="text-lg font-semibold text-red-600">
+                    {students.length > 0 ? (students.reduce((sum, s) => sum + s.percentage, 0) / students.length).toFixed(1) : 0}%
+                  </h3>
+                  <p className="text-sm text-gray-600">Avg Performance</p>
+                </CardContent>
+              </Card>
+            </div>
+          </div>
+        );
       default:
         return renderOverview();
     }
   };

   return (
     <div className="space-y-6">
       <div className="flex space-x-4 border-b border-gray-200">
         {[
           { key: 'overview', label: 'Overview' },
           { key: 'students', label: 'Students' },
           { key: 'teams', label: 'Teams' },
           { key: 'guides', label: 'Project Guides' },
           { key: 'analytics', label: 'Analytics' }
         ].map(({ key, label }) => (
           <button
             key={key}
             onClick={() => setCurrentView(key as any)}
             className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
               currentView === key
                 ? 'border-blue-600 text-blue-600'
                 : 'border-transparent text-gray-500 hover:text-gray-700'
             }`}
           >
             {label}
           </button>
         ))}
       </div>

       {renderContent()}
       
       {selectedTeam && (
         <TeamDetailsModal
           team={selectedTeam}
           guide={selectedTeam.guide}
           onClose={() => setSelectedTeam(null)}
           userRole="principal"
         />
       )}
     </div>
   );
 };