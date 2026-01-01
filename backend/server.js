import express from "express";
import mysql from "mysql2";
import bcrypt from "bcryptjs";
import cors from "cors";
import nodemailer from "nodemailer";
import Bytez from "bytez.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const api = express.Router();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("✅ Backend working fine");
});


console.log("🔥🔥🔥 SERVER.JS LOADED 🔥🔥🔥");

// ======================= STATIC UPLOADS FOLDER =======================
app.use("/uploads", express.static("uploads"));

// ======================= MULTER: FILE STORAGE =======================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});
const upload = multer({ storage });

// ======================= MySQL =======================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ap@31",
  database: "medisynn",
});

db.connect((err) => {
  if (err) console.error("❌ MySQL connection failed:", err);
  else console.log("✅ Connected to MySQL");
});

// ======================= Nodemailer =======================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

// ======================= Bytez (AI) =======================
const key = "bc9d33932e14c62dc63e367772cc7092";
const sdk = new Bytez(key);

const deepseekModel = sdk.model("deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B");
const whisperModel = sdk.model("openai/whisper-large-v3");

// =================================================================
// 🔥 FIXED JSON PARSE (same as yours, untouched)
// =================================================================
function safeParse(value) {
  try {
    if (!value || value === "null") return [];
    if (typeof value === "object") return value;

    const fixed = value
      .replace(/'/g, '"')
      .replace(/([{,]\s*)(\w+):/g, '$1"$2":');

    return JSON.parse(fixed);
  } catch (err) {
    console.log("❌ JSON parse failed:", value);
    return [];
  }
}

// =================================================================
// LOGIN (untouched)
// =================================================================
api.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const cleanEmail = email.toLowerCase().trim();

  db.query("SELECT * FROM users WHERE email = ?", [cleanEmail], async (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (!results.length)
      return res.status(404).json({ message: "User not found" });

    const user = results[0];

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(401).json({ message: "Invalid password" });

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, full_name: user.full_name, email: user.email },
    });
  });
});

// =================================================================
// SIGNUP (untouched)
// =================================================================
api.post("/signup", async (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (results.length)
      return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
      [full_name, email, hashed],
      (err2) => {
        if (err2) return res.status(500).json({ message: "Registration failed" });
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  });
});

// =================================================================
// SEND OTP (untouched)
// =================================================================
api.post("/send-otp", (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (!results.length)
      return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    db.query(
      "UPDATE users SET reset_otp = ?, otp_expiry = ? WHERE email = ?",
      [otp, expiry, email]
    );


    const htmlTemplate = `
  <div style="background:#f4f4f7; padding:0 0 0 0; font-family:Arial, sans-serif;">
<table align="center" width="100%" cellpadding="0" cellspacing="0"
  style="
    max-width:520px;
    background:#ffffff;
    border:1px solid #e8e8e8;
    box-shadow:0 4px 14px rgba(0,0,0,0.08);
    overflow:hidden;
  ">


      <tr>
  <td style="
  padding:30px 25px;
  text-align:center;
  border-radius:14px;
">


          <!-- ICON -->
          <div style="font-size:40px; margin-bottom:10px;">🔐</div>

          <!-- TITLE -->
          <h1 style="margin:5px 0 10px; font-size:26px; color:#2563eb; line-height:1.3; font-weight:700;">
            Medisynn<br/>Security Verification
          </h1>

          <!-- MESSAGE -->
          <p style="font-size:15px; color:#555; margin:0 0 20px; line-height:1.6;">
          The password reset request was made for your Medisynn account. Use the code below to continue.
          </p>

          <!-- OTP BOX -->
          <div style="
            background:#2563eb;
            color:white;
            font-size:34px;
            font-weight:bold;
            padding:18px 0;
            border-radius:12px;
            width:82%;
            margin: 0 auto 22px auto;
            letter-spacing:6px;
          ">
            ${otp}
          </div>

          <!-- Security Note -->
          <p style="font-size:14px; color:#666; margin-top:14px; line-height:1.7;">

            <span style="color:#d9534f; font-weight:bold;">
              ⚠️ Do NOT share this OTP with anyone.
            </span>
            Medisynn will never ask for your verification code.
          </p>

          <hr style="border:none; border-top:1px solid #ddd; margin:28px 0;" />

          <!-- FOOTER -->
          <p style="font-size:12px; color:#999; margin:0;">
            © ${new Date().getFullYear()} Medisynn • All Rights Reserved
          </p>

        </td>
      </tr>
    </table>
  </div>
`;


transporter.sendMail({
  from: "Medisynn <medisynn.care24@gmail.com>",
  to: email,
  subject: "Your OTP Code – Medisynn Verification",
  html: htmlTemplate,
});


    res.status(200).json({ message: "OTP sent successfully" });
  });
});

// =================================================================
// VERIFY OTP (untouched)
// =================================================================
api.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (!results.length) return res.status(404).json({ message: "User not found" });

    const user = results[0];

    if (!user.reset_otp || otp !== user.reset_otp)
      return res.status(401).json({ message: "Invalid OTP" });

    if (new Date() > user.otp_expiry)
      return res.status(400).json({ message: "OTP expired" });

    db.query(
      "UPDATE users SET reset_otp = NULL, otp_expiry = NULL WHERE email = ?",
      [email]
    );

    res.status(200).json({ message: "OTP verified successfully" });
  });
});

// =================================================================
// RESET PASSWORD (untouched)
// =================================================================
api.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  const hash = await bcrypt.hash(newPassword, 10);

  db.query(
    "UPDATE users SET password = ? WHERE email = ?",
    [hash, email],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "User not found" });

      res.status(200).json({ message: "Password updated successfully" });
    }
  );
});

// =================================================================
// AI CHAT (untouched)
// =================================================================
api.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    const { error, output } = await deepseekModel.run([
      { role: "user", content: prompt },
    ]);

    if (error) return res.status(500).json({ message: "AI failed" });

    res.json({ response: output[0].content });
  } catch (err) {
    res.status(500).json({ message: "AI internal error" });
  }
});

// =================================================================
// PROFILE FETCH (untouched)
// =================================================================
api.post("/profile", (req, res) => {
  const { email } = req.body;

  db.query("SELECT full_name, email, profile_image FROM users WHERE email=?", [email], (err, results) => {
    if (!results.length) return res.status(404).json({ message: "User not found" });

    const data = results[0];
    const img = data.profile_image
      ? `http://localhost:5000/uploads/${data.profile_image}`
      : null;

    res.json({ full_name: data.full_name, email: data.email, profile_image: img });
  });
});

// =================================================================
// 🔥 NEW → UPLOAD PROFILE IMAGE (FormData)
// =================================================================
api.post("/upload-profile-image", upload.single("image"), (req, res) => {
  const { email } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filename = req.file.filename;

  // 🔥 SAVE IN DATABASE ALSO
  db.query(
    "UPDATE users SET profile_image=? WHERE email=?",
    [filename, email],
    (err) => {
      if (err) return res.status(500).json({ message: "DB update failed" });

      res.json({ filename });
    }
  );
});


// =================================================================
// 🔥 FIXED PROFILE UPDATE (JSON ONLY, NO MULTER)
// =================================================================
api.post("/update-profile", async (req, res) => {
    console.log("🟡 RAW BODY RECEIVED:", req.body);

  const { email, full_name, password, profile_image } = req.body;
    console.log("🟣 PARSED VALUES:", {
    email,
    full_name,
    password,
    profile_image
  });

  const finalImg =
    profile_image === null || profile_image === "null" || profile_image === ""
      ? null
      : profile_image;

  let sql, params;
    console.log("🟠 FINAL IMAGE TO SAVE:", finalImg);

  if (password && password.trim() !== "") {
    const hash = await bcrypt.hash(password, 10);
    sql = "UPDATE users SET full_name=?, password=?, profile_image=? WHERE email=?";
    params = [full_name, hash, finalImg, email];
  } else {
    sql = "UPDATE users SET full_name=?, profile_image=? WHERE email=?";
    params = [full_name, finalImg, email];
  }

  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ message: "Update failed" });
    res.json({ message: "Profile updated" });
  });
});


// =================================================================
// DELETE PROFILE IMAGE (fixed)
// =================================================================
api.post("/delete-profile-image", (req, res) => {
  const { email, filename } = req.body;

  if (!email || !filename)
    return res.status(400).json({ message: "Email & filename required" });

  const filePath = path.join(process.cwd(), "uploads", filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  db.query("UPDATE users SET profile_image=NULL WHERE email=?", [email], (err) => {
    if (err) return res.status(500).json({ message: "DB error" });

    res.json({ message: "Profile image deleted successfully" });
  });
});

// =================================================================
// DASHBOARD GET (untouched)
// =================================================================
api.get("/dashboard/:email", (req, res) => {
  const { email } = req.params;

  db.query("SELECT * FROM user_data WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (!results.length) {
      db.query(
        "INSERT INTO user_data (email, heartRateHistory, stepsHistory, bpHistory, healthHistory, wellnessTips, reminders) VALUES (?, '[]', '[]', '[]', '[]', '[]', '[]')",
        [email]
      );

      return res.json({
        email,
        heartRateHistory: [],
        stepsHistory: [],
        bpHistory: [],
        healthHistory: [],
        wellnessTips: [],
        reminders: [],
      });
    }

    const d = results[0];

    res.json({
      email: d.email,
      heartRateHistory: safeParse(d.heartRateHistory),
      stepsHistory: safeParse(d.stepsHistory),
      bpHistory: safeParse(d.bpHistory),
      healthHistory: safeParse(d.healthHistory),
      wellnessTips: safeParse(d.wellnessTips),
      reminders: safeParse(d.reminders),
    });
  });
});

// =================================================================
// DASHBOARD SAVE (untouched)
// =================================================================
api.put("/dashboard/:email", (req, res) => {
  const { email } = req.params;

  const payload = {
    heartRateHistory: JSON.stringify(req.body.heartRateHistory || []),
    stepsHistory: JSON.stringify(req.body.stepsHistory || []),
    bpHistory: JSON.stringify(req.body.bpHistory || []),
    healthHistory: JSON.stringify(req.body.healthHistory || []),
    wellnessTips: JSON.stringify(req.body.wellnessTips || []),
    reminders: JSON.stringify(req.body.reminders || []),
  };

  console.log("🔍 Saving dashboard for:", email);
  console.log("📦 Payload:", payload);

  db.query(
    `
    INSERT INTO user_data 
      (email, heartRateHistory, stepsHistory, bpHistory, healthHistory, wellnessTips, reminders)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      heartRateHistory = VALUES(heartRateHistory),
      stepsHistory = VALUES(stepsHistory),
      bpHistory = VALUES(bpHistory),
      healthHistory = VALUES(healthHistory),
      wellnessTips = VALUES(wellnessTips),
      reminders = VALUES(reminders)
    `,
    [
      email,
      payload.heartRateHistory,
      payload.stepsHistory,
      payload.bpHistory,
      payload.healthHistory,
      payload.wellnessTips,
      payload.reminders,
    ],
    (err) => {
      if (err) return res.status(500).json({ message: "Save failed" });

      console.log(`✅ Dashboard updated for user: ${email}`);
      res.json({ message: "Dashboard saved" });
    }
  );
});

// =================================================================
// START SERVER (untouched)
// =================================================================
app.use("/api", api);
app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);
