// import React, { useEffect, useState } from 'react';
// import { Todo } from '../types/Todo.ts';
// import { getTodos, addTodo, deleteTodo } from '../api/todoApi.ts';

// const TodoList: React.FC = () => {
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [title, setTitle] = useState('');

//   useEffect(() => {
//     loadTodos();
//   }, []);

//   const loadTodos = async () => {
//     const data = await getTodos();
//     setTodos(data);
//   };

//   const handleAdd = async () => {
//     if (!title.trim()) return;
//     await addTodo(title);
//     setTitle('');
//     loadTodos();
//   };

//   const handleDelete = async (id: number) => {
//     await deleteTodo(id);
//     loadTodos();
//   };

//   return (
//     <div>
//       <h1>TODO List</h1>
//       <input value={title} onChange={(e) => setTitle(e.target.value)} />
//       <button onClick={handleAdd}>Add</button>
//       <ul>
//         {todos.map((todo) => (
//           <li key={todo.id}>
//             {todo.title}
//             <button onClick={() => handleDelete(todo.id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default TodoList;
