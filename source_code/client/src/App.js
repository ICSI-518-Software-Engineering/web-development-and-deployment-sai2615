import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import InventoryList from './components/InventoryList';
import MovieList from './components/MovieList';
import ItemForm from './components/ItemForm';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    refreshItems();
  }, []);

  const refreshItems = async () => {
    const response = await fetch('/api/items');
    const data = await response.json();
    setItems(data);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    navigate('/edit'); // Navigate to the ItemForm for editing
  };

  const handleDeleteItem = async (itemId) => {
    await fetch(`/api/items/${itemId}`, { method: 'DELETE' });
    setMessage('Item deleted successfully.'); // Set a success message
    refreshItems(); // Refresh the item list after deletion
  };

  // Show the success message and then clear it after 3 seconds
  useEffect(() => {
    if (message !== '') {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="App">
      <Navbar />
      {message && <div className="message">{message}</div>} {/* Display the success message */}
      <Routes>
        <Route path="/movies" element={<MovieList />} />
        <Route path="/" element={
          <InventoryList 
            items={items} 
            onSelectItem={handleSelectItem} 
            onDeleteItem={handleDeleteItem} 
          />}
        />
        <Route path="/add" element={
          <ItemForm 
            onSave={() => {
              setMessage('Item added/updated successfully.'); // Set a success message
              refreshItems();
              navigate('/'); // Navigate back to the list after saving
            }} 
          />}
        />
        <Route path="/edit" element={
          <ItemForm 
            itemToUpdate={selectedItem} 
            onSave={() => {
              setMessage('Item added/updated successfully.'); // Reuse the success message
              refreshItems();
              navigate('/'); // Navigate back to the list after saving
            }} 
          />}
        />
      </Routes>
    </div>
  );
}

export default App;
