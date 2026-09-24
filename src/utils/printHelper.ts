/**
 * Robust print helper for browser and iframe environments.
 * Creates an isolated hidden iframe with the cloned styled element to guarantee
 * that printing never prints blank pages or gets blocked by modal overflow / iframe issues.
 */
export function printElement(element: HTMLElement, title: string = 'શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય'): void {
  try {
    // 1. Check if we have an existing print frame and remove it
    const existingFrame = document.getElementById('print-service-iframe');
    if (existingFrame) {
      existingFrame.remove();
    }

    // 2. Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'print-service-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      // Fallback to window.print if iframe doc is inaccessible
      window.print();
      return;
    }

    // 3. Extract all stylesheet links and inline styles from current document
    let stylesHtml = '';
    const styleElements = document.querySelectorAll('style, link[rel="stylesheet"]');
    styleElements.forEach(el => {
      stylesHtml += el.outerHTML;
    });

    // 4. Construct print document HTML with high-quality printing styles
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="gu">
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;500;600;700;800;900&family=Noto+Serif+Gujarati:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
        ${stylesHtml}
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box;
          }
          body {
            background-color: #ffffff !important;
            color: #1c1917 !important;
            margin: 0 !important;
            padding: 10px !important;
            font-family: 'Noto Sans Gujarati', 'Shruti', system-ui, sans-serif !important;
          }
          .no-print {
            display: none !important;
          }
          /* Ensure borders, shadows, backgrounds render crisp */
          #pdf-document-render, #printable-receipt, .printable-card {
            border: 2px solid #b45309 !important;
            box-shadow: none !important;
            margin: 0 auto !important;
            max-width: 100% !important;
            background: #ffffff !important;
          }
        </style>
      </head>
      <body>
        <div class="print-wrapper">
          ${element.outerHTML}
        </div>
      </body>
      </html>
    `);
    doc.close();

    // 5. Wait for images and fonts to load, then trigger print
    const printWindow = iframe.contentWindow;
    if (printWindow) {
      setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
        } catch (e) {
          console.warn('Iframe print failed, falling back to window.print():', e);
          window.print();
        }
      }, 400);
    } else {
      window.print();
    }
  } catch (err) {
    console.error('Print helper error:', err);
    window.print();
  }
}
