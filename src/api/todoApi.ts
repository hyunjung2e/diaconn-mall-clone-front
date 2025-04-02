// const API_URL = 'http://localhost:8080/api/todos';

// export const getTodos = async () => {
//   const response = await fetch(API_URL);
//   const data = await response.json();
//   return Array.isArray(data) ? data : [];
// };

// export const addTodo = async (title: string) => {
//   await fetch(API_URL, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ title, completed: false }),
//   });
// };

// export const deleteTodo = async (id: number) => {
//   await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
// };
