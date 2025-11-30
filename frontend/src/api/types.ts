export enum StudyResourceTypeEnum {
    URL = "url",
    VIDEO = "video",
    BOOK = "book",
    OTHER = "other",
}
export interface StudyResource {
    resourceId: string,
    title: string,
    type: StudyResourceTypeEnum,
    content?: string,
}
export interface Tag {
    tagId: string,
    content: string,
    color: string,
}
export interface StudySession {
    sessionId: string,
    tagId: string,
    title: string,
    notes?: string,
    startedAt: Date,
    durationMinutes: number,
    tag: Tag,
}
export interface QuizAttempt {
    quizAttemptId: string,
    quizId: string,
    quizTitle: string,
    score: number,
    finishedAt: Date,
    tag: Tag,
}
export interface UserEventResponse {
    userSessions: Array<StudySession>,
    userQuizzesAttempts: Array<QuizAttempt>,
}