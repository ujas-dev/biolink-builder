import { Link } from 'react-router-dom'
import { useAuth } from '@/components/auth/AuthProvider'
import LoginForm from '@/components/auth/LoginForm'
import { Sparkles, Zap, Palette, BarChart3 } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()

  if (user) {
    return <Link to="/dashboard">Go to Dashboard</Link>
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Your Link in Bio,
              <br />
              <span className="text-yellow-300">Supercharged</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-primary-100 max-w-3xl mx-auto">
              Create stunning bio link pages with RSS feeds, multiple layouts, and
              unlimited customization. All free, forever.
            </p>
            <a
              href="#signup"
              className="inline-block px-8 py-4 bg-white text-primary-600 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Get Started Free
            </a>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 80C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            Everything You Need, Nothing You Don't
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Sparkles className="h-12 w-12 text-primary-600" />}
              title="RSS Feed Integration"
              description="Auto-sync content from YouTube, blogs, podcasts, and Shopify stores"
            />
            <FeatureCard
              icon={<Palette className="h-12 w-12 text-purple-600" />}
              title="Multiple Layouts"
              description="Grid, timeline, carousel, bento, and list layouts for any style"
            />
            <FeatureCard
              icon={<Zap className="h-12 w-12 text-yellow-600" />}
              title="Custom Themes"
              description="20+ pre-built themes or inject your own CSS for total control"
            />
            <FeatureCard
              icon={<BarChart3 className="h-12 w-12 text-green-600" />}
              title="Analytics Built-In"
              description="Track clicks, views, and performance without external tools"
            />
          </div>
        </div>
      </div>

      {/* Signup Section */}
      <div id="signup" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Start Building Your Bio Link
          </h2>
          <LoginForm />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            Built with React, Supabase, and hosted on GitHub Pages
          </p>
          <p className="text-gray-500 mt-2">
            © 2025 BioLink Builder. Open source and free forever.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
