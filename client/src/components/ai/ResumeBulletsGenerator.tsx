import React, { useState } from 'react'
import { aiAPI, ResumeBullets } from '../../lib/api'
import { Wand2, Loader, Copy, Check } from 'lucide-react'

interface ResumeBulletsGeneratorProps {
  position: string
  companyName: string
  responsibilities: string[]
  skills: string[]
  autoGenerate?: boolean
}

export const ResumeBulletsGenerator: React.FC<ResumeBulletsGeneratorProps> = ({
  position,
  companyName,
  responsibilities,
  skills,
  autoGenerate = false,
}) => {
  const [bullets, setBullets] = useState<ResumeBullets | null>(null)
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    if (autoGenerate && !bullets && !loading) {
      handleGenerate()
    }
  }, [autoGenerate, bullets, loading])

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await aiAPI.generateResumeBullets(position, companyName, responsibilities, skills)
      setBullets(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate resume bullets'
      setError(errorMessage)
      console.error('Error generating bullets:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyBullet = (bullet: string, index: number) => {
    navigator.clipboard.writeText(bullet)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleCopyAll = () => {
    if (bullets) {
      const text = bullets.bullets.map(b => `• ${b}`).join('\n')
      navigator.clipboard.writeText(text)
      setCopiedIndex(-1)
      setTimeout(() => setCopiedIndex(null), 2000)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border-2 border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-900">📝 Resume Bullet Points</h3>
        {bullets && (
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            {copiedIndex === -1 ? (
              <>
                <Check size={14} className="text-green-600" />
                Copied All!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy All
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-3 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {bullets ? (
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-slate-900 mb-2">💡 Suggested Bullets:</h4>
            <ul className="space-y-2">
              {bullets.bullets.map((bullet, idx) => (
                <li key={idx} className="text-sm text-slate-700 p-3 bg-white border-l-4 border-blue-400 rounded flex justify-between items-start gap-2 hover:bg-slate-50 transition-colors">
                  <span className="flex-1">{bullet}</span>
                  <button
                    onClick={() => handleCopyBullet(bullet, idx)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 border border-blue-300 text-blue-600 rounded hover:bg-blue-100 transition-colors whitespace-nowrap"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check size={12} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        Copy
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {bullets.tips.length > 0 && (
            <div>
              <h4 className="font-medium text-slate-900 mb-2">✨ Tips:</h4>
              <ul className="space-y-1">
                {bullets.tips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-slate-600">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleGenerate}
            className="w-full text-sm px-3 py-2 border border-blue-300 text-blue-600 hover:bg-blue-50 rounded transition-colors font-medium"
          >
            Regenerate
          </button>
        </div>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-semibold transition-colors"
        >
          {loading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Generating Bullets...
            </>
          ) : (
            <>
              <Wand2 size={18} />
              Generate Resume Bullets
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default ResumeBulletsGenerator
