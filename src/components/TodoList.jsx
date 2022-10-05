import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { addTodos, deleteTodo, getTodos, updateTodo } from "../api/apiTodos";
const TodoList = () => {
  const [todos, setTodos] = useState("");
  const queryClient = useQueryClient();
  // fetching data
  const {
    data: Todos,
    isError,
    isLoading,
  } = useQuery(["todos"], getTodos, {
    select: (data) => data.sort((a, b) => b.id - a.id),
  });

  const addTodoMutation = useMutation(addTodos, {
    onSuccess: () => {
      // invalid cache and refresh
      queryClient.invalidateQueries("todos");
    },
  });

  // update todos

  const updateTodosMutation = useMutation(updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  // delete todos mutation
  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
      console.log("Item deleted !");
    },
  });

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    addTodoMutation.mutate({
      // id: new Date().toString(),
      id: Math.floor(Math.random() * 100),
      // name: "Mark zuckerberg",
      name: todos,
      completed: false,
    });
    setTodos("");
  };

  const insertForm = (
    <form onSubmit={handleSubmit}>
      <label htmlFor="addTodo">Enter the todos</label>
      <div>
        <input
          type="text"
          value={todos}
          onChange={(e) => {
            setTodos(e.target.value);
          }}
          placeholder="Enter the todos"
        />
      </div>
      <button>Add todos</button>
    </form>
  );
  // if error
  let message;
  if (isLoading) {
    message = "Loading .....";
  } else if (isError) {
    message = "SOmethig went wrong";
  } else {
    message = Todos.map((todo) => {
      return (
        <div key={todo?.id}>
          <p>{todo?.name}</p>
          <input
            type="checkbox"
            checked={todo?.completed}
            id={todo?.id}
            onChange={() =>
              updateTodosMutation.mutate({
                ...todo,
                completed: !todo.completed,
              })
            }
          />
          <p>{todo?.description}</p>
          <button onClick={() => deleteTodoMutation.mutate({ id: todo.id })}>
            Delete todos
          </button>
        </div>
      );
    });
  }
  return (
    <div>
      <main>
        <div>{insertForm}</div>
        {message}
      </main>
    </div>
  );
};

export default TodoList;
