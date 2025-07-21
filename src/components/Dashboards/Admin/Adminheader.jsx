import React from 'react';
import { Link } from 'react-router-dom';

function Adminheader() {
  return (
    <header className="bg-yellow-700 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="text-xl font-bold">Admin Dashboard</div>
        <nav className="space-x-4">
          <Link to="/admin/file" className="hover:underline">File</Link>
          <Link to="/admin/tokens" className="hover:underline">Tokens</Link>
          <Link to="/admin/reports" className="hover:underline">Reports</Link>
          <Link to="/admin/silver-reserves" className="hover:underline">Silver Reserves</Link>
          <Link to="/admin/gold-reserves" className="hover:underline">Gold Reserves</Link>
        </nav>
      </div>
    </header>
  );
}

export default Adminheader;
