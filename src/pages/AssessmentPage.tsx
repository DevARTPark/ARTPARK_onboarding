// src/pages/AssessmentPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Flag, Timer } from 'lucide-react';
import { ASSESSMENT_LAPS } from '../components/assessment/assessment_questions';

export default function AssessmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [hasStarted, setHasStarted] = useState(false);
  const [currentLapIndex, setCurrentLapIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isLapTransition, setIsLapTransition] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Derived
  const currentLap = ASSESSMENT_LAPS[currentLapIndex];
  const currentQuestion = currentLap?.questions[currentQuestionIndex];
  const totalLaps = ASSESSMENT_LAPS.length;

  // Handlers
  const handleAnswer = (questionId: string, score: number) => {
    // 1. Save Answer
    setAnswers(prev => ({ ...prev, [questionId]: score }));

    // 2. Logic to move next
    if (currentQuestionIndex < currentLap.questions.length - 1) {
      // Next Question in same Lap
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Lap Finished
      if (currentLapIndex < totalLaps - 1) {
        setIsLapTransition(true);
      } else {
        finishAssessment();
      }
    }
  };

  const nextLap = () => {
    setIsLapTransition(false);
    setCurrentLapIndex(prev => prev + 1);
    setCurrentQuestionIndex(0);
  };

  const finishAssessment = () => {
    setIsFinished(true);
    // TODO: Send 'answers' to backend API here
    console.log("Final Scores:", answers);
  };

  // --- RENDER: WELCOME SCREEN ---
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Timer className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Innovation Index Assessment</h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            This assessment consists of <strong>{totalLaps} Laps</strong> (Dimensions). 
            You will answer a series of scenarios to help us understand your innovation style.
          </p>
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-8 text-sm">
            <strong>ID:</strong> {id} • Estimated time: 15 mins
          </div>
          <button 
            onClick={() => setHasStarted(true)}
            className="w-full py-4 bg-gray-900 text-white text-lg font-bold rounded-xl hover:bg-gray-800 transition-all"
          >
            Start Engine
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: FINISHED SCREEN ---
  if (isFinished) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessment Complete!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for completing the assessment. Your team's data has been synced.
          </p>
          <button 
             onClick={() => navigate('/')} // Or wherever you want them to go
             className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: LAP TRANSITION SCREEN ---
  if (isLapTransition) {
    const nextLapData = ASSESSMENT_LAPS[currentLapIndex + 1];
    return (
      <div className="min-h-screen bg-indigo-900 flex items-center justify-center p-6 text-white">
        <div className="max-w-xl w-full text-center">
          <div className="mb-6 inline-flex p-4 bg-white/10 rounded-full">
            <Flag className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Lap {currentLapIndex + 1} Complete!</h2>
          <p className="text-indigo-200 text-lg mb-8">Next up: {nextLapData.title}</p>
          
          <div className="bg-white/10 p-6 rounded-xl mb-8 backdrop-blur-sm">
            <h3 className="font-semibold text-white mb-2">{nextLapData.title}</h3>
            <p className="text-indigo-200 text-sm">{nextLapData.description}</p>
          </div>

          <button 
            onClick={nextLap}
            className="px-8 py-3 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 mx-auto"
          >
            Start Next Lap <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: QUESTION SCREEN ---
  const progressPercent = ((currentQuestionIndex + 1) / currentLap.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header / Progress */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              {currentLap.title}
            </span>
            <span className="text-sm text-gray-400">
              Q{currentQuestionIndex + 1} of {currentLap.questions.length}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl w-full">
          {/* Question Text */}
          <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-10 leading-tight">
            {currentQuestion.text}
          </h2>

          {/* Options Grid */}
          <div className="grid gap-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(currentQuestion.id, option.score)}
                className="group text-left p-6 bg-white border border-gray-200 rounded-xl hover:border-orange-500 hover:ring-1 hover:ring-orange-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                    {option.id}
                  </div>
                  <span className="text-lg text-gray-700 group-hover:text-gray-900">
                    {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}