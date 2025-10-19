import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiaryMetricsChart } from "@/features/analytics/DiaryMetricsChart";
import { FourScalesChart } from "@/features/analytics/FourScalesChart";
import { CyclesChart } from "@/features/analytics/CyclesChart";
import { BarChart3, Activity, TrendingUp } from "lucide-react";

export default function Analytics() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Аналитика</h1>
        <p className="text-muted-foreground">
          Визуализация данных дневников и активностей
        </p>
      </div>

      <Tabs defaultValue="diary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="diary" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Дневник
          </TabsTrigger>
          <TabsTrigger value="scales" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Четыре шкалы
          </TabsTrigger>
          <TabsTrigger value="cycles" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Циклы
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diary">
          <DiaryMetricsChart />
        </TabsContent>

        <TabsContent value="scales">
          <FourScalesChart />
        </TabsContent>

        <TabsContent value="cycles">
          <CyclesChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}
