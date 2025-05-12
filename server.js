import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import excelJS from "exceljs";
import nodemailer from "nodemailer"; // ✅ Email sending

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const __dirname = path.resolve(); // Get the root directory

// Ensure data directory exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log("📂 'data' directory created.");
} else {
  console.log("📂 'data' directory already exists.");
}

// Endpoint to save data to Excel and send via email
app.post("/save-excel", async (req, res) => {
  try {
    const { parentName, parentPhone, studentName, studentClass, subject, level, groupSize, question } = req.body;

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
      console.log("❌ ERROR: Some fields are missing or empty.");
      return res.status(400).json({ message: "All fields are required." });
    }

    const filePath = path.join(dataDir, "registrations.xlsx");

    // Create or load workbook
    const workbook = new excelJS.Workbook();
    let worksheet;

    if (fs.existsSync(filePath)) {
      await workbook.xlsx.readFile(filePath);
      worksheet = workbook.getWorksheet("Registrations");
    } else {
      worksheet = workbook.addWorksheet("Registrations");
      worksheet.addRow(["Parent Name", "Parent Phone", "Student Name", "Student Class", "Subject", "Level", "Group Size", "Question"]);
    }

    // Add data row
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

    // ✅ Email the Excel file to you and your teacher
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "testalgoritmtest@gmail.com", // <-- replace
        pass: "wthr vjcq aqed uxfr",    // <-- replace with Gmail App Password
      },
    });

    const mailOptions = {
      from: "your.email@gmail.com", // <-- replace
      to: ["your.email@gmail.com", "teacher.email@gmail.com"], // <-- replace both
      subject: "📥 New Registration Submitted",
      text: "A new registration has been submitted. Excel file attached.",
      attachments: [
        {
          filename: "registrations.xlsx",
          path: filePath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent to you and your teacher.");

    res.status(200).json({ message: "Data saved and email sent successfully!" });

  } catch (error) {
    console.error("❌ ERROR:", error.message);
    res.status(500).json({ message: "Error saving data or sending email" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
