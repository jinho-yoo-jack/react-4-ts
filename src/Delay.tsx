import { useState } from 'react';

function DelayedCounter() {
    const [count, setCount] = useState(0);

    // 이 이벤트 핸들러는 각 렌더링마다 새로 생성됩니다.
    const handleAlertClick = () => {
        // setTimeout의 콜백 함수는 클로저입니다.
        // 이 함수는 'handleAlertClick'함수가 생성될 당시의 `count` 값을 "기억"합니다.
        setTimeout(() => {
            alert('Alert: count is ' + count);
        }, 3000);
    };

    return (
        <div>
            <h3>클로저 예시</h3>
            <p>You clicked {count} times</p>

            {/* setCount를 호출하면 컴포넌트가 리렌더링됩니다. */}
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>

            {/* 이 버튼은 클릭 시점의 count 값을 기준으로 alert를 예약합니다. */}
            <button onClick={handleAlertClick}>
                Show alert after 3 seconds
            </button>
        </div>
    );
}

export default DelayedCounter;