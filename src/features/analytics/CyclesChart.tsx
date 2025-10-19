import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { analyticsService } from "@/services/analytics.service";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format, subDays } from "date-fns";
import { toast } from "@/hooks/use-toast";

export function CyclesChart() {
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const { data: rliData = [], isLoading } = useQuery({
    queryKey: ["daily-rli", startDate, endDate],
    queryFn: () =>
      analyticsService.getDailyRLI({
        startDate,
        endDate,
      }),
  });

  const handleExport = () => {
    // Simple CSV export
    const csv = [
      ["Date", "Recovery", "Strain", "RLI"].join(","),
      ...rliData.map((row) =>
        [
          row.date,
          row.day_recovery.toFixed(2),
          row.day_strain.toFixed(2),
          row.rli.toFixed(2),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rli-cycles-${startDate}-${endDate}.csv`;
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
          <CardTitle>Циклы восстановления и напряжения</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={rliData.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
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
        ) : rliData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Нет данных за выбранный период
          </div>
        ) : (
          <>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rliData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), "dd.MM")}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) =>
                      format(new Date(value as string), "dd MMMM yyyy")
                    }
                    formatter={(value: number) => value.toFixed(2)}
                  />
                  <Legend />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
                  <Line
                    type="monotone"
                    dataKey="rli"
                    name="RLI"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rliData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), "dd.MM")}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) =>
                      format(new Date(value as string), "dd MMMM yyyy")
                    }
                    formatter={(value: number) => value.toFixed(2)}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="day_recovery"
                    name="Восстановление"
                    stackId="1"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                  />
                  <Area
                    type="monotone"
                    dataKey="day_strain"
                    name="Напряжение"
                    stackId="2"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
