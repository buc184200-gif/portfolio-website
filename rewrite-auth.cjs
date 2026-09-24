const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldRegister = \`// 1. Auth Register Endpoint
app.post("/api/auth/register", (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const users = readUsers();
    
    if (users[cleanEmail] && users[cleanEmail].verified === true) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }
    
    // Create or update unverified user
    users[cleanEmail] = { name: name.trim(), password, verified: false };
    writeUsers(users);

    // Generate and store OTP
    const otp = generateOtp();
    activeOtps[cleanEmail] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
      attempts: 0,
      lastSentAt: Date.now()
    };

    console.log(\\\`
==================================================
[OTP EMAIL VERIFICATION]
To: \${cleanEmail}
Subject: Verify your Crestiva account
Your 6-digit verification code is: \${otp}
Expires in: 5 minutes
==================================================
    \\\`);

    return res.json({ 
      success: true, 
      message: "Verification code sent to your email.", 
      email: cleanEmail,
      demoOtp: otp
    });
  } catch (err: any) {
    console.error("Register API error:", err);
    return res.status(500).json({ error: "Internal server error during registration." });
  }
});\`;

const newRegister = \`// 1. Auth Register Endpoint
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = await readUser(cleanEmail);
    
    if (user && user.verified === true) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }
    
    // Create or update unverified user
    await writeUser(cleanEmail, { name: name.trim(), password, verified: false });

    // Generate and store OTP
    const otp = generateOtp();
    activeOtps[cleanEmail] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
      lastSentAt: Date.now()
    };

    console.log(\\\`
==================================================
[OTP EMAIL VERIFICATION]
To: \${cleanEmail}
Subject: Verify your Crestiva account
Your 6-digit verification code is: \${otp}
Expires in: 5 minutes
==================================================
    \\\`);

    return res.json({ 
      success: true, 
      message: "Verification code sent to your email.", 
      email: cleanEmail,
      demoOtp: otp
    });
  } catch (err: any) {
    console.error("Register API error:", err);
    return res.status(500).json({ error: "Internal server error during registration." });
  }
});\`;

const oldLogin = \`// 2. Auth Login Endpoint
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const users = readUsers();
    const user = users[cleanEmail];
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    if (user.verified !== true) {
      const otp = generateOtp();
      activeOtps[cleanEmail] = {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
        attempts: 0,
        lastSentAt: Date.now()
      };

      console.log(\\\`
==================================================
[OTP EMAIL VERIFICATION - LOGIN TRIGGERED]
To: \${cleanEmail}
Subject: Verify your Crestiva account
Your 6-digit verification code is: \${otp}
Expires in: 5 minutes
==================================================
      \\\`);

      return res.status(403).json({ 
        error: "Please verify your email address to continue.", 
        unverified: true,
        email: cleanEmail,
        demoOtp: otp
      });
    }

    const token = signToken({ email: cleanEmail, name: user.name });
    return res.json({ success: true, token, name: user.name, email: cleanEmail });
  } catch (err: any) {
    console.error("Login API error:", err);
    return res.status(500).json({ error: "Internal server error during login." });
  }
});\`;

const newLogin = \`// 2. Auth Login Endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = await readUser(cleanEmail);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    if (user.verified !== true) {
      const otp = generateOtp();
      activeOtps[cleanEmail] = {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
        attempts: 0,
        lastSentAt: Date.now()
      };

      console.log(\\\`
==================================================
[OTP EMAIL VERIFICATION - LOGIN TRIGGERED]
To: \${cleanEmail}
Subject: Verify your Crestiva account
Your 6-digit verification code is: \${otp}
Expires in: 5 minutes
==================================================
      \\\`);

      return res.status(403).json({ 
        error: "Please verify your email address to continue.", 
        unverified: true,
        email: cleanEmail,
        demoOtp: otp
      });
    }

    const token = signToken({ email: cleanEmail, name: user.name });
    return res.json({ success: true, token, name: user.name, email: cleanEmail });
  } catch (err: any) {
    console.error("Login API error:", err);
    return res.status(500).json({ error: "Internal server error during login." });
  }
});\`;

const oldVerifyOtp = \`// 2b. Verify OTP Endpoint
app.post("/api/auth/verify-otp", (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Missing email or verification code." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const users = readUsers();
    const user = users[cleanEmail];
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const otpData = activeOtps[cleanEmail];
    if (!otpData) {
      return res.status(400).json({ error: "No active verification code found. Please request a new one." });
    }

    if (Date.now() > otpData.expiresAt) {
      delete activeOtps[cleanEmail];
      return res.status(400).json({ error: "Verification code has expired. Please request a new one." });
    }

    if (otpData.attempts >= 3) {
      delete activeOtps[cleanEmail];
      return res.status(400).json({ error: "Too many incorrect attempts. Please request a new code." });
    }

    if (otpData.otp !== otp.trim()) {
      otpData.attempts += 1;
      const remaining = 3 - otpData.attempts;
      return res.status(400).json({ 
        error: \`Invalid verification code. \${remaining} attempt(s) remaining.\` 
      });
    }

    // Success! Verify user
    user.verified = true;
    users[cleanEmail] = user;
    writeUsers(users);

    delete activeOtps[cleanEmail];

    const token = signToken({ email: cleanEmail, name: user.name });
    return res.json({ 
      success: true, 
      token, 
      name: user.name, 
      email: cleanEmail,
      message: "Email address verified successfully!" 
    });
  } catch (err: any) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ error: "Internal server error during OTP verification." });
  }
});\`;

const newVerifyOtp = \`// 2b. Verify OTP Endpoint
app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Missing email or verification code." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = await readUser(cleanEmail);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const otpData = activeOtps[cleanEmail];
    if (!otpData) {
      return res.status(400).json({ error: "No active verification code found. Please request a new one." });
    }

    if (Date.now() > otpData.expiresAt) {
      delete activeOtps[cleanEmail];
      return res.status(400).json({ error: "Verification code has expired. Please request a new one." });
    }

    if (otpData.attempts >= 3) {
      delete activeOtps[cleanEmail];
      return res.status(400).json({ error: "Too many incorrect attempts. Please request a new code." });
    }

    if (otpData.otp !== otp.trim()) {
      otpData.attempts += 1;
      const remaining = 3 - otpData.attempts;
      return res.status(400).json({ 
        error: \`Invalid verification code. \${remaining} attempt(s) remaining.\` 
      });
    }

    // Success! Verify user
    user.verified = true;
    await writeUser(cleanEmail, user);

    delete activeOtps[cleanEmail];

    const token = signToken({ email: cleanEmail, name: user.name });
    return res.json({ 
      success: true, 
      token, 
      name: user.name, 
      email: cleanEmail,
      message: "Email address verified successfully!" 
    });
  } catch (err: any) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ error: "Internal server error during OTP verification." });
  }
});\`;

const oldResendOtp = \`// 2c. Resend OTP Endpoint
app.post("/api/auth/resend-otp", (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const users = readUsers();
    const user = users[cleanEmail];
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.verified === true) {
      return res.status(400).json({ error: "This account is already verified." });
    }

    // Cooldown check (30 seconds)
    const existing = activeOtps[cleanEmail];
    if (existing && (Date.now() - existing.lastSentAt < 30000)) {
      const remainingSec = Math.ceil((30000 - (Date.now() - existing.lastSentAt)) / 1000);
      return res.status(429).json({ error: \`Please wait \${remainingSec} second(s) before requesting another code.\` });
    }

    const otp = generateOtp();
    activeOtps[cleanEmail] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
      lastSentAt: Date.now()
    };

    console.log(\\\`
==================================================
[OTP EMAIL VERIFICATION - RESENT]
To: \${cleanEmail}
Subject: Verify your Crestiva account
Your 6-digit verification code is: \${otp}
Expires in: 5 minutes
==================================================
    \\\`);

    return res.json({ 
      success: true, 
      message: "Verification code resent successfully.", 
      demoOtp: otp 
    });
  } catch (err: any) {
    console.error("Resend OTP error:", err);
    return res.status(500).json({ error: "Internal server error during resending." });
  }
});\`;

const newResendOtp = \`// 2c. Resend OTP Endpoint
app.post("/api/auth/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = await readUser(cleanEmail);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.verified === true) {
      return res.status(400).json({ error: "This account is already verified." });
    }

    // Cooldown check (30 seconds)
    const existing = activeOtps[cleanEmail];
    if (existing && (Date.now() - existing.lastSentAt < 30000)) {
      const remainingSec = Math.ceil((30000 - (Date.now() - existing.lastSentAt)) / 1000);
      return res.status(429).json({ error: \`Please wait \${remainingSec} second(s) before requesting another code.\` });
    }

    const otp = generateOtp();
    activeOtps[cleanEmail] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
      lastSentAt: Date.now()
    };

    console.log(\\\`
==================================================
[OTP EMAIL VERIFICATION - RESENT]
To: \${cleanEmail}
Subject: Verify your Crestiva account
Your 6-digit verification code is: \${otp}
Expires in: 5 minutes
==================================================
    \\\`);

    return res.json({ 
      success: true, 
      message: "Verification code resent successfully.", 
      demoOtp: otp 
    });
  } catch (err: any) {
    console.error("Resend OTP error:", err);
    return res.status(500).json({ error: "Internal server error during resending." });
  }
});\`;


const oldPaymentCreate = \`// 3. Secure Create Order Endpoint (Strictly server-validated)
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: "Your session expired. Please sign in again." });
    }
    const users = readUsers();
    const dbUser = users[user.email];\`;

const newPaymentCreate = \`// 3. Secure Create Order Endpoint (Strictly server-validated)
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: "Your session expired. Please sign in again." });
    }
    const dbUser = await readUser(user.email);\`;

const oldPaymentVerify = \`// 4. Secure Payment Verification Endpoint
app.post("/api/payment/verify", (req, res) => {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: "Your session expired. Please sign in again." });
    }
    const users = readUsers();
    const dbUser = users[user.email];\`;

const newPaymentVerify = \`// 4. Secure Payment Verification Endpoint
app.post("/api/payment/verify", async (req, res) => {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: "Your session expired. Please sign in again." });
    }
    const dbUser = await readUser(user.email);\`;

code = code.replace(oldRegister, newRegister);
code = code.replace(oldLogin, newLogin);
code = code.replace(oldVerifyOtp, newVerifyOtp);
code = code.replace(oldResendOtp, newResendOtp);
code = code.replace(oldPaymentCreate, newPaymentCreate);
code = code.replace(oldPaymentVerify, newPaymentVerify);

fs.writeFileSync('server.ts', code);
console.log('Done mapping auth routes to Firestore.');
