import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LecturePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [lectures, setlectures] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phoneno: '',
    gender: '',
    off_day:'',
    status: '',
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchlectures();
  }, []);

  const fetchlectures = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/viewl');
      setlectures(response.data.data || []);
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
    if (showPopup) {
      setFormData({
        id: '',
        name: '',
        phoneno: '',
        gender: '',
        off_day:'',
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
    // Convert phoneno to integer (if it's a valid number)
  const phoneNumber = parseInt(formData.phoneno, 11);

  // Check if the phone number is a valid integer
  if (isNaN(phoneNumber)) {
    alert('Please enter a valid phone number!');
    return;
  }
  
    try {
      console.log('Adding lecture with data:', formData); // Log the formData for debugging
      const response = await axios.post('http://127.0.0.1:8000/api/createl', {
        lecture_name: formData.name,
        lecture_phone_number: formData.phoneno,
        lecture_gender: formData.gender,
        off_day: formData.off_day,
        lecture_status: formData.status,
      });
      console.log('Lecture added successfully:', response.data);
      fetchlectures();
      togglePopup();
    } catch (error) {
      console.error('Error adding Lecture:', error);
      if (error.response) {
        // Server responded with an error
        console.error('Error Response:', error.response.data);
      } else {
        // Network error or timeout
        console.error('Error Message:', error.message);
      }
    }
  };
  

  const handleUpdate = async () => {
    if (!formData.id) { // Correctly check for formData.id
      alert('Lecture ID is missing!');
      return;
    }
  
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/updatel/${formData.id}`, {
        lecture_name: formData.name,
        lecture_phone_number: formData.phoneno,
        lecture_gender: formData.gender,
        off_day: formData.off_day,
        lecture_status: formData.status,
      });
      console.log('lecture updated successfully:', response.data);
      fetchlectures();
      togglePopup();
    } catch (error) {
      console.error('Error updating lecture:', error);
    }
  };
  

  const handleEdit = (lecture) => {
    console.log('Editing lecture:', lecture); // Debug log
    if (lecture) {
      setFormData({
        id: lecture.lecture_id, // Correct the field here
        name: lecture.lecture_name,
        phoneno: lecture.lecture_phone_number,
        gender: lecture.lecture_gender,
        off_day: lecture.off_day,
        status: lecture.lecture_status,
      });
      setEditMode(true);
      togglePopup();
    }
  };

  const handleDelete = async (lecture_id) => {
    try {
        if (!lecture_id) {
            console.error('Invalid lecture_id provided.');
            return;
        }
        await axios.delete(`http://127.0.0.1:8000/api/deletel/${lecture_id}`);
        fetchlectures(); // Ensure this function is properly implemented
    } catch (error) {
        console.error('Error deleting lecture:', error);
    }
};


  return (
    <div>
      <h1>Lecture Management</h1>
      <div style={{ marginBottom: '20px' }}>
        <button style={styles.addButton} onClick={togglePopup}>
          Add Lecture
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Lecture Name</th>
            <th style={styles.tableHeader}>Phone Number</th>
            <th style={styles.tableHeader}>Gender</th>
            <th style={styles.tableHeader}>Off Day</th>
            <th style={styles.tableHeader}>Status</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lectures.map((lecture) => (
            <tr key={lecture.lecture_id}>
              <td style={styles.tableCell}>{lecture.lecture_name}</td>
              <td style={styles.tableCell}>{lecture.lecture_phone_number}</td>
              <td style={styles.tableCell}>{lecture.lecture_gender}</td>
              <td style={styles.tableCell}>{lecture.off_day}</td>
              <td style={styles.tableCell}>{lecture.lecture_status}</td>
              <td style={styles.tableCell}>
                <button style={styles.editButton} onClick={() => handleEdit(lecture)}>
                  Edit
                </button>
                <button style={styles.deleteButton} onClick={() => handleDelete(lecture.lecture_id)}>
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
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="number"
                  name="phoneno"
                  value={formData.phoneno}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Gender</label>
                <div>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      style={styles.radioInput}
                      checked={formData.gender === 'Male'}
                      onChange={handleInputChange}
                    />
                    <span style={{ ...styles.radioCircle, backgroundColor: formData.gender === 'Male' ? '#35943c' : '#ccc' }}></span>
                    Male
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      style={styles.radioInput}
                      checked={formData.gender === 'Female'}
                      onChange={handleInputChange}
                    />
                    <span style={{ ...styles.radioCircle, backgroundColor: formData.gender === 'Female' ? '#d9534f' : '#ccc' }}></span>
                    Female
                  </label>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Off Day</label>
                <div>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="off_day"
                      value="Monday"
                      style={styles.radioInput}
                      checked={formData.gender === 'Monday'}
                      onChange={handleInputChange}
                    />
                    <span style={{ ...styles.radioCircle, backgroundColor: formData.off_day === 'Monday' ? '#35943c' : '#ccc' }}></span>
                    Monday
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="off_day"
                      value="Tuesday"
                      style={styles.radioInput}
                      checked={formData.gender === 'Tuesday'}
                      onChange={handleInputChange}
                    />
                    <span style={{ ...styles.radioCircle, backgroundColor: formData.off_day === 'Tuesday' ? '#d9534f' : '#ccc' }}></span>
                    Tuesday
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="off_day"
                      value="Wednesday"
                      style={styles.radioInput}
                      checked={formData.gender === 'Wednesday'}
                      onChange={handleInputChange}
                    />
                    <span style={{ ...styles.radioCircle, backgroundColor: formData.off_day === 'Wednesday' ? '#d9534f' : '#ccc' }}></span>
                    Wednesday
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="off_day"
                      value="Thursday"
                      style={styles.radioInput}
                      checked={formData.gender === 'Thursday'}
                      onChange={handleInputChange}
                    />
                    <span style={{ ...styles.radioCircle, backgroundColor: formData.off_day === 'Thursday' ? '#d9534f' : '#ccc' }}></span>
                    Thursday
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="off_day"
                      value="Friday"
                      style={styles.radioInput}
                      checked={formData.gender === 'Friday'}
                      onChange={handleInputChange}
                    />
                    <span style={{ ...styles.radioCircle, backgroundColor: formData.off_day === 'Friday' ? '#d9534f' : '#ccc' }}></span>
                    Friday
                  </label>
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
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

export default LecturePage;
