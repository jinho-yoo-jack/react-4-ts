import './App.css'
import TodoTemplate from "./components/TodoTemplate.tsx";
import TodoInsert from "./components/TodoInsert.tsx";
import Info from "./components/Info.tsx";
import MyComponent from "./components/MyComponent.tsx";
import {ConfirmModal} from "./components/ConfirmModal.tsx";


function App() {
    return (
        <>
            {/*<DelayedCounter />*/}
            {/*<Counter />*/}
            <TodoTemplate>
                <TodoInsert/>
            </TodoTemplate>
            <Info/>
            <MyComponent/>
            <ConfirmModal />
        </>
    )
}

export default App
