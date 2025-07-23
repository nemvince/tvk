import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { auth } from '@/lib/auth';
import { o } from '../lib/orpc';

export const Route = createFileRoute('/')({
  component: Index,
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="p-2">
      <input
        className="border p-1"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
      />
      <input
        className="border p-1"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />
      <button
        onClick={() => {
          auth.signIn.email({
            email,
            password,
            callbackURL: '/',
          });
        }}
        type="button"
      >
        Login
      </button>
    </div>
  );
};

function Index() {
  const planetQuery = useQuery(
    o.planet.find.queryOptions({ input: { id: 1 } })
  );
  const session = auth.useSession();

  if (planetQuery.isLoading) {
    return <div className="p-2">Loading...</div>;
  }
  if (planetQuery.isError) {
    return <div className="p-2">Error: {planetQuery.error.message}</div>;
  }
  if (!planetQuery.data) {
    return <div className="p-2">Planet not found</div>;
  }

  if (!session.data) {
    return <Login />;
  }

  return (
    <div className="p-2">
      <h1 className="font-bold text-2xl">
        Welcome to the TVK, {session.data.user.name}!
      </h1>
      <p className="mt-4">This is the home page.</p>
      <h2 className="mt-6 font-semibold text-xl">Planet Details</h2>
      <p>ID: {planetQuery.data.id}</p>
      <p>Name: {planetQuery.data.name}</p>
    </div>
  );
}
