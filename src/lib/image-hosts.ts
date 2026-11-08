export const IMAGE_HOSTS = [
  "utfs.io",
  "*.ufs.sh",
  "uploadthing.com",
  "*.uploadthing.com",
  "images.unsplash.com",
  "placehold.co",
]

export function isAllowedImageHost(url: string): boolean {
  let host: string
  try {
    host = new URL(url).hostname
  } catch {
    return false
  }
  return IMAGE_HOSTS.some((pattern) =>
    pattern.startsWith("*.") ? host.endsWith(pattern.slice(1)) : host === pattern,
  )
}
