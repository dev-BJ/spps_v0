// Performance prediction algorithm
export interface StudentData {
  currentGPA: number
  attendance: number
  assignmentCompletion: number
  participation: number
  previousGrades: number[]
  behaviorScore: number
}

export interface PredictionResult {
  predictedGPA: number
  confidence: number
  riskLevel: "low" | "medium" | "high"
  factors: string[]
  recommendations: string[]
}

export function predictStudentPerformance(data: StudentData): PredictionResult {
  // Weighted factors for prediction
  const weights = {
    currentGPA: 0.35,
    attendance: 0.2,
    assignmentCompletion: 0.2,
    participation: 0.15,
    behaviorScore: 0.1,
  }

  // Calculate trend from previous grades
  const trend = calculateTrend(data.previousGrades)

  // Base prediction using weighted average
  let predictedGPA =
    data.currentGPA * weights.currentGPA +
    (data.attendance / 100) * 4.0 * weights.attendance +
    (data.assignmentCompletion / 100) * 4.0 * weights.assignmentCompletion +
    (data.participation / 100) * 4.0 * weights.participation +
    (data.behaviorScore / 100) * 4.0 * weights.behaviorScore

  // Apply trend adjustment
  predictedGPA += trend * 0.1

  // Ensure GPA stays within valid range
  predictedGPA = Math.max(0, Math.min(4.0, predictedGPA))

  // Calculate confidence based on data consistency
  const confidence = calculateConfidence(data)

  // Determine risk level
  const riskLevel = determineRiskLevel(predictedGPA, data)

  // Generate factors and recommendations
  const factors = identifyKeyFactors(data)
  const recommendations = generateRecommendations(data, riskLevel)

  return {
    predictedGPA: Math.round(predictedGPA * 100) / 100,
    confidence,
    riskLevel,
    factors,
    recommendations,
  }
}

function calculateTrend(grades: number[]): number {
  if (grades.length < 2) return 0

  const recent = grades.slice(-3) // Last 3 grades
  const earlier = grades.slice(0, -3) || grades.slice(0, 1)

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
  const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length

  return recentAvg - earlierAvg
}

function calculateConfidence(data: StudentData): number {
  let confidence = 85 // Base confidence

  // Reduce confidence for inconsistent data
  if (data.attendance < 80) confidence -= 10
  if (data.assignmentCompletion < 70) confidence -= 10
  if (data.previousGrades.length < 5) confidence -= 5

  // Increase confidence for consistent high performance
  if (data.currentGPA > 3.5 && data.attendance > 90) confidence += 5

  return Math.max(60, Math.min(95, confidence))
}

function determineRiskLevel(predictedGPA: number, data: StudentData): "low" | "medium" | "high" {
  if (predictedGPA < 2.0 || data.attendance < 75) return "high"
  if (predictedGPA < 2.5 || data.attendance < 85) return "medium"
  return "low"
}

function identifyKeyFactors(data: StudentData): string[] {
  const factors: string[] = []

  if (data.attendance < 85) factors.push("Low attendance rate")
  if (data.assignmentCompletion < 80) factors.push("Incomplete assignments")
  if (data.participation < 70) factors.push("Limited class participation")
  if (data.currentGPA < 2.5) factors.push("Below-average current GPA")
  if (data.behaviorScore < 75) factors.push("Behavioral concerns")

  if (factors.length === 0) factors.push("Strong overall performance")

  return factors
}

function generateRecommendations(data: StudentData, riskLevel: string): string[] {
  const recommendations: string[] = []

  if (riskLevel === "high") {
    recommendations.push("Schedule immediate intervention meeting")
    recommendations.push("Assign academic mentor or tutor")
    recommendations.push("Develop personalized learning plan")
  }

  if (data.attendance < 85) {
    recommendations.push("Address attendance issues with family")
    recommendations.push("Identify barriers to regular attendance")
  }

  if (data.assignmentCompletion < 80) {
    recommendations.push("Implement assignment tracking system")
    recommendations.push("Provide additional homework support")
  }

  if (data.participation < 70) {
    recommendations.push("Encourage active class participation")
    recommendations.push("Consider alternative engagement strategies")
  }

  if (recommendations.length === 0) {
    recommendations.push("Continue current successful strategies")
    recommendations.push("Consider advanced placement opportunities")
  }

  return recommendations
}
