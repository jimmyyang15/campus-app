
import React from 'react'
import PdfDocument from '@/app/_components/certificate/pdf-document'
import { pdf } from '@react-pdf/renderer'
import CertificateComponent from '@/app/_components/certificate/certificate-component'
const CertificatePage = () => {
  
  return (
    <div>
      <CertificateComponent />
    </div>
  )
}

export default CertificatePage