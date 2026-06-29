interface CloudinaryWidgetResult {
  event: string
  info?: { public_id: string; secure_url: string }
}

interface CloudinaryWidget {
  createUploadWidget: (
    options: Record<string, unknown>,
    callback: (error: unknown, result: CloudinaryWidgetResult) => void
  ) => { open: () => void }
}

declare global {
  interface Window {
    cloudinary?: CloudinaryWidget
  }
}

export {}
