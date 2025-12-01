export enum StudyResourceTypeEnum {
    VIDEO = "video",
    BOOK = "book",
    WEBSITE = "website",
    OTHER = "other",
}
export interface StudyResource {
    resourceId: string,
    title: string,
    type: StudyResourceTypeEnum,
    desc?: string,
    url?: string,
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
    startedAt: string,
    durationMinutes: number,
    tag: Tag,
}
export interface QuizAttempt {
    quizAttemptId: string,
    quizId: string,
    quizTitle: string,
    score: number,
    finishedAt: string,
    tag: Tag,
}
export interface UserEventResponse {
    userSessions: Array<StudySession>,
    userQuizzesAttempts: Array<QuizAttempt>,
}