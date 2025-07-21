import React from 'react';
import { Link } from 'react-router-dom';

function Employeeheader() {
  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="text-xl font-bold">Employee Dashboard</div>
        <nav className="space-x-4">
          <Link to="/employee/tokens" className="hover:underline">Tokens</Link>
          <Link to="/employee/exchanges" className="hover:underline">Exchanges</Link>
          <Link to="/employee/purchases" className="hover:underline">Purchases</Link>
          <Link to="/employee/order-management" className="hover:underline">Order Management</Link>
          <Link to="/employee/sales" className="hover:underline">Sales</Link>
          <Link to="/employee/test-reports" className="hover:underline">Test Reports</Link>
        </nav>
      </div>
    </header>
  );
}

export default Employeeheader;
