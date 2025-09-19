@@ .. @@
           <div className="flex items-center space-x-2">
             <Calendar className="w-4 h-4 text-gray-500" />
             <span className="text-sm text-gray-600">
-              {team.weeklyLogs.length} logs submitted
+              {team.weeklyLogs?.length || 0} logs submitted
             </span>
           </div>
           
           <div className="mt-4">
             <p className="text-sm text-gray-500 mb-2">Team Members:</p>
             <div className="flex flex-wrap gap-1">
-              {team.members.slice(0, 3).map((member) => (
+              {(team.members || []).slice(0, 3).map((member) => (
                 <span key={member.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
-                  {member.name}
+                  {member.name || member.profiles?.full_name}
                   {member.isTeamLead && <span className="text-blue-600 ml-1">★</span>}
                 </span>
               ))}
-              {team.members.length > 3 && (
+              {(team.members || []).length > 3 && (
                 <span className="text-xs bg-gray-100 px-2 py-1 rounded">
-                  +{team.members.length - 3} more
+                  +{(team.members || []).length - 3} more
                 </span>
               )}
             </div>
           </div>