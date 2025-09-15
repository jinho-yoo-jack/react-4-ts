// 실제 비즈니스 로직을 담고 있는 예시 컴포넌트
import {useConfirmModal, ConfirmModal} from "./ConfirmModal.tsx";

const MyComponent = () => {
    // 1. 훅을 호출하여 모달을 여는 함수(confirm)를 가져옵니다.
    const confirm = useConfirmModal();

    // 버튼 클릭 시 실행될 핸들러 함수
    const handleButtonClick = async () => {
        console.log("모달을 엽니다.");

        // 2. confirm 함수를 호출하고 사용자의 응답을 기다립니다.
        const userConfirmed = await confirm("이 작업을 정말로 실행하시겠습니까?");

        // 3. 사용자의 응답에 따라 다른 동작을 수행합니다.
        if (userConfirmed) {
            console.log("사용자가 '확인'을 눌렀습니다. API를 호출합니다.");
            // 여기에 실제 API 호출이나 비즈니스 로직을 넣습니다.
            alert("작업이 실행되었습니다!");
        } else {
            console.log("사용자가 '취소'를 눌렀습니다. 작업을 중단합니다.");
        }
    };

    return (
        <div>
            <p>아래 버튼을 누르면 확인 모달이 나타납니다.</p>
            <button
                onClick={handleButtonClick}
                style={{padding: '12px 20px', fontSize: '16px', cursor: 'pointer'}}
            >
                작업 실행
            </button>
        </div>
    );
};

export default MyComponent;