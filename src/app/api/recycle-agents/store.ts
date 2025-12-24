// Shared in-memory store using global to persist across module reloads in development
declare global {
  var recycleAgentsStore: Map<string, any> | undefined;
}

if (!global.recycleAgentsStore) {
  global.recycleAgentsStore = new Map();
}

export const recycleAgents = global.recycleAgentsStore;
