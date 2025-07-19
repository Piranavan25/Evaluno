export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-6">Welcome to Evaluno</h1>
      <div className="space-x-4">
        <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded">Register</a>
        <a href="/login" className="bg-gray-700 text-white px-4 py-2 rounded">Login</a>
      </div>
    </main>
  );
}
