import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import excelJS from "exceljs";
import nodemailer from "nodemailer";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const __dirname = path.resolve(); // Get root dir
const dataDir = path.join(__dirname, "data");
const filePath = path.join(dataDir, "registrations.xlsx");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log("📂 'data' directory created.");
} else {
  console.log("📂 'data' directory already exists.");
}

// ✅ POST: Save registration data to Excel and send email
app.post("/save-excel", async (req, res) => {
  try {
    const {
      parentName,
      parentPhone,
      studentName,
      studentClass,
      subject,
      level,
      groupSize,
      question,
    } = req.body;

    if (
      !parentName?.trim() ||
      !parentPhone?.trim() ||
      !studentName?.trim() ||
      !studentClass?.trim() ||
      !subject?.trim() ||
      !level?.trim() ||
      !groupSize?.trim() ||
      !question?.trim()
    ) {
      console.log("❌ ERROR: Missing or empty fields.");
      return res.status(400).json({ message: "All fields are required." });
    }

    const workbook = new excelJS.Workbook();
    let worksheet;

    if (fs.existsSync(filePath)) {
      await workbook.xlsx.readFile(filePath);
      worksheet = workbook.getWorksheet("Registrations");
    } else {
      worksheet = workbook.addWorksheet("Registrations");
      worksheet.addRow([
        "Parent Name",
        "Parent Phone",
        "Student Name",
        "Student Class",
        "Subject",
        "Level",
        "Group Size",
        "Question",
      ]);
    }

    worksheet.addRow([
      parentName.trim(),
      parentPhone.trim(),
      studentName.trim(),
      studentClass.trim(),
      subject.trim(),
      level.trim(),
      groupSize.trim(),
      question.trim(),
    ]);

    await workbook.xlsx.writeFile(filePath);
    console.log("✅ Excel file updated.");

    // ✅ Send email with attached Excel file
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "testalgoritmtest@gmail.com",         // ✅ your Gmail address
        pass: "wthr vjcq aqed uxfr",                 // ✅ your Gmail App Password
      },
    });

    const mailOptions = {
      from: "testalgoritmtest@gmail.com",
      to: ["your.email@gmail.com", "teacher.email@gmail.com"], // ✅ change both
      subject: "📥 New Registration Submitted",
      text: "A new registration has been submitted. Excel file attached.",
      attachments: [{ filename: "registrations.xlsx", path: filePath }],
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent.");

    res.status(200).json({ message: "Data saved and email sent successfully!" });
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    res.status(500).json({ message: "Error saving data or sending email" });
  }
});

// ✅ GET: Download the latest Excel file
app.get("/download-excel", (req, res) => {
  const filePath = path.join(dataDir, "registrations.xlsx");

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Disposition', 'attachment; filename="registrations.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).send("Excel file not found.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
