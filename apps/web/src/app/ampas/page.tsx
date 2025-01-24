'use client';

import html2pdf from 'html2pdf.js';
import { useRef } from 'react';

const TestPage = () => {
  const slideref = useRef(null);

  const handlePdf = async () => {
    if (!slideref.current) {
      alert('Element not found!');
      return;
    }

    const opt = {
      margin: 1,
      filename: 'myfile.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    try {
      await html2pdf().from(slideref.current).set(opt).save();
      alert('PDF has been downloaded!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF!');
    }
  };

  return (
    <>
      <button onClick={handlePdf} >
        Download
      </button>
      <div ref={slideref} >
        <p>asdasd</p>
      </div>
    </>
  );
};

export default TestPage;
