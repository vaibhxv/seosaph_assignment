import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Input, FormControl, FormLabel } from '@chakra-ui/react';

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddUser = async () => {
    if (!username || !email || !description || !role) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      await axios.post('http://localhost:8989/api/users', { username, email, description, role });
      navigate('/');  // Redirect to home page after adding user
    } catch (err) {
      setError('Error adding user.');
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Box p={6} className="bg-white rounded-lg shadow-md w-full max-w-lg">
        <h1 className='text-2xl font-bold'>Add a new user</h1>
        <br></br>
        <div className="space-y-4">
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Role</FormLabel>
            <Input
              placeholder="Enter role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1"
            />
          </FormControl>
          <br></br>

          {error && <Box className="text-red-500 mt-2">{error}</Box>}

          <div className="flex space-x-4 mt-6">
            <Button colorScheme="teal" onClick={handleAddUser}>Add User</Button>
            <Button colorScheme="blue" onClick={() => navigate('/')}>Back</Button>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default AddUser;
