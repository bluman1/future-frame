import { PDFDocument, rgb, StandardFonts } from "https://cdn.skypack.dev/pdf-lib@1.17.1";

export async function generatePDF(content: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  
  // PDF settings
  const fontSize = 12;
  const titleSize = 16;
  const margin = 50;
  const lineHeight = fontSize * 1.5;
  
  let currentPage = pdfDoc.addPage();
  let { width, height } = currentPage.getSize();
  let yPosition = height - margin;

  // Helper function to add a new page
  const addNewPage = () => {
    currentPage = pdfDoc.addPage();
    yPosition = height - margin;
    return currentPage;
  };

  // Helper function to write text and handle overflow
  const writeText = (text: string, { fontSize: size = fontSize, font = timesRomanFont, indent = 0 } = {}) => {
    // Replace problematic characters and normalize line endings
    text = text.replace(/[\r\n]+/g, ' ').trim();
    
    if (yPosition < margin + size) {
      currentPage = addNewPage();
    }

    const maxWidth = width - 2 * margin - indent;
    const words = text.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, size);

      if (testWidth > maxWidth) {
        currentPage.drawText(currentLine, {
          x: margin + indent,
          y: yPosition,
          size: size,
          font: font,
          color: rgb(0, 0, 0),
        });
        yPosition -= lineHeight;
        currentLine = word;

        if (yPosition < margin + size) {
          currentPage = addNewPage();
        }
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      currentPage.drawText(currentLine, {
        x: margin + indent,
        y: yPosition,
        size: size,
        font: font,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight;
    }
  };

  // Process markdown-like content
  const sections = content.split('\n\n').map(section => section.trim());
  
  for (const section of sections) {
    if (!section) continue;

    if (section.startsWith('# ')) {
      writeText(section.substring(2), { fontSize: titleSize, font: timesBoldFont });
      yPosition -= lineHeight;
    } else if (section.startsWith('## ')) {
      writeText(section.substring(3), { fontSize: titleSize - 2, font: timesBoldFont });
      yPosition -= lineHeight;
    } else if (section.startsWith('- ')) {
      writeText('•' + section.substring(1), { indent: 20 });
    } else {
      writeText(section);
      yPosition -= lineHeight / 2;
    }

    yPosition -= lineHeight / 2;
  }

  return await pdfDoc.save();
}