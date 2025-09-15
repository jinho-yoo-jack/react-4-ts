import {useState} from "react";
import {useConfirmModal} from "./ConfirmModal.tsx";

const Info = () => {
    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');

    const onChangeName = (e) => {
        setUsername(e.target.value);
    }

    const onChangeNickname = (e) => {
        setNickname(e.target.value);
    }

    return (
        <div>
            <div>
                <input value={username} onChange={onChangeName}/>
                <input value={nickname} onChange={onChangeNickname}/>
            </div>
            <div>
                <div>
                    <b>이름:</b> {username}
                    <b>닉네임:</b> {nickname}
                </div>
            </div>
        </div>
    )
}

export default Info;