import React, { useState, useEffect } from 'react';
import { getItems, addItem, updateItem, deleteItem } from './api';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';

function App(){
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const resp = await getItems();
      setItems(resp.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load items');
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  const handleSaved = async (payload) => {
    try {
      if (editing) {
        await updateItem(editing._id, payload);
        setMessage('Updated');
        setEditing(null);
      } else {
        await addItem(payload);
        setMessage('Added');
      }
      await load();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      await deleteItem(id);
      setMessage('Deleted');
      await load();
    } catch (err) {
      console.error(err);
      setMessage('Delete failed');
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>Item Manager</h2>
      {message && <div style={{color:'green'}}>{message}</div>}
      <ItemForm onSaved={handleSaved} editingItem={editing} />
      <hr />
      {loading ? <div>Loading...</div> : <ItemList items={items} onEdit={i=>setEditing(i)} onDelete={handleDelete} />}
    </div>
  );
}

export default App;
