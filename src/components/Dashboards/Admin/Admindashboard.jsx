import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';

function Admindashboard() {
  const [stores, setStores] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeName, setStoreName] = useState('');
  const [employeeData, setEmployeeData] = useState({ name: '', mobile: '', storeId: '' });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const unsubscribeStores = onSnapshot(collection(db, 'stores'), (snapshot) => {
      setStores(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubscribeEmployees = onSnapshot(collection(db, 'employees'), (snapshot) => {
      setEmployees(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => {
      unsubscribeStores();
      unsubscribeEmployees();
    };
  }, []);

  const handleAddStore = async (e) => {
    e.preventDefault();
    if (!storeName.trim()) return;
    // Prevent duplicate store names
    if (stores.some(s => s.name.trim().toLowerCase() === storeName.trim().toLowerCase())) {
      showNotification('Store already exists', 'error');
      return;
    }
    await addDoc(collection(db, 'stores'), { name: storeName.trim(), createdAt: new Date().toISOString() });
    setStoreName('');
    setShowAddStoreModal(false);
    showNotification('Store added successfully', 'success');
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!employeeData.name.trim() || !employeeData.mobile.trim() || !employeeData.storeId) return;
    // Prevent duplicate mobile numbers
    if (employees.some(emp => emp.mobile === employeeData.mobile)) {
      showNotification('Employee with this mobile already exists', 'error');
      return;
    }
    await addDoc(collection(db, 'employees'), {
      name: employeeData.name.trim(),
      mobile: employeeData.mobile.trim(),
      storeId: employeeData.storeId,
      createdAt: new Date().toISOString(),
    });
    setEmployeeData({ name: '', mobile: '', storeId: '' });
    setShowAddEmployeeModal(false);
    showNotification('Employee added successfully', 'success');
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage stores and employees</p>
        </div>
        <button
          onClick={() => setShowAddStoreModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200"
        >
          Add Store
        </button>
      </div>
      {/* Stores List */}
      <div className="grid grid-cols-1 gap-6">
        {stores.map(store => (
          <div key={store.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{store.name}</h2>
                <p className="text-gray-600 mt-1">Store ID: {store.id}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedStore(store);
                  setEmployeeData({ ...employeeData, storeId: store.id });
                  setShowAddEmployeeModal(true);
                }}
                className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                Add Employee
              </button>
            </div>
            {/* Employees under this store */}
            <div className="p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Employees</h3>
              <div className="space-y-2">
                {employees.filter(emp => emp.storeId === store.id).length === 0 && (
                  <p className="text-gray-500">No employees yet.</p>
                )}
                {employees.filter(emp => emp.storeId === store.id).map(emp => (
                  <div key={emp.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">{emp.name}</p>
                      <p className="text-xs text-gray-500">Mobile: {emp.mobile}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Add Store Modal */}
      {showAddStoreModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
            <h3 className="text-xl font-semibold mb-4">Add Store</h3>
            <form onSubmit={handleAddStore} className="space-y-4">
              <input
                type="text"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                placeholder="Store Name"
                required
              />
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowAddStoreModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded-lg">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
            <h3 className="text-xl font-semibold mb-4">Add Employee to {selectedStore?.name}</h3>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <input
                type="text"
                value={employeeData.name}
                onChange={e => setEmployeeData({ ...employeeData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                placeholder="Employee Name"
                required
              />
              <input
                type="tel"
                value={employeeData.mobile}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (val.length <= 10) setEmployeeData({ ...employeeData, mobile: val });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                placeholder="Mobile Number (10 digits)"
                maxLength={10}
                required
              />
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowAddEmployeeModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded-lg">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 p-4 rounded-xl shadow-lg transition-all duration-300 z-[9999] ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <div className="flex items-center space-x-2 text-white">
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admindashboard;
