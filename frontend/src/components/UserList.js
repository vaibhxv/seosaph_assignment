import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box, Button, Input, TableContainer, Table, Thead, Tbody, Tr, Th, Td,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  useDisclosure, IconButton, Spinner
} from '@chakra-ui/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import Nav from './Navbar';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8989/api/users?page=${page}&filter=${filter}`);
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const userId = new URLSearchParams(location.search).get('userId');
    if (userId) {
      fetchUserDetails(userId);
      onOpen();
    }
  }, [location.search, onOpen]);

  const fetchUserDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8989/api/users/${id}`);
      setSelectedUser(res.data);
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8989/api/users/${id}`);
      fetchUsers();  // Refresh the list after deletion
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`?userId=${id}`);
  };

  const handleSortToggle = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    const sortedUsers = [...users].sort((a, b) => {
      if (newSortOrder === 'asc') {
        return a.username.localeCompare(b.username);
      } else {
        return b.username.localeCompare(a.username);
      }
    });
    setUsers(sortedUsers);
  };

  return (
    <>
    <Nav />
    <div className="flex flex-col items-center bg-gray-50 min-h-screen p-6">
      {loading ? (
        <>
        <Spinner size="xl" className="m-8" />
        <h3>Sometimes hosted backend service on Render.com can take upto 60seconds to load.</h3>
        <h3>Thank You for being patient.</h3>
        </>
      ) : (
        <Box className="w-full bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <Input
            placeholder="Filter by username"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full max-w-sm"
          />
          <Link to='/add-user'>
            <Button colorScheme="teal" className="ml-4">+ Add User</Button>
          </Link>
        </div>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th className="flex items-center">
                  Username
                  <IconButton
                    aria-label="Sort Username"
                    icon={sortOrder === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    size="sm"
                    onClick={handleSortToggle}
                    ml={2}
                  />
                </Th>
                <Th>Email</Th>
                <Th>Description</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map(user => (
                <Tr key={user._id}>
                  <Td>{user.username}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.description.split(' ').slice(0, 5).join(' ')}{user.description.split(' ').length > 5 ? '...' : ''}</Td>
                  <Td>
                    <Button colorScheme="blue" onClick={() => handleViewDetails(user._id)} className="mr-2">View Details</Button>
                    <Button colorScheme="red" onClick={() => handleDelete(user._id)}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 rounded"
          >
            Previous
          </button>
          <span className="text-lg">
            Page {page} of {Math.ceil(total / 10)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page * 10 >= total}
            className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </Box>
      )}
     

      {/* User Details Modal */}
      {selectedUser && (
        <Modal isOpen={isOpen} onClose={() => { onClose(); navigate('/'); }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedUser.username}'s Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="space-y-2">
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Description:</strong> {selectedUser.description}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Registered On:</strong> {new Date(selectedUser.registrationDate).toLocaleDateString()}</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={() => { onClose(); navigate('/'); }}>Back</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
    </>
  );
};

export default UserList;
