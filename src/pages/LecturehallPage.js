import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LecturehallPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [lecturehalls, setLecturehall] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    shortName: '',
    status: '',
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchLecturehall();
  }, []);

  const fetchLecturehall = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/viewlh');
      setLecturehall(response.data.data || []);
    } catch (error) {
      console.error('Error fetching lecturehall:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
    if (showPopup) {
      // Reset form data when closing the popup
      setFormData({
        id: '',
        fullName: '',
        shortName: '',
        status: '',
      });
      setEditMode(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editMode) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };

  const handleAdd = async () => {
    if (!formData.status || (formData.status !== 'Active' && formData.status !== 'Inactive')) {
      alert('Please select a valid status!');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/createlh', {
        lecturehall_name: formData.fullName,
        lecturehall_shortname: formData.shortName,
        lecturehall_status: formData.status,
      });
      console.log('Lecturehall added successfully:', response.data);
      fetchLecturehall();
      togglePopup();
    } catch (error) {
      console.error('Error adding lecturehall:', error);
    }
  };

  const handleUpdate = async () => {
    if (!formData.id) { // Correctly check for formData.id
      alert('Lecturehall ID is missing!');
      return;
    }
  
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/updatelh/${formData.id}`, {
        lecturehall_name: formData.fullName,
        lecturehall_shortname: formData.shortName,
        lecturehall_status: formData.status,
      });
      console.log('Lecturehall updated successfully:', response.data);
      fetchLecturehall();
      togglePopup();
    } catch (error) {
      console.error('Error updating lecturehall:', error);
    }
  };
  

  const handleEdit = (lecturehall) => {
    console.log('Editing Department:', lecturehall); // Debug log
    if (lecturehall) {
      setFormData({
        id: lecturehall.lecturehall_id, // Correct the field here
        fullName: lecturehall.lecturehall_name,
        shortName: lecturehall.lecturehall_shortname,
        status: lecturehall.lecturehall_status,
      });
      setEditMode(true);
      togglePopup();
    }
  };
  

  const handleDelete = async (lecturehall_id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/deletelh/${lecturehall_id}`);
      fetchLecturehall();
    } catch (error) {
      console.error('Error deleting lecturehall:', error);
    }
  };

  return (
    <div>
      <h1>Lecturehall Management</h1>
      <div style={{ marginBottom: '20px' }}>
        <button style={styles.addButton} onClick={togglePopup}>
          Add Lecturehall
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Lecturehall Full Name</th>
            <th style={styles.tableHeader}>Lecturehall Short Name</th>
            <th style={styles.tableHeader}>Status</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lecturehalls.map((lecturehall) => (
            <tr key={lecturehall.lecturehall_id}>
              <td style={styles.tableCell}>{lecturehall.lecturehall_name}</td>
              <td style={styles.tableCell}>{lecturehall.lecturehall_shortname}</td>
              <td style={styles.tableCell}>{lecturehall.lecturehall_status}</td>
              <td style={styles.tableCell}>
                <button style={styles.editButton} onClick={() => handleEdit(lecturehall)}>
                  Edit
                </button>
                <button style={styles.deleteButton} onClick={() => handleDelete(lecturehall.lecturehall_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <button
              onClick={togglePopup}
              style={styles.closeBtn}
              onMouseEnter={(e) => (e.target.style.color = 'darkred')}
              onMouseLeave={(e) => (e.target.style.color = 'red')}
            >
              ✖
            </button>
            <h2 style={styles.heading}>{editMode ? 'Edit' : 'Create'} Lecturehall</h2>
            <form style={styles.form} onSubmit={handleSave}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Lecturehall Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Lecturehall Short Name</label>
                <input
                  type="text"
                  name="shortName"
                  value={formData.shortName}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Lecturehall Status</label>
                <div>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      style={styles.radioInput}
                      checked={formData.status === 'Active'}
                      onChange={handleInputChange}
                    />
                    <span style={{ ...styles.radioCircle, backgroundColor: formData.status === 'Active' ? '#35943c' : '#ccc' }}></span>
                    Active
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      style={styles.radioInput}
                      checked={formData.status === 'Inactive'}
                      onChange={handleInputChange}
                    />
                    <span style={{ ...styles.radioCircle, backgroundColor: formData.status === 'Inactive' ? '#d9534f' : '#ccc' }}></span>
                    In Active
                  </label>
                </div>
              </div>
              <div style={styles.buttonContainer}>
                <button type="submit" style={styles.submitButton}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


const styles = {
  addButton: {
    backgroundColor: '#35943c',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  table: {
    width: '100%',
    margin: '1 auto', // Centers the table
    borderCollapse: 'collapse',
    marginBottom: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    padding: '10px',
    border: '1px solid #ccc',
    textAlign: 'left',
  },
  tableCell: {
    padding: '10px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '400px', // Reduced popup width
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px', // Reduced gap between fields
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {
    marginBottom: '5px',
    fontSize: '18px',
    color: '#333',
  },
  input: {
    width: '100%',
    height: '30px', // Smaller height
    padding: '5px', // Reduced padding
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  select: {
    width: '100%',
    height: '30px', // Consistent size with input
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center', // Center the button
  },
  submitButton: {
    backgroundColor: '#35943c',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    marginBottom: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  radioInput: {
    display: 'none', // Hide the default radio button
  },
  radioCircle: {
    display: 'inline-block',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid #ccc',
  },
  closeBtn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: 'red',
  },

  editButton: {
    backgroundColor: '#0275d8', // Blue color
    color: '#fff', // White text
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '14px',
    marginRight: '5px', // Space between buttons
    transition: 'all 0.3s ease',
  },
  // Hover effect for the edit button
  editButtonHover: {
    backgroundColor: '#025aa5', // Darker blue on hover
  },

  // Delete button styles
  deleteButton: {
    backgroundColor: '#d9534f', // Red color
    color: '#fff', // White text
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
  // Hover effect for the delete button
  deleteButtonHover: {
    backgroundColor: '#c9302c', // Darker red on hover
  },
};
export default LecturehallPage;
