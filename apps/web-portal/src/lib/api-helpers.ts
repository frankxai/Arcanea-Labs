// API Helper Functions for Arcanea Sora

export interface GenerationRequest {
  type: 'text-to-image' | 'text-to-video' | 'image-to-text'
  prompt?: string
  imageData?: string
  options?: {
    quality?: 'draft' | 'standard' | 'high' | 'ultra'
    style?: 'realistic' | 'artistic' | 'anime' | 'cyberpunk' | 'fantasy'
    resolution?: string
    duration?: number
  }
}

export interface GenerationResponse {
  success: boolean
  type: 'image' | 'video' | 'text'
  url?: string
  extractedText?: string
  prompt?: string
  metadata?: {
    resolution?: string
    duration?: string
    model?: string
    generationTime?: string
    confidence?: number
    processingTime?: string
    detectedLanguage?: string
    fileSize?: string
    format?: string
  }
  error?: string
}

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export async function generateContent(request: GenerationRequest): Promise<GenerationResponse> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(
        errorData.error || `HTTP ${response.status}`,
        response.status,
        errorData.code
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    
    // Network or other errors
    throw new APIError(
      'Failed to connect to the server. Please check your internet connection.',
      0
    )
  }
}

export function validatePrompt(prompt: string, type: GenerationRequest['type']): string | null {
  if (!prompt.trim()) {
    return 'Prompt cannot be empty'
  }

  const maxLengths = {
    'text-to-image': 1000,
    'text-to-video': 500,
    'image-to-text': 0 // Not applicable
  }

  const maxLength = maxLengths[type]
  if (maxLength > 0 && prompt.length > maxLength) {
    return `Prompt must be ${maxLength} characters or less`
  }

  // Check for potentially harmful content
  const bannedWords = ['violence', 'explicit', 'nsfw', 'illegal']
  const lowerPrompt = prompt.toLowerCase()
  for (const word of bannedWords) {
    if (lowerPrompt.includes(word)) {
      return 'Prompt contains inappropriate content'
    }
  }

  return null
}

export function validateImageFile(file: File): string | null {
  const maxSize = 20 * 1024 * 1024 // 20MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

  if (file.size > maxSize) {
    return 'File size must be less than 20MB'
  }

  if (!allowedTypes.includes(file.type)) {
    return 'File must be a JPEG, PNG, WebP, or GIF image'
  }

  return null
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  }
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (remainingSeconds === 0) {
    return `${minutes}m`
  }
  
  return `${minutes}m ${remainingSeconds}s`
}

export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

export function shareContent(title: string, text: string, url?: string): void {
  if (navigator.share) {
    navigator.share({
      title,
      text,
      url: url || window.location.href
    }).catch(console.error)
  } else {
    // Fallback: copy to clipboard
    copyToClipboard(`${title}\n${text}\n${url || window.location.href}`)
  }
}

