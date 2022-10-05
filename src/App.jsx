import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TodoList from "./components/TodoList";
function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container w-full max-w-7xl mx-auto justify-center my-6">
        <TodoList />
      </div>
    </QueryClientProvider>
  );
}

export default App;
