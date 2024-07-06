'use client'
import React, { useEffect, useRef, useCallback } from 'react'
import * as LR from '@uploadcare/blocks'
import { useRouter } from 'next/navigation'

type Props = {
  onUpload: (e: string) => any
}

LR.registerBlocks(LR)

const UploadCareButton = ({ onUpload }: Props) => {
  const router = useRouter()
  const ctxProviderRef = useRef<HTMLDivElement>(null)

  const handleUpload = useCallback(async (e: CustomEvent) => {
    const file = await onUpload(e.detail.cdnUrl)
    if (file) {
      router.refresh()
    }
  }, [onUpload, router])

  useEffect(() => {
    const addEventListener = () => {
      const ctxProviderElement = ctxProviderRef.current?.querySelector('lr-upload-ctx-provider')
      if (ctxProviderElement) {
        console.log('Adding event listener')
        // ctxProviderElement.addEventListener('file-upload-success', handleUpload)
      } else {
        console.log('ctxProviderElement not found')
      }
    }

    const removeEventListener = () => {
      const ctxProviderElement = ctxProviderRef.current?.querySelector('lr-upload-ctx-provider')
      if (ctxProviderElement) {
        console.log('Removing event listener')
        // ctxProviderElement.removeEventListener('file-upload-success', handleUpload)
      } else {
        console.log('ctxProviderElement not found during cleanup')
      }
    }

    addEventListener()

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          removeEventListener()
          addEventListener()
        }
      }
    })

    if (ctxProviderRef.current) {
      observer.observe(ctxProviderRef.current, { childList: true, subtree: true })
    }

    return () => {
      removeEventListener()
      observer.disconnect()
    }
  }, [handleUpload])

  return (
    <div
      ref={ctxProviderRef}
      dangerouslySetInnerHTML={{
        __html: `
          <lr-config
            ctx-name="my-uploader"
            pubkey="055f6d6766366f23d470"
            max-local-file-size-bytes="10000000"
            img-only="true"
            source-list="local, url, camera, dropbox, gdrive"
          ></lr-config>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.48.0/web/lr-file-uploader-regular.min.css"
          />
          <lr-file-uploader-regular
            ctx-name="my-uploader"
            class="my-config uc-dark"
          ></lr-file-uploader-regular>
          <lr-upload-ctx-provider
            ctx-name="my-uploader"
          ></lr-upload-ctx-provider>
        `
      }}
    />
  )
}

export default UploadCareButton
