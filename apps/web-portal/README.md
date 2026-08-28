# Arcanea Sora - Multimodal AI Creation Studio

A sleek, modern web interface for multimodal AI content generation, inspired by OpenAI's Sora. This application provides three powerful AI capabilities in one unified interface:

## 🚀 Features

### 🎨 Text-to-Image Generation
- Generate stunning images from text descriptions
- High-quality 1024x1024 resolution output
- Multiple artistic styles (Realistic, Artistic, Anime)
- Real-time generation progress tracking

### 🎬 Text-to-Video Generation
- Create dynamic videos from text prompts
- 5-10 second video clips
- HD quality output (1280x720)
- Smooth animation and transitions

### 📄 Image-to-Text Analysis
- Extract text from uploaded images (OCR)
- Analyze image content and context
- Support for multiple image formats (JPG, PNG, WebP)
- High accuracy text recognition

## 🛠️ Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Radix UI primitives
- **File Handling**: React Dropzone
- **Icons**: Lucide React

## 🎯 Key Features

- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Theme**: Beautiful gradient background with glassmorphism effects
- **Real-time Progress**: Live progress tracking during generation
- **Generation History**: Keep track of recent creations
- **Drag & Drop**: Easy file upload with drag and drop support
- **Export Options**: Download generated content
- **Settings Panel**: Customize quality, style, and preferences

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/generate/          # API routes for AI generation
│   ├── globals.css           # Global styles and CSS variables
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Main application page
├── components/ui/            # Reusable UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── progress.tsx
│   ├── tabs.tsx
│   └── textarea.tsx
└── lib/
    └── utils.ts              # Utility functions
```

## 🎨 Design Features

- **Gradient Backgrounds**: Beautiful purple-to-slate gradients
- **Glassmorphism**: Backdrop blur effects for modern aesthetics
- **Smooth Animations**: Framer Motion powered transitions
- **Interactive Elements**: Hover effects and micro-interactions
- **Accessibility**: ARIA compliant components

## 🔧 API Integration

The application includes a mock API structure that can be easily connected to real AI services:

- `/api/generate` - Main generation endpoint
- Supports all three generation types
- Returns structured responses with metadata
- Error handling and validation

## 🎯 Usage Examples

### Text-to-Image
```
"A majestic dragon soaring through a sunset sky, digital art style"
```

### Text-to-Video
```
"A time-lapse of a flower blooming in a magical garden"
```

### Image-to-Text
Simply drag and drop an image containing text to extract and analyze it.

## 🚀 Deployment

This is a Next.js application that can be deployed to:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is part of the Arcanea Labs ecosystem.

---

Built with ❤️ by the Arcanea team

