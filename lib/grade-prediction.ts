// AI-powered grade prediction system
export interface GradePredictionData {
  currentGPA: number
  assignments: Assignment[]
  attendance: number
  participationScore: number
  studyHours: number
  previousGrades: number[]
  subjectDifficulty: number
  timeToFinals: number // weeks
  upcomingAssignments: UpcomingAssignment[]
}

export interface Assignment {
  score: number
  maxScore: number
  weight: number
  type: string
  date: string
  difficulty: number
}

export interface UpcomingAssignment {
  name: string
  weight: number
  type: string
  difficulty: number
  dueDate: string
  estimatedScore?: number
}

export interface PredictionResult {
  predictedFinalGrade: number
  confidence: number
  letterGrade: string
  probabilityDistribution: {
    "A+": number
    A: number
    "A-": number
    "B+": number
    B: number
    "B-": number
    "C+": number
    C: number
    "C-": number
    D: number
    F: number
  }
  trendAnalysis: {
    direction: "improving" | "declining" | "stable"
    strength: number // 0-1
    keyFactors: string[]
  }
  scenarios: {
    optimistic: number
    realistic: number
    pessimistic: number
  }
  recommendations: Recommendation[]
  riskFactors: string[]
  milestones: Milestone[]
}

export interface Recommendation {
  type: "study" | "attendance" | "assignment" | "participation"
  priority: "high" | "medium" | "low"
  action: string
  impact: number // expected grade improvement
  timeframe: string
}

export interface Milestone {
  assignment: string
  requiredScore: number
  impact: string
  date: string
}

export class GradePredictionEngine {
  // Weights for different factors in prediction
  private static readonly WEIGHTS = {
    currentPerformance: 0.35,
    trendAnalysis: 0.25,
    attendance: 0.15,
    participation: 0.1,
    studyHabits: 0.1,
    assignmentDifficulty: 0.05,
  }

  static predictGrade(data: GradePredictionData): PredictionResult {
    // Calculate current performance metrics
    const currentPerformance = this.calculateCurrentPerformance(data)
    const trendAnalysis = this.analyzeTrend(data.previousGrades, data.assignments)
    const attendanceImpact = this.calculateAttendanceImpact(data.attendance)
    const participationImpact = this.calculateParticipationImpact(data.participationScore)
    const studyHabitsImpact = this.calculateStudyHabitsImpact(data.studyHours)

    // Predict upcoming assignment performance
    const upcomingPerformance = this.predictUpcomingAssignments(data)

    // Calculate weighted prediction
    const basePrediction =
      currentPerformance * this.WEIGHTS.currentPerformance +
      trendAnalysis.score * this.WEIGHTS.trendAnalysis +
      attendanceImpact * this.WEIGHTS.attendance +
      participationImpact * this.WEIGHTS.participation +
      studyHabitsImpact * this.WEIGHTS.studyHabits +
      upcomingPerformance.averageScore * this.WEIGHTS.assignmentDifficulty

    // Apply trend momentum
    const trendMomentum = this.calculateTrendMomentum(trendAnalysis, data.timeToFinals)
    const predictedFinalGrade = Math.max(0, Math.min(100, basePrediction + trendMomentum))

    // Calculate confidence based on data consistency
    const confidence = this.calculateConfidence(data, trendAnalysis)

    // Generate probability distribution
    const probabilityDistribution = this.generateProbabilityDistribution(predictedFinalGrade, confidence, trendAnalysis)

    // Generate scenarios
    const scenarios = this.generateScenarios(predictedFinalGrade, trendAnalysis, data)

    // Generate recommendations
    const recommendations = this.generateRecommendations(data, predictedFinalGrade, trendAnalysis)

    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(data, predictedFinalGrade)

    // Generate milestones
    const milestones = this.generateMilestones(data, predictedFinalGrade)

    return {
      predictedFinalGrade: Math.round(predictedFinalGrade * 100) / 100,
      confidence: Math.round(confidence * 100),
      letterGrade: this.convertToLetterGrade(predictedFinalGrade),
      probabilityDistribution,
      trendAnalysis,
      scenarios,
      recommendations,
      riskFactors,
      milestones,
    }
  }

  private static calculateCurrentPerformance(data: GradePredictionData): number {
    if (data.assignments.length === 0) return data.currentGPA * 25 // Convert GPA to percentage

    const weightedSum = data.assignments.reduce((sum, assignment) => {
      const percentage = (assignment.score / assignment.maxScore) * 100
      return sum + percentage * assignment.weight
    }, 0)

    const totalWeight = data.assignments.reduce((sum, assignment) => sum + assignment.weight, 0)
    return totalWeight > 0 ? weightedSum / totalWeight : data.currentGPA * 25
  }

  private static analyzeTrend(
    previousGrades: number[],
    assignments: Assignment[],
  ): {
    direction: "improving" | "declining" | "stable"
    strength: number
    score: number
    keyFactors: string[]
  } {
    const recentAssignments = assignments.slice(-5) // Last 5 assignments
    const keyFactors: string[] = []

    if (recentAssignments.length < 2) {
      return {
        direction: "stable",
        strength: 0,
        score: previousGrades.length > 0 ? previousGrades[previousGrades.length - 1] : 85,
        keyFactors: ["Insufficient data for trend analysis"],
      }
    }

    // Calculate trend using linear regression
    const scores = recentAssignments.map((a) => (a.score / a.maxScore) * 100)
    const trend = this.calculateLinearTrend(scores)

    let direction: "improving" | "declining" | "stable" = "stable"
    const strength = Math.abs(trend.slope)

    if (trend.slope > 2) {
      direction = "improving"
      keyFactors.push("Recent assignment scores showing upward trend")
    } else if (trend.slope < -2) {
      direction = "declining"
      keyFactors.push("Recent assignment scores showing downward trend")
    } else {
      keyFactors.push("Performance remains consistent")
    }

    // Analyze assignment type performance
    const examScores = recentAssignments.filter((a) => a.type.toLowerCase().includes("exam"))
    const quizScores = recentAssignments.filter((a) => a.type.toLowerCase().includes("quiz"))

    if (examScores.length > 0) {
      const examAvg = examScores.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) / examScores.length
      if (examAvg > 90) keyFactors.push("Strong exam performance")
      else if (examAvg < 70) keyFactors.push("Exam performance needs improvement")
    }

    return {
      direction,
      strength: Math.min(1, strength / 10),
      score: scores[scores.length - 1] || 85,
      keyFactors,
    }
  }

  private static calculateLinearTrend(values: number[]): { slope: number; intercept: number } {
    const n = values.length
    const sumX = (n * (n - 1)) / 2
    const sumY = values.reduce((sum, val) => sum + val, 0)
    const sumXY = values.reduce((sum, val, i) => sum + val * i, 0)
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    return { slope, intercept }
  }

  private static calculateAttendanceImpact(attendance: number): number {
    // Attendance has diminishing returns after 90%
    if (attendance >= 95) return 95
    if (attendance >= 90) return 85 + (attendance - 90) * 2
    if (attendance >= 80) return 70 + (attendance - 80) * 1.5
    return Math.max(50, attendance * 0.8)
  }

  private static calculateParticipationImpact(participation: number): number {
    return Math.min(95, participation * 0.9 + 10)
  }

  private static calculateStudyHabitsImpact(studyHours: number): number {
    // Optimal study hours per week: 10-15 hours
    if (studyHours >= 10 && studyHours <= 15) return 90
    if (studyHours >= 8) return 85
    if (studyHours >= 5) return 75
    return Math.max(60, 60 + studyHours * 2)
  }

  private static predictUpcomingAssignments(data: GradePredictionData): {
    averageScore: number
    predictions: { assignment: string; predictedScore: number }[]
  } {
    const predictions = data.upcomingAssignments.map((assignment) => {
      let predictedScore = data.currentGPA * 25 // Base prediction

      // Adjust based on assignment type and difficulty
      const typeMultiplier = this.getTypeMultiplier(assignment.type, data.assignments)
      const difficultyAdjustment = (5 - assignment.difficulty) * 2 // Easier = higher score

      predictedScore = predictedScore * typeMultiplier + difficultyAdjustment
      predictedScore = Math.max(0, Math.min(100, predictedScore))

      return {
        assignment: assignment.name,
        predictedScore: Math.round(predictedScore),
      }
    })

    const averageScore =
      predictions.length > 0
        ? predictions.reduce((sum, p) => sum + p.predictedScore, 0) / predictions.length
        : data.currentGPA * 25

    return { averageScore, predictions }
  }

  private static getTypeMultiplier(type: string, pastAssignments: Assignment[]): number {
    const typeAssignments = pastAssignments.filter((a) => a.type.toLowerCase() === type.toLowerCase())

    if (typeAssignments.length === 0) return 1.0

    const typeAverage = typeAssignments.reduce((sum, a) => sum + a.score / a.maxScore, 0) / typeAssignments.length

    return typeAverage
  }

  private static calculateTrendMomentum(trendAnalysis: any, timeToFinals: number): number {
    const momentumFactor = Math.max(0.1, 1 - timeToFinals / 16) // Stronger momentum closer to finals

    if (trendAnalysis.direction === "improving") {
      return trendAnalysis.strength * 5 * momentumFactor
    } else if (trendAnalysis.direction === "declining") {
      return -trendAnalysis.strength * 3 * momentumFactor
    }

    return 0
  }

  private static calculateConfidence(data: GradePredictionData, trendAnalysis: any): number {
    let confidence = 0.7 // Base confidence

    // More assignments = higher confidence
    confidence += Math.min(0.2, data.assignments.length * 0.02)

    // Consistent performance = higher confidence
    if (trendAnalysis.direction === "stable") confidence += 0.1

    // Good attendance = higher confidence
    if (data.attendance > 90) confidence += 0.05

    // Sufficient time remaining = higher confidence
    if (data.timeToFinals > 4) confidence += 0.05

    return Math.min(0.95, confidence)
  }

  private static generateProbabilityDistribution(predictedGrade: number, confidence: number, trendAnalysis: any) {
    const stdDev = (1 - confidence) * 15 // Lower confidence = higher standard deviation

    const grades = {
      "A+": { min: 97, max: 100 },
      A: { min: 93, max: 96 },
      "A-": { min: 90, max: 92 },
      "B+": { min: 87, max: 89 },
      B: { min: 83, max: 86 },
      "B-": { min: 80, max: 82 },
      "C+": { min: 77, max: 79 },
      C: { min: 73, max: 76 },
      "C-": { min: 70, max: 72 },
      D: { min: 60, max: 69 },
      F: { min: 0, max: 59 },
    }

    const distribution: any = {}

    Object.entries(grades).forEach(([letter, range]) => {
      const probability = this.normalProbability(predictedGrade, stdDev, range.min, range.max)
      distribution[letter] = Math.round(probability * 100)
    })

    return distribution
  }

  private static normalProbability(mean: number, stdDev: number, min: number, max: number): number {
    const z1 = (min - mean) / stdDev
    const z2 = (max - mean) / stdDev

    // Simplified normal distribution calculation
    const prob1 = 0.5 * (1 + this.erf(z1 / Math.sqrt(2)))
    const prob2 = 0.5 * (1 + this.erf(z2 / Math.sqrt(2)))

    return Math.max(0, prob2 - prob1)
  }

  private static erf(x: number): number {
    // Approximation of error function
    const a1 = 0.254829592
    const a2 = -0.284496736
    const a3 = 1.421413741
    const a4 = -1.453152027
    const a5 = 1.061405429
    const p = 0.3275911

    const sign = x >= 0 ? 1 : -1
    x = Math.abs(x)

    const t = 1.0 / (1.0 + p * x)
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

    return sign * y
  }

  private static generateScenarios(predictedGrade: number, trendAnalysis: any, data: GradePredictionData) {
    const baseVariation = 5
    const trendImpact = trendAnalysis.strength * 10

    return {
      optimistic: Math.min(100, predictedGrade + baseVariation + trendImpact),
      realistic: predictedGrade,
      pessimistic: Math.max(0, predictedGrade - baseVariation - trendImpact * 0.5),
    }
  }

  private static generateRecommendations(
    data: GradePredictionData,
    predictedGrade: number,
    trendAnalysis: any,
  ): Recommendation[] {
    const recommendations: Recommendation[] = []

    // Study recommendations
    if (data.studyHours < 8) {
      recommendations.push({
        type: "study",
        priority: "high",
        action: `Increase study time to 8-10 hours per week (currently ${data.studyHours} hours)`,
        impact: 5,
        timeframe: "2-3 weeks",
      })
    }

    // Attendance recommendations
    if (data.attendance < 90) {
      recommendations.push({
        type: "attendance",
        priority: "high",
        action: "Improve attendance to above 90% to maximize learning opportunities",
        impact: 8,
        timeframe: "Immediate",
      })
    }

    // Assignment-specific recommendations
    if (trendAnalysis.direction === "declining") {
      recommendations.push({
        type: "assignment",
        priority: "high",
        action: "Focus on upcoming high-weight assignments to reverse declining trend",
        impact: 10,
        timeframe: "1-2 weeks",
      })
    }

    // Participation recommendations
    if (data.participationScore < 80) {
      recommendations.push({
        type: "participation",
        priority: "medium",
        action: "Increase class participation and engagement",
        impact: 3,
        timeframe: "Ongoing",
      })
    }

    // Grade-specific recommendations
    if (predictedGrade < 80) {
      recommendations.push({
        type: "study",
        priority: "high",
        action: "Consider forming study groups or seeking tutoring assistance",
        impact: 12,
        timeframe: "1 week",
      })
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  private static identifyRiskFactors(data: GradePredictionData, predictedGrade: number): string[] {
    const risks: string[] = []

    if (predictedGrade < 70) risks.push("At risk of failing the course")
    if (data.attendance < 80) risks.push("Poor attendance affecting learning continuity")
    if (data.studyHours < 5) risks.push("Insufficient study time for course requirements")
    if (data.timeToFinals < 3) risks.push("Limited time remaining to improve grade")

    const recentLowScores = data.assignments.slice(-3).filter((a) => a.score / a.maxScore < 0.7)
    if (recentLowScores.length >= 2) risks.push("Recent assignment performance below expectations")

    const highWeightUpcoming = data.upcomingAssignments.filter((a) => a.weight > 20)
    if (highWeightUpcoming.length > 0 && predictedGrade < 80) {
      risks.push("High-weight assignments could significantly impact final grade")
    }

    return risks
  }

  private static generateMilestones(data: GradePredictionData, predictedGrade: number): Milestone[] {
    const milestones: Milestone[] = []

    // Find critical upcoming assignments
    const criticalAssignments = data.upcomingAssignments
      .filter((a) => a.weight > 15)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

    criticalAssignments.forEach((assignment) => {
      const requiredScore = this.calculateRequiredScore(assignment, predictedGrade, data)

      milestones.push({
        assignment: assignment.name,
        requiredScore,
        impact: `${assignment.weight}% of final grade`,
        date: assignment.dueDate,
      })
    })

    return milestones.slice(0, 3) // Top 3 most critical
  }

  private static calculateRequiredScore(
    assignment: UpcomingAssignment,
    targetGrade: number,
    data: GradePredictionData,
  ): number {
    // Simplified calculation - in reality this would be more complex
    const currentWeightedScore = data.assignments.reduce((sum, a) => sum + (a.score / a.maxScore) * a.weight, 0)
    const totalCurrentWeight = data.assignments.reduce((sum, a) => sum + a.weight, 0)

    const remainingWeight = 100 - totalCurrentWeight
    const requiredWeightedPoints = targetGrade * 100 - currentWeightedScore

    if (remainingWeight <= 0) return targetGrade

    const requiredScore = (requiredWeightedPoints / remainingWeight) * 100
    return Math.max(0, Math.min(100, Math.round(requiredScore)))
  }

  private static convertToLetterGrade(percentage: number): string {
    if (percentage >= 97) return "A+"
    if (percentage >= 93) return "A"
    if (percentage >= 90) return "A-"
    if (percentage >= 87) return "B+"
    if (percentage >= 83) return "B"
    if (percentage >= 80) return "B-"
    if (percentage >= 77) return "C+"
    if (percentage >= 73) return "C"
    if (percentage >= 70) return "C-"
    if (percentage >= 60) return "D"
    return "F"
  }
}
