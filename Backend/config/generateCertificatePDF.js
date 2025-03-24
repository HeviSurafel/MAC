const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");

const generateCertificatePDF = async (studentId, studentName, courseName, certificateId, qrCodeData) => {

  return new Promise(async (resolve, reject) => {
    try {
      const certificatesDir = path.join(__dirname, "../certificates");
      if (!fs.existsSync(certificatesDir)) {
        fs.mkdirSync(certificatesDir, { recursive: true });
      }

      const sanitizedCourseName = courseName.replace(/\s+/g, "_");
      const filePath = path.join(certificatesDir, `${studentId}_${sanitizedCourseName}.pdf`);

      const stream = fs.createWriteStream(filePath);
      const doc = new PDFDocument({ size: "A4", layout: "landscape" });

      doc.pipe(stream);

      const primaryColor = "#1E3A8A"; // Dark blue
      const secondaryColor = "#B91C1C"; // Red
      const accentColor = "#FFD700"; // Gold
      const titleFont = "Helvetica-Bold";
      const bodyFont = "Helvetica";

      doc.rect(0, 0, 842, 595).fill("#FFFFFF"); 
      doc.fillColor(accentColor).rect(0, 0, 50, 595).fill(); 

      doc.fontSize(38).font(titleFont).fillColor(primaryColor).text("CERTIFICATE", 250, 50);
      doc.fontSize(24).font("Helvetica-Oblique").fillColor(secondaryColor).text("of completion", 250, 90);
      doc.moveTo(100, 130).lineTo(742, 130).stroke(primaryColor);

      doc.fontSize(20).font(bodyFont).fillColor("#000").text("This certificate is presented to", 0, 160, { align: "center", width: 842 });
      doc.fontSize(30).font("Helvetica-Bold").fillColor(primaryColor).text(studentName.toUpperCase(), 0, 200, { align: "center", width: 842 });

      doc.fontSize(16).font(bodyFont).fillColor("#000").text("For successfully completing the", 0, 250, { align: "center", width: 842 });
      doc.fontSize(18).font("Helvetica-Bold").fillColor(secondaryColor).text(courseName, 0, 280, { align: "center", width: 842 });

      let courseDescription = "";
      if (courseName === "Graphics Design") {
        courseDescription = "This course covered the fundamentals of design theory, typography, color theory, and practical skills in various design tools.";
      } else if (courseName === "Full Stack Web Development") {
        courseDescription = "This course included intensive training in front-end and back-end technologies, database management, and web development best practices.";
      } else if (courseName === "App Development") {
        courseDescription = "The course focused on mobile application development for both Android and iOS, utilizing modern frameworks and APIs.";
      } else if (courseName === "Basic Computer Skills") {
        courseDescription = "This course provided essential knowledge in basic computer operations, office software tools, internet usage, and troubleshooting techniques.";
      } else if (courseName === "Video Editing") {
        courseDescription = "This course focused on video production, editing techniques, and the use of professional editing software.";
      } else {
        courseDescription = "This course provided the necessary skills and knowledge for a specific field, focusing on practical, hands-on training.";
      }

      doc.fontSize(14).font(bodyFont).fillColor("#555").text(courseDescription, 0, 320, { align: "center", width: 842 });

      const currentDate = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      doc.fontSize(12).fillColor("#555").text(`Certificate ID: ${certificateId}`, 100, 420);
      doc.fontSize(12).fillColor("#555").text(`Date: ${currentDate}`, 550, 420);

      // General Manager's Name & Signature
      doc.fontSize(14).fillColor("#000").text("General Manager: Miki", 500, 450);
      doc.moveTo(620, 460).lineTo(710, 460).stroke(); 

      // Load GM Signature Image
      const gmSignaturePath = path.join(__dirname, "../assets/stmakalla.png"); 
      if (fs.existsSync(gmSignaturePath)) {
        doc.image(gmSignaturePath, 580, 470, { width: 130, height: 50 });
      } else {
        console.warn("GM Signature image not found:", gmSignaturePath);
      }

      // QR Code
      const qrCodeImage = await QRCode.toDataURL(qrCodeData, { errorCorrectionLevel: "H", width: 200 });
      doc.image(qrCodeImage, 650, 30, { width: 150, height: 150 });

      // Stamp Image
      const stampImagePath = path.join(__dirname, "../assets/stmakalla.png"); 
      if (fs.existsSync(stampImagePath)) {
        doc.image(stampImagePath, 300, 400, { width: 150, height: 150 });
      } else {
        console.warn("Stamp image not found:", stampImagePath);
      }

      doc.save();

      // Set transparency
      doc.opacity(0.2); // Increased opacity for better visibility

      // Move to the starting position (bottom-left)
      doc.fontSize(60)
        .fillColor("#CCCCCC") // Light gray for subtle effect
        .rotate(-30, { origin: [200, 400] }) // Rotate text diagonally
        .text("Makalla Technology Solutions", 100, 400, { align: "center", width: 1000 });

      doc.restore(); // Restore the document state

      doc.end();

      stream.on("finish", () => {
        resolve(filePath);
      });
      stream.on("error", (error) => reject(error));
    } catch (error) {
      console.error("Error generating certificate PDF:", error);
      reject(error);
    }
  });
};

module.exports = generateCertificatePDF;
