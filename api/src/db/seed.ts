import "dotenv/config";
import { db } from "./index";
import { tags, studySessions, studyResources, users } from "./schema";
import { studyResourceTypeEnum } from "./queries/sessions";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("🌱 Rozpoczynam seedowanie bazy danych...");

    // Tworzenie użytkownika testowego (jeśli nie istnieje)
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
      console.log(`✅ Utworzono użytkownika: ${newUser.username} (${userId})`);
    } else {
      userId = existingUser[0].userId;
      console.log(
        `✅ Użytkownik już istnieje: ${existingUser[0].username} (${userId})`
      );
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
    console.log(`✅ Dodano ${insertedTags.length} tagów`);

    // Dodawanie sesji nauki
    console.log("📚 Dodawanie sesji nauki...");
    const sessionsData = [
      {
        userId,
        tagId: insertedTags[0].tagId, // Matematyka
        title: "Algebra liniowa - podstawy",
        notes: "Przerobione: wektory, macierze, wyznaczniki",
        startedAt: new Date("2024-01-15T10:00:00Z"),
        durationMinutes: 120,
      },
      {
        userId,
        tagId: insertedTags[1].tagId, // Programowanie
        title: "React - hooks i state management",
        notes: "Nauka useState, useEffect, useContext",
        startedAt: new Date("2024-01-16T14:30:00Z"),
        durationMinutes: 90,
      },
      {
        userId,
        tagId: insertedTags[1].tagId, // Programowanie
        title: "TypeScript - zaawansowane typy",
        notes: "Generics, utility types, conditional types",
        startedAt: new Date("2024-01-17T09:00:00Z"),
        durationMinutes: 150,
      },
      {
        userId,
        tagId: insertedTags[2].tagId, // Języki obce
        title: "Angielski - słownictwo biznesowe",
        notes: "50 nowych słówek z dziedziny biznesu",
        startedAt: new Date("2024-01-18T16:00:00Z"),
        durationMinutes: 60,
      },
      {
        userId,
        tagId: insertedTags[3].tagId, // Historia
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
    console.log(`✅ Dodano ${insertedSessions.length} sesji nauki`);

    // Dodawanie zasobów do sesji
    console.log("📖 Dodawanie zasobów do sesji...");
    const resourcesData = [
      // Zasoby dla pierwszej sesji (Matematyka)
      {
        sessionId: insertedSessions[0].sessionId,
        title: "Khan Academy - Linear Algebra",
        type: studyResourceTypeEnum.VIDEO,
        content: "https://www.khanacademy.org/math/linear-algebra",
      },
      {
        sessionId: insertedSessions[0].sessionId,
        title: "Podręcznik: Algebra liniowa i geometria",
        type: studyResourceTypeEnum.BOOK,
        content: "ISBN: 978-83-01-12345-6",
      },
      {
        sessionId: insertedSessions[0].sessionId,
        title: "Notatki z wykładu",
        type: studyResourceTypeEnum.OTHER,
        content: "Plik: algebra_notatki.pdf",
      },
      // Zasoby dla drugiej sesji (React)
      {
        sessionId: insertedSessions[1].sessionId,
        title: "React Documentation - Hooks",
        type: studyResourceTypeEnum.URL,
        content: "https://react.dev/reference/react",
      },
      {
        sessionId: insertedSessions[1].sessionId,
        title: "React Tutorial - YouTube",
        type: studyResourceTypeEnum.VIDEO,
        content: "https://www.youtube.com/watch?v=example",
      },
      // Zasoby dla trzeciej sesji (TypeScript)
      {
        sessionId: insertedSessions[2].sessionId,
        title: "TypeScript Handbook",
        type: studyResourceTypeEnum.URL,
        content: "https://www.typescriptlang.org/docs/handbook/intro.html",
      },
      {
        sessionId: insertedSessions[2].sessionId,
        title: "TypeScript Deep Dive",
        type: studyResourceTypeEnum.BOOK,
        content: "Online book: basarat.gitbook.io/typescript",
      },
      // Zasoby dla czwartej sesji (Angielski)
      {
        sessionId: insertedSessions[3].sessionId,
        title: "Business English Vocabulary - Quizlet",
        type: studyResourceTypeEnum.URL,
        content: "https://quizlet.com/business-english",
      },
      {
        sessionId: insertedSessions[3].sessionId,
        title: "Podcast: Business English",
        type: studyResourceTypeEnum.VIDEO,
        content: "https://podcast.example.com/business-english",
      },
      // Zasoby dla piątej sesji (Historia)
      {
        sessionId: insertedSessions[4].sessionId,
        title: "World War II Documentary",
        type: studyResourceTypeEnum.VIDEO,
        content: "https://www.youtube.com/watch?v=ww2-doc",
      },
      {
        sessionId: insertedSessions[4].sessionId,
        title: "Encyclopedia Britannica - WWII",
        type: studyResourceTypeEnum.URL,
        content: "https://www.britannica.com/event/World-War-II",
      },
      {
        sessionId: insertedSessions[4].sessionId,
        title: "Książka: Historia II Wojny Światowej",
        type: studyResourceTypeEnum.BOOK,
        content: "ISBN: 978-83-01-67890-1",
      },
    ];

    const insertedResources = await db
      .insert(studyResources)
      .values(resourcesData)
      .returning();
    console.log(`✅ Dodano ${insertedResources.length} zasobów`);

    console.log("🎉 Seedowanie zakończone pomyślnie!");
    console.log(`📊 Podsumowanie:`);
    console.log(`   - Użytkowników: 1`);
    console.log(`   - Tagów: ${insertedTags.length}`);
    console.log(`   - Sesji: ${insertedSessions.length}`);
    console.log(`   - Zasobów: ${insertedResources.length}`);
  } catch (error) {
    console.error("❌ Błąd podczas seedowania:", error);
    throw error;
  }
}

// Uruchomienie seedowania
seed()
  .then(() => {
    console.log("✅ Seedowanie zakończone");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Błąd:", error);
    process.exit(1);
  });
