// 'quack' 메서드를 가진 모든 것을 나타내는 인터페이스
interface CanQuack {
    quack(): void;
}

class Duck {
    quack() {
        console.log("꽥꽥!");
    }
    // 다른 메서드
    swim() {
        console.log("수영을 합니다.");
    }
}

class Robot {
    quack() {
        console.log("기계음: 꽥-꽥.");
    }
}

// 이 함수는 'CanQuack' 인터페이스의 구조를 만족하는 모든 객체를 받을 수 있습니다.
function makeItQuack(entity: CanQuack) {
    entity.quack();
}

const donald = new Duck();
const terminator = new Robot();

makeItQuack(donald);     // 출력: 꽥꽥!
makeItQuack(terminator); // 출력: 기계음: 꽥-꽥