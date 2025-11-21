import React from 'react';

export default function ItemList({ items, onEdit, onDelete }) {
  return (
    <div>
      <h3>Items</h3>
      {items.length === 0 && <div>No items yet</div>}
      <ul>
        {items.map(it => (
          <li key={it._id} style={{marginBottom:10}}>
            <strong>{it.name}</strong> — {it.description || 'no desc'} <br />
            Mobile: {it.mobileNumber || '—'} {it.mobileDetails ? `(${it.mobileDetails.countryCallingCode} ${it.mobileDetails.countryName})` : ''}
            <br />
            <button onClick={()=>onEdit(it)}>Edit</button>
            <button onClick={()=>onDelete(it._id)} style={{marginLeft:6}}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
