import {MdCheckBoxOutlineBlank, MdRemoveCircleOutline} from "react-icons/md";

const TodoItem = () => {
    return (
        <div className="TodoItemList">
            <div className="TodoItemList__checkbox">
                <MdCheckBoxOutlineBlank/>
                <div className="TodoItemList__text">할 일</div>
            </div>
            <div className="TodoItemList__remove">
                <MdRemoveCircleOutline/>
            </div>
        </div>
    )
}

export default TodoItem;