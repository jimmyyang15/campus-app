"use client"

import React from 'react'
import PdfDocument from '@/app/_components/certificate/pdf-document'
import { pdf } from '@react-pdf/renderer'
const CertificatePage = () => {
    const handleGenerate = async () => {
		const blob = await pdf(<PdfDocument  />).toBlob()
		const url = URL.createObjectURL(blob)
		window.open(url, "_blank")
	}
  return (
    <div>
        <button onClick={handleGenerate}>Generate certificate</button>
    </div>
  )
}

export default CertificatePage