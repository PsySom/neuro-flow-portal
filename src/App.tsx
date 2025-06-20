
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ActivitiesProvider } from "@/contexts/ActivitiesContext";
import { PersonalizationProvider } from "@/contexts/PersonalizationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import About from "./pages/About";
import ForProfessionals from "./pages/ForProfessionals";
import KnowledgeBase from "./pages/KnowledgeBase";
import Practices from "./pages/Practices";
import Diaries from "./pages/Diaries";
import MoodDiaryPage from "./pages/MoodDiaryPage";
import ThoughtsDiaryPage from "./pages/ThoughtsDiaryPage";
import ProcrastinationDiaryPage from "./pages/ProcrastinationDiaryPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PersonalizationProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
              <ActivitiesProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/for-professionals" element={<ForProfessionals />} />
                    <Route path="/knowledge" element={<KnowledgeBase />} />
                    <Route path="/practices" element={<Practices />} />
                    <Route path="/diaries" element={<Diaries />} />
                    <Route path="/diaries/mood" element={<MoodDiaryPage />} />
                    <Route path="/diaries/thoughts" element={<ThoughtsDiaryPage />} />
                    <Route path="/diaries/procrastination" element={<ProcrastinationDiaryPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </ActivitiesProvider>
            </TooltipProvider>
          </ThemeProvider>
        </PersonalizationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
