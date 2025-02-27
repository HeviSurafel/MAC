const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");

const generateCertificatePDF = async (studentId, studentName, courseName, certificateId, qrCodeData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const certificatesDir = path.join(__dirname, "../certificates");

      // Ensure the certificates directory exists
      if (!fs.existsSync(certificatesDir)) {
        fs.mkdirSync(certificatesDir, { recursive: true });
      }

      const filePath = path.join(certificatesDir, `${studentId}.pdf`);
      const stream = fs.createWriteStream(filePath);
      const doc = new PDFDocument({ size: "A4", layout: "landscape" });

      doc.pipe(stream);

      // ✅ Background Image
      const backgroundImagePath = path.join(__dirname, "../assets/certificate-bg.jpg");
      if (fs.existsSync(backgroundImagePath)) {
        doc.image(backgroundImagePath, 0, 0, { width: 842, height: 595 });
      }

      // ✅ Certificate Title
      doc.fontSize(36).font("Helvetica-Bold").fillColor("#2C3E50").text("Certificate of Completion", 0, 150, { align: "center", width: 842 });

      // ✅ Awarded To
      doc.fontSize(24).font("Helvetica").fillColor("#34495E").text("Awarded to:", 0, 220, { align: "center", width: 842 });
      doc.fontSize(32).font("Helvetica-Bold").fillColor("#2980B9").text(studentName, 0, 260, { align: "center", width: 842 });

      // ✅ Course Name
      doc.fontSize(20).font("Helvetica").fillColor("#34495E").text("For successfully completing the course:", 0, 330, { align: "center", width: 842 });
      doc.fontSize(28).font("Helvetica-Bold").fillColor("#2980B9").text(courseName, 0, 370, { align: "center", width: 842 });

      // ✅ Certificate & Student ID
      doc.fontSize(14).font("Helvetica").fillColor("#7F8C8D").text(`Certificate ID: ${certificateId}`, 0, 420, { align: "center", width: 842 });
      doc.fontSize(14).font("Helvetica").fillColor("#7F8C8D").text(`Student ID: ${studentId}`, 0, 440, { align: "center", width: 842 });

      // ✅ QR Code
      const qrCodeImage = await QRCode.toDataURL(qrCodeData);
      doc.image(qrCodeImage, 700, 450, { width: 100, height: 100 });

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};



module.exports = generateCertificatePDF;