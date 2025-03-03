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

      const filePath = path.join(certificatesDir, `${studentId}_${courseName.replace(/ /g, "_")}.pdf`);
      const stream = fs.createWriteStream(filePath);
      const doc = new PDFDocument({ size: "A4", layout: "landscape" });

      doc.pipe(stream);

      // ✅ Background Color
      doc.rect(0, 0, 842, 595).fill("#F0F8FF"); // Light blue background

      // ✅ Decorative Border
      doc.rect(20, 20, 802, 555).stroke("#2980B9", 2); // Outer border
      doc.rect(30, 30, 782, 535).stroke("#2980B9", 1); // Inner border

      // ✅ Header: Makalla Technology Solutions
      doc.fontSize(28).font("Helvetica-Bold").fillColor("#2C3E50").text("Makalla Technology Solutions", 0, 50, { align: "center", width: 842 });

      // ✅ Certificate Title
      doc.fontSize(42).font("Helvetica-Bold").fillColor("#2980B9").text("Certificate of Completion", 0, 120, { align: "center", width: 842 });

      // ✅ Decorative Line
      doc.moveTo(100, 180).lineTo(742, 180).stroke("#2980B9", 2);

      // ✅ Awarded To
      doc.fontSize(28).font("Helvetica").fillColor("#34495E").text("This certificate is proudly presented to", 0, 200, { align: "center", width: 842 });
      doc.fontSize(36).font("Helvetica-Bold").fillColor("#2980B9").text(studentName, 0, 240, { align: "center", width: 842 });

      // ✅ Course Name
      doc.fontSize(24).font("Helvetica").fillColor("#34495E").text("For successfully completing the course in", 0, 320, { align: "center", width: 842 });
      doc.fontSize(32).font("Helvetica-Bold").fillColor("#2980B9").text(courseName, 0, 360, { align: "center", width: 842 });

      // ✅ Certificate & Student ID
      doc.fontSize(16).font("Helvetica").fillColor("#7F8C8D").text(`Certificate ID: ${certificateId}`, 0, 440, { align: "center", width: 842 });
      doc.fontSize(16).font("Helvetica").fillColor("#7F8C8D").text(`Student ID: ${studentId}`, 0, 470, { align: "center", width: 842 });

      // ✅ QR Code
      const qrCodeImage = await QRCode.toDataURL(qrCodeData);
      doc.image(qrCodeImage, 700, 450, { width: 100, height: 100 });

      // ✅ Footer Text
      doc.fontSize(14).font("Helvetica").fillColor("#7F8C8D").text("This certificate is issued by Makalla Technology Solutions", 0, 540, { align: "center", width: 842 });
      doc.fontSize(12).font("Helvetica").fillColor("#7F8C8D").text("Powered by Makalla Technology Solutions", 0, 560, { align: "center", width: 842 });

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateCertificatePDF;