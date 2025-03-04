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

      const filePath = path.join(certificatesDir, `${studentId}_${courseName.replace(/ /g, "_")}.pdf`);
      const stream = fs.createWriteStream(filePath);
      const doc = new PDFDocument({ size: "A4", layout: "landscape" });

      doc.pipe(stream);

      // Define styles based on course
      let primaryColor, secondaryColor, titleFont, bodyFont, bgColor, borderType;
      switch (courseName) {
        case "Full Stack Web Development":
          primaryColor = "#1E3A8A";
          secondaryColor = "#64748B";
          bgColor = "#E3F2FD"; // Light blue
          titleFont = "Helvetica-Bold";
          bodyFont = "Helvetica";
          borderType = "solid";
          break;
        case "App Development":
          primaryColor = "#0D9488";
          secondaryColor = "#14B8A6";
          bgColor = "#D1FAE5"; // Light green
          titleFont = "Helvetica-Bold";
          bodyFont = "Helvetica";
          borderType = "dotted";
          break;
        case "Video Editing":
          primaryColor = "#B91C1C";
          secondaryColor = "#F43F5E";
          bgColor = "#FEE2E2"; // Light red
          titleFont = "Courier-Bold";
          bodyFont = "Courier";
          borderType = "dashed";
          break;
        case "Graphics Design":
          primaryColor = "#8B5CF6";
          secondaryColor = "#A78BFA";
          bgColor = "#EDE9FE"; // Light purple
          titleFont = "Times-Bold";
          bodyFont = "Times-Roman";
          borderType = "double";
          break;
        case "Basic Computer Skill":
          primaryColor = "#2563EB";
          secondaryColor = "#3B82F6";
          bgColor = "#DBEAFE"; // Light blue
          titleFont = "Helvetica-Bold";
          bodyFont = "Helvetica";
          borderType = "solid";
          break;
        default:
          primaryColor = "#374151";
          secondaryColor = "#6B7280";
          bgColor = "#F9FAFB";
          titleFont = "Helvetica-Bold";
          bodyFont = "Helvetica";
          borderType = "solid";
      }

      // Background
      doc.rect(0, 0, 842, 595).fill(bgColor);
      doc.rect(20, 20, 802, 555).stroke(primaryColor, borderType === "double" ? 4 : 2);
      if (borderType === "dotted") {
        doc.dash(5, { space: 5 });
      } else if (borderType === "dashed") {
        doc.dash(10, { space: 5 });
      }
      doc.rect(30, 30, 782, 535).stroke(secondaryColor, 1);
      doc.undash();

      // **✅ Add Watermark**
      doc.fontSize(80)
        .fillColor("#E0E0E0") // Light gray for transparency effect
        .opacity(0.2) // Reduce opacity for watermark effect
        .rotate(45, { origin: [421, 298] }) // Rotate diagonally
        .text("Makalla Technology Solutions", 100, 150, { align: "center", width: 842 });

      doc.rotate(0).opacity(1); // Reset rotation & opacity

      // Header
      doc.fontSize(28).font(titleFont).fillColor(primaryColor).text("Makalla Technology Solutions", 0, 50, { align: "center", width: 842 });
      doc.fontSize(42).font(titleFont).fillColor(secondaryColor).text("Certificate of Completion", 0, 120, { align: "center", width: 842 });
      doc.moveTo(100, 180).lineTo(742, 180).stroke(primaryColor, 2);

      // Recipient
      doc.fontSize(28).font(bodyFont).fillColor("#34495E").text("This certificate is proudly presented to", 0, 200, { align: "center", width: 842 });
      doc.fontSize(36).font(titleFont).fillColor(primaryColor).text(studentName.toUpperCase(), 0, 240, { align: "center", width: 842 });

      // Course Name
      doc.fontSize(24).font(bodyFont).fillColor("#34495E").text("For successfully completing the course in", 0, 320, { align: "center", width: 842 });
      doc.fontSize(32).font(titleFont).fillColor(secondaryColor).text(courseName.toUpperCase(), 0, 360, { align: "center", width: 842 });

      // Certificate & Student ID
      doc.fontSize(16).font(bodyFont).fillColor("#7F8C8D").text(`Certificate ID: ${certificateId}`, 0, 440, { align: "center", width: 842 });
      doc.fontSize(16).font(bodyFont).fillColor("#7F8C8D").text(`Student ID: ${studentId}`, 0, 470, { align: "center", width: 842 });

      // QR Code
      const qrCodeImage = await QRCode.toDataURL(qrCodeData);
      doc.image(qrCodeImage, 700, 450, { width: 100, height: 100 });

      // Footer
      doc.fontSize(14).font(bodyFont).fillColor("#7F8C8D").text("This certificate is issued by Makalla Technology Solutions", 0, 540, { align: "center", width: 842 });
      doc.fontSize(12).font(bodyFont).fillColor("#7F8C8D").text("Powered by Makalla Technology Solutions", 0, 560, { align: "center", width: 842 });

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateCertificatePDF;
