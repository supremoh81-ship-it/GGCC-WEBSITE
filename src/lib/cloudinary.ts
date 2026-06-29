import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

export async function generateSignedUploadParams(folder: string) {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
  // The Cloudinary Upload Widget appends source=uw to every signed upload request,
  // so it must be included here or the widget's own signature check will fail.
  const paramsToSign: Record<string, string | number> = { timestamp, folder, source: 'uw' }
  if (uploadPreset) paramsToSign.upload_preset = uploadPreset

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  )
  return {
    timestamp,
    signature,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    uploadPreset,
    folder,
  }
}

export async function deleteCloudinaryAsset(publicId: string) {
  return cloudinary.uploader.destroy(publicId)
}
