import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root");

const Scheduler = () => {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    subject: "",
    startDate: "",
    endDate: "",
    lecture: "",
    lecture_id: "", // Explicitly initialized
    department: "",
    batch: "",
    lectureHall: "",
  });
  const [isEditable, setIsEditable] = useState(false);
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/timetable"
        );
        console.log(response.data);
        const eventsData = response.data.data.map((event) => ({
          id: event.id,
          title: event.subject,
          start: event.start_date,
          end: event.end_date,
          lecture: event.lecture,
          lecture_id: event.lecture_id, // Added lecture_id to events
          department: event.department,
          batch: event.batch,
          lectureHall: event.lecture_hall,
        }));

        console.log(eventsData);
        setEvents(eventsData);

        // Extract unique lectures
        const uniqueLectures = [
          ...new Map(
            response.data.data.map((event) => [
              event.lecture_id,
              { lecture: event.lecture, lecture_id: event.lecture_id },
            ])
          ).values(),
        ];

        console.log(uniqueLectures);

        setLectures(uniqueLectures);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleDateClick = (info) => {
    if (!newEvent.lecture_id) {
      alert("Please select a lecturer first.");
      return;
    }
    setNewEvent({
      subject: "",
      startDate: info.dateStr,
      endDate: info.dateStr,
      lecture: newEvent.lecture,
      lecture_id: newEvent.lecture_id,
      department: "",
      batch: "",
      lectureHall: "",
    });
    setSelectedEvent(null);
    setIsEditable(true);
    setModalIsOpen(true);
  };

  // Handle event click to edit an existing event
  const handleEventClick = (info) => {
    const clickedEvent = events.find((event) => event.id === info.event.id);
    if (clickedEvent) {
      setSelectedEvent(clickedEvent);
      setNewEvent({
        subject: clickedEvent.title,
        startDate: clickedEvent.start.split("T")[0],
        endDate: clickedEvent.end.split("T")[0],
        lecture: clickedEvent.lecture || "",
        lecture_id: clickedEvent.lecture_id || "",
        department: clickedEvent.department || "",
        batch: clickedEvent.batch || "",
        lectureHall: clickedEvent.lectureHall || "",
      });
      setIsEditable(false);
      setModalIsOpen(true);
    }
  };


  const handleEventDelete = async () => {
    if (selectedEvent) {
      try {
        await axios.delete(
          `http://127.0.0.1:8000/api/timetable/${selectedEvent.id}`
        );

        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== selectedEvent.id)
        );

        setModalIsOpen(false);
        setNewEvent({
          subject: "",
          startDate: "",
          endDate: "",
          lecture: "",
          lecture_id: "", // Reset lecture_id
          department: "",
          batch: "",
          lectureHall: "",
        });
        setSelectedEvent(null);
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete the event. Please try again.");
      }
    }
  };

  const handleSave = async () => {
    const requestData = {
      subject: newEvent.subject,
      lecture: parseInt(newEvent.lecture_id, 10), // Use lecture_id for backend
      department: newEvent.department,
      batch: newEvent.batch,
      lecture_hall: newEvent.lectureHall,
      start_date: newEvent.startDate,
      end_date: newEvent.endDate,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/timetable",
        requestData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.message === "Timetable saved successfully") {
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            id: response.data.data.id,
            title: newEvent.subject,
            start: `${newEvent.startDate}T00:00:00`,
            end: `${newEvent.endDate}T23:59:59`,
            lecture: newEvent.lecture_id,
            lecture_id: newEvent.lecture_id, // Added lecture_id
            department: newEvent.department,
            batch: newEvent.batch,
            lectureHall: newEvent.lectureHall,
          },
        ]);

        setModalIsOpen(false);
        setNewEvent({
          subject: "",
          startDate: "",
          endDate: "",
          lecture: "",
          lecture_id: "", // Reset lecture_id
          department: "",
          batch: "",
          lectureHall: "",
        });
      } else {
        alert("Error saving the event: " + response.data.message);
      }
    } catch (error) {
      console.error("Full validation error:", error.response?.data);
      alert(
        "Validation Error: " +
          Object.values(error.response?.data?.errors || {})
            .flat()
            .join(", ")
      );
    }
  };


  return (
    <div style={{ padding: "20px" }}>
    <div style={{ marginBottom: "20px" }}>
      <label>Select Lecturer: </label>
      <select
        name="lecture"
        value={newEvent.lecture_id}
        onChange={(e) => {
          if (e.target.value === "") {
            // Reset when "Select Lecturer" is chosen
            setNewEvent({
              ...newEvent,
              lecture: "",
              lecture_id: "",
            });
          } else {
            const selectedLecture = lectures.find(
              (lecture) => lecture.lecture_id === e.target.value
            );
            
            // Safely handle the selection
            if (selectedLecture) {
              setNewEvent({
                ...newEvent,
                lecture: selectedLecture.lecture,
                lecture_id: selectedLecture.lecture_id,
              });
            }
          }
        }}
        style={{
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <option value="">Select Lecturer</option>
        {lectures.map((lecture, index) => (
          <option key={index} value={lecture.lecture_id}>
            {lecture.lecture}
          </option>
        ))}
      </select>
    </div>

    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      events={events.filter(
        (event) =>
          event.lecture_id === newEvent.lecture_id || newEvent.lecture_id === ""
      )}
      editable
      selectable
      dateClick={handleDateClick}
      eventClick={handleEventClick}
    />

    <Modal
    isOpen={modalIsOpen}
    onRequestClose={() => setModalIsOpen(false)}
    contentLabel="Event Details"
    style={customStyles}
  >
    {selectedEvent && (
      <div>
        <h2>Event Details</h2>
        <p><strong>Department:</strong> {selectedEvent.department}</p>
        <p><strong>Module Name:</strong> {selectedEvent.title}</p>
        <p><strong>Batch:</strong> {selectedEvent.batch}</p>
        <p><strong>Lecture Hall:</strong> {selectedEvent.lectureHall}</p>
        <p><strong>Start Date:</strong> {selectedEvent.start.toString()}</p>
        <p><strong>End Date:</strong> {selectedEvent.end.toString()}</p>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </div>
    )}

  
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              display: "flex",
              gap: "10px",
            }}
          >
            <img
              src={require("../img/edit.png")}
              alt="Edit"
              style={{
                width: "25px",
                height: "25px",
                cursor: "pointer",
                position: "relative",
                top: "-50px",
              }}
              onClick={() => setIsEditable(true)}
            />
            <img
              src={require("../img/edit.png")}
              alt="Delete"
              style={{
                width: "25px",
                height: "25px",
                cursor: "pointer",
                position: "relative",
                top: "-50px",
              }}
              onClick={handleEventDelete}
            />
          </div>

          <h2 style={{ marginTop: "40px" }}>
            {selectedEvent ? "Edit Timetable" : "Add New Timetable"}
          </h2>
          <form
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <label>Department:</label>
            <input
              type="text"
              name="department"
              value={newEvent.department}
              onChange={(e) =>
                setNewEvent({ ...newEvent, department: e.target.value })
              }
              disabled={!isEditable}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <label>Module Name:</label>
            <input
              type="text"
              name="subject"
              value={newEvent.subject}
              onChange={(e) =>
                setNewEvent({ ...newEvent, subject: e.target.value })
              }
              disabled={!isEditable}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <label>Batch:</label>
            <input
              type="text"
              name="batch"
              value={newEvent.batch}
              onChange={(e) =>
                setNewEvent({ ...newEvent, batch: e.target.value })
              }
              disabled={!isEditable}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <label>Lecture Hall:</label>
            <input
              type="text"
              name="lectureHall"
              value={newEvent.lectureHall}
              onChange={(e) =>
                setNewEvent({ ...newEvent, lectureHall: e.target.value })
              }
              disabled={!isEditable}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={newEvent.startDate}
              onChange={(e) =>
                setNewEvent({ ...newEvent, startDate: e.target.value })
              }
              disabled={!isEditable}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <label>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={newEvent.endDate}
              onChange={(e) =>
                setNewEvent({ ...newEvent, endDate: e.target.value })
              }
              disabled={!isEditable}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <div style={{ gridColumn: "1 / -1", textAlign: "right" }}>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  background: "#4CAF50",
                  color: "#fff",
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setModalIsOpen(false)}
                style={{
                  background: "#f44336",
                  color: "#fff",
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
     </Modal>
    </div>
  );
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fff",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
};

export default Scheduler;
