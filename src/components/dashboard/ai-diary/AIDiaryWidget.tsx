import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, FolderOpen, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FreeChat from "../ai-chat/FreeChat";
import { StructuredHistory } from "@/features/diary/StructuredHistory";
import { ActiveDiariesTab } from "./ActiveDiariesTab";

export const AIDiaryWidget = () => {
  const [activeTab, setActiveTab] = useState("notes");
  const navigate = useNavigate();

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">AI Дневник</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/diary')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Открыть полностью
          </Button>
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Заметки
            </TabsTrigger>
            <TabsTrigger value="active-diaries" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Активные
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              История
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0 px-6 pb-6">
          <TabsContent value="notes" className="h-full mt-4 data-[state=active]:flex data-[state=active]:flex-col">
            <div className="flex-1 min-h-0">
              <FreeChat />
            </div>
          </TabsContent>

          <TabsContent value="active-diaries" className="h-full mt-4 overflow-y-auto">
            <ActiveDiariesTab />
          </TabsContent>

          <TabsContent value="history" className="h-full mt-4 overflow-y-auto">
            <StructuredHistory />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};
