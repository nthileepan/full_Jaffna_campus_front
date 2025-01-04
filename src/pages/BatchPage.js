import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BatchPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [batches, setBatches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    prefix: '',
    department_name: '',
    batch_name: '',
    batch_short_date: '',
    batch_end_date: '',
    batch_status: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState({
    add: false,
    update: false,
    delete: {},
  });

  useEffect(() => {
    fetchBatches();
    fetchDepartments();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/batches');
      setBatches(response.data || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/view');
      setDepartments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
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
        prefix: '',
        department_name: '',
        batch_name: '',
        batch_short_date: '',
        batch_end_date: '',
        batch_status: '',
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
    if (!formData.batch_status) {
      alert('Please select a valid status!');
      return;
    }
    setIsLoading(prev => ({ ...prev, add: true }));
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/batches', {
        prefix: ' ',  // Always set prefix to empty string when adding
        department_name: formData.department_name,
        batch_name: formData.batch_name,
        batch_short_date: formData.batch_short_date,
        batch_end_date: formData.batch_end_date,
        batch_status: formData.batch_status,
      });
      console.log('Batch added successfully:', response.data);
      fetchBatches();
      togglePopup();
    } catch (error) {
      console.error('Error adding batch:', error);
    }finally {
      setIsLoading(prev => ({ ...prev, add: false }));
    }
  };

  const handleUpdate = async () => {
    if (!formData.id) {
      alert('Batch ID is missing!');
      return;
    }
    setIsLoading(prev => ({ ...prev, update: true }));
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/batches/${formData.id}`, {
        prefix: ' ', // Always set prefix to empty string when updating
        department_name: formData.department_name,
        batch_name: formData.batch_name,
        batch_short_date: formData.batch_short_date,
        batch_end_date: formData.batch_end_date,
        batch_status: formData.batch_status,
      });
      console.log('Batch updated successfully:', response.data);
      fetchBatches();
      togglePopup();
    } catch (error) {
      console.error('Error updating batch:', error);
    }finally {
      setIsLoading(prev => ({ ...prev, update: false }));
    }
  };

  const handleEdit = (batch) => {
    if (batch) {
      setFormData({
        id: batch.id,
        prefix: batch.prefix,
        department_name: batch.department_name,
        batch_name: batch.batch_name,
        batch_short_date: batch.batch_short_date,
        batch_end_date: batch.batch_end_date,
        batch_status: batch.batch_status,
      });
      setEditMode(true);
      togglePopup();
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(prev => ({ ...prev, delete: { [id]: true } }));
    try {
      await axios.delete(`http://127.0.0.1:8000/api/batches/${id}`);
      fetchBatches();
    } catch (error) {
      console.error('Error deleting batch:', error);
    } finally {
      setIsLoading(prev => {
        const newDelete = { ...prev.delete };
        delete newDelete[id];
        return { ...prev, delete: newDelete };
      });
    }
  };

  
  const renderSubmitButton = () => {
    const buttonStyle = {
      ...styles.submitButton,
      opacity: isLoading.add || isLoading.update ? 0.5 : 1,
      cursor: isLoading.add || isLoading.update ? 'not-allowed' : 'pointer'
    };

    return (
      <button 
        type="submit" 
        style={buttonStyle} 
        disabled={isLoading.add || isLoading.update}
      >
        {isLoading.add || isLoading.update ? 'Saving...' : 'Save'}
      </button>
    );
  };

  return (
    <div>
      <h1>Batch Management</h1>
      <div style={{ marginBottom: '20px' }}>
        <button style={styles.addButton} onClick={togglePopup}>
          Add Batch
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Department</th>
            <th style={styles.tableHeader}>Batch Name</th>
            <th style={styles.tableHeader}>Start Date</th>
            <th style={styles.tableHeader}>End Date</th>
            <th style={styles.tableHeader}>Status</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch.id}>
              <td style={styles.tableCell}>{batch.department_name}</td>
              <td style={styles.tableCell}>{batch.batch_name}</td>
              <td style={styles.tableCell}>{batch.batch_short_date}</td>
              <td style={styles.tableCell}>{batch.batch_end_date}</td>
              <td style={styles.tableCell}>{batch.batch_status}</td>
              <td style={styles.tableCell}>
                <button style={styles.editButton} onClick={() => handleEdit(batch)}>
                  Edit
                </button>
                <button 
                  style={styles.deleteButton} 
                  onClick={() => handleDelete(batch.id)}
                  disabled={isLoading.delete[batch.id]}
                >
                  {isLoading.delete[batch.id] ? 'Deleting...' : 'Delete'}
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
            <h2 style={styles.heading}>{editMode ? 'Edit' : 'Create'} Batch</h2>
            <form style={styles.form} onSubmit={handleSave}>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Department Name</label>
                <select
                  name="department_name"
                  value={formData.department_name}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department_shortname}>
                      {dept.department_shortname} 
                    </option>
                  ))}
                </select>
              </div>
              {/* Rest of the form remains the same */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Batch Name</label>
                <input
                  type="text"
                  name="batch_name"
                  value={formData.batch_name}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Start Date</label>
                <input
                  type="date"
                  name="batch_short_date"
                  value={formData.batch_short_date}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>End Date</label>
                <input
                  type="date"
                  name="batch_end_date"
                  value={formData.batch_end_date}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Batch Status</label>
                <div>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="batch_status"
                      value="Active"
                      style={styles.radioInput}
                      checked={formData.batch_status === 'Active'}
                      onChange={handleInputChange}
                    />
                    <span style={{ ...styles.radioCircle, backgroundColor: formData.batch_status === 'Active' ? '#35943c' : '#ccc' }}></span>
                    Active
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="batch_status"
                      value="Inactive"
                      style={styles.radioInput}
                      checked={formData.batch_status === 'Inactive'}
                      onChange={handleInputChange}
                    />
                    <span style={{ ...styles.radioCircle, backgroundColor: formData.batch_status === 'Inactive' ? '#d9534f' : '#ccc' }}></span>
                    In Active
                  </label>
                </div>
              </div>
              <div style={styles.buttonContainer}>
                {renderSubmitButton()}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles remain the same as in the original code


// Styles remain the same as in the original code


// Styles remain the same as in the Department Page
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
    margin: '1 auto',
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
    width: '400px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
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
    height: '30px',
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
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
    display: 'none',
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
    backgroundColor: '#0275d8',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '14px',
    marginRight: '5px',
    transition: 'all 0.3s ease',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
};

export default BatchPage;