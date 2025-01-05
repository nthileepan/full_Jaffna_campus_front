import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Timetable = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [scheduleDetails, setScheduleDetails] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date("2024-12-22T13:30:00"));
  const [userRole, setUserRole] = useState(null);
  const [roleSpecificId, setRoleSpecificId] = useState(null);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const navigate = useNavigate();

  // First useEffect to check authentication and fetch user details
  useEffect(() => {
    const userData = localStorage.getItem('userid');

    if (!userData) {
      navigate('/login');
      return;
    }

    // Fetch user details

    fetch(`http://127.0.0.1:8000/api/user-details/${userData}`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          const role = data.data.user.roles[0]?.slug.toLowerCase(); // Convert to lowercase for consistency
          console.log('Role:', role);
          setUserRole(role);
          
          // Set the appropriate ID based on role
          if (role === 'student' && data.data.student) {
            setRoleSpecificId(data.data.student.id);
            console.log('Student ID:', data.data.student.id);
          } else if (role === 'lecture' && data.data.lecture) { // Changed from lecturer to lecture
            setRoleSpecificId(data.data.lecture.id);
            console.log('Lecturer ID:', data.data.lecture.id);
          }
        }
      })
      .catch(error => console.error("Error fetching user details:", error));

      console.log('Role Specific ID:', roleSpecificId);
      console.log('User Role:', userRole);
  }, []);

  // Fetch time slots
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/Slot")
      .then((response) => response.json())
      .then((data) => {
        const slots = data.map((slot) => ({
          id: slot.id,
          startTime: slot.start_time,
          endTime: slot.end_time,
          time: `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`,
        }));
        setTimeSlots(slots);
      })
      .catch((error) => console.error("Error fetching time slots:", error));
  }, []);

  // Fetch schedule based on user role and roleSpecificId
  useEffect(() => {
    if (roleSpecificId && userRole) {
      const endpoint = userRole === 'student' 
        ? `http://127.0.0.1:8000/api/student/${roleSpecificId}/timetable`
        : `http://127.0.0.1:8000/api/lecturer-timetable/${roleSpecificId}`;

      fetch(endpoint)
        .then((response) => response.json())
        .then((data) => {
          const fetchedSchedule = {};
          const fetchedScheduleDetails = {};

          data.time_tables.forEach((entry) => {
            const day = entry.time_table.date;
            const timeSlot = entry.slot
              ? `${entry.slot.start_time.slice(0, 5)} - ${entry.slot.end_time.slice(0, 5)}`
              : null;
            const activity = entry.slot ? `${entry.module_name}` : "No Slot";

            if (!fetchedSchedule[day]) {
              fetchedSchedule[day] = {};
              fetchedScheduleDetails[day] = {};
            }

            if (timeSlot) {
              fetchedSchedule[day][timeSlot] = activity;
              fetchedScheduleDetails[day][timeSlot] = {
                timetableId: entry.time_table.id,
                lecturerId: entry.time_table.lecturer_id,
                moduleId: entry.time_table.module_id,
              };
            }
          });

          setSchedule(fetchedSchedule);
          setScheduleDetails(fetchedScheduleDetails);
        })
        .catch((error) => console.error(`Error fetching ${userRole} schedule:`, error));
    }
  }, [roleSpecificId, userRole]);

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    navigate('/login');
  };

  const isOngoing = (startTime, endTime, date) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const now = currentTime;

    const start = new Date(now);
    start.setHours(startHour, startMinute, 0);

    const end = new Date(now);
    end.setHours(endHour, endMinute, 0);

    return now >= start && now < end && currentTime.toLocaleDateString("en-US", { weekday: "long" }) === date;
  };

  const handleClick = (day, time) => {
    const details = scheduleDetails[day]?.[time];
    if (details) {
      // Updated to match the exact role values from API
      const attendanceEndpoint = userRole === 'student' ? '/StudentAttendance' : '/attendance';
      navigate(`${attendanceEndpoint}?${userRole}_id=${roleSpecificId}&time_table_id=${details.timetableId}&lecture_id=${details.lecturerId}`);
    }
  };

  const styles = {
    timetable: {
      display: "grid",
      gridTemplateColumns: "1fr repeat(7, 1fr)",
      gap: "1px",
      backgroundColor: "#ccc",
    },
    headerCell: {
      backgroundColor: "#007bff",
      color: "#fff",
      fontWeight: "bold",
      textAlign: "center",
      padding: "10px",
    },
    timeCell: {
      backgroundColor: "#f8f9fa",
      textAlign: "center",
      padding: "10px",
      border: "1px solid #ddd",
    },
    activityCell: (ongoing, activity) => ({
      backgroundColor: ongoing ? "#d4edda" : "#f8f9fa",
      textAlign: "center",
      padding: "10px",
      border: "1px solid #ddd",
      minHeight: "50px",
      cursor: ongoing && activity !== "No Slot" ? "pointer" : "default",
    }),
  };

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.timetable}>
      <div style={styles.headerCell}>Time</div>
      {days.map((day) => (
        <div key={day} style={styles.headerCell}>
          {day}
        </div>
      ))}

      {timeSlots.map((slot) => (
        <React.Fragment key={slot.id}>
          <div style={styles.timeCell}>{slot.time}</div>
          {days.map((day) => (
            <div
              key={`${day}-${slot.time}`}
              style={styles.activityCell(isOngoing(slot.startTime, slot.endTime, day), schedule[day]?.[slot.time])}
              onClick={() => isOngoing(slot.startTime, slot.endTime, day) && schedule[day]?.[slot.time] && handleClick(day, slot.time)}
            >
              {schedule[day]?.[slot.time] || ""}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Timetable;