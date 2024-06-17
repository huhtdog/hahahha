import React, { useEffect, useState } from 'react';
import { supabase } from './createClient';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data);
    }
  };

  const addUser = async (firstName, lastName) => {
    const { data, error } = await supabase.from('users').insert([{ first_name: firstName, last_name: lastName }]);
    if (error) {
      console.error('Error adding user:', error);
    } else {
      setUsers([...users, ...data]);
      setFirstName('');
      setLastName('');
    }
  };

  const updateUser = async (userId, newFirstName, newLastName) => {
    const { data, error } = await supabase.from('users').update({ first_name: newFirstName, last_name: newLastName }).eq('id', userId);
    if (error) {
      console.error('Error updating user:', error);
    } else {
      setUsers(users.map(user => (user.id === userId ? data[0] : user)));
      setEditingUserId(null);
    }
  };

  const deleteUser = async (userId) => {
    const { error } = await supabase.from('users').delete().eq('id', userId);
    if (error) {
      console.error('Error deleting user:', error);
    } else {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    addUser(firstName, lastName);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    updateUser(editingUserId, newFirstName, newLastName);
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setNewFirstName(user.first_name);
    setNewLastName(user.last_name);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Staff Management</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              {editingUserId === user.id ? (
                <form onSubmit={handleUpdateUser}>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    style={{ marginRight: '10px' }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    style={{ marginRight: '10px' }}
                    required
                  />
                  <button type="submit" style={{ marginRight: '10px' }}>Update</button>
                  <button type="button" onClick={() => setEditingUserId(null)}>Cancel</button>
                </form>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{user.first_name} {user.last_name}</strong>
                  </div>
                  <div>
                    <button onClick={() => handleEdit(user)} style={{ marginRight: '10px' }}>Edit</button>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>No users found</p>
        )}
      </ul>
      
      <form onSubmit={handleAddUser} style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={{ marginRight: '10px', marginBottom: '10px' }}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={{ marginRight: '10px', marginBottom: '10px' }}
          required
        />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default Dashboard;
