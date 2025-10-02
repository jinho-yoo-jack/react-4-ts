import React from 'react';

// 1. Button 컴포넌트가 받을 props의 타입을 정의합니다.
// React의 표준 버튼 속성을 확장하여 onClick, type 등 모든 속성을 받을 수 있게 합니다.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode; // 버튼 내부에 들어갈 텍스트나 아이콘
}

export function Button({ children, disabled, ...rest }: ButtonProps) {

    // 2. disabled 상태에 따라 다른 스타일을 적용합니다.
    const buttonStyle: React.CSSProperties = {
        padding: '8px 16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: disabled ? 'not-allowed' : 'pointer', // 비활성화 시 커서 변경
        opacity: disabled ? 0.6 : 1, // 비활성화 시 투명도 조절
        backgroundColor: disabled ? '#e9e9e9' : '#007bff',
        color: disabled ? '#888' : 'white',
    };

    // 3. 실제 <button> 엘리먼트를 렌더링합니다.
    // disabled 속성과 스타일을 적용하고, 나머지 props(...rest)를 그대로 전달합니다.
    return (
        <button style={buttonStyle} disabled={disabled} {...rest}>
            {children}
        </button>
    );
}