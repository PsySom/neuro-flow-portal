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
  ReferenceArea,
} from "recharts";
import { format, subDays } from "date-fns";
import { toast } from "@/hooks/use-toast";

const METRIC_OPTIONS = [
  { value: "mood", label: "Настроение" },
  { value: "stress", label: "Стресс" },
  { value: "energy", label: "Энергия" },
  { value: "sleep_quality", label: "Качество сна" },
  { value: "morning_feeling", label: "Утреннее самочувствие" },
  { value: "overall_sleep_impact", label: "Влияние сна" },
];

export function DiaryMetricsChart() {
  const [metricKey, setMetricKey] = useState("mood");
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const { data: metricsData = [], isLoading } = useQuery({
    queryKey: ["metrics-timeseries", metricKey, startDate, endDate],
    queryFn: () =>
      analyticsService.getMetricsTimeseries({
        metricKey,
        startDate,
        endDate,
        limit: 100,
      }),
  });

  const handleExport = () => {
    const csv = [
      ["Timestamp", "Topic", "Metric", "Value", "Norm Min", "Norm Max"].join(","),
      ...metricsData.map((row) =>
        [
          row.ts,
          row.topic,
          row.key,
          row.value,
          row.norm_min || "",
          row.norm_max || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diary-metrics-${metricKey}-${startDate}-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Экспорт завершён",
      description: "Данные сохранены в CSV файл",
    });
  };

  // Get norm range from first data point
  const normMin = metricsData[0]?.norm_min;
  const normMax = metricsData[0]?.norm_max;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Метрики дневника</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={metricsData.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="metric">Метрика</Label>
            <Select value={metricKey} onValueChange={setMetricKey}>
              <SelectTrigger id="metric">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METRIC_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
        ) : metricsData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Нет данных за выбранный период
          </div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="ts"
                  tickFormatter={(value) =>
                    format(new Date(value), "dd.MM HH:mm")
                  }
                />
                <YAxis domain={[0, 10]} />
                <Tooltip
                  labelFormatter={(value) =>
                    format(new Date(value as string), "dd MMMM yyyy HH:mm")
                  }
                  formatter={(value: number) => value.toFixed(1)}
                />
                <Legend />
                {normMin !== null && normMax !== null && (
                  <ReferenceArea
                    y1={normMin}
                    y2={normMax}
                    fill="hsl(var(--primary))"
                    fillOpacity={0.1}
                    label="Норма"
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Значение"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
