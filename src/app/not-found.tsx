import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-6xl font-bold text-gray-200 mb-4">404</h2>
      <h3 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h3>
      <p className="text-gray-500 mb-6">
        The project or page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="bg-blue-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-blue-700 transition"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
