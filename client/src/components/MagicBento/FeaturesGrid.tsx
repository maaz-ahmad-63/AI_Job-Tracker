import { MagicBento, BentoCardProps } from './MagicBento'
import { 
  Zap, 
  Brain, 
  BarChart3, 
  Shield, 
  Maximize2, 
  AlertCircle 
} from 'lucide-react'

interface FeaturesGridProps {
  className?: string;
}

export const FeaturesGrid: React.FC<FeaturesGridProps> = ({ className = '' }) => {
  const featureCards: BentoCardProps[] = [
    {
      icon: <Brain className="w-6 h-6 text-blue-400" />,
      title: 'AI Job Parser',
      description: 'Automatically extract company, position, skills, and salary from job descriptions in seconds.',
      label: 'AI Powered',
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: 'Smart Resume Builder',
      description: 'Generate tailored resume bullet points matching job requirements using AI.',
      label: 'Optimization',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-green-400" />,
      title: 'Track Progress',
      description: 'Visualize your job search with comprehensive statistics and status tracking.',
      label: 'Analytics',
    },
    {
      icon: <Maximize2 className="w-6 h-6 text-purple-400" />,
      title: 'Drag & Drop Board',
      description: 'Organize applications on an interactive Kanban board by status.',
      label: 'Organization',
    },
    {
      icon: <Shield className="w-6 h-6 text-red-400" />,
      title: 'Secure & Private',
      description: 'Your job search data is protected with enterprise-grade security and encryption.',
      label: 'Security',
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-orange-400" />,
      title: 'Never Forget',
      description: 'Store all your applications in one place with notes and links for easy reference.',
      label: 'Database',
    },
  ]

  return (
    <div className={`w-full ${className}`}>
      <style>{`
        .features-gradient {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 41, 59, 0.5) 100%);
        }
      `}</style>
      <div className="features-gradient rounded-2xl p-2 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Powerful Features</h2>
          <p className="text-gray-300">Everything you need to master your job search</p>
        </div>
        <MagicBento
          cards={featureCards}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          enableStars={true}
          clickEffect={true}
          particleCount={10}
          spotlightRadius={300}
          glowColor="59, 130, 246"
          className="bg-transparent"
        />
      </div>
    </div>
  )
}
