      import React, { useState, useEffect } from 'react';
      import axios from 'axios';
      
      const AssignToModulePage = () => {
        const [showPopup, setShowPopup] = useState(false);
        const [assigntomodules, setAssigntomodules] = useState([]);
        const [lectures, setlectures] = useState([]);
        const [departments, setDepartments] = useState([]);
        const [modules, setModules] = useState([]);
        const [formData, setFormData] = useState({
          id: '',
          lecture_name: '',
          department_name: '',
          module_name: '',
        });
        const [editMode, setEditMode] = useState(false);
      
        useEffect(() => {
          fetchModules();
          fetchAssigntomodules();
          fetchLectures();
          fetchDepartments();
          console.log('form : ',formData)
      
        }, []);

        const fetchAssigntomodules = async () => {
          try {
            const response = await axios.get('http://127.0.0.1:8000/api/assign');
            setAssigntomodules(response.data.data || []);
            console.log('res : ',response.data)
          } catch (error) {
            console.error('Error fetching assigntomodules:', error);
          }
        };

        const fetchLectures = async () => {
          try {
            const response = await axios.get('http://127.0.0.1:8000/api/viewl');
            setlectures(response.data.data || []);
          } catch (error) {
            console.error('Error fetching lectures:', error);
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

        const fetchModules = async () => {
          try {
            const response = await axios.get('http://127.0.0.1:8000/api/viewm');
            setModules(response.data.data || []);
          } catch (error) {
            console.error('Error fetching modules:', error);
          }
        };
      
        
      
        const payload = {
          id: '',
          lecture_name: '',
          department_name: '',
          module_name: '',
        };
      
        console.log({
          lecture_name: formData.lecture_name,
          department_shortname: formData.department_name,
          module_name: formData.module_name, 
        });
        
        
      
        const handleInputChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
        };
      
        const togglePopup = () => {
          setShowPopup(!showPopup);
          if (showPopup) {
            setFormData({
              id: '',
              lecture_name: '',
              department_name: '',
              module_name: '',
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
      
          try {
            const response = await axios.post('http://127.0.0.1:8000/api/assign', {
              lecture_name: formData.lecture_name,
              department_name: formData.department_name,
              module_name: formData.module_name, 
            });
            console.log('Module added successfully:', response.data);
            fetchModules();
            fetchAssigntomodules();
            fetchLectures();
            fetchDepartments();
            togglePopup();
          } catch (error) {
            console.error('Error assign to module:', error);
          }
        };
      
        const handleUpdate = async () => {
          if (!formData.id) { // Correctly check for formData.id
            alert('ID is missing!');
            return;
          }
        
          try {
            const response = await axios.put(`http://127.0.0.1:8000/api/assign/${formData.id}`, {
              lecture_name: formData.lecture_name,
              department_name: formData.department_name,
              module_name: formData.module_name, 
            });
            console.log('Module updated successfully:', response.data);
            fetchAssigntomodules();
            togglePopup();
          } catch (error) {
            console.error('Error updating assign to modules:', error);
          }
        };
        
      
        const handleEdit = (assigntomodule) => {
          console.log('Editing Assign to Module:', assigntomodule); // Debug log
          if (assigntomodule) {
            setFormData({
              id: assigntomodule.id, // Correct the field here
              lecture_name: assigntomodule.lecture_name,
              department_shortname: assigntomodule.department_name,
              module_name: assigntomodule.module_name,
            });
            setEditMode(true);
            togglePopup();
          }
        };
      
        const handleDelete = async (assigntomodule_id) => {
          try {
              if (!assigntomodule_id) {
                  console.error('Invalid assigntomodule_id provided.');
                  return;
              }
              await axios.delete(`http://127.0.0.1:8000/api/assign/${assigntomodule_id}`);
              fetchAssigntomodules(); // Ensure this function is properly implemented
          } catch (error) {
              console.error('Error deleting assigntomodule:', error);
          }
      };
      
      
        return (
          <div>
            <h1>Module Management</h1>
            <div style={{ marginBottom: '20px' }}>
              <button style={styles.addButton} onClick={togglePopup}>
                Assign to Module
              </button>
            </div>
      
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Lecture Name</th>
                  <th style={styles.tableHeader}>Department Name</th>
                  <th style={styles.tableHeader}>Module Name</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assigntomodules.map((assigntomodule) => (
                  <tr key={assigntomodule.id}>
                    <td style={styles.tableCell}>{assigntomodule.lecture_name}</td>
                    <td style={styles.tableCell}>{assigntomodule.department_name}</td>
                    <td style={styles.tableCell}>{assigntomodule.module_name}</td>
                    <td style={styles.tableCell}>
                      <button style={styles.editButton} onClick={() => handleEdit(assigntomodule)}>
                        Edit
                      </button>
                      <button style={styles.deleteButton} onClick={() => handleDelete(assigntomodule.assigntomodule_id)}>
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
                  <h2 style={styles.heading}>{editMode ? 'Edit' : 'Create'} Lecture</h2>
                  <form style={styles.form} onSubmit={handleSave}>
                  <div style={styles.formGroup}>
                      <label style={styles.label}>Lecture Name</label>
                      <select
                        name="lecture_name"
                        value={formData.lecture_name}
                        onChange={handleInputChange}
                        style={styles.input}
                        required
                      >
                        <option value="lecture_id">Select Lecture</option>
                        {lectures.map((lex) => (
                          <option key={lex.lecture_id} value={lex.lecture_name}>
                            {lex.lecture_name} 
                          </option>
                        ))}
                      </select>
                    </div>
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
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Module Name</label>
                      <select
                        name="module_name"
                        value={formData.module_name}
                        onChange={handleInputChange}
                        style={styles.input}
                        required
                      >
                        <option value="">Select Module</option>
                        {modules.map((mod) => (
                          <option key={mod.module_id} value={mod.module_name}>
                            {mod.module_name} 
                          </option>
                        ))}
                      </select>
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
      
      export default AssignToModulePage;
      