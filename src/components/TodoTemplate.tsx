import type {ReactNode} from "react";
import '../style/TodoTemplate.scss'


const TodoTemplate = ({children}: { children: ReactNode }) => {
    return (
        <div className="TodoTemplate">
            <div className="TodoTemplate__header">일정관리</div>
            <div className="TodoTemplate__body">{children}</div>
        </div>

    )
};

export default TodoTemplate;