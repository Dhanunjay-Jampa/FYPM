@@ .. @@
           {/* Team Members */}
           <div>
             <h3 className="font-semibold text-gray-900 mb-4">Team Members</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
-              {team.members.map((member) => (
+              {(team.members || []).map((member) => (
                 <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                   <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                         <span className="font-medium text-gray-600">
-                          {member.name.charAt(0).toUpperCase()}
+                          {(member.name || member.profiles?.full_name || 'U').charAt(0).toUpperCase()}
                         </span>
                       </div>
                       <div>
-                        <h4 className="font-medium text-gray-900">{member.name}</h4>
-                        <p className="text-sm text-gray-600">{member.rollNumber}</p>
+                        <h4 className="font-medium text-gray-900">{member.name || member.profiles?.full_name}</h4>
+                        <p className="text-sm text-gray-600">{member.rollNumber || member.roll_number}</p>
                       </div>
                     </div>
-                    {member.isTeamLead && (
+                    {(member.isTeamLead || member.is_team_lead) && (
                       <Badge variant="primary">Team Lead</Badge>
                     )}
                   </div>
                   
                   <div className="space-y-2">
                     <div className="flex items-center space-x-2">
                       <Mail className="w-4 h-4 text-gray-400" />
-                      <span className="text-sm text-gray-600">{member.email}</span>
+                      <span className="text-sm text-gray-600">{member.email || member.profiles?.email}</span>
                     </div>
                     
                     <div className="flex items-center justify-between">
                       <span className="text-sm text-gray-600">Performance:</span>
                       <div className="flex items-center space-x-2">
                         <span className="text-sm font-medium">{member.percentage}%</span>
                         {member.backlogs > 0 && (
                           <Badge variant="danger">{member.backlogs} backlogs</Badge>
                         )}
                       </div>
                     </div>
                     
                     <div>
                       <p className="text-sm text-gray-600 mb-1">Skills:</p>
                       <div className="flex flex-wrap gap-1">
-                        {member.skills.map((skill, index) => (
+                        {(member.skills || []).map((skill, index) => (
                           <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                             {skill}
                           </span>
                         ))}
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           {/* Project Progress */}
           <div>
             <h3 className="font-semibold text-gray-900 mb-4">Project Progress</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="text-center p-4 bg-blue-50 rounded-lg">
-                <p className="text-2xl font-bold text-blue-600">{team.weeklyLogs.length}</p>
+                <p className="text-2xl font-bold text-blue-600">{team.weeklyLogs?.length || 0}</p>
                 <p className="text-sm text-blue-800">Weekly Logs</p>
               </div>
               <div className="text-center p-4 bg-green-50 rounded-lg">
-                <p className="text-2xl font-bold text-green-600">{team.documents.length}</p>
+                <p className="text-2xl font-bold text-green-600">{team.documents?.length || 0}</p>
                 <p className="text-sm text-green-800">Documents</p>
               </div>
               <div className="text-center p-4 bg-purple-50 rounded-lg">
-                <p className="text-2xl font-bold text-purple-600">{team.evaluations.length}</p>
+                <p className="text-2xl font-bold text-purple-600">{team.evaluations?.length || 0}</p>
                 <p className="text-sm text-purple-800">Evaluations</p>
               </div>
             </div>
           </div>