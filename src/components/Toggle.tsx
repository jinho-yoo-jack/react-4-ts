import {useState} from "react";

interface Switch {
    on: boolean;
}

const Toggle = () => {
    const [state, setToggle] = useState<Switch>({
        on: false,
    })

    const onToggleClick = () => {
        setToggle({on: !state.on})
    }

    return (
        <div>
            {/* 'on' 상태 변수를 직접 사용 */}
            <div>The button is {state ? 'on' : 'off'}</div>
            <button onClick={onToggleClick}>Toggle</button>
        </div>

    )
}

export default Toggle;
