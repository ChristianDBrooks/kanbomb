export default async function requestAddTask(id: string) {
  const addTaskResponse = await fetch('/api/task', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      task: {
        taskListId: id,
        text: '',
        complete: false
      }
    })
  })

  return addTaskResponse.json();
}