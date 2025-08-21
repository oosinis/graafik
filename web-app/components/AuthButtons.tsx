import React from 'react';

export function AuthButtons() {
  return (
    <div className="flex gap-2">
      <a href="/api/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</a>
      <a href="/api/auth/logout" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Logout</a>
    </div>
  );
}
