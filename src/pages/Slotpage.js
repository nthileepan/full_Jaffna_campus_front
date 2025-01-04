import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SlotPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    slot_name: '',
    start_hour: '12',
    start_minute: '00',
    start_period: 'AM',
    end_hour: '12',
    end_minute: '00',
    end_period: 'AM',
  });
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState({
    add: false,
    update: false,
    delete: {},
  });

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/slots');
      setSlots(response.data || []);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
    if (showPopup) {
      // Reset form data when closing the popup
      setFormData({
        id: '',
        slot_name: '',
        start_hour: '12',
        start_minute: '00',
        start_period: 'AM',
        end_hour: '12',
        end_minute: '00',
        end_period: 'AM',
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

  const to24Hour = (hour, minute, period) => {
    let hr = parseInt(hour, 10);
    const min = minute;
    if (period === 'PM' && hr !== 12) {
      hr += 12;
    }
    if (period === 'AM' && hr === 12) {
      hr = 0;
    }
    return `${hr.toString().padStart(2, '0')}:${min}`;
  };

  const to12Hour = (time24) => {
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return { hour: hour.toString(), minute, period };
  };

  const handleAdd = async () => {
    const formattedStartTime = to24Hour(
      formData.start_hour,
      formData.start_minute,
      formData.start_period
    );
    const formattedEndTime = to24Hour(
      formData.end_hour,
      formData.end_minute,
      formData.end_period
    );

    if (formattedStartTime >= formattedEndTime) {
      alert('End time must be after start time');
      return;
    }

    setIsLoading((prev) => ({ ...prev, add: true }));
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/slots',
        {
          slot_name: formData.slot_name,
          start_time: formattedStartTime,
          end_time: formattedEndTime,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      console.log('Slot added successfully:', response.data);
      fetchSlots();
      togglePopup();
    } catch (error) {
      console.error('Full error object:', error);

      if (error.response) {
        console.error('Error response data:', error.response.data);
        alert(error.response.data.message || 'Failed to add slot');
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('No response from server');
      } else {
        console.error('Error setting up request:', error.message);
        alert('Error setting up request');
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, add: false }));
    }
  };

  const handleUpdate = async () => {
    if (!formData.id) {
      alert('Slot ID is missing!');
      return;
    }

    const formattedStartTime = to24Hour(
      formData.start_hour,
      formData.start_minute,
      formData.start_period
    );
    const formattedEndTime = to24Hour(
      formData.end_hour,
      formData.end_minute,
      formData.end_period
    );

    if (formattedStartTime >= formattedEndTime) {
      alert('End time must be after start time');
      return;
    }

    setIsLoading((prev) => ({ ...prev, update: true }));
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/slots/${formData.id}`,
        {
          slot_name: formData.slot_name,
          start_time: formattedStartTime,
          end_time: formattedEndTime,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      console.log('Slot updated successfully:', response.data);
      fetchSlots();
      togglePopup();
    } catch (error) {
      console.error('Full error object:', error);

      if (error.response) {
        console.error('Error response data:', error.response.data);
        alert(error.response.data.message || 'Failed to update slot');
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('No response from server');
      } else {
        console.error('Error setting up request:', error.message);
        alert('Error setting up request');
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, update: false }));
    }
  };

  const handleEdit = (slot) => {
    if (slot) {
      const start = to12Hour(slot.start_time);
      const end = to12Hour(slot.end_time);
      setFormData({
        id: slot.id,
        slot_name: slot.slot_name,
        start_hour: start.hour,
        start_minute: start.minute,
        start_period: start.period,
        end_hour: end.hour,
        end_minute: end.minute,
        end_period: end.period,
      });
      setEditMode(true);
      togglePopup();
    }
  };

  const handleDelete = async (id) => {
    setIsLoading((prev) => ({ ...prev, delete: { [id]: true } }));
    try {
      await axios.delete(`http://127.0.0.1:8000/api/slots/${id}`);
      fetchSlots();
    } catch (error) {
      console.error('Error deleting slot:', error);
      alert('Failed to delete slot');
    } finally {
      setIsLoading((prev) => {
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
      cursor: isLoading.add || isLoading.update ? 'not-allowed' : 'pointer',
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

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0')
  );
  const periods = ['AM', 'PM'];

  const displayTime = (time24) => {
    const { hour, minute, period } = to12Hour(time24);
    return `${hour}:${minute} ${period}`;
  };

  return (
    <div>
      <h1>Slot Management</h1>
      <div style={{ marginBottom: '20px' }}>
        <button style={styles.addButton} onClick={togglePopup}>
          Add Slot
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Slot Name</th>
            <th style={styles.tableHeader}>Start Time</th>
            <th style={styles.tableHeader}>End Time</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot.id}>
              <td style={styles.tableCell}>{slot.slot_name}</td>
              <td style={styles.tableCell}>{displayTime(slot.start_time)}</td>
              <td style={styles.tableCell}>{displayTime(slot.end_time)}</td>
              <td style={styles.tableCell}>
                <button
                  style={styles.editButton}
                  onClick={() => handleEdit(slot)}
                >
                  Edit
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(slot.id)}
                  disabled={isLoading.delete[slot.id]}
                >
                  {isLoading.delete[slot.id] ? 'Deleting...' : 'Delete'}
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
            <h2 style={styles.label}>{editMode ? 'Edit' : 'Create'} Slot</h2>
            <form style={styles.form} onSubmit={handleSave}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Slot Name</label>
                <input
                  type="text"
                  name="slot_name"
                  value={formData.slot_name}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>

              {/* Start Time */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Start Time</label>
                <div style={styles.timeContainer}>
                  <select
                    name="start_hour"
                    value={formData.start_hour}
                    onChange={handleInputChange}
                    style={styles.select}
                    required
                  >
                    {hours.map((hr) => (
                      <option key={hr} value={hr}>
                        {hr}
                      </option>
                    ))}
                  </select>
                  <span style={styles.timeSeparator}>:</span>
                  <select
                    name="start_minute"
                    value={formData.start_minute}
                    onChange={handleInputChange}
                    style={styles.select}
                    required
                  >
                    {minutes.map((min) => (
                      <option key={min} value={min}>
                        {min}
                      </option>
                    ))}
                  </select>
                  <select
                    name="start_period"
                    value={formData.start_period}
                    onChange={handleInputChange}
                    style={styles.selectPeriod}
                    required
                  >
                    {periods.map((period) => (
                      <option key={period} value={period}>
                        {period}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* End Time */}
              <div style={styles.formGroup}>
                <label style={styles.label}>End Time</label>
                <div style={styles.timeContainer}>
                  <select
                    name="end_hour"
                    value={formData.end_hour}
                    onChange={handleInputChange}
                    style={styles.select}
                    required
                  >
                    {hours.map((hr) => (
                      <option key={hr} value={hr}>
                        {hr}
                      </option>
                    ))}
                  </select>
                  <span style={styles.timeSeparator}>:</span>
                  <select
                    name="end_minute"
                    value={formData.end_minute}
                    onChange={handleInputChange}
                    style={styles.select}
                    required
                  >
                    {minutes.map((min) => (
                      <option key={min} value={min}>
                        {min}
                      </option>
                    ))}
                  </select>
                  <select
                    name="end_period"
                    value={formData.end_period}
                    onChange={handleInputChange}
                    style={styles.selectPeriod}
                    required
                  >
                    {periods.map((period) => (
                      <option key={period} value={period}>
                        {period}
                      </option>
                    ))}
                  </select>
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
    margin: '0 auto',
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
    zIndex: 1000,
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
    gap: '15px',
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
    height: '35px',
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  select: {
    width: '60px',
    height: '35px',
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    marginRight: '5px',
  },
  selectPeriod: {
    width: '80px',
    height: '35px',
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  timeContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  timeSeparator: {
    margin: '0 5px',
    fontSize: '18px',
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

export default SlotPage;
