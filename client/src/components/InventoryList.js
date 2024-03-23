import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming axios is used for HTTP requests
import styles from './InventoryList.module.css'; // Update with your actual path

function InventoryList() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/items');
      setItems(response.data);
      if (response.data.length === 0) {
        alert("No items in inventory. Add some!");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleUpdateItem = async (id) => {
    try {
      await axios.put(`/api/items/${id}`, editingItem);
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`/api/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleChange = (e, field) => {
    setEditingItem({ ...editingItem, [field]: e.target.value });
  };

  const startEditing = (item) => {
    setEditingItem(item);
  };

  return (
    <div className={styles.listContainer}>
      {items.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>
                  <img src={item.imagePath || 'placeholder.jpg'} alt="item" style={{ width: '50px' }} />
                </td>
                <td>
                  {editingItem && editingItem._id === item._id ? (
                    <input type="text" value={editingItem.name} onChange={(e) => handleChange(e, 'name')} />
                  ) : (
                    item.name
                  )}
                </td>
                <td>
                  {editingItem && editingItem._id === item._id ? (
                    <input type="number" value={editingItem.quantity} onChange={(e) => handleChange(e, 'quantity')} />
                  ) : (
                    item.quantity
                  )}
                </td>
                <td>
                  {editingItem && editingItem._id === item._id ? (
                    <button onClick={() => handleUpdateItem(item._id)}>Save</button>
                  ) : (
                    <button onClick={() => startEditing(item)}>Update</button>
                  )}
                  <button onClick={() => handleDeleteItem(item._id)} className={styles.deleteButton}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No items in inventory. Add some!</p>
      )}
    </div>
  );
}

export default InventoryList;
