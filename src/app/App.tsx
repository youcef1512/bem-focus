import { Navigate, Route, Routes } from "react-router-dom";
import { AppChrome } from "../components/AppChrome";
import { DailyPlanPage, DownloadsPage, HistoryTimelinePage, SummariesPage } from "../routes/UtilityPages";
import { ExamDetailPage, ExamsPage } from "../routes/ExamPages";
import { HomePage } from "../routes/HomePage";
import { LessonPage, PracticePage, SubjectDetailPage, SubjectsPage } from "../routes/SubjectsPages";

export function App() {
  return (
    <Routes>
      <Route element={<AppChrome />}>
        <Route element={<HomePage />} path="/" />
        <Route element={<DailyPlanPage />} path="/daily-plan" />
        <Route element={<SubjectsPage />} path="/subjects" />
        <Route element={<SubjectDetailPage />} path="/subjects/:subjectId" />
        <Route element={<LessonPage />} path="/lessons/:lessonId" />
        <Route element={<PracticePage />} path="/practice/:lessonId" />
        <Route element={<ExamsPage />} path="/past-exams" />
        <Route element={<ExamDetailPage />} path="/past-exams/:subjectId/:year" />
        <Route element={<HistoryTimelinePage />} path="/history-timeline" />
        <Route element={<SummariesPage />} path="/summaries" />
        <Route element={<DownloadsPage />} path="/downloads" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Route>
    </Routes>
  );
}
