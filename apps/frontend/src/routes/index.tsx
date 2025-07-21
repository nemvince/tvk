import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { o } from '../lib/orpc';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const planetQuery = useQuery(
    o.planet.find.queryOptions({ input: { id: 1 } })
  );

  if (planetQuery.isLoading) {
    return <div className="p-2">Loading...</div>;
  }
  if (planetQuery.isError) {
    return <div className="p-2">Error: {planetQuery.error.message}</div>;
  }
  if (!planetQuery.data) {
    return <div className="p-2">Planet not found</div>;
  }
  return (
    <div className="p-2">
      <h1 className="font-bold text-2xl">Welcome to the TVK!</h1>
      <p className="mt-4">This is the home page.</p>
      <h2 className="mt-6 font-semibold text-xl">Planet Details</h2>
      <p>ID: {planetQuery.data.id}</p>
      <p>Name: {planetQuery.data.name}</p>
    </div>
  );
}
