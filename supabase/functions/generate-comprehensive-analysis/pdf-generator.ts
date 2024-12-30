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

  // Helper function to format markdown text
  const formatMarkdown = (text: string): string => {
    // Remove markdown bold syntax and handle the text separately
    return text.replace(/\*\*(.*?)\*\*/g, '$1')
              .replace(/\n/g, ' ') // Replace newlines with spaces
              .trim();
  };

  // Helper function to check if text should be bold (was previously wrapped in **)
  const shouldBeBold = (text: string, originalText: string): boolean => {
    const boldPattern = /\*\*(.*?)\*\*/g;
    let match;
    while ((match = boldPattern.exec(originalText)) !== null) {
      if (match[1] === text) {
        return true;
      }
    }
    return false;
  };

  // Helper function to write text and handle overflow
  const writeText = (text: string, originalText: string, { fontSize: size = fontSize, indent = 0 } = {}) => {
    // Format the text first
    text = formatMarkdown(text);
    
    if (yPosition < margin + size) {
      currentPage = addNewPage();
    }

    const maxWidth = width - 2 * margin - indent;
    const words = text.split(' ').filter(word => word.length > 0); // Filter out empty strings
    let currentLine = '';
    let currentWords: string[] = [];

    for (const word of words) {
      currentWords.push(word);
      const testLine = currentWords.join(' ');
      const font = shouldBeBold(testLine, originalText) ? timesBoldFont : timesRomanFont;
      const testWidth = font.widthOfTextAtSize(testLine, size);

      if (testWidth > maxWidth) {
        // Remove the last word that caused overflow
        currentWords.pop();
        currentLine = currentWords.join(' ');
        const lineFont = shouldBeBold(currentLine, originalText) ? timesBoldFont : timesRomanFont;
        
        if (currentLine.trim()) {
          currentPage.drawText(currentLine.trim(), {
            x: margin + indent,
            y: yPosition,
            size: size,
            font: lineFont,
            color: rgb(0, 0, 0),
          });
        }
        
        yPosition -= lineHeight;
        currentWords = [word];

        if (yPosition < margin + size) {
          currentPage = addNewPage();
        }
      }
    }

    if (currentWords.length > 0) {
      currentLine = currentWords.join(' ');
      const font = shouldBeBold(currentLine, originalText) ? timesBoldFont : timesRomanFont;
      
      if (currentLine.trim()) {
        currentPage.drawText(currentLine.trim(), {
          x: margin + indent,
          y: yPosition,
          size: size,
          font: font,
          color: rgb(0, 0, 0),
        });
      }
      yPosition -= lineHeight;
    }
  };

  // Process markdown-like content by splitting on double newlines
  const sections = content.split('\n\n').map(section => section.trim()).filter(section => section.length > 0);
  
  for (const section of sections) {
    // Store original text for bold checking
    const originalText = section;

    if (section.startsWith('# ')) {
      // Handle main titles
      writeText(section.substring(2), originalText, { fontSize: titleSize });
      yPosition -= lineHeight;
    } else if (section.startsWith('## ')) {
      // Handle subtitles
      writeText(section.substring(3), originalText, { fontSize: titleSize - 2 });
      yPosition -= lineHeight;
    } else if (section.startsWith('- ')) {
      // Handle bullet points
      writeText('•' + section.substring(1), originalText, { indent: 20 });
    } else {
      // Handle regular paragraphs
      writeText(section, originalText);
      yPosition -= lineHeight / 2;
    }

    yPosition -= lineHeight / 2;
  }

  return await pdfDoc.save();
}