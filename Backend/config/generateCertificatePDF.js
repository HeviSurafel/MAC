const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");

const generateCertificatePDF = async (studentName, courseName, certificateId, qrCodeData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const certificatesDir = path.join(__dirname, "../certificates");

      // Ensure the certificates directory exists
      if (!fs.existsSync(certificatesDir)) {
        fs.mkdirSync(certificatesDir, { recursive: true });
      }

      const filePath = path.join(certificatesDir, `${certificateId}.pdf`);
      const stream = fs.createWriteStream(filePath);
      const doc = new PDFDocument({ size: "A4", layout: "landscape" });

      doc.pipe(stream);

      // ✅ Add a decorative background image
      const backgroundImagePath = path.join(__dirname, "../assets/certificate-bg.jpg"); // Replace with your background image path
      if (fs.existsSync(backgroundImagePath)) {
        doc.image(backgroundImagePath, 0, 0, { width: 842, height: 595 }); // A4 dimensions in landscape
      }

      // ✅ Add a decorative border
      doc.rect(30, 30, 782, 535).stroke("#4A90E2"); // Blue border with 30px margin

      // ✅ Certificate Title (Centered and Stylish)
      doc.fontSize(36)
        .font("Helvetica-Bold")
        .fillColor("#2C3E50") // Dark blue color
        .text("Certificate of Completion", 0, 150, { align: "center", width: 842 });

      // ✅ Awarded to: (Stylish and Centered)
      doc.fontSize(24)
        .font("Helvetica")
        .fillColor("#34495E") // Dark gray color
        .text(`Awarded to:`, 0, 220, { align: "center", width: 842 });

      doc.fontSize(32)
        .font("Helvetica-Bold")
        .fillColor("#2980B9") // Blue color
        .text(studentName, 0, 260, { align: "center", width: 842 });

      // ✅ Course Details (Centered and Elegant)
      doc.fontSize(20)
        .font("Helvetica")
        .fillColor("#34495E") // Dark gray color
        .text(`For successfully completing the course:`, 0, 330, { align: "center", width: 842 });

      doc.fontSize(28)
        .font("Helvetica-Bold")
        .fillColor("#2980B9") // Blue color
        .text(courseName, 0, 370, { align: "center", width: 842 });

      // ✅ Certificate ID (Subtle and Centered)
      doc.fontSize(14)
        .font("Helvetica")
        .fillColor("#7F8C8D") // Gray color
        .text(`Certificate ID: ${certificateId}`, 0, 420, { align: "center", width: 842 });

      // ✅ Generate and Add QR Code (Neatly Positioned in Bottom Right)
      const qrCodeImage = await QRCode.toDataURL(qrCodeData);
      doc.image(qrCodeImage, 700, 450, { width: 100, height: 100 }); // Positioned in the bottom-right corner

      // ✅ Add a subtle watermark (Diagonal and Faded)
      doc.font("Helvetica-Bold")
        .fontSize(50)
        .fillColor("lightgray")
        .opacity(0.1) // Very subtle watermark
        .rotate(45, { origin: [421, 297] }) // Diagonal placement
        .text("Makalla Technology Solution Academy", 50, 150, { align: "center", width: 700 });

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateCertificatePDF;