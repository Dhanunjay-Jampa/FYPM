@@ .. @@
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!file || !user?.profile?.id) {
       setError('Please select a file and ensure you are logged in');
       return;
     }

     setLoading(true);
     setError('');

     try {
-      // Create unique file path
-      const fileExt = file.name.split('.').pop();
-      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
-      const filePath = `${teamId}/${fileName}`;
-
-      // Upload file to storage
-      const { data: uploadData, error: uploadError } = await storage.uploadFile(
-        'documents',
-        filePath,
-        file
-      );
-
-      if (uploadError) throw uploadError;
-
-      // Create document record
-      const { data: documentData, error: documentError } = await db.createDocument({
+      // For demo purposes, create a mock document entry
+      const documentData = {
+        id: `doc_${Date.now()}`,
         team_id: teamId,
         name: formData.name,
         type: formData.type,
-        file_path: filePath,
+        file_path: `demo/${file.name}`,
         file_size: file.size,
         mime_type: file.type,
         uploaded_by: user.profile.id,
-        description: formData.description || null
-      });
-
-      if (documentError) throw documentError;
+        description: formData.description || null,
+        version: 1,
+        is_latest: true,
+        created_at: new Date().toISOString(),
+        uploaded_by_student: {
+          profiles: {
+            full_name: user.name,
+            email: user.email
+          }
+        }
+      };

       onUpload(documentData);
     } catch (err: any) {
       setError(err.message);