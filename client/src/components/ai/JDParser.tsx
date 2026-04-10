import React, { useState } from 'react'
import { aiAPI, ParsedJobDescription } from '../../lib/api'
import { ResumeBulletsGenerator } from './ResumeBulletsGenerator'
import { Wand2, Loader } from 'lucide-react'

interface JDParserProps {
  onParse: (parsed: ParsedJobDescription) => void
  onError?: (error: string) => void
}

export const JDParser: React.FC<JDParserProps> = ({ onParse, onError }) => {
  const [jdText, setJdText] = useState('')
  const [loading, setLoading] = useState(false)
  const [showParser, setShowParser] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedJobDescription | null>(null)

  const handleParse = async () => {
    if (!jdText.trim()) {
      onError?.('Please paste a job description')
      return
    }

    setLoading(true)
    try {
      const response = await aiAPI.parseJobDescription(jdText)
      setParsedData(response.data)
      onParse(response.data)
      setJdText('')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse job description'
      onError?.(errorMessage)
      console.error('Error parsing JD:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUseSuggestions = () => {
    if (parsedData) {
      setParsedData(null)
      setShowParser(false)
    }
  }

  if (!showParser) {
    return (
      <button
        onClick={() => setShowParser(true)}
        className="w-full flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
      >
        <Wand2 size={18} />
        Use AI to Parse Job Description
      </button>
    )
  }

  if (parsedData) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
          <h3 className="font-semibold text-slate-900 mb-2">✅ Job Description Parsed Successfully!</h3>
          <div className="text-sm text-slate-700 space-y-1">
            <p><strong>Company:</strong> {parsedData.companyName || 'Not found'}</p>
            <p><strong>Position:</strong> {parsedData.position || 'Not found'}</p>
            {parsedData.seniority && <p><strong>Level:</strong> {parsedData.seniority}</p>}
            {parsedData.location && <p><strong>Location:</strong> {parsedData.location}</p>}
          </div>
          <button
            onClick={handleUseSuggestions}
            className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
          >
            Use This Data
          </button>
        </div>

        <ResumeBulletsGenerator
          position={parsedData.position || 'Unknown Position'}
          companyName={parsedData.companyName || 'Unknown Company'}
          responsibilities={parsedData.keyResponsibilities || []}
          skills={parsedData.requiredSkills || []}
          autoGenerate={true}
        />
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-slate-900">AI Job Description Parser</h3>
        <button
          onClick={() => setShowParser(false)}
          className="text-slate-500 hover:text-slate-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Paste the full job description below:
          </label>
          <textarea
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            placeholder="Copy and paste the complete job description here. The AI will extract company name, position, location, seniority, salary, skills, and responsibilities..."
            className="w-full h-40 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            disabled={loading}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleParse}
            disabled={loading || !jdText.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 text-white rounded-lg font-semibold transition-colors"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Parsing...
              </>
            ) : (
              <>
                <Wand2 size={18} />
                Parse with AI
              </>
            )}
          </button>
          <button
            onClick={() => setShowParser(false)}
            disabled={loading}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default JDParser
