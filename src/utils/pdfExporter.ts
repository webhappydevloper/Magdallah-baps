import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/**
 * Exports any DOM element to a crisp, high-resolution PDF preserving Gujarati fonts and styling.
 * Uses html2canvas-pro which natively supports modern CSS color functions like oklab() and oklch().
 */
export async function exportElementToPdf(
  element: HTMLElement,
  fileName: string,
  orientation: 'p' | 'l' = 'p'
): Promise<Blob> {
  // Save current scroll position
  const originalScrollY = window.scrollY;

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // 2x resolution for crystal clear text and stamps
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (_clonedDoc, clonedElement) => {
        // Ensure background is solid white for printable documents
        clonedElement.style.backgroundColor = '#ffffff';
      }
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF(orientation, 'mm', 'a4');

    const pageWidth = orientation === 'p' ? 210 : 297;
    const pageHeight = orientation === 'p' ? 297 : 210;

    const margin = 8; // 8mm margin
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    if (contentHeight <= pageHeight - margin * 2) {
      pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
    } else {
      // If slightly longer, fit to single page height proportionally so it remains a single clean invoice/card
      const scaledWidth = ((pageHeight - margin * 2) * canvas.width) / canvas.height;
      const centeredX = (pageWidth - scaledWidth) / 2;
      pdf.addImage(imgData, 'PNG', centeredX, margin, scaledWidth, pageHeight - margin * 2);
    }

    pdf.save(fileName);
    return pdf.output('blob');
  } catch (error) {
    console.error('PDF generation error:', error);
    // Fallback: If canvas export ever fails, trigger native browser print/save as PDF
    window.print();
    throw error;
  } finally {
    window.scrollTo(0, originalScrollY);
  }
}
