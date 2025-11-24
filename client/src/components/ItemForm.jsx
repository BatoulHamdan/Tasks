import { useState, useEffect } from 'react';
import { getCategories } from '../api';

export default function ItemForm({ onSaved, editingItem }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || '');
      setDescription(editingItem.description || '');
      setMobileNumber(editingItem.mobileNumber || '');
      setCategoryId(editingItem.category?._id || '');
    } else {
      setName('');
      setDescription('');
      setMobileNumber('');
      setCategoryId('');
    }
    setError('');
  }, [editingItem]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    onSaved({ 
      name, 
      description, 
      mobileNumber: mobileNumber || null,
      categoryId: categoryId || null
    });
  };

  return (
    <form onSubmit={submit}>
      <h3>{editingItem ? 'Edit Item' : 'Add Item'}</h3>
      {error && <div style={{color:'red'}}>{error}</div>}
      <div>
        <label>Name</label><br />
        <input value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
        <label>Description</label><br />
        <input value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Mobile Number (optional)</label><br />
        <input value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} placeholder="+999999999" />
      </div>
      <div>
        <label>Category</label><br />
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          <option value="">-- Select category --</option>
          {(Array.isArray(categories) ? categories : []).map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <button type="submit">{editingItem ? 'Update' : 'Add'}</button>
    </form>
  );
}
