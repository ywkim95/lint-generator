// 샘플 TypeScript 코드 - Prettier 및 ESLint 규칙 테스트용
export const sampleCode = `// 샘플 TypeScript 코드
interface User {
  id: number;
  name: string;
  email: string;
}

function getUserData(userId: number): User | null {
  const users: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" }
  ];

  const user = users.find(u => u.id === userId);

  if (!user) {
    console.log("User not found");
    return null;
  }

  return user;
}

const result = getUserData(1);
if (result) {
  console.log(\`Found user: \${result.name}\`);
}
`;

export default sampleCode;
