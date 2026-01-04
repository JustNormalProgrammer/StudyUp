export enum StudyResourceTypeEnum {
  VIDEO = 'video',
  BOOK = 'book',
  WEBSITE = 'website',
  OTHER = 'other',
}
export interface StudyResource {
  resourceId: string
  title: string
  type: StudyResourceTypeEnum
  desc?: string
  url?: string
}
export interface Tag {
  tagId: string
  content: string
  color: string
}
export interface StudySession {
  sessionId: string
  tagId: string
  title: string
  notes?: string
  startedAt: string
  durationMinutes: number
  tag: Tag
}
export interface QuizInfo {
  quizId: string
  title: string
  isMultipleChoice: boolean
  numberOfQuestions: number
}
export interface Quiz {
  quizId: string
  sessionId: string
  title: string
  numberOfQuestions: number
  isMultipleChoice: boolean
  createdAt: string
  tag: Tag  
  quizContent: Array<QuizQuestion>
  maxScore: number
}

export interface QuizQuestion {
  questionNumber: number
  questionContent: string
  isMultipleChoice: boolean
  questionChoices: Array<{
    id: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
    content: string
    isCorrect: boolean
  }>
}
export interface QuizAttempt {
  quizAttemptId: string
  quizId: string
  finishedAt: string
  score: string
  userAttemptContent: Array<{
    questionNumber: number
    isMultipleChoice: boolean
    userAnswers: Array<'A' | 'B' | 'C' | 'D' | 'E' | 'F'>
    correctAnswers: Array<'A' | 'B' | 'C' | 'D' | 'E' | 'F'>
    isCorrect: boolean
    score: number
    maxScore: number
  }>
}
export interface UserEventResponse {
  userSessions: Array<StudySession>
  userQuizzesAttempts: Array<QuizAttempt>
}
export interface UserStats {
  sessionsStats: {
    totalSessions: number
    totalDuration: number
  }
  quizzesStats: {
    totalQuizzes: number
    totalQuizAttempts: number
    averageQuizScore: number
  }
  resourcesStats: {
    totalResources: number
  }
}
export interface UserSettings {
  dailyStudyGoal: number
  weeklyQuizGoal: number
}