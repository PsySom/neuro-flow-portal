// Re-export all functions with backward compatibility
export {
  useActivitiesApi as useActivities,
  useTodayActivitiesApi as useTodayActivities, 
  useActivitiesRangeApi as useActivitiesRange,
  useActivityTypesApi as useActivityTypes,
  useCreateActivityApi as useCreateActivity,
  useUpdateActivityApi as useUpdateActivity,
  useDeleteActivityApi as useDeleteActivity,
  useToggleActivityStatusApi as useToggleActivityStatus,
  useActivitiesSyncApi as useActivitiesSync
} from './useActivitiesApi';

// Legacy exports for backward compatibility
export * from './useActivitiesApi';