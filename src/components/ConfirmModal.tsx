import * as React from "react";
import {create} from "zustand/react";

interface ModalState {
    isOpen: boolean;
    message: string;
    resolvePromise?: (value: boolean) => void;
    open: (message: string) => Promise<boolean>;
    close: (result: boolean) => void;
}

// Zustand를 사용하여 모달 상태 스토어(store) 생성
const useModalStore = create<ModalState>((set) => ({
    isOpen: false,
    message: '',
    resolvePromise: undefined,
    open: (message) => {
        return new Promise((resolve) => {
            set({isOpen: true, message: message, resolvePromise: resolve});
        });
    },
    close: (result) => {
        set((state) => {
            state.resolvePromise?.(result);
            return {isOpen: false, message: '', resolvePromise: undefined};
        });
    },
}));

// ✨ 실제 컴포넌트에서 사용할 커스텀 훅
// eslint-disable-next-line react-refresh/only-export-components
export const useConfirmModal = () => {
    const open = useModalStore((state) => state.open);
    return open;
};


export const ConfirmModal = () => {
    const { isOpen, message, close } = useModalStore();
    //
    if (!isOpen) {
        return null;
    }

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <p style={{margin: '0 0 20px 0'}}>Message</p>
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                    <button style={styles.buttonSecondary} onClick={() => close(false)}>취소</button>
                    <button style={styles.buttonPrimary} onClick={() => close(true)}>확인</button>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    // Modal Styles
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    modalContent: {
        background: 'white',
        padding: '25px',
        borderRadius: '8px',
        minWidth: '300px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
    },
    buttonPrimary: {
        background: '#007bff',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    buttonSecondary: {
        background: '#7d6c6c',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer'
    },
};