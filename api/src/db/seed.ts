import "dotenv/config";
import { db } from "./index";
import {
  tags,
  studySessions,
  studyResources,
  studySessionsStudyResources,
  users,
  quizzes,
} from "./schema";
import { StudyResourceTypeEnum } from "./queries/resources";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("🌱 Rozpoczynam seedowanie bazy danych...");

    // Tworzenie użytkownika testowego
    const testUserEmail = "test@example.com";

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, testUserEmail))
      .limit(1);

    let userId: string;

    if (existingUser.length === 0) {
      console.log("📝 Tworzenie użytkownika testowego...");

      const [newUser] = await db
        .insert(users)
        .values({
          username: "testuser",
          email: testUserEmail,
          password: await bcrypt.hash("testpassword123", 10),
        })
        .returning();

      userId = newUser.userId;
    } else {
      userId = existingUser[0].userId;
      console.log(`ℹ️ Użytkownik już istnieje: ${userId}`);
    }

    // Dodawanie tagów
    console.log("🏷️  Dodawanie tagów...");

    const tagsData = [
      { userId, content: "Matematyka" },
      { userId, content: "Programowanie" },
      { userId, content: "Języki obce" },
      { userId, content: "Historia" },
      { userId, content: "Fizyka" },
    ];

    const insertedTags = await db.insert(tags).values(tagsData).returning();

    // Dodawanie sesji
    console.log("📚 Dodawanie sesji nauki...");

    const sessionsData = [
      {
        userId,
        tagId: insertedTags[0].tagId,
        title: "Algebra liniowa - podstawy",
        notes: "Przerobione: wektory, macierze, wyznaczniki",
        startedAt: new Date("2024-01-15T10:00:00Z"),
        durationMinutes: 120,
      },
      {
        userId,
        tagId: insertedTags[1].tagId,
        title: "React - hooks i state management",
        notes: "useState, useEffect, useContext",
        startedAt: new Date("2024-01-16T14:30:00Z"),
        durationMinutes: 90,
      },
      {
        userId,
        tagId: insertedTags[1].tagId,
        title: "TypeScript - zaawansowane typy",
        notes: "Generics, conditional types",
        startedAt: new Date("2024-01-17T09:00:00Z"),
        durationMinutes: 150,
      },
      {
        userId,
        tagId: insertedTags[2].tagId,
        title: "Angielski - słownictwo biznesowe",
        notes: "50 nowych słówek z biznesu",
        startedAt: new Date("2024-01-18T16:00:00Z"),
        durationMinutes: 60,
      },
      {
        userId,
        tagId: insertedTags[3].tagId,
        title: "II Wojna Światowa - przyczyny i przebieg",
        notes: "Analiza przyczyn wybuchu wojny",
        startedAt: new Date("2024-01-19T11:00:00Z"),
        durationMinutes: 180,
      },
    ];

    const insertedSessions = await db
      .insert(studySessions)
      .values(sessionsData)
      .returning();

    // Dodawanie zasobów
    console.log("📖 Dodawanie zasobów...");

    const resourcesData = [
      {
        userId,
        title: "Khan Academy - Linear Algebra",
        type: StudyResourceTypeEnum.VIDEO,
        content: "https://www.khanacademy.org/math/linear-algebra",
      },
      {
        userId,
        title: "Podręcznik: Algebra liniowa i geometria",
        type: StudyResourceTypeEnum.BOOK,
        content: "ISBN: 978-83-01-12345-6",
      },
      {
        userId,
        title: "Notatki z wykładu",
        type: StudyResourceTypeEnum.OTHER,
        content: "algebra_notatki.pdf",
      },
      {
        userId,
        title: "React Documentation - Hooks",
        type: StudyResourceTypeEnum.URL,
        content: "https://react.dev/reference/react",
      },
      {
        userId,
        title: "React Tutorial - YouTube",
        type: StudyResourceTypeEnum.VIDEO,
        content: "https://www.youtube.com/watch?v=example",
      },
      {
        userId,
        title: "TypeScript Handbook",
        type: StudyResourceTypeEnum.URL,
        content: "https://www.typescriptlang.org/docs/handbook/intro.html",
      },
      {
        userId,
        title: "TypeScript Deep Dive",
        type: StudyResourceTypeEnum.BOOK,
        content: "basarat.gitbook.io/typescript",
      },
      {
        userId,
        title: "Business English Vocabulary - Quizlet",
        type: StudyResourceTypeEnum.URL,
        content: "https://quizlet.com/business-english",
      },
      {
        userId,
        title: "Podcast: Business English",
        type: StudyResourceTypeEnum.VIDEO,
        content: "https://podcast.example.com/business-english",
      },
      {
        userId,
        title: "World War II Documentary",
        type: StudyResourceTypeEnum.VIDEO,
        content: "https://www.youtube.com/watch?v=ww2-doc",
      },
      {
        userId,
        title: "Encyclopedia Britannica - WWII",
        type: StudyResourceTypeEnum.URL,
        content: "https://www.britannica.com/event/World-War-II",
      },
      {
        userId,
        title: "Książka: Historia II Wojny Światowej",
        type: StudyResourceTypeEnum.BOOK,
        content: "ISBN: 978-83-01-67890-1",
      },
    ];

    const insertedResources = await db
      .insert(studyResources)
      .values(resourcesData)
      .returning();

    // Powiązania many-to-many
    console.log("🔗 Powiązania sesji i zasobów...");

    const studySessionsResourcesData = [
      // Algebra
      {
        sessionId: insertedSessions[0].sessionId,
        resourceId: insertedResources[0].resourceId,
        label: '1-23'
      },
      {
        sessionId: insertedSessions[0].sessionId,
        resourceId: insertedResources[1].resourceId,
        label: '1-23'
      },
      {
        sessionId: insertedSessions[0].sessionId,
        resourceId: insertedResources[2].resourceId,
        label: '1:24'
      },
      {
        sessionId: insertedSessions[0].sessionId,
        resourceId: insertedResources[5].resourceId,
        label: '1:24'
      }, // dodatkowy
      {
        sessionId: insertedSessions[0].sessionId,
        resourceId: insertedResources[11].resourceId,
        label: 'Paragraph 1'
      }, // dodatkowy

      // React
      {
        sessionId: insertedSessions[1].sessionId,
        resourceId: insertedResources[3].resourceId,
        label: 'Paragraph 1'
      },
      {
        sessionId: insertedSessions[1].sessionId,
        resourceId: insertedResources[4].resourceId,
        label: 'Paragraph 1'
      },
      {
        sessionId: insertedSessions[1].sessionId,
        resourceId: insertedResources[5].resourceId,
        label: '1:24'
      }, // dodatkowy

      // TypeScript
      {
        sessionId: insertedSessions[2].sessionId,
        resourceId: insertedResources[5].resourceId,
        label: '1-23'
      },
      {
        sessionId: insertedSessions[2].sessionId,
        resourceId: insertedResources[6].resourceId,
        label: '1:24'
      },
      {
        sessionId: insertedSessions[2].sessionId,
        resourceId: insertedResources[3].resourceId,
      }, // dodatkowy

      // Angielski
      {
        sessionId: insertedSessions[3].sessionId,
        resourceId: insertedResources[7].resourceId,
      },
      {
        sessionId: insertedSessions[3].sessionId,
        resourceId: insertedResources[8].resourceId,
        label: '1-23'
      },
      {
        sessionId: insertedSessions[3].sessionId,
        resourceId: insertedResources[4].resourceId,
      }, // dodatkowy

      // Historia
      {
        sessionId: insertedSessions[4].sessionId,
        resourceId: insertedResources[9].resourceId,
        label: '1-23'
      },
      {
        sessionId: insertedSessions[4].sessionId,
        resourceId: insertedResources[10].resourceId,
      },
      {
        sessionId: insertedSessions[4].sessionId,
        resourceId: insertedResources[11].resourceId,
        label: '1-23'
      },
      {
        sessionId: insertedSessions[4].sessionId,
        resourceId: insertedResources[0].resourceId,
      }, // dodatkowy
    ];

    await db
      .insert(studySessionsStudyResources)
      .values(studySessionsResourcesData);

    // Dodanie quizu
    console.log("📝 Dodawanie quizów...");

    await db
      .insert(quizzes)
      .values({
        userId,
        sessionId: insertedSessions[0].sessionId,
        title: "II Wojna Światowa - Quiz",
        isMultipleChoice: true,
        numberOfQuestions: 10,
        quizContent: {
          questions: [
            {
              content: "Kiedy rozpoczęła się II wojna światowa?",
              isMultipleChoice: false,
              choices: [
                { content: "1 września 1939", isCorrect: true },
                { content: "3 września 1939", isCorrect: false },
                { content: "7 grudnia 1941", isCorrect: false },
                { content: "6 czerwca 1944", isCorrect: false },
              ],
            },
          ],
        },
      })
      .returning();

    console.log("✅ Seedowanie zakończone!");
  } catch (error) {
    console.error("❌ Błąd podczas seedowania:", error);
    process.exit(1);
  }
}

seed();
