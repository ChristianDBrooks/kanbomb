
export interface TaskUpdate {
  text?: string;
  complete?: boolean;
}

export default async function requestUpdateTask(id: string, updates: TaskUpdate) {
  const taskListUpdateResponse = await fetch('/api/task', {
    method: "PATCH",
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      id,
      task: updates
    })
  })

  return taskListUpdateResponse.json();
}