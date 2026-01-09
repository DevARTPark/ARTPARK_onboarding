import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  LayoutDashboard,
  BarChart3,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { ASSESSMENT_LAPS } from '../components/assessment/assessment_questions';

// --- TYPES ---
type EvaluationBucket = 'GREEN' | 'YELLOW' | 'RED';

interface AssessmentResult {
  totalScore: number;
  dimensionScores: Record<string, number>;
  bucket: EvaluationBucket;
  lowDimensions: string[]; // IDs of dimensions < 10
}

export default function AssessmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE ---
  const [activeLapId, setActiveLapId] = useState<string>(ASSESSMENT_LAPS[0].id);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New State for Results
  const [showResults, setShowResults] = useState(false);
  const [resultData, setResultData] = useState<AssessmentResult | null>(null);

  // --- DERIVED DATA ---
  const activeLap = ASSESSMENT_LAPS.find(l => l.id === activeLapId) || ASSESSMENT_LAPS[0];
  const activeQuestion = activeLap.questions[currentQuestionIndex];
  
  const totalQuestions = useMemo(() => 
    ASSESSMENT_LAPS.reduce((acc, lap) => acc + lap.questions.length, 0), 
  []);
  
  const totalAnswered = Object.keys(answers).length;
  const isComplete = totalAnswered === totalQuestions;

  // --- SCORING LOGIC ---
  const calculateResults = (): AssessmentResult => {
    let totalScore = 0;
    const dimensionScores: Record<string, number> = {};
    const lowDimensions: string[] = [];

    // Calculate scores per lap (dimension)
    ASSESSMENT_LAPS.forEach(lap => {
      let lapScore = 0;
      lap.questions.forEach(q => {
        lapScore += (answers[q.id] || 0);
      });
      
      dimensionScores[lap.id] = lapScore;
      totalScore += lapScore;

      // Check for "Red Flag" dimensions (< 10 points)
      if (lapScore < 10) {
        lowDimensions.push(lap.id);
      }
    });

    // Determine Bucket based on PDF Rules
    // Green: Total >= 75 AND No dimension < 10
    // Red: Total < 60 OR >= 2 dimensions < 10
    // Yellow: Everything else (Score 60-74 OR exactly 1 dimension < 10)
    
    let bucket: EvaluationBucket = 'YELLOW'; 

    if (totalScore < 60 || lowDimensions.length >= 2) {
      bucket = 'RED';
    } else if (totalScore >= 75 && lowDimensions.length === 0) {
      bucket = 'GREEN';
    } else {
      bucket = 'YELLOW';
    }

    return { totalScore, dimensionScores, bucket, lowDimensions };
  };

  // --- HANDLERS ---
  const handleSelectOption = (score: number) => {
    setAnswers(prev => ({ ...prev, [activeQuestion.id]: score }));
  };

  const handleClearAnswer = () => {
    const newAnswers = { ...answers };
    delete newAnswers[activeQuestion.id];
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeLap.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const currentLapIndex = ASSESSMENT_LAPS.findIndex(l => l.id === activeLapId);
      if (currentLapIndex < ASSESSMENT_LAPS.length - 1) {
        const nextLap = ASSESSMENT_LAPS[currentLapIndex + 1];
        setActiveLapId(nextLap.id);
        setCurrentQuestionIndex(0);
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      const currentLapIndex = ASSESSMENT_LAPS.findIndex(l => l.id === activeLapId);
      if (currentLapIndex > 0) {
        const prevLap = ASSESSMENT_LAPS[currentLapIndex - 1];
        setActiveLapId(prevLap.id);
        setCurrentQuestionIndex(prevLap.questions.length - 1);
      }
    }
  };

  const handleLapChange = (lapId: string) => {
    setActiveLapId(lapId);
    const lap = ASSESSMENT_LAPS.find(l => l.id === lapId);
    if (lap) {
      const firstUnanswered = lap.questions.findIndex(q => answers[q.id] === undefined);
      setCurrentQuestionIndex(firstUnanswered !== -1 ? firstUnanswered : 0);
    }
  };

  const handleSubmit = async () => {
    if (!isComplete) return;
    
    setIsSubmitting(true);
    
    // Simulate API processing delay
    setTimeout(() => {
      const results = calculateResults();
      setResultData(results);
      setShowResults(true);
      setIsSubmitting(false);
      console.log("Assessment Results:", results);
    }, 1000);
  };

  const getLapProgress = (lapId: string) => {
    const lap = ASSESSMENT_LAPS.find(l => l.id === lapId);
    if (!lap) return { current: 0, total: 0, isDone: false };
    const answeredCount = lap.questions.filter(q => answers[q.id] !== undefined).length;
    return {
      current: answeredCount,
      total: lap.questions.length,
      isDone: answeredCount === lap.questions.length
    };
  };

  // --- RENDER RESULTS VIEW ---
  if (showResults && resultData) {
    const bucketConfig = {
      GREEN: {
        label: 'High Priority (Green)',
        color: 'text-green-700',
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: CheckCircle,
        desc: 'Indicates strong innovation judgment and balanced capability.'
      },
      YELLOW: {
        label: 'Review Required (Yellow)',
        color: 'text-yellow-700',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: AlertTriangle,
        desc: 'Indicates potential with uneven strengths or gaps.'
      },
      RED: {
        label: 'Not Ready (Red)',
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: XCircle,
        desc: 'Significant gaps detected. Reassessment or major pivot recommended.'
      }
    }[resultData.bucket];

    const BucketIcon = bucketConfig.icon;

    return (
      <div className="min-h-screen bg-gray-50 font-sans p-8 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          
          {/* Result Header */}
          <div className={`${bucketConfig.bg} p-10 border-b ${bucketConfig.border} text-center`}>
            <div className={`mx-auto w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm mb-6 ${bucketConfig.color}`}>
              <BucketIcon className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete</h1>
            <p className={`text-xl font-semibold mb-4 ${bucketConfig.color}`}>
              {bucketConfig.label}
            </p>
            <p className="text-gray-600 max-w-lg mx-auto">{bucketConfig.desc}</p>
            
            <div className="mt-8 inline-flex items-baseline gap-2">
              <span className="text-5xl font-bold text-gray-900">{resultData.totalScore.toFixed(1)}</span>
              <span className="text-gray-500 font-medium text-lg">/ 100</span>
            </div>
          </div>

          {/* Dimension Breakdown */}
          <div className="p-10">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Dimension Breakdown
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              {ASSESSMENT_LAPS.map(lap => {
                const score = resultData.dimensionScores[lap.id] || 0;
                // Highlight dimensions < 10 as per "Red/Yellow" logic
                const isLow = score < 10; 
                
                return (
                  <div key={lap.id} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-gray-700">{lap.title.replace('Lap ', '').split(':')[1]}</span>
                      <span className={`font-bold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                        {score} <span className="text-gray-400 text-sm font-normal">/ 20</span>
                      </span>
                    </div>
                    {/* Bar */}
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-indigo-500'}`} 
                        style={{ width: `${(score / 20) * 100}%` }}
                      />
                    </div>
                    {isLow && (
                      <p className="text-xs text-red-500 mt-2 font-medium">Needs Attention (Score &lt; 10)</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex justify-center">
              <button 
                onClick={() => navigate('/')}
                className="w-full md:w-auto px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Back to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER ASSESSMENT (Standard View) ---
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* --- SIDEBAR: DIMENSIONS --- */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 hidden md:flex">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 text-gray-800 mb-1">
            <LayoutDashboard className="w-6 h-6 text-indigo-600" />
            <h1 className="text-lg font-bold tracking-tight">Innovation Index</h1>
          </div>
          <p className="text-xs text-gray-500 ml-9">ID: {id}</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {ASSESSMENT_LAPS.map((lap) => {
            const { current, total, isDone } = getLapProgress(lap.id);
            const isActive = activeLapId === lap.id;

            return (
              <button
                key={lap.id}
                onClick={() => handleLapChange(lap.id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 border ${
                  isActive 
                    ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' 
                    : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-sm font-semibold ${isActive ? 'text-indigo-900' : 'text-gray-700'}`}>
                    {lap.title}
                  </span>
                  {isDone ? (
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  ) : (
                    <span className="text-xs font-medium text-gray-400">
                      {current}/{total}
                    </span>
                  )}
                </div>
                
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-green-500' : 'bg-indigo-500'}`}
                    style={{ width: `${(current / total) * 100}%` }}
                  />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Global Progress Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between text-sm mb-2 font-medium">
            <span className="text-gray-600">Total Progress</span>
            <span className={isComplete ? "text-green-600" : "text-indigo-600"}>
              {Math.round((totalAnswered / totalQuestions) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
             <div 
               className="h-full bg-green-500 transition-all duration-500 ease-out"
               style={{ width: `${(totalAnswered / totalQuestions) * 100}%` }}
             />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!isComplete || isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2
              ${isComplete 
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Submit Assessment <CheckCircle className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT: QUESTIONS --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{activeLap.title}</h2>
            <p className="text-gray-500 text-sm mt-1">{activeLap.description}</p>
          </div>
          <div className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full text-gray-600">
            Question {currentQuestionIndex + 1} of {activeLap.questions.length}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-medium text-gray-900 leading-normal mb-8">
                {activeQuestion.text}
              </h3>

              <div className="space-y-4">
                {activeQuestion.options.map((option) => {
                  const isSelected = answers[activeQuestion.id] === option.score;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option.score)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 group
                        ${isSelected 
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 shadow-sm' 
                          : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                    >
                      <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                        ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'}`}>
                        {isSelected && <Circle className="w-2.5 h-2.5 fill-white text-white" />}
                      </div>
                      <div className="flex-1">
                        <span className={`text-lg ${isSelected ? 'text-indigo-900 font-medium' : 'text-gray-700'}`}>
                          {option.text}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-8 mb-8">
               {answers[activeQuestion.id] !== undefined && (
                  <button 
                    onClick={handleClearAnswer}
                    className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Clear Answer
                  </button>
               )}
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 p-6">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0 && activeLapId === ASSESSMENT_LAPS[0].id}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Previous
            </button>

            <div className="hidden md:flex gap-1.5">
              {activeLap.questions.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentQuestionIndex 
                      ? 'bg-indigo-600 w-6' 
                      : answers[activeLap.questions[idx].id] !== undefined
                        ? 'bg-green-400' 
                        : 'bg-gray-200'
                  }`} 
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 font-medium shadow-md transition-all hover:translate-x-1"
            >
              {currentQuestionIndex === activeLap.questions.length - 1 && activeLapId === ASSESSMENT_LAPS[ASSESSMENT_LAPS.length - 1].id ? (
                 <span className="opacity-50">End of Survey</span>
              ) : (
                 <>Next <ArrowRight className="w-5 h-5" /></>
              )}
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}