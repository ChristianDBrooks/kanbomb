export default async function requestAddBoard(id: string) {
  const addTaskListResponse = await fetch('/api/tasklist', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      boardId: id
    })
  })

  return addTaskListResponse.json();
}