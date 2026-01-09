// src/utils/assessmentScoring.ts
import { ASSESSMENT_LAPS } from '../components/assessment/assessment_questions';
import { AssessmentBucket } from '../store/useApplicationStore';

export interface AssessmentCalculation {
  dimensionScores: Record<string, number>;
  totalScore: number;
  bucket: AssessmentBucket;
}

export const calculateAssessmentScore = (answers: Record<string, number>): AssessmentCalculation => {
  let totalScore = 0;
  const dimensionScores: Record<string, number> = {};
  let dimensionsBelow10 = 0;

  // 1. Calculate Score per Dimension (Lap)
  ASSESSMENT_LAPS.forEach((lap) => {
    let lapScore = 0;
    lap.questions.forEach((q) => {
      // Add the score if the question was answered, otherwise 0
      lapScore += answers[q.id] || 0;
    });

    dimensionScores[lap.id] = lapScore;
    totalScore += lapScore;

    if (lapScore < 10) {
      dimensionsBelow10++;
    }
  });

  // 2. Determine Bucket based on Rules
  // Rules derived from PDF Page 1:
  // Red: Total < 60 OR 2+ dimensions < 10 [cite: 301, 302, 303]
  // Green: Total >= 75 AND 0 dimensions < 10 [cite: 293, 294, 295]
  // Yellow: Total 60-74 OR exactly 1 dimension < 10 [cite: 297, 298, 299]

  let bucket: AssessmentBucket = 'Yellow'; // Default fallback

  if (totalScore < 60 || dimensionsBelow10 >= 2) {
    bucket = 'Red';
  } else if (totalScore >= 75 && dimensionsBelow10 === 0) {
    bucket = 'Green';
  } else {
    // This covers the 60-74 range and the "exactly one dimension below 10" case
    bucket = 'Yellow';
  }

  return { dimensionScores, totalScore, bucket };
};