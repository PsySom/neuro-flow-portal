
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PersonalizationProvider } from "./contexts/PersonalizationContext";
import { ActivitiesProvider } from "./contexts/ActivitiesContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Practices from "./pages/Practices";
import KnowledgeBase from "./pages/KnowledgeBase";
import Calendar from "./pages/Calendar";
import Diaries from "./pages/Diaries";
import MoodDiaryPage from "./pages/MoodDiaryPage";
import ThoughtsDiaryPage from "./pages/ThoughtsDiaryPage";
import ProcrastinationDiaryPage from "./pages/ProcrastinationDiaryPage";
import OCDDiaryPage from "./pages/OCDDiaryPage";
import ForProfessionals from "./pages/ForProfessionals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PersonalizationProvider>
        <ActivitiesProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/practices" element={<Practices />} />
                <Route path="/knowledge" element={<KnowledgeBase />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/diaries" element={<Diaries />} />
                <Route path="/mood-diary" element={<MoodDiaryPage />} />
                <Route path="/thoughts-diary" element={<ThoughtsDiaryPage />} />
                <Route path="/procrastination-diary" element={<ProcrastinationDiaryPage />} />
                <Route path="/ocd-diary" element={<OCDDiaryPage />} />
                <Route path="/for-professionals" element={<ForProfessionals />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ActivitiesProvider>
      </PersonalizationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
