import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { analyticsService } from "@/services/analytics.service";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";
import { toast } from "@/hooks/use-toast";

const SCOPE_OPTIONS = [
  { value: "all", label: "Все" },
  { value: "activity", label: "Активности" },
  { value: "day", label: "Дни" },
  { value: "day_part", label: "Части дня" },
];

const DAY_PART_OPTIONS = [
  { value: "all", label: "Все" },
  { value: "morning", label: "Утро" },
  { value: "afternoon", label: "День" },
  { value: "evening", label: "Вечер" },
];

export function FourScalesChart() {
  const [scope, setScope] = useState("all");
  const [dayPart, setDayPart] = useState("all");
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const { data: scalesData = [], isLoading } = useQuery({
    queryKey: ["four-scales", scope, dayPart, startDate, endDate],
    queryFn: () =>
      analyticsService.getFourScalesData({
        scope: scope === "all" ? undefined : scope,
        dayPart: dayPart === "all" ? undefined : dayPart,
        startDate,
        endDate,
      }),
  });

  const handleExport = () => {
    const csv = [
      [
        "Date",
        "Scope",
        "Day Part",
        "Process Satisfaction",
        "Result Satisfaction",
        "Energy Cost",
        "Stress Level",
      ].join(","),
      ...scalesData.map((row) =>
        [
          row.date,
          row.scope,
          row.day_part || "",
          row.process_satisfaction,
          row.result_satisfaction,
          row.energy_cost,
          row.stress_level,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `four-scales-${startDate}-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Экспорт завершён",
      description: "Данные сохранены в CSV файл",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Четыре шкалы</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={scalesData.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <Label htmlFor="scope">Область</Label>
            <Select value={scope} onValueChange={setScope}>
              <SelectTrigger id="scope">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCOPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {scope === "day_part" && (
            <div>
              <Label htmlFor="day-part">Часть дня</Label>
              <Select value={dayPart} onValueChange={setDayPart}>
                <SelectTrigger id="day-part">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAY_PART_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label htmlFor="start-date">Начало периода</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="end-date">Конец периода</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : scalesData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Нет данных за выбранный период
          </div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), "dd.MM")}
                />
                <YAxis domain={[0, 10]} />
                <Tooltip
                  labelFormatter={(value) =>
                    format(new Date(value as string), "dd MMMM yyyy")
                  }
                  formatter={(value: number) => value.toFixed(1)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="process_satisfaction"
                  name="Удовл. процессом"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="result_satisfaction"
                  name="Удовл. результатом"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="energy_cost"
                  name="Энергозатраты"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="stress_level"
                  name="Стресс"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
