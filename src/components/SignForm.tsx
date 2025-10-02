// 실제 사용하는 React 컴포넌트
export const SignupForm = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // form의 기본 새로고침 동작 방지

        // 1. 이름 유효성 검사
        const nameValidationResult = checkIsNameValid(name);
        if (!nameValidationResult.ok) {
            alert(nameValidationResult.reason); // 실패 시 reason을 alert으로 표시
            return;
        }

        // 2. 나이 유효성 검사
        const ageAsNumber = Number(age);
        const ageValidationResult = checkIsAgeValid(ageAsNumber);
        if (!ageValidationResult.ok) {
            alert(ageValidationResult.reason); // 실패 시 reason을 alert으로 표시
            return;
        }

        // 3. 모든 유효성 검사 통과
        alert('유효성 검사 통과! 가입에 성공했습니다.');
        // 여기에 실제 서버로 데이터를 전송하는 로직을 추가
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>이름: </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label>나이: </label>
                <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />
            </div>
            <button type="submit">가입하기</button>
        </form>
    );
}