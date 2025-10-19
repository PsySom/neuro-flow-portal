import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { fourScaleTrackerService } from "@/services/four-scale-tracker.service";
import { activitiesService, Activity as ActivityType } from "@/services/activities.service";
import {
  aggregateDay,
  getBalanceStatus,
  DayItem,
  ActivityKind,
} from "@/utils/recoveryStrain";
import { format } from "date-fns";

export function DayBalanceIndicator() {
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: trackers = [], isLoading: isLoadingTrackers } = useQuery({
    queryKey: ["four-scale-trackers-today", today],
    queryFn: () =>
      fourScaleTrackerService.list({
        startDate: today,
        endDate: today,
      }),
  });

  const { data: activities = [], isLoading: isLoadingActivities } = useQuery({
    queryKey: ["activities-today", today],
    queryFn: () =>
      activitiesService.list({
        startDate: today + "T00:00:00",
        endDate: today + "T23:59:59",
      }),
    enabled: trackers.length > 0,
  });

  const isLoading = isLoadingTrackers || isLoadingActivities;

  // Build items for aggregation
  const dayItems: DayItem[] = trackers
    .filter((t) => t.scope === "activity" && t.activity_id)
    .map((tracker) => {
      const activity = activities.find((a) => a.id === tracker.activity_id);
      if (!activity?.kind) return null;

      return {
        kind: activity.kind as ActivityKind,
        process: tracker.process_satisfaction,
        result: tracker.result_satisfaction,
        energy: tracker.energy_cost,
        stress: tracker.stress_level,
      };
    })
    .filter((item): item is DayItem => item !== null);

  // Calculate aggregate if we have data
  const aggregate = dayItems.length > 0 ? aggregateDay(dayItems) : null;
  const balanceStatus = aggregate ? getBalanceStatus(aggregate.delta) : null;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!aggregate || dayItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Статус дня
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Пока нет оценённых активностей за сегодня
          </p>
        </CardContent>
      </Card>
    );
  }

  const recoveryPercent = Math.min(
    100,
    (aggregate.recovery / (aggregate.recovery + aggregate.strain)) * 100
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Статус дня
          </CardTitle>
          {balanceStatus && (
            <Badge
              variant={
                balanceStatus.status === "critical"
                  ? "destructive"
                  : balanceStatus.status === "good"
                  ? "default"
                  : "secondary"
              }
            >
              {balanceStatus.label}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <TrendingUp className="h-4 w-4" />
              Восстановление
            </span>
            <span className="font-medium">{aggregate.recovery.toFixed(1)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <TrendingDown className="h-4 w-4" />
              Напряжение
            </span>
            <span className="font-medium">{aggregate.strain.toFixed(1)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Баланс (RLI)</span>
            <span
              className={
                aggregate.delta >= 0 ? "text-green-600" : "text-red-600"
              }
            >
              {aggregate.delta > 0 ? "+" : ""}
              {aggregate.delta.toFixed(1)}
            </span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full transition-all ${
                balanceStatus?.status === "critical"
                  ? "bg-red-500"
                  : balanceStatus?.status === "good"
                  ? "bg-green-500"
                  : "bg-yellow-500"
              }`}
              style={{ width: `${recoveryPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            На основе {dayItems.length} оценённых активностей
          </p>
        </div>

        {balanceStatus && (
          <div className="pt-2 border-t">
            <p className="text-sm">
              {balanceStatus.status === "critical" && (
                <>
                  <span className="font-medium text-red-600">
                    Рекомендация:
                  </span>{" "}
                  Запланируйте восстанавливающие активности
                </>
              )}
              {balanceStatus.status === "good" && (
                <>
                  <span className="font-medium text-green-600">Отлично!</span>{" "}
                  Хороший баланс между напряжением и восстановлением
                </>
              )}
              {balanceStatus.status === "warning" && (
                <>
                  <span className="font-medium text-yellow-600">
                    Внимание:
                  </span>{" "}
                  Постарайтесь добавить больше восстанавливающих активностей
                </>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
