'use client'
import React, { useEffect, useRef } from 'react'
import * as LR from '@uploadcare/blocks'
import { useRouter } from 'next/navigation'

type Props = {
  onUpload: (e: string) => any
}

LR.registerBlocks(LR)

const UploadCareButton = ({ onUpload }: Props) => {
  const router = useRouter()
  const ctxProviderRef = useRef<
    typeof LR.UploadCtxProvider.prototype & LR.UploadCtxProvider
  >(null)

  useEffect(() => {
    const handleUpload = async (e: any) => {
      const file = await onUpload(e.detail.cdnUrl)
      if (file) {
        router.refresh()
      }
    }

    const currentCtxProvider = ctxProviderRef.current

    if (currentCtxProvider) {
      currentCtxProvider.addEventListener('file-upload-success', handleUpload)
    }

    return () => {
      if (currentCtxProvider) {
        currentCtxProvider.removeEventListener('file-upload-success', handleUpload)
      }
    }
  }, [onUpload, router])

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <lr-config
              ctx-name="my-uploader"
              pubkey="055f6d6766366f23d470"
            ></lr-config>
            <lr-file-uploader-regular
              ctx-name="my-uploader"
              css-src="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.35.2/web/lr-file-uploader-regular.min.css"
            ></lr-file-uploader-regular>
            <lr-upload-ctx-provider
              ctx-name="my-uploader"
              ref="${ctxProviderRef.current}"
            ></lr-upload-ctx-provider>
          `
        }}
      />
    </div>
  )
}

export default UploadCareButton
