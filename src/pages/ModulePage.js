
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModulePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [modules, setModules] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    moduleName: '',
    departmentShortName: '',
    moduleHours: '',
    moduleStatus: '',
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchDepartments();
    fetchModules();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/view');
      setDepartments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchModules = async (departmentId = '') => {
    try {
      let response;
      if (departmentId) {
        response = await axios.get(`http://127.0.0.1:8000/api/departmentm/${departmentId}`);
      } else {
        response = await axios.get('http://127.0.0.1:8000/api/viewm');
      }
      setModules(response.data.data || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
      setModules([]); // Clear modules if there's an error
    }
  };

  const handleDepartmentChange = (e) => {
    const selectedDeptId = e.target.value;
    setSelectedDepartment(selectedDeptId);
    fetchModules(selectedDeptId);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
    if (showPopup) {
      setFormData({
        id: '',
        moduleName: '',
        departmentShortName: '',
        moduleHours: '',
        moduleStatus: '',
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
    if (!formData.moduleStatus || (formData.moduleStatus !== 'Active' && formData.moduleStatus !== 'Inactive')) {
      alert('Please select a valid status!');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/createm', {
        module_name: formData.moduleName,
        department_shortname: formData.departmentShortName,
        module_hours: formData.moduleHours,
        module_status: formData.moduleStatus,
      });
      console.log('Module added successfully:', response.data);
      fetchModules(selectedDepartment);
      togglePopup();
    } catch (error) {
      console.error('Error adding module:', error);
    }
  };

  const handleUpdate = async () => {
    if (!formData.id) {
      alert('Department ID is missing!');
      return;
    }
  
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/updatem/${formData.id}`, {
        module_name: formData.moduleName,
        department_shortname: formData.departmentShortName,
        module_hours: formData.moduleHours,
        module_status: formData.moduleStatus,
      });
      console.log('Module updated successfully:', response.data);
      fetchModules(selectedDepartment);
      togglePopup();
    } catch (error) {
      console.error('Error updating modules:', error);
    }
  };

  const handleEdit = (module) => {
    if (module) {
      setFormData({
        id: module.module_id,
        moduleName: module.module_name,
        departmentShortName: module.department_shortname,
        moduleHours: module.module_hours,
        moduleStatus: module.module_status,
      });
      setEditMode(true);
      togglePopup();
    }
  };

  const handleDelete = async (module_id) => {
    try {
      if (!module_id) {
        console.error('Invalid module_id provided.');
        return;
      }
      await axios.delete(`http://127.0.0.1:8000/api/deletem/${module_id}`);
      fetchModules(selectedDepartment);
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  return (
    <div>
      <h1>Module Management</h1>
      
      {/* Department Dropdown */}
      <div style={styles.filterContainer}>
        <label style={styles.label}>Filter by Department: </label>
        <select 
          value={selectedDepartment} 
          onChange={handleDepartmentChange} 
          style={styles.select}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.department_id} value={dept.department_id}>
              {dept.department_name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button style={styles.addButton} onClick={togglePopup}>
          Add Module
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Module Name</th>
            <th style={styles.tableHeader}>Department</th>
            <th style={styles.tableHeader}>Hours</th>
            <th style={styles.tableHeader}>Status</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((module) => (
            <tr key={module.module_id}>
              <td style={styles.tableCell}>{module.module_name}</td>
              <td style={styles.tableCell}>{module.department_shortname}</td>
              <td style={styles.tableCell}>{module.module_hours}</td>
              <td style={styles.tableCell}>{module.module_status}</td>
              <td style={styles.tableCell}>
                <button style={styles.editButton} onClick={() => handleEdit(module)}>
                  Edit
                </button>
                <button style={styles.deleteButton} onClick={() => handleDelete(module.module_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Rest of the existing popup code remains the same */}
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
            <h2 style={styles.heading}>{editMode ? 'Edit' : 'Create'} Module</h2>
            <form style={styles.form} onSubmit={handleSave}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Module Name</label>
                <input
                  type="text"
                  name="moduleName"
                  value={formData.moduleName}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Department</label>
                <select
                  name="departmentShortName"
                  value={formData.departmentShortName}
                  onChange={handleInputChange}
                  style={styles.select}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Hours</label>
                <input
                  type="number"
                  name="moduleHours"
                  value={formData.moduleHours}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <div>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="moduleStatus"
                      value="Active"
                      style={styles.radioInput}
                      checked={formData.moduleStatus === 'Active'}
                      onChange={handleInputChange}
                    />
                    <span style={{ ...styles.radioCircle, backgroundColor: formData.moduleStatus === 'Active' ? '#35943c' : '#ccc' }}></span>
                    Active
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="moduleStatus"
                      value="Inactive"
                      style={styles.radioInput}
                      checked={formData.moduleStatus === 'Inactive'}
                      onChange={handleInputChange}
                    />
                    <span style={{ ...styles.radioCircle, backgroundColor: formData.moduleStatus === 'Inactive' ? '#d9534f' : '#ccc' }}></span>
                    Inactive
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

  filterContainer: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
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

export default ModulePage;
