'use client'

import NICValidator from "@/components/nic-validator"
import Script from 'next/script'

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Sri Lankan NIC Analyzer",
    "description": "Analyze Sri Lankan National Identity Card numbers to determine birth date, age, and gender",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Birth date calculation",
      "Gender determination",
      "Age calculation",
      "Support for both old and new NIC formats"
    ]
  };

  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NICValidator />
    </>
  )
}