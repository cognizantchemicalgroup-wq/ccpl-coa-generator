async function getLogoDataUrl() {
  const storedLogo = localStorage.getItem('ccpl_logo');
  if (storedLogo) {
    return storedLogo;
  }

  try {
    const response = await fetch('1.png');
    if (!response.ok) throw new Error('Logo fetch failed');
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('PDF template logo load failed:', error);
    return null;
  }
}

function formatDateForPDF(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'N/A';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function extractUnit(specification) {
  if (!specification || typeof specification !== 'string') return '';
  const unitMatch = specification.match(/(mg|g|kg|ppm|%|µg|µm|μm|mL|L|mol|mmol|mM|M)\b/i);
  return unitMatch ? unitMatch[0] : '';
}

async function generatePdfBlobFromData(data) {
  const { jsPDF } = window.jspdf;
  const logo = await getLogoDataUrl();
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  function addPageNumber(currentPage, totalPages) {
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(150, 150, 150);
    let text = `Page ${currentPage}`;
    if (totalPages) text += ` of ${totalPages}`;
    doc.text(text, 105, 290, { align: 'center' });
  }

  function drawHeader() {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(79, 70, 229);
    const rawProductName = data.productName || data.chemicalName || data.productData?.productName || data.productData?.name || 'COA Report';
    const productNameText = rawProductName.split('-')[0].trim().toUpperCase();
    doc.text(productNameText, 15, 15);

    if (logo) {
      try {
        const imgProps = doc.getImageProperties(logo);
        const pageWidth = doc.internal.pageSize.getWidth();
        const logoWidth = 35;
        const logoHeight = 23;
        const margin = 10;
        const logoX = pageWidth - logoWidth - margin;
        doc.addImage(logo, imgProps.fileType, logoX, 5, logoWidth, logoHeight);
      } catch (e) {
        console.warn('Logo drawing failed', e);
      }
    }

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Certificate of Analysis', 15, 25);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(15, 35, 195, 35);

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    let detailsY = 45;

    doc.text('Product Code :', 15, detailsY);
    doc.setFont(undefined, 'normal');
    doc.text(data.productCode || data.productData?.code || 'N/A', 80, detailsY);
    detailsY += 6;

    doc.setFont(undefined, 'bold');
    doc.text('Batch No. :', 15, detailsY);
    doc.setFont(undefined, 'normal');
    doc.text(data.batchNo || 'N/A', 80, detailsY);
    detailsY += 6;

    doc.setFont(undefined, 'bold');
    doc.text('CAS No. :', 15, detailsY);
    doc.setFont(undefined, 'normal');
    doc.text(data.casNo || data.productData?.cas || 'N/A', 80, detailsY);
    detailsY += 6;

    doc.setFont(undefined, 'bold');
    doc.text('Manufacturing Date :', 15, detailsY);
    doc.setFont(undefined, 'normal');
    doc.text(formatDateForPDF(data.mfgDate), 80, detailsY);
    detailsY += 6;

    doc.setFont(undefined, 'bold');
    doc.text('Expiry Date :', 15, detailsY);
    doc.setFont(undefined, 'normal');
    doc.text(formatDateForPDF(data.expiryDate), 80, detailsY);

    return detailsY + 4;
  }

  function drawImageInBox(imageData, x, y, maxW, maxH) {
    if (!imageData) return;
    try {
      const imgProps = doc.getImageProperties(imageData);
      const ratio = imgProps.width / imgProps.height;
      let width = maxW;
      let height = width / ratio;
      if (height > maxH) {
        height = maxH;
        width = height * ratio;
      }
      const offsetX = x + (maxW - width) / 2;
      const offsetY = y + (maxH - height) / 2;
      doc.addImage(imageData, imgProps.fileType, offsetX, offsetY, width, height);
    } catch (e) {
      console.warn('PDF image draw error:', e);
    }
  }

  const tests = Array.isArray(data.testResults) ? data.testResults : [];
  const headerBottom = drawHeader();

  function estimateTotalPages() {
    let pages = 1;
    let y = headerBottom + 25;
    tests.forEach((test) => {
      if (test.type === 'header') {
        y += 12;
      } else {
        const resultValue = (test.result || '-').toString();
        const unit = extractUnit(test.specification);
        let resultText = resultValue;
        if (unit && !isNaN(resultText) && !resultText.includes(unit)) {
          resultText = resultText + ' ' + unit;
        }
        const testLines = doc.splitTextToSize(test.test || '-', 56);
        const specLines = doc.splitTextToSize(test.specification || '-', 78);
        const resultLines = doc.splitTextToSize(resultText, 38);
        const maxLines = Math.max(testLines.length, specLines.length, resultLines.length);
        const rowHeight = maxLines * 4.5 + 2;
        if (y + rowHeight > 255) {
          pages++;
          y = headerBottom + rowHeight;
        } else {
          y += rowHeight;
        }
      }
    });
    if (y > 235) pages++;
    return pages;
  }

  const totalPages = estimateTotalPages();

  let yPos = headerBottom + 4;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setFillColor(240, 240, 240);
  doc.rect(15, yPos - 5, 180, 8, 'F');
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text('Test Parameter', 17, yPos);
  doc.text('Specification', 75, yPos);
  doc.text('Result', 155, yPos);
  yPos += 2;
  doc.setLineWidth(0.3);
  doc.line(15, yPos, 195, yPos);
  doc.setLineWidth(0.1);
  doc.setFont(undefined, 'normal');
  yPos += 6;

  let pageNumber = 1;
  tests.forEach((test, index) => {
    if (yPos > 255) {
      addPageNumber(pageNumber, totalPages);
      doc.addPage();
      pageNumber++;
      const newHeaderBottom = drawHeader();
      yPos = newHeaderBottom + 10;
      doc.setFillColor(240, 240, 240);
      doc.rect(15, yPos - 5, 180, 8, 'F');
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.text('Test Parameter', 17, yPos);
      doc.text('Specification', 75, yPos);
      doc.text('Result', 155, yPos);
      yPos += 2;
      doc.setLineWidth(0.3);
      doc.line(15, yPos, 195, yPos);
      doc.setLineWidth(0.1);
      doc.setFont(undefined, 'normal');
      yPos += 6;
    }

    if (test.type === 'header') {
      yPos += 2;
      doc.setFontSize(9.5);
      doc.setFont(undefined, 'bold');
      doc.setFillColor(102, 126, 234);
      doc.rect(15, yPos - 4, 180, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(test.test || '-', 17, yPos + 1);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(8.5);
      yPos += 9;
      return;
    }

    let result = (test.result || '-').toString();
    const unit = extractUnit(test.specification);
    if (unit && !isNaN(result) && !result.includes(unit)) {
      result = result + ' ' + unit;
    }

    const testLines = doc.splitTextToSize(test.test || '-', 56);
    const specLines = doc.splitTextToSize(test.specification || '-', 78);
    const resultLines = doc.splitTextToSize(result, 38);
    const maxLines = Math.max(testLines.length, specLines.length, resultLines.length);
    const rowHeight = maxLines * 4.5 + 2;

    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(15, yPos - 3, 180, rowHeight, 'F');
    }

    doc.text(testLines, 17, yPos);
    doc.text(specLines, 75, yPos);
    doc.text(resultLines, 155, yPos);
    yPos += rowHeight;
  });

  yPos += 10;
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Remarks :', 15, yPos);
  doc.setFont(undefined, 'normal');
  // Use user-entered remarks for both RM and FG
  const remarksText = (data.remarks) ? data.remarks : 'The above material meets the specification as per USP / NF / BP / EP / IP / Inhouse.';
  const remarksLines = doc.splitTextToSize(remarksText, 170);
  doc.text(remarksLines, 40, yPos);
  yPos += remarksLines.length * 5 + 5;

  if (yPos > 230) {
    addPageNumber(pageNumber, totalPages);
    doc.addPage();
    pageNumber++;
    const newHeaderBottom = drawHeader();
    yPos = newHeaderBottom + 10;
  }

  yPos += 10;
  doc.setLineWidth(0.2);
  doc.setDrawColor(200, 200, 200);
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');

  // Both RM and FG use the same signature layout
  // Signature block dimensions - leave proper space between text
  const compiledByX = 15;
  const companyX = 80;
  const approvedByX = 140;
  const blockWidth = 55;

  // Vertical positioning - cleaner layout without lines
  const headerTextY = yPos;           // "Compiled By" / "Approved By" text
  const signatureTopY = yPos + 2;     // Top of signature area
  const signatureBottomY = yPos + 18; // Bottom of signature area

  const signatureHeight = signatureBottomY - signatureTopY; // Available height for signature

  // Draw header texts - NO "Company Stamp" text, just the stamp image
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Compiled By', compiledByX, headerTextY);
  // Removed: doc.text('Company Stamp', companyX, headerTextY);
  doc.text('Approved By', approvedByX, headerTextY);

  // Draw signature images - properly sized and centered
  // Max width: 70% of block width, Max height: available vertical space
  const maxSigWidth = blockWidth * 0.7;
  const maxSigHeight = signatureHeight - 2; // Leave 2mm margin top/bottom

  drawImageInBox(data.compiledBySignature, compiledByX, signatureTopY, maxSigWidth, maxSigHeight);
  drawImageInBox(data.companyStampImage, companyX, signatureTopY, 35, signatureHeight + 4);
  drawImageInBox(data.approvedBySignature, approvedByX, signatureTopY, maxSigWidth, maxSigHeight);

  // REMOVED: Draw signature lines
  // REMOVED: Draw footer texts ("Stamp / Date & Sign")

  yPos = signatureBottomY + 8;

  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.5);
  doc.line(15, yPos - 5, 195, yPos - 5);

  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(79, 70, 229);
  doc.text('COGNIZANT CHEMICAL PRIVATE LIMITED', 15, yPos);

  doc.setFont(undefined, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  yPos += 4;
  doc.text('Regd. Office - B-120, Disma Office Premises, Sector AWC, Steel Market, Kalamboli, Panvel - 410218', 15, yPos);
  yPos += 3.5;
  doc.text('Mobile: 9766652255 / 9920272227  |  Email: admin@cognizantchemical.com', 15, yPos);
  yPos += 3.5;
  doc.text('Website: www.cognizantchemical.com', 15, yPos);

  addPageNumber(pageNumber, totalPages);
  return doc.output('blob');
}

function downloadPdfBlob(blob, fileName) {
  const pdfUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
}
