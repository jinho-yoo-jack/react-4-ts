import './App.css'
import DelayedCounter from "./Delay.tsx";
import Counter from "./Counter.tsx";
import ProfilePage from "./page/ProfilePage.tsx";


function App() {
    return (
        <>
            <DelayedCounter />
            <Counter />
            <ProfilePage />
            {/*<TodoTemplate>Todo App을 만들자.</TodoTemplate>*/}
            {/*<BarChart />*/}

        </>
    )
}

export default App
