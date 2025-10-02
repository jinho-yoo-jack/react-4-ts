const ary = [1,2,3,4]
// i*2 --> ary
// 원본 데이터 오염 / 변경
// 한번 더 실행 하면, 4, 16, 6, 8


// 원본 데이터는 수정하지 않습니다.
const ary2 = ary.map(i => i * 2);
console.log(ary);
console.log(ary2);
