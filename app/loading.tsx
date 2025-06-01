import React from 'react';

export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {/* You can replace this with your logo */}
          <div className="text-2xl font-bold text-blue-600">CSE Impact</div>
          <div className="mt-2 w-12 h-12 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin"></div>
        </div>
        <p className="text-gray-600 mt-4 text-sm">Chargement en cours...</p>
      </div>
    </div>
  );
}
