type TaskListUpdate = {
  boardId?: string;
  title?: string;
}

export default async function requestUpdateTaskList(id: string, updates: TaskListUpdate) {
  const taskListUpdateResponse = await fetch('/api/tasklist', {
    method: "PATCH",
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      id,
      taskList: updates
    })
  })

  return taskListUpdateResponse.json();
}