const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Add Firebase imports
code = code.replace('import { createServer as createViteServer } from "vite";', 
\`import { createServer as createViteServer } from "vite";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";\`);

// Replace users.json logic with Firestore
const oldStoreLogic = \`// Server-side Persistent User Store
const USERS_FILE = path.join(process.cwd(), "users.json");

function readUsers(): Record<string, any> {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Error reading users file:", err);
  }
  return {};
}

function writeUsers(users: Record<string, any>) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing users file:", err);
  }
}\`;

const newStoreLogic = \`// Initialize Firebase Admin
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
}

// User helper methods mapping to Firestore
async function readUsers(): Promise<Record<string, any>> {
  try {
    const snapshot = await db.collection("users").get();
    const users: Record<string, any> = {};
    snapshot.forEach(doc => {
      users[doc.id] = doc.data();
    });
    return users;
  } catch (err) {
    console.error("Error reading users from Firestore:", err);
    return {};
  }
}

async function writeUsers(users: Record<string, any>) {
  // Not used directly in the new logic as we'll do targeted updates
}\`;
code = code.replace(oldStoreLogic, newStoreLogic);

fs.writeFileSync('server.ts', code);
console.log('Done mapping storage.');
