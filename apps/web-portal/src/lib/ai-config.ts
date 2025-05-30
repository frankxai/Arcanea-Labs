// AI Service Configuration for Arcanea Sora

export const AI_MODELS = {
  textToImage: {
    primary: 'dall-e-3',
    fallback: 'stable-diffusion-xl',
    options: {
      'dall-e-3': {
        provider: 'openai',
        maxResolution: '1024x1024',
        styles: ['natural', 'vivid'],
        quality: ['standard', 'hd']
      },
      'stable-diffusion-xl': {
        provider: 'stability',
        maxResolution: '1024x1024',
        styles: ['photographic', 'digital-art', 'comic-book', 'fantasy-art', 'line-art', 'analog-film', 'neon-punk', 'isometric'],
        quality: ['draft', 'standard', 'high']
      }
    }
  },
  textToVideo: {
    primary: 'sora-preview',
    fallback: 'runway-gen2',
    options: {
      'sora-preview': {
        provider: 'openai',
        maxDuration: 60,
        resolutions: ['1920x1080', '1280x720'],
        frameRates: [24, 30]
      },
      'runway-gen2': {
        provider: 'runway',
        maxDuration: 10,
        resolutions: ['1280x720', '512x512'],
        frameRates: [24]
      }
    }
  },
  imageToText: {
    primary: 'gpt-4-vision',
    fallback: 'google-vision',
    options: {
      'gpt-4-vision': {
        provider: 'openai',
        maxFileSize: '20MB',
        supportedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        features: ['ocr', 'description', 'analysis']
      },
      'google-vision': {
        provider: 'google',
        maxFileSize: '10MB',
        supportedFormats: ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'pdf'],
        features: ['ocr', 'object-detection', 'text-detection']
      }
    }
  }
}

export const GENERATION_LIMITS = {
  textToImage: {
    maxPromptLength: 1000,
    maxGenerationsPerHour: 50,
    maxGenerationsPerDay: 200
  },
  textToVideo: {
    maxPromptLength: 500,
    maxGenerationsPerHour: 10,
    maxGenerationsPerDay: 30
  },
  imageToText: {
    maxFileSize: 20 * 1024 * 1024, // 20MB
    maxUploadsPerHour: 100,
    maxUploadsPerDay: 500
  }
}

export const QUALITY_PRESETS = {
  draft: {
    name: 'Draft',
    description: 'Fast generation, lower quality',
    multiplier: 0.5
  },
  standard: {
    name: 'Standard',
    description: 'Balanced speed and quality',
    multiplier: 1.0
  },
  high: {
    name: 'High',
    description: 'Slower generation, higher quality',
    multiplier: 1.5
  },
  ultra: {
    name: 'Ultra',
    description: 'Slowest generation, best quality',
    multiplier: 2.0
  }
}

export const STYLE_PRESETS = {
  realistic: {
    name: 'Realistic',
    description: 'Photorealistic style',
    prompt_suffix: ', photorealistic, high detail, professional photography'
  },
  artistic: {
    name: 'Artistic',
    description: 'Artistic and creative style',
    prompt_suffix: ', artistic, creative, beautiful composition, trending on artstation'
  },
  anime: {
    name: 'Anime',
    description: 'Anime and manga style',
    prompt_suffix: ', anime style, manga, cel shading, vibrant colors'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    description: 'Futuristic cyberpunk aesthetic',
    prompt_suffix: ', cyberpunk, neon lights, futuristic, dark atmosphere'
  },
  fantasy: {
    name: 'Fantasy',
    description: 'Fantasy and magical themes',
    prompt_suffix: ', fantasy art, magical, ethereal, mystical atmosphere'
  }
}

