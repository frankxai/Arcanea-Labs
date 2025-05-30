"use client"

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  Download, 
  Play, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Sparkles,
  Loader2,
  Camera,
  Film,
  Type,
  Copy,
  Share,
  Heart,
  MoreHorizontal
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'

interface GenerationResult {
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
  }
}

export default function SoraClone() {
  const [activeTab, setActiveTab] = useState('text-to-image')
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [history, setHistory] = useState<GenerationResult[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: false
  })

  const handleGenerate = async () => {
    if (!prompt.trim() && activeTab !== 'image-to-text') return
    if (activeTab === 'image-to-text' && !uploadedFile) return
    
    setIsGenerating(true)
    setProgress(0)
    setGenerationResult(null)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 300)

    try {
      const formData = new FormData()
      if (uploadedFile) {
        formData.append('image', uploadedFile)
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: activeTab,
          prompt: prompt,
          imageData: uploadedFile ? await fileToBase64(uploadedFile) : null
        })
      })

      const result: GenerationResult = await response.json()
      
      setProgress(100)
      setTimeout(() => {
        setIsGenerating(false)
        setGenerationResult(result)
        if (result.success) {
          setHistory(prev => [result, ...prev.slice(0, 9)]) // Keep last 10 results
        }
      }, 500)

    } catch (error) {
      console.error('Generation failed:', error)
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadResult = () => {
    if (generationResult?.url) {
      const link = document.createElement('a')
      link.href = generationResult.url
      link.download = `arcanea-${activeTab}-${Date.now()}`
      link.click()
    }
  }

  const tabConfig = {
    'text-to-image': {
      title: 'Text to Image',
      icon: ImageIcon,
      description: 'Generate stunning images from text descriptions',
      placeholder: 'A majestic dragon soaring through a sunset sky, digital art style...',
      color: 'from-purple-500 to-pink-500',
      examples: [
        'A cyberpunk cityscape at night with neon lights',
        'A serene mountain lake with aurora borealis',
        'A steampunk airship floating above clouds'
      ]
    },
    'text-to-video': {
      title: 'Text to Video',
      icon: Video,
      description: 'Create dynamic videos from text prompts',
      placeholder: 'A time-lapse of a flower blooming in a magical garden...',
      color: 'from-blue-500 to-cyan-500',
      examples: [
        'Ocean waves crashing on a rocky shore',
        'A cat playing with a ball of yarn',
        'Rain drops falling on a window'
      ]
    },
    'image-to-text': {
      title: 'Image to Text',
      icon: FileText,
      description: 'Extract and analyze text from images',
      placeholder: 'Upload an image to extract text and analyze content...',
      color: 'from-green-500 to-emerald-500',
      examples: [
        'Extract text from documents',
        'Analyze image content',
        'OCR for handwritten text'
      ]
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Arcanea Sora</h1>
                <p className="text-sm text-gray-400">Multimodal AI Creation Studio</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Camera className="w-4 h-4 mr-2" />
                Gallery ({history.length})
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Mode Selection */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/20 border border-white/10">
              {Object.entries(tabConfig).map(([key, config]) => {
                const IconComponent = config.icon
                return (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                    className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400"
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {config.title}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {/* Tab Content */}
            {Object.entries(tabConfig).map(([key, config]) => (
              <TabsContent key={key} value={key} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Header Card */}
                  <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center`}>
                            <config.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-xl">{config.title}</CardTitle>
                            <p className="text-gray-400 text-sm">{config.description}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Panel - Input */}
                    <div className="xl:col-span-2 space-y-6">
                      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center">
                            <Type className="w-5 h-5 mr-2" />
                            Input
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {key === 'image-to-text' ? (
                            <div 
                              {...getRootProps()} 
                              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                                isDragActive 
                                  ? 'border-purple-400 bg-purple-400/10' 
                                  : 'border-white/20 hover:border-white/40'
                              }`}
                            >
                              <input {...getInputProps()} />
                              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-400 mb-4">
                                {isDragActive 
                                  ? 'Drop the image here...' 
                                  : 'Drag & drop an image here, or click to select'
                                }
                              </p>
                              {uploadedFile && (
                                <div className="mt-4 p-3 bg-green-500/20 rounded-lg">
                                  <p className="text-sm text-green-400">
                                    ✓ Uploaded: {uploadedFile.name}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <Textarea
                                placeholder={config.placeholder}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder:text-gray-400 resize-none"
                              />
                              
                              {/* Example Prompts */}
                              <div className="space-y-2">
                                <p className="text-sm text-gray-400">Try these examples:</p>
                                <div className="flex flex-wrap gap-2">
                                  {config.examples.map((example, index) => (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setPrompt(example)}
                                      className="text-xs border-white/20 text-gray-300 hover:bg-white/10"
                                    >
                                      {example}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Generation Controls */}
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <div className="text-sm text-gray-400">
                              {key === 'text-to-video' && '⏱️ Duration: 5-10 seconds'}
                              {key === 'text-to-image' && '🖼️ Resolution: 1024x1024'}
                              {key === 'image-to-text' && '📄 Supports: JPG, PNG, WebP'}
                            </div>
                            <Button 
                              onClick={handleGenerate}
                              disabled={isGenerating || (!prompt.trim() && key !== 'image-to-text') || (key === 'image-to-text' && !uploadedFile)}
                              className={`bg-gradient-to-r ${config.color} hover:opacity-90 text-white border-0 px-6`}
                            >
                              {isGenerating ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4 mr-2" />
                                  Generate
                                </>
                              )}
                            </Button>
                          </div>

                          {/* Progress Bar */}
                          <AnimatePresence>
                            {isGenerating && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3 pt-4"
                              >
                                <Progress value={progress} className="w-full h-2" />
                                <div className="flex justify-between text-xs text-gray-400">
                                  <span>
                                    {progress < 30 && '🔄 Initializing AI models...'}
                                    {progress >= 30 && progress < 60 && '🧠 Processing your request...'}
                                    {progress >= 60 && progress < 90 && '✨ Generating content...'}
                                    {progress >= 90 && '🎯 Finalizing output...'}
                                  </span>
                                  <span>{progress}%</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>

                      {/* Output Section */}
                      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white flex items-center">
                              {key === 'text-to-video' && <Film className="w-5 h-5 mr-2" />}
                              {key === 'text-to-image' && <ImageIcon className="w-5 h-5 mr-2" />}
                              {key === 'image-to-text' && <FileText className="w-5 h-5 mr-2" />}
                              Output
                            </CardTitle>
                            {generationResult && (
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                                  <Heart className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                                  <Share className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-video bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                            {generationResult ? (
                              <div className="w-full h-full">
                                {generationResult.type === 'image' && (
                                  <div className="relative w-full h-full">
                                    <img 
                                      src={generationResult.url} 
                                      alt="Generated content"
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                    <div className="absolute bottom-4 right-4 flex space-x-2">
                                      <Button size="sm" onClick={downloadResult} className="bg-black/50 hover:bg-black/70">
                                        <Download className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                                
                                {generationResult.type === 'video' && (
                                  <div className="relative w-full h-full">
                                    <video 
                                      src={generationResult.url} 
                                      controls
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  </div>
                                )}
                                
                                {generationResult.type === 'text' && (
                                  <div className="p-6 text-left">
                                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                                      <pre className="text-white text-sm whitespace-pre-wrap font-mono">
                                        {generationResult.extractedText}
                                      </pre>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      onClick={() => copyToClipboard(generationResult.extractedText || '')}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Copy className="w-4 h-4 mr-2" />
                                      Copy Text
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <config.icon className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-400">
                                  {isGenerating ? 'Generating your content...' : 'Your generated content will appear here'}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {/* Metadata */}
                          {generationResult?.metadata && (
                            <div className="mt-4 p-3 bg-white/5 rounded-lg">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {Object.entries(generationResult.metadata).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                    <span className="text-white">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right Panel - History & Settings */}
                    <div className="space-y-6">
                      {/* Recent Generations */}
                      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Recent Generations</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {history.length > 0 ? (
                              history.slice(0, 5).map((item, index) => (
                                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                                    {item.type === 'image' && <ImageIcon className="w-6 h-6 text-gray-400" />}
                                    {item.type === 'video' && <Video className="w-6 h-6 text-gray-400" />}
                                    {item.type === 'text' && <FileText className="w-6 h-6 text-gray-400" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm truncate">
                                      {item.prompt || 'Image Analysis'}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                      {item.metadata?.generationTime || item.metadata?.processingTime}
                                    </p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-400 text-sm text-center py-4">
                                No generations yet
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Quick Settings */}
                      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Quality</span>
                            <select className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm">
                              <option value="standard">Standard</option>
                              <option value="high">High</option>
                              <option value="ultra">Ultra</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Style</span>
                            <select className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm">
                              <option value="realistic">Realistic</option>
                              <option value="artistic">Artistic</option>
                              <option value="anime">Anime</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Auto-save</span>
                            <input type="checkbox" className="rounded" defaultChecked />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Powered by Arcanea AI • Built with Next.js & Tailwind CSS
            </p>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                API Docs
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                Support
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

