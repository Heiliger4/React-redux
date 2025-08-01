import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminDashboard = () => {
  const [users, setUsers] = useState([
    // Mock data - replace with actual API call
    { id: '1', email: 'admin@example.com', role: 'admin', createdAt: '2024-01-01' },
    { id: '2', email: 'user@example.com', role: 'user', createdAt: '2024-01-02' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roleDialog, setRoleDialog] = useState({ open: false, user: null, newRole: '' });

  const handleRoleChange = async (userId, newRole) => {
    setLoading(true);
    try {
      // TODO: Implement actual API call to update user role
      console.log(`Updating user ${userId} role to ${newRole}`);
      
      // Mock update
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      setRoleDialog({ open: false, user: null, newRole: '' });
    } catch (err) {
      setError('Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    setLoading(true);
    try {
      // TODO: Implement actual API call to delete user
      console.log(`Deleting user ${userId}`);
      
      // Mock delete
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    return role === 'admin' ? <AdminPanelSettingsIcon /> : <PersonIcon />;
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? 'secondary' : 'primary';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AdminPanelSettingsIcon color="secondary" />
        Admin Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage users and their roles
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Typography variant="body2">{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getRoleIcon(user.role)}
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setRoleDialog({ 
                        open: true, 
                        user, 
                        newRole: user.role 
                      })}
                      disabled={loading}
                      sx={{ mr: 1 }}
                    >
                      Change Role
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Role Change Dialog */}
      <Dialog open={roleDialog.open} onClose={() => setRoleDialog({ open: false, user: null, newRole: '' })}>
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Change role for {roleDialog.user?.email}
          </Typography>
          <Select
            value={roleDialog.newRole}
            onChange={(e) => setRoleDialog(prev => ({ ...prev, newRole: e.target.value }))}
            fullWidth
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialog({ open: false, user: null, newRole: '' })}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleRoleChange(roleDialog.user?.id, roleDialog.newRole)}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Update Role'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard; 