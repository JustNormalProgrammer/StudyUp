export const getScoreMessage = (score: number) => {
    const highScoreMessages = [
        "Congratulations! Excellent result!",
        "Great work! Keep it up!",
        "Outstanding performance — you’ve mastered this material.",
        "You’ve nailed it! This is a fantastic score.",
        "Excellent score — be proud of yourself!",
        "You crushed this test!",
        "Fantastic result! Keep the momentum going.",
        "Outstanding result!",
        "You’ve crushed it!",
    ]
    const mediumScoreMessages = [
        "Good job! Keep it up!",
        "Well done! This is a good score",
        "This is a good starting point. Keep going!",
        "Nice job! You’re making good progress",
        "Well done! A bit more practice will boost your score",
        "Good effort! Keep building on this",
        "You’re getting there — stay consistent",
        "Solid result — a bit more practice will get you even further",
        "Nice work! Review a few topics to improve even more",
        "Good effort! There’s room to grow",
        "You’re on the right track! Keep it up",
        "You’re getting better! Keep going",
    ]
    const lowScoreMessages = [
        "Keep practicing to improve",
        "Learning takes time — stay patient",
        "Learning takes time. Try again when you’re ready",
        "Mistakes are part of the process — keep going!",
        "Review the material and give it another shot",
        "Each try brings you closer to success!",
        "Not there yet — but don't give up!"
    ];
    if (score >= 80) {
        return highScoreMessages[Math.floor(Math.random() * highScoreMessages.length)]
    } else if (score >= 50) {
        return mediumScoreMessages[Math.floor(Math.random() * mediumScoreMessages.length)]
    } else {
        return lowScoreMessages[Math.floor(Math.random() * lowScoreMessages.length)]
    }
}