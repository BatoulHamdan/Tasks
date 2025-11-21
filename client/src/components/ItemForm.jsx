import { useState, useEffect } from 'react';

export default function ItemForm({ onSaved, editingItem }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');

  useEffect(()=> {
    if (editingItem) {
      setName(editingItem.name || '');
      setDescription(editingItem.description || '');
      setMobileNumber(editingItem.mobileNumber || '');
    } else {
      setName(''); setDescription(''); setMobileNumber('');
    }
    setError('');
  }, [editingItem]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    onSaved({ name, description, mobileNumber: mobileNumber || null });
  };

  return (
    <form onSubmit={submit}>
      <h3>{editingItem ? 'Edit Item' : 'Add Item'}</h3>
      {error && <div style={{color:'red'}}>{error}</div>}
      <div>
        <label>Name</label><br />
        <input value={name} onChange={e=>setName(e.target.value)} />
      </div>
      <div>
        <label>Description</label><br />
        <input value={description} onChange={e=>setDescription(e.target.value)} />
      </div>
      <div>
        <label>Mobile Number (optional)</label><br />
        <input value={mobileNumber} onChange={e=>setMobileNumber(e.target.value)} placeholder="+999999999" />
      </div>
      <button type="submit">{editingItem ? 'Update' : 'Add'}</button>
    </form>
  );
}
