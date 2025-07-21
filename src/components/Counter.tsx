import {useReducer} from "react";

type Action = { type: 'plus' } | { type: 'minus' } // union type을 활용하여 타입 별칭으로 다음과 같이 타입을 지정가능합니다.

const initNumber: number = 100;
const reducer = (number: number, action: Action): number => {
    switch (action.type) {
        case 'plus':
            return number + 1;
        case 'minus':
            return number - 1;
        default :
            return number;
    }
}


function Counter() {
    const [number, dispatch] = useReducer(reducer, initNumber);
    const plusHandler = () => dispatch({type: 'plus'});
    const minusHandler = () => dispatch({type: 'minus'});

    return (
        <div>
            <h1> {number}</h1>
            <button onClick={plusHandler}>plus</button>
            <button onClick={minusHandler}>minus</button>
        </div>
    )
}
export default Counter;