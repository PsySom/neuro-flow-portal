import { ActivityFeed } from "@/features/activities/ActivityFeed";

export default function Activities() {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Активности</h1>
        <p className="text-muted-foreground">
          Управляйте своими активностями и оценивайте их влияние
        </p>
      </div>
      <ActivityFeed />
    </div>
  );
}
