// 샘플 TypeScript 코드 - Prettier 및 ESLint 규칙 테스트용
export const sampleCode = `// 샘플 TypeScript 코드 - 다양한 포맷팅 규칙 테스트
interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
}

// 긴 줄 - printWidth 테스트용
const longLineExample = "이것은 매우 긴 문자열입니다. printWidth 설정에 따라 줄바꿈이 달라집니다. 80자일 때와 120자일 때 차이를 확인하세요.";

// 배열 - trailingComma 테스트용
const colors = ["red", "green", "blue", "yellow", "purple", "orange", "pink", "brown"];

// 객체 - bracketSpacing, trailingComma 테스트용
const config = { printWidth: 80, tabWidth: 2, semi: true, singleQuote: false, trailingComma: "es5" };

function getUserData(userId: number): User | null {
  const users: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com", address: "123 Main St", phoneNumber: "555-1234" },
    { id: 2, name: "Bob", email: "bob@example.com", address: "456 Oak Ave", phoneNumber: "555-5678" },
    { id: 3, name: "Charlie", email: "charlie@example.com", address: "789 Pine Rd", phoneNumber: "555-9012" }
  ];

  // 화살표 함수 - arrowParens 테스트용
  const user = users.find(u => u.id === userId);

  if (!user) {
    console.log("User not found");
    return null;
  }

  return user;
}

// 함수 호출 - printWidth 테스트용
const result = getUserData(1);
if (result) {
  console.log(\`Found user: \${result.name} at \${result.address}\`);
}

// 여러 매개변수 - printWidth 테스트용
function createUser(id: number, name: string, email: string, address: string, phoneNumber: string) {
  return { id, name, email, address, phoneNumber };
}
`;

export default sampleCode;
