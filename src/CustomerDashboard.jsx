import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const LOCAL_KEY = 'sub_customers';

const CustomerDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    plan: '',
    price: '',
    start: '',
    end: '',
  });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) setCustomers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(customers));
  }, [customers]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = () => {
    const { name, phone, plan, price, start, end } = formData;
    if (!name || !phone || !plan || !price || !start || !end) {
      alert("Please fill all fields");
      return;
    }

    const updated = [...customers];
    if (editIndex !== null) {
      updated[editIndex] = formData;
      setEditIndex(null);
    } else {
      updated.push({ ...formData });
    }
    setCustomers(updated);
    setFormData({ name: '', phone: '', plan: '', price: '', start: '', end: '' });
  };

  const handleEdit = (index) => {
    setFormData(customers[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...customers];
    updated.splice(index, 1);
    setCustomers(updated);
    setEditIndex(null);
  };

  const calculateProgress = (start, end) => {
    const now = new Date();
    const s = new Date(start);
    const e = new Date(end);
    const total = e - s;
    const elapsed = now - s;
    const remaining = Math.max(0, Math.ceil((e - now) / (1000 * 60 * 60 * 24)));
    const percent = Math.min(100, Math.max(0, (elapsed / total) * 100));
    return { percent: Math.round(percent), remaining };
  };

  const chartData = {
    labels: customers.map((c) => c.name),
    datasets: [
      {
        label: 'Monthly Income ($)',
        data: customers.map((c) => parseFloat(c.price) || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <div className="bg-dark text-white p-3" style={{ minHeight: '100vh', width: '100%', maxWidth: '220px' }}>
        <h5 className="text-center">Admin Panel</h5>
        <ul className="nav flex-column mt-4">
          <li className="nav-item"><a className="nav-link text-white" href="#">Dashboard</a></li>
          <li className="nav-item"><a className="nav-link text-white" href="#">Customers</a></li>
          <li className="nav-item"><a className="nav-link text-white" href="#">Reports</a></li>
        </ul>
      </div>

      <div className="container-fluid mt-4">
        <h2>Customer Subscription Manager</h2>

        <div className="row g-2 mt-3">
          <div className="col-md-2 col-6">
            <input
              name="name"
              placeholder="Customer Name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 col-6">
            <input
              name="phone"
              placeholder="Phone Number"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 col-6">
            <input
              name="plan"
              placeholder="Plan"
              className="form-control"
              value={formData.plan}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 col-6">
            <input
              name="price"
              placeholder="Price"
              className="form-control"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 col-6">
            <input
              name="start"
              type="date"
              className="form-control"
              value={formData.start}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 col-6">
            <input
              name="end"
              type="date"
              className="form-control"
              value={formData.end}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-12 mt-2">
            <button className="btn btn-primary w-100" onClick={handleAddOrUpdate}>
              {editIndex !== null ? "Update" : "Add"}
            </button>
          </div>
        </div>

        <div className="mt-5">
          <h4>Monthly Revenue Chart</h4>
          <Bar data={chartData} />
        </div>

        <div className="table-responsive mt-4">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Plan</th>
                <th>Price</th>
                <th>Start</th>
                <th>End</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => {
                const { percent, remaining } = calculateProgress(c.start, c.end);
                return (
                  <tr key={i}>
                    <td>{c.name}</td>
                    <td>{c.phone}</td>
                    <td>{c.plan}</td>
                    <td>${c.price}</td>
                    <td>{c.start}</td>
                    <td>{c.end}</td>
                    <td>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${percent}%` }}
                          aria-valuenow={percent}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {percent}% - {remaining} days left
                        </div>
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(i)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(i)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;