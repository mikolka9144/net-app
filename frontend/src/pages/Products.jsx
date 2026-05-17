import React, { useEffect, useState } from 'react';
import { fetchItems, createItem } from '../api';

export default function Products() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', price: '' });

  useEffect(() => {
    fetchItems().then(setItems);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await createItem({ name: form.name, price: Number(form.price) });
    setForm({ name: '', price: '' });
    fetchItems().then(setItems);
  };

  return (
    <div>
      <h1>Products</h1>

      <ul>
        {items.map(i => (
          <li key={i.id}>{i.name} – {i.price} PLN</li>
        ))}
      </ul>

      <h2>Add product</h2>
      <form onSubmit={submit}>
        <input name="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" required />
        <input name="price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Price" required />
        <button>Add</button>
      </form>
    </div>
  );
}
