import './App.css'
import TodoTemplate from "./components/TodoTemplate.tsx";
import TodoInsert from "./components/TodoInsert.tsx";


function App() {
    return (
        <>
            {/*<DelayedCounter />*/}
            {/*<Counter />*/}
            <TodoTemplate>
                <TodoInsert/>
            </TodoTemplate>
        </>
    )
}

export default App
