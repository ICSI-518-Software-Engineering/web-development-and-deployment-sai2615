import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ItemForm.module.css';

function ItemForm({ itemToUpdate, onSave }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (itemToUpdate) {
      setName(itemToUpdate.name);
      setQuantity(itemToUpdate.quantity.toString());
      // Note: Existing image handling isn't changed. Image re-upload required for updates.
    }
  }, [itemToUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Name validation
    if (!name.trim()) {
      alert('Name cannot be empty.');
      return;
    }

    // Quantity validation
    const quantityNum = Number(quantity);
    if (!quantityNum || quantityNum <= 0) {
      alert('Quantity must be a positive number.');
      return;
    }

    // Image validation
    if (!image) {
      alert('Please upload an image.');
      return;
    } else {
      const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!validTypes.includes(image.type)) {
        alert('Image must be in .png, .jpg, or .jpeg format.');
        return;
      }
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('quantity', quantityNum);
    if (image) formData.append('image', image);

    const method = itemToUpdate ? 'PUT' : 'POST';
    const url = itemToUpdate ? `/api/items/${itemToUpdate._id}` : '/api/items';

    try {
      const response = await fetch(url, { method, body: formData });
      if (response.ok) {
        onSave();
        navigate('/'); // Redirect to the homepage after successful operation
      } else {
        alert('Failed to save the item.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving the item.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Image:</label>
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          {itemToUpdate ? 'Update Item' : 'Add Item'}
        </button>
      </form>
    </div>
  );
}

export default ItemForm;