export default async function requestDeleteTaskList(id: string) {
  const deleteTaskListResponse = await fetch('/api/tasklist', {
    method: "DELETE",
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      taskListId: id
    })
  })

  return deleteTaskListResponse.json();
}