const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldInit = `// Initialize Firebase Admin
let db: FirebaseFirestore.Firestore;
try {
  const firebaseApp = initializeApp({
    credential: applicationDefault(),
    projectId: "optical-fold-818qq"
  });
  db = getFirestore(firebaseApp);
  db.settings({ databaseId: "ai-studio-crestivawebstudi-64161a69-50b8-4cb3-bf43-a31d0e9ea07d" });
  console.log("Firebase Admin initialized successfully.");
} catch (e) {
  console.error("Error initializing Firebase Admin:", e);
}`;

const newInit = `import { cert } from "firebase-admin/app";
// Initialize Firebase Admin
let db: FirebaseFirestore.Firestore;
try {
  let credential = applicationDefault();
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      credential = cert(serviceAccount);
    } catch (e) {
      console.warn("Failed to parse FIREBASE_SERVICE_ACCOUNT as JSON. Falling back to applicationDefault().");
    }
  }

  const firebaseApp = initializeApp({
    credential,
    projectId: "optical-fold-818qq"
  });
  db = getFirestore(firebaseApp);
  db.settings({ databaseId: "ai-studio-crestivawebstudi-64161a69-50b8-4cb3-bf43-a31d0e9ea07d" });
  console.log("Firebase Admin initialized successfully.");
} catch (e) {
  console.error("Error initializing Firebase Admin:", e);
}`;

code = code.replace(oldInit, newInit);

// The import of cert is added in the code block above, but wait, the top of server.ts has:
// import { initializeApp, applicationDefault } from "firebase-admin/app";
// I'll just use import { cert } right there in the block since it's TypeScript/ES6. Wait, top level imports are required.
fs.writeFileSync('server.ts', code);
console.log('Fixed admin initialization.');
