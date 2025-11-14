// 샘플 TypeScript 코드 - Prettier 및 ESLint 규칙 테스트용
export const sampleCode = `// 샘플 TypeScript 코드 - printWidth 효과를 명확하게 보여주는 예제
interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
}

// 배열 - printWidth에 따라 줄바꿈이 달라집니다
const colors = ["red", "green", "blue", "yellow", "purple", "orange", "pink", "brown", "black", "white"];

// 객체 - printWidth에 따라 줄바꿈이 달라집니다
const config = { printWidth: 80, tabWidth: 2, semi: true, singleQuote: false, trailingComma: "es5", bracketSpacing: true };

// 여러 속성을 가진 객체 배열 - printWidth 40일 때와 80일 때 차이가 명확합니다
const users = [
  { id: 1, name: "Alice", email: "alice@example.com", address: "123 Main St", phoneNumber: "555-1234" },
  { id: 2, name: "Bob", email: "bob@example.com", address: "456 Oak Ave", phoneNumber: "555-5678" },
  { id: 3, name: "Charlie", email: "charlie@example.com", address: "789 Pine Rd", phoneNumber: "555-9012" }
];

// 함수 매개변수 - printWidth에 따라 줄바꿈이 달라집니다
function createUser(id: number, name: string, email: string, address: string, phoneNumber: string, age: number) {
  return { id, name, email, address, phoneNumber, age };
}

// 체이닝 - printWidth에 따라 줄바꿈이 달라집니다
const filteredUsers = users.filter(user => user.id > 0).map(user => ({ ...user, active: true })).slice(0, 10);

// 화살표 함수 - arrowParens 테스트용
const findUser = (userId: number) => users.find(u => u.id === userId);

// 삼항 연산자와 긴 표현식 - printWidth에 따라 줄바꿈이 달라집니다
const message = filteredUsers.length > 0 ? "Users found: " + filteredUsers.length : "No users found";

// 함수 호출 - printWidth에 따라 매개변수 줄바꿈이 달라집니다
const newUser = createUser(4, "David", "david@example.com", "321 Elm St", "555-4321", 30);
`;

export default sampleCode;
