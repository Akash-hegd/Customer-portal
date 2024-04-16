import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";

interface Address {
  street: string;
  city: string;
}

interface Company {
  name: string;
}

interface User {
  id: number;
  name: string;
  company?: Company;
  address?: Address;
}

interface Customer {
  id: number;
  name: string;
  title: string;
  address: string;
  photos: string[];
}

const CustomerList: React.FC<{
  customers: Customer[];
  selectedCustomerId: number | null;
  onSelectCustomer: (id: number) => void;
}> = ({ customers, selectedCustomerId, onSelectCustomer }) => (
  <div className="customer-list">
    {customers.map((customer) => (
      <Link
        key={customer.id}
        to={`/customer/${customer.id}`}
        style={{
          textDecoration: "none",
          color: selectedCustomerId === customer.id ? "#333" : "#777",
        }}
      >
        <div
          className={`customer-card ${
            selectedCustomerId === customer.id ? "selected" : ""
          }`}
          onClick={() => onSelectCustomer(customer.id)}
        >
          <h3>{customer.name}</h3>
          <p>{customer.title}</p>
        </div>
      </Link>
    ))}
  </div>
);

const CustomerDetails: React.FC<{ customer: Customer }> = ({ customer }) => (
  <div className="customer-details">
    <h2>{customer.name}</h2>
    <p>{customer.title}</p>
    <p>{customer.address}</p>
    <div className="photo-grid">
      {customer.photos.map((photo, index) => (
        <img key={index} src={photo} alt={`Photo ${index + 1}`} />
      ))}
    </div>
  </div>
);

const App: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );

  useEffect(() => {
    axios
      .get<User[]>("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        setCustomers(
          response.data.map((user) => ({
            id: user.id,
            name: user.name,
            title: user.company ? user.company.name : "",
            address: user.address
              ? `${user.address.street}, ${user.address.city}`
              : "",
            photos: Array.from(
              { length: 9 },
              (_, i) => `https://picsum.photos/200/300?random=${i}`
            ),
          }))
        );
      });
  }, []);

  return (
    <Router>
      <div className="app">
        <CustomerList
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          onSelectCustomer={setSelectedCustomerId}
        />
        <Routes>
          <Route
            path="/customer/:id"
            element={
              <CustomerDetails
                customer={
                  customers.find(
                    (customer) => customer.id === selectedCustomerId
                  ) || {
                    id: 0,
                    name: "",
                    title: "",
                    address: "",
                    photos: [],
                  }
                }
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
