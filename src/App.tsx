import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { PersonalizationProvider } from "./contexts/PersonalizationContext"
import { AuthProvider } from "./contexts/AuthContext"
import { ActivitiesProvider } from "./contexts/ActivitiesContext"
import { ThemeProvider } from "next-themes"

import Index from "./pages/Index"
import Dashboard from "./pages/Dashboard"
import About from "./pages/About"
import ForProfessionals from "./pages/ForProfessionals"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Calendar from "./pages/Calendar"
import Practices from "./pages/Practices"
import Diaries from "./pages/Diaries"
import KnowledgeBase from "./pages/KnowledgeBase"
import ArticleView from "./pages/ArticleView"
import MoodDiaryPage from "./pages/MoodDiaryPage"
import ThoughtsDiaryPage from "./pages/ThoughtsDiaryPage"
import OCDDiaryPage from "./pages/OCDDiaryPage"
import ProcrastinationDiaryPage from "./pages/ProcrastinationDiaryPage"
import SelfEsteemDiaryPage from "./pages/SelfEsteemDiaryPage"
import NotFound from "./pages/NotFound"
import DepressionCareDiaryPage from "./pages/DepressionCareDiaryPage"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AuthProvider>
              <PersonalizationProvider>
                <ActivitiesProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/for-professionals" element={<ForProfessionals />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/practices" element={<Practices />} />
                    <Route path="/diaries" element={<Diaries />} />
                    <Route path="/knowledge" element={<KnowledgeBase />} />
                    <Route path="/article/:id" element={<ArticleView />} />
                    <Route path="/diary/mood" element={<MoodDiaryPage />} />
                    <Route path="/diary/thoughts" element={<ThoughtsDiaryPage />} />
                    <Route path="/diary/ocd" element={<OCDDiaryPage />} />
                    <Route path="/diary/procrastination" element={<ProcrastinationDiaryPage />} />
                    <Route path="/diary/self-esteem" element={<SelfEsteemDiaryPage />} />
                    <Route path="/diary/depression-care" element={<DepressionCareDiaryPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ActivitiesProvider>
              </PersonalizationProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
