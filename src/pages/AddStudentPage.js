import React from "react";
import {
  TextField,
  Grid,
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  TextareaAutosize,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  IconButton,
  Checkbox,
  FormControlLabel,
  FormGroup,
  RadioGroup,
  Radio,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { formatMeridiem } from "@mui/x-date-pickers/internals";
import { useParams, useHistory } from "react-router-dom";
import { ImportContacts } from "@mui/icons-material";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AddStudentPage = (student) => {
  const { id } = useParams();

  console.log(student);

  const location = useLocation();
  const navigate = useNavigate();

  const [showTextarea, setShowTextarea] = useState(false);
  const [students, setStudents] = useState([]);

  const handleButtonClick = () => {
    setShowTextarea(!showTextarea);
  };
  const [fileName, setFileName] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const [myId, setMyId] = useState(location?.state?.student?.id || "");
  // ////////////////////////////////////////////////////////////////////////////////////////////////
  const resetFileds = {
    studentFirstName: "",
    studentMiddleName: "",
    studentLastName: "",
    month: "",
    day: "",
    year: "",
    streetAddress: "",
    streetAddressLine2: "",
    city: "",
    state: "",
    nic: "",
    postalCode: "",
    country: "",
    email: "",
    phone: "",
    emergencyFirstName: "",
    emergencyLastName: "",
    emergencyRelationship: "",
    emergencyAddress: "",
    emergencyStreetAddressLine2: "",
    emergencyCity: "",
    emergencyState: "",
    emergencyPostalCode: "",
    emergencyPhoneNumber: "",
    emergencyEmail: "",
    appliedPreferredMode: "",
    programApplied: "",
    batch: "",
    department: "",
    appliedStudentNumber: "",
    appliedCourseName: "",
    olExamName: "",
    alExamName: "",
    examOrEmploymentName: "",
    qualificationsStatement: "",
    courseReason: "",
    selfChecked: false,
    newsPapersAdvertisement: false,
    seminarWebinar: false,
    socialMedia: false,
    openEvents: false,
    bcasWebsite: false,
    leaflets: false,
    studentReview: false,
    radio: false,
    other: false,
    parentsChecked: false,
    otherChecked: false,
    spouseChecked: false,
    payingName: "",
    payingAddress: "",
    payingOfficialAddress: "",
    payingCity: "",
    payingState: "",
    payingPostalCode: "",
    payingCountry: "",
    payingContactNumber: "",
    payingEmail: "",
    hasScholarship: false,
    studentNumber: "",
    totalCourseFee: "",
    registrationFee: "",
    installments: "",
    paymentDiscount: "",
    zohonumber: "",
    joinDate: "",
    endDate: "",
    paymentStatus: false,
    selectedOlFile: null,
    selectedAlFile: null,
    selectedImageFile: null,
    selectedFile1: null,
    selectedFile2: null,
  };
  // ////////////////////////////////////////////////////////////////////////////////////////////////
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/getdepartments")
      .then((response) => {
        console.log(response.data); // Check the structure of the API response
        setDepartments(response.data.departments || []); // Fallback to an empty array if departments is undefined
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [batches, setbatches] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/getbatches")
      .then((response) => {
        console.log(response.data); // Check the structure of the API response
        setbatches(response.data.batches || []); // Fallback to an empty array if departments is undefined
      })
      .catch((error) => {
        console.error("Error fetching batches:", error);
      });
  }, []);
  // ////////////////////////////////////////////////////////////////////////////////////////////////
  const [formData, setFormData] = useState({
    studentFirstName: "",
    studentMiddleName: "",
    studentLastName: "",
    month: "",
    day: "",
    year: "",
    streetAddress: "",
    streetAddressLine2: "",
    city: "",
    state: "",
    nic: "",
    postalCode: "",
    country: "",
    email: "",
    phone: "",
    emergencyFirstName: "",
    emergencyLastName: "",
    emergencyRelationship: "",
    emergencyAddress: "",
    emergencyStreetAddressLine2: "",
    emergencyCity: "",
    emergencyState: "",
    emergencyPostalCode: "",
    emergencyPhoneNumber: "",
    emergencyEmail: "",
    appliedPreferredMode: "",
    programApplied: "",
    batch: "",
    department: "",
    appliedStudentNumber: "",
    appliedCourseName: "",
    olExamName: "",
    alExamName: "",
    examOrEmploymentName: "",
    qualificationsStatement: "",
    newsPapersAdvertisement: 0,
    seminarWebinar: 0,
    socialMedia: "",
    openEvents: "",
    other: "",
    radio: "",
    bcasWebsite: "",
    leaflets: "",
    studentReview: "",
    courseReason: "",
    selfChecked: "",
    parentsChecked: "",
    otherChecked: "",
    spouseChecked: "",
    payingName: "",
    payingAddress: "",
    payingOfficialAddress: "",
    payingCity: "",
    payingState: "",
    payingPostalCode: "",
    payingCountry: "",
    payingContactNumber: "",
    payingEmail: "",
    hasScholarship: 0, // Radio button ("yes", "no")
    studentNumber: "",
    totalCourseFee: "",
    registrationFee: "",
    installments: "",
    paymentDiscount: "",
    zohonumber: "",
    joinDate: "",
    endDate: "",
    paymentStatus: "", // Radio button ("approved", "rejected")
  });

  const [files, setFiles] = useState({
    selectedOlFile: null,
    selectedAlFile: null,
    selectedImageFile: null,
    selectedFile1: null,
    selectedFile2: null,
  });

  const handlecheck = () => {
    alert(location.state.student.id);
  };
  useEffect(() => {
    if (location.state?.student) {
      const studentData = location.state.student;
      setFormData({
        studentFirstName: studentData.first_name || "",
        studentMiddleName: studentData.middle_name || "",
        studentLastName: studentData.last_name || "",
        year: studentData.date_of_birth
          ? studentData.date_of_birth.split("-")[0]
          : "",
        month: studentData.date_of_birth
          ? studentData.date_of_birth.split("-")[1]
          : "",
        day: studentData.date_of_birth
          ? studentData.date_of_birth.split("-")[2]
          : "",
        streetAddress: studentData.address || "",
        streetAddressLine2: studentData.address_line || "",
        city: studentData.city || "",
        state: studentData.province || "",
        nic: studentData.nic_number || "",
        postalCode: studentData.postal_code || "",
        country: studentData.country || "",
        email: studentData.email || "",
        phone: studentData.phone_number || "",
        emergencyFirstName: studentData.emergency_contact?.first_name || "",
        emergencyLastName: studentData.emergency_contact?.last_name || "",
        emergencyRelationship:
          studentData.emergency_contact?.relationship || "",
        emergencyAddress: studentData.emergency_contact?.address || "",
        emergencyStreetAddressLine2:
          studentData.emergency_contact?.address_line || "",
        emergencyCity: studentData.emergency_contact?.city || "",
        emergencyState: studentData.emergency_contact?.province || "",
        emergencyPostalCode: studentData.emergency_contact?.postal_code || "",
        emergencyPhoneNumber: studentData.emergency_contact?.phone_number || "",
        emergencyEmail: studentData.emergency_contact?.email || "",
        appliedPreferredMode: studentData.name_of_course?.preferred_mode || "",
        programApplied: studentData.name_of_course?.program_applied_for || "",
        appliedStudentNumber: studentData.name_of_course?.student_number || "",
        appliedCourseName: studentData.name_of_course?.course_name || "",
        olExamName: studentData.qualifications?.olexam || "",
        selectedOlFile: studentData.qualifications?.olpath || "",
        alExamName: studentData.qualifications?.alexam || "",
        selectedAlFile: studentData.qualifications?.alpath || "",
        examOrEmploymentName:
          studentData.other_qualifications?.qualifications || "",
        qualificationsStatement:
          studentData.other_qualifications?.qualifications_line || "",
        newsPapersAdvertisement:
          studentData.applicant_checklist?.newspaper || "",
        seminarWebinar: studentData.applicant_checklist?.seminar || "",
        socialMedia: studentData.applicant_checklist?.social_media || "",
        openEvents: studentData.applicant_checklist?.open_events || "",
        other: studentData.applicant_checklist?.other || "",
        radio: studentData.applicant_checklist?.radio || "",
        bcasWebsite: studentData.applicant_checklist?.bcas_website || "",
        leaflets: studentData.applicant_checklist?.leaflets || "",
        studentReview: studentData.applicant_checklist?.student_review || "",
        selectedFile1: studentData.student_nic?.nic || "",
        selectedFile2:
          studentData.student_date_of_birth_certificate
            ?.date_of_birth_certificate || "",
        selectedImageFile: studentData.student_image?.image || "",
        courseReason: studentData.personal_statement?.course_reason || "",
        selfChecked: studentData.personal_statement?.self || "",
        parentsChecked: studentData.personal_statement?.parents || "",
        otherChecked: studentData.personal_statement?.other || "",
        spouseChecked: studentData.personal_statement?.spouse || "",
        payingName: studentData.who_will_pay?.name || "",
        //  payingName: studentData.who_will_pay?.name || '',
        payingAddress: studentData.who_will_pay?.address || "",
        payingOfficialAddress: studentData.who_will_pay?.address_official || "",
        payingCity: studentData.who_will_pay?.city || "",
        payingState: studentData.who_will_pay?.Province || "",
        payingPostalCode: studentData.who_will_pay?.postal_code || "",
        payingCountry: studentData.who_will_pay?.country || "",
        payingContactNumber: studentData.who_will_pay?.phone_number || "",
        payingEmail: studentData.who_will_pay?.email || "",
        hasScholarship: studentData.who_will_pay?.scholarship || "",
        paymentStatus: studentData.admin_use?.status || "",
        studentNumber: studentData.admin_use?.student_number || "",
        totalCourseFee: studentData.admin_use?.total_fees || "",
        registrationFee: studentData.admin_use?.registration_fees || "",
        installments: studentData.admin_use?.installment || "",
        paymentDiscount: studentData.admin_use?.discount || "",
        zohonumber: studentData.zoho_no || "",
        joinDate: studentData.admin_use?.join_date || "",
        endDate: studentData.admin_use?.end_date || "",
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files: inputFiles } = e.target;
    if (inputFiles.length > 0) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [name]: inputFiles[0],
      }));
    }
  };

  // //////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Ensure all required fields are filled
    if (
      !formData.studentFirstName ||
      !formData.studentLastName ||
      !formData.email ||
      !formData.phone
    ) {
      alert(
        "Please fill in all required fields (First Name, Last Name, Email, Phone)"
      );
      return;
    }

    // Ensure all emergency contact fields are filled
    if (
      !formData.emergencyFirstName ||
      !formData.emergencyLastName ||
      !formData.emergencyPhoneNumber
    ) {
      alert("Please fill in all emergency contact fields");
      return;
    }

    // Ensure at least one qualification file is uploaded
    // if (!files.selectedOlFile && !files.selectedAlFile) {
    //   alert("Please upload at least one qualification file (OL or AL)");
    //   return;
    // }

    // Validate NIC (National ID) - must be provided
    if (!formData.nic) {
      alert("Please provide a NIC");
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please provide a valid email");
      return;
    }

    // Validate phone number (check for length and digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Please provide a valid phone number");
      return;
    }

    console.log("Files before appending to FormData:", files);
    console.log("Form Data:", formData);

    const data = new FormData();

    // Append the form data
    data.append("studentFirstName", formData.studentFirstName);
    data.append("studentMiddleName", formData.studentMiddleName);
    data.append("studentLastName", formData.studentLastName);
    data.append("month", formData.month);
    data.append("day", formData.day);
    data.append("year", formData.year);
    data.append("streetAddress", formData.streetAddress);
    data.append("streetAddressLine2", formData.streetAddressLine2);
    data.append("city", formData.city);
    data.append("state", formData.state);
    data.append("nic", formData.nic);
    data.append("postalCode", formData.postalCode);
    data.append("country", formData.country);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("emergencyFirstName", formData.emergencyFirstName);
    data.append("emergencyLastName", formData.emergencyLastName);
    data.append("emergencyRelationship", formData.emergencyRelationship);
    data.append("emergencyAddress", formData.emergencyAddress);
    data.append(
      "emergencyStreetAddressLine2",
      formData.emergencyStreetAddressLine2
    );
    data.append("emergencyCity", formData.emergencyCity);
    data.append("emergencyState", formData.emergencyState);
    data.append("emergencyPostalCode", formData.emergencyPostalCode);
    data.append("emergencyPhoneNumber", formData.emergencyPhoneNumber);
    data.append("emergencyEmail", formData.emergencyEmail);
    data.append("appliedPreferredMode", formData.appliedPreferredMode);
    data.append("programApplied", formData.programApplied);
    data.append("batch", formData.batch);
    data.append("department", formData.department);
    data.append("appliedStudentNumber", formData.appliedStudentNumber);
    data.append("appliedCourseName", formData.appliedCourseName);
    data.append("olExamName", formData.olExamName);
    data.append("alExamName", formData.alExamName);
    data.append("examOrEmploymentName", formData.examOrEmploymentName);
    data.append("qualificationsStatement", formData.qualificationsStatement);
    data.append("courseReason", formData.courseReason);
    data.append("selfChecked", formData.selfChecked ? 1 : 0);
    data.append(
      "newsPapersAdvertisement",
      formData.newsPapersAdvertisement ? 1 : 0
    );
    data.append("seminarWebinar", formData.seminarWebinar ? 1 : 0);
    data.append("socialMedia", formData.socialMedia ? 1 : 0);
    data.append("openEvents", formData.openEvents ? 1 : 0);
    data.append("bcasWebsite", formData.bcasWebsite ? 1 : 0);
    data.append("leaflets", formData.leaflets ? 1 : 0);
    data.append("studentReview", formData.studentReview ? 1 : 0);
    data.append("radio", formData.radio ? 1 : 0);
    data.append("other", formData.other ? 1 : 0);
    data.append("parentsChecked", formData.parentsChecked ? 1 : 0);
    data.append("otherChecked", formData.otherChecked ? 1 : 0);
    data.append("spouseChecked", formData.spouseChecked ? 1 : 0);
    data.append("payingName", formData.payingName);
    data.append("payingAddress", formData.payingAddress);
    data.append("payingOfficialAddress", formData.payingOfficialAddress);
    data.append("payingCity", formData.payingCity);
    data.append("payingState", formData.payingState);
    data.append("payingPostalCode", formData.payingPostalCode);
    data.append("payingCountry", formData.payingCountry);
    data.append("payingContactNumber", formData.payingContactNumber);
    data.append("payingEmail", formData.payingEmail);
    data.append("hasScholarship", formData.hasScholarship ? 1 : 0);
    data.append("studentNumber", formData.studentNumber);
    data.append("totalCourseFee", formData.totalCourseFee);
    data.append("registrationFee", formData.registrationFee);
    data.append("installments", formData.installments);
    data.append("paymentDiscount", formData.paymentDiscount);
    data.append("zohonumber", formData.zohonumber);
    data.append("joinDate", formData.joinDate);
    data.append("endDate", formData.endDate);
    data.append("paymentStatus", formData.paymentStatus ? 1 : 0);

    if (files.selectedOlFile) {
      console.log("Appending selectedOlFile:", files.selectedOlFile);
      data.append("selectedOlFile", files.selectedOlFile);
    }
    if (files.selectedAlFile) {
      console.log("Appending selectedAlFile:", files.selectedAlFile);
      data.append("selectedAlFile", files.selectedAlFile);
    }
    if (files.selectedImageFile) {
      console.log("Appending selectedImageFile:", files.selectedImageFile);
      data.append("selectedImageFile", files.selectedImageFile);
    }
    if (files.selectedFile1) {
      console.log("Appending selectedFile1:", files.selectedFile1);
      data.append("selectedFile1", files.selectedFile1);
    }
    if (files.selectedFile2) {
      console.log("Appending selectedFile2:", files.selectedFile2);
      data.append("selectedFile2", files.selectedFile2);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/addStudent",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response.data); // Log the full response

      if (response) {
        alert(response.data.message); // Access the success message
        setFormData(resetFileds);
        setFiles({});
      } else {
        alert("Failed to save student data");
      }
    } catch (error) {
      console.error(
        "Error saving student:",
        error.response?.data || error.message
      );
      alert("Failed to save student");
    }
  };

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    // Fetch student data by ID
    axios
      .get(`http://127.0.0.1:8000/api/getstudents/${id}`)
      .then((response) => {
        setFormData(response.data.student); // Set the form data with the fetched student data
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });
  }, [id]); // Run this effect whenever the ID changes
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleUpdate = async (id) => {
    // Confirm if the user really wants to update the student data
    if (window.confirm("Are you sure you want to update this student?")) {
      try {
        // Create the FormData object with updated data
        const data = new FormData();
        data.append("studentFirstName", formData.studentFirstName);
        data.append("studentMiddleName", formData.studentMiddleName);
        data.append("studentLastName", formData.studentLastName);
        data.append("month", formData.month);
        data.append("day", formData.day);
        data.append("year", formData.year);
        data.append("streetAddress", formData.streetAddress);
        data.append("streetAddressLine2", formData.streetAddressLine2);
        data.append("city", formData.city);
        data.append("state", formData.state);
        data.append("nic", formData.nic);
        data.append("postalCode", formData.postalCode);
        data.append("country", formData.country);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("emergencyFirstName", formData.emergencyFirstName);
        data.append("emergencyLastName", formData.emergencyLastName);
        data.append("emergencyRelationship", formData.emergencyRelationship);
        data.append("emergencyAddress", formData.emergencyAddress);
        data.append(
          "emergencyStreetAddressLine2",
          formData.emergencyStreetAddressLine2
        );
        data.append("emergencyCity", formData.emergencyCity);
        data.append("emergencyState", formData.emergencyState);
        data.append("emergencyPostalCode", formData.emergencyPostalCode);
        data.append("emergencyPhoneNumber", formData.emergencyPhoneNumber);
        data.append("emergencyEmail", formData.emergencyEmail);
        data.append("appliedPreferredMode", formData.appliedPreferredMode);
        data.append("programApplied", formData.programApplied);
        data.append("appliedStudentNumber", formData.appliedStudentNumber);
        data.append("appliedCourseName", formData.appliedCourseName);
        data.append("olExamName", formData.olExamName);
        data.append("alExamName", formData.alExamName);
        data.append("examOrEmploymentName", formData.examOrEmploymentName);
        data.append(
          "qualificationsStatement",
          formData.qualificationsStatement
        );
        data.append("courseReason", formData.courseReason);
        data.append("selfChecked", formData.selfChecked ? 1 : 0);
        data.append(
          "newsPapersAdvertisement",
          formData.newsPapersAdvertisement ? 1 : 0
        );
        data.append("seminarWebinar", formData.seminarWebinar ? 1 : 0);
        data.append("socialMedia", formData.socialMedia ? 1 : 0);
        data.append("openEvents", formData.openEvents ? 1 : 0);
        data.append("bcasWebsite", formData.bcasWebsite ? 1 : 0);
        data.append("leaflets", formData.leaflets ? 1 : 0);
        data.append("studentReview", formData.studentReview ? 1 : 0);
        data.append("radio", formData.radio ? 1 : 0);
        data.append("other", formData.other ? 1 : 0);
        data.append("parentsChecked", formData.parentsChecked ? 1 : 0);
        data.append("otherChecked", formData.otherChecked ? 1 : 0);
        data.append("spouseChecked", formData.spouseChecked ? 1 : 0);
        data.append("payingName", formData.payingName);
        data.append("payingAddress", formData.payingAddress);
        data.append("payingOfficialAddress", formData.payingOfficialAddress);
        data.append("payingCity", formData.payingCity);
        data.append("payingState", formData.payingState);
        data.append("payingPostalCode", formData.payingPostalCode);
        data.append("payingCountry", formData.payingCountry);
        data.append("payingContactNumber", formData.payingContactNumber);
        data.append("payingEmail", formData.payingEmail);
        data.append("hasScholarship", formData.hasScholarship ? 1 : 0);
        data.append("studentNumber", formData.studentNumber);
        data.append("totalCourseFee", formData.totalCourseFee);
        data.append("registrationFee", formData.registrationFee);
        data.append("installments", formData.installments);
        data.append("paymentDiscount", formData.paymentDiscount);
        data.append("zohonumber", formData.zohonumber);
        data.append("joinDate", formData.joinDate);
        data.append("endDate", formData.endDate);
        data.append("paymentStatus", formData.paymentStatus ? 1 : 0);

        // Append files if provided
        if (files.selectedOlFile) {
          data.append("selectedOlFile", files.selectedOlFile);
        }

        if (files.selectedAlFile) {
          data.append("selectedAlFile", files.selectedAlFile);
        }
        if (files.selectedImageFile) {
          // Append the file to the FormData object
          data.append("selectedImageFile", files.selectedImageFile);

          // Alert the file object or its name
          // alert("File Available: " + files.selectedImageFile.name); // Display file name
        }
        if (files.selectedFile1) {
          data.append("selectedFile1", files.selectedFile1);
        }
        if (files.selectedFile2) {
          data.append("selectedFile2", files.selectedFile2);
        }

        // Make the PUT request to update the student data
        const response = await axios.post(
          `http://127.0.0.1:8000/api/putstudent/${myId}`,
          formData
        );

        // Check the response structure
        console.log("Response from API:", response.data);

        // If the response contains the message and id, show the id
        if (response.data && response.data.id) {
          alert(`Student updated successfully with ID: ${response.data.id}`);
        } else {
          alert("Failed to update student");
        }

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === id ? { ...student, ...formData } : student
          )
        );
      } catch (error) {
        console.error(
          "Error updating student:",
          error.response ? error.response.data : error
        );
        alert("Failed to update student");
      }
    }
  };

  return (
    <div>
      <Box sx={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Student Registration Form
        </Typography>
        <Grid container spacing={2}>
          {/* Full Name */}
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                padding: "10px 20px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Student Details
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              name="studentFirstName"
              value={formData.studentFirstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Middle Name"
              variant="outlined"
              name="studentMiddleName"
              value={formData.studentMiddleName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              name="studentLastName"
              value={formData.studentLastName}
              onChange={handleChange}
            />
          </Grid>

          {/* Birth Date */}
          <Grid item xs={12}>
            <Typography variant="h6">Birth Date</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                name="month"
                value={formData.month}
                onChange={handleChange}
              >
                <MenuItem value="January">January</MenuItem>
                <MenuItem value="February">February</MenuItem>
                <MenuItem value="March">March</MenuItem>
                <MenuItem value="April">April</MenuItem>
                <MenuItem value="May">May</MenuItem>
                <MenuItem value="June">June</MenuItem>
                <MenuItem value="July">July</MenuItem>
                <MenuItem value="August">August</MenuItem>
                <MenuItem value="September">September</MenuItem>
                <MenuItem value="October">October</MenuItem>
                <MenuItem value="November">November</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Day</InputLabel>
              <Select name="day" value={formData.day} onChange={handleChange}>
                {Array.from({ length: 31 }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select name="year" value={formData.year} onChange={handleChange}>
                {Array.from({ length: 100 }, (_, i) => (
                  <MenuItem key={2024 - i} value={2024 - i}>
                    {2024 - i}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Present Address */}
          <Grid item xs={12}>
            <Typography variant="h6">Present Address</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address"
              variant="outlined"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address Line 2"
              variant="outlined"
              name="streetAddressLine2"
              value={formData.streetAddressLine2}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="City"
              variant="outlined"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="State/Province"
              variant="outlined"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Nic"
              type="number"
              variant="outlined"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Postal/Zip Code"
              type="number"
              variant="outlined"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            ></TextField>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Phone Number"
              type="number"
              variant="outlined"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>

          {/* Emergency Contact */}
          <Grid item xs={12}>
            <Typography variant="h6">Emergency Contact</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              name="emergencyFirstName"
              value={formData.emergencyFirstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              name="emergencyLastName"
              value={formData.emergencyLastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Relationship"
              variant="outlined"
              name="emergencyRelationship"
              value={formData.emergencyRelationship}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Of Person To Contact In Case Of Emergency"
              variant="outlined"
              name="emergencyAddress"
              value={formData.emergencyAddress}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address Line 2"
              variant="outlined"
              name="emergencyStreetAddressLine2"
              value={formData.emergencyStreetAddressLine2}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="City"
              variant="outlined"
              name="emergencyCity"
              value={formData.emergencyCity}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="State / Province"
              variant="outlined"
              name="emergencyState"
              value={formData.emergencyState}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Postal / Zip Code"
              type="number"
              variant="outlined"
              name="emergencyPostalCode"
              value={formData.emergencyPostalCode}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Phone Number"
              type="number"
              variant="outlined"
              name="emergencyPhoneNumber"
              value={formData.emergencyPhoneNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              name="emergencyEmail"
              value={formData.emergencyEmail}
              onChange={handleChange}
            />
          </Grid>

          {/* Emergency Contact */}
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                padding: "10px 20px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Program Applied for
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Preferred Mode</InputLabel>
              <Select
                name="appliedPreferredMode"
                value={formData.appliedPreferredMode}
                onChange={handleChange}
              >
                <MenuItem value="Full Time">Full TIme</MenuItem>
                <MenuItem value="Part Time">Part Time</MenuItem>
                {/* Add more countries */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Program Applied For</InputLabel>
              <Select
                name="programApplied"
                value={formData.programApplied}
                onChange={handleChange}
              >
                <MenuItem value="diploma">Diploma</MenuItem>
                <MenuItem value="hnd">HND</MenuItem>
                <MenuItem value="undergraduate">Undergraduate</MenuItem>
                <MenuItem value="postgraduate">Postgraduate</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
                {/* Add more countries */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Batch</InputLabel>
              <Select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
              >
                {batches.map((batch, index) => (
                  <MenuItem key={index} value={batch.id}>
                    {batch.batch_name}
                  </MenuItem>
                ))}

                {/* Add more countries */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                {departments.map((dept, index) => (
                  <MenuItem key={index} value={dept.department_id}>
                    {dept.department_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Student Number"
              type="number"
              variant="outlined"
              name="appliedStudentNumber"
              value={formData.appliedStudentNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Name of the Course"
              variant="outlined"
              name="appliedCourseName"
              value={formData.appliedCourseName}
              onChange={handleChange}
            />
          </Grid>

          {/* Emergency Contact */}
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                padding: "10px 20px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Academic Background
              </Typography>
            </Box>
          </Grid>

          <Grid container spacing={3} sx={{ marginBottom: "20px" }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Name of the Exam (OL)</InputLabel>
                <Select
                  name="olExamName"
                  value={formData.olExamName}
                  onChange={handleChange}
                  defaultValue=""
                >
                  <MenuItem value="GCE O/L">GCE O/L</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  border: "1px dashed #ccc",
                  padding: "20px",
                  textAlign: "center",
                  borderRadius: "8px",
                }}
              >
                <CloudUploadIcon sx={{ fontSize: "40px", color: "#9e9e9e" }} />
                {formData.selectedOlFile && !files.selectedOlFile && (
                  <div>Current File: {formData.selectedOlFile}</div>
                )}

                <Typography
                  variant="caption"
                  display="block"
                  sx={{ marginBottom: "10px" }}
                >
                  Drag and drop files here
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ color: "#9e9e9e" }}
                >
                  File should be in pdf, doc/docx format.
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ marginTop: "10px" }}
                >
                  Browse File
                  <input
                    hidden
                    accept=".pdf,.doc,.docx"
                    type="file"
                    name="selectedOlFile"
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ marginBottom: "20px" }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Name of the Exam (AL)</InputLabel>
                <Select
                  name="alExamName"
                  value={formData.alExamName}
                  onChange={handleChange}
                  defaultValue=""
                >
                  <MenuItem value="GCE A/L">GCE A/L</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  border: "1px dashed #ccc",
                  padding: "20px",
                  textAlign: "center",
                  borderRadius: "8px",
                }}
              >
                <CloudUploadIcon sx={{ fontSize: "40px", color: "#9e9e9e" }} />
                {formData.selectedAlFile && !files.selectedAlFile && (
                  <div>Current File: {formData.selectedAlFile}</div>
                )}
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ marginBottom: "10px" }}
                >
                  Drag and drop files here
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ color: "#9e9e9e" }}
                >
                  File should be in pdf, doc/docx format.
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ marginTop: "10px" }}
                >
                  Browse File
                  <input
                    hidden
                    accept=".pdf,.doc,.docx"
                    type="file"
                    name="selectedAlFile"
                    // value={files.selectedAlFile}
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ borderRadius: "8px", marginTop: "20px", width: "810px" }}>
            {/* Other Qualifications Section */}
            <Box sx={{ marginBottom: "20px" }}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    backgroundColor: "#f5f5f5",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Other Qualifications (Professional & etc)
                  </Typography>
                </Box>
              </Grid>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={10}>
                  <TextField
                    fullWidth
                    required
                    label="Name of the Exam/Employment"
                    variant="outlined"
                    name="examOrEmploymentName"
                    value={formData.examOrEmploymentName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={2} textAlign="center">
                  <IconButton color="primary" onClick={handleButtonClick}>
                    <AddCircleIcon fontSize="large" />
                  </IconButton>
                </Grid>
                {showTextarea && ( // Conditionally render the TextareaAutosize
                  <Grid item xs={12} sm={10}>
                    <TextareaAutosize
                      name="qualificationsStatement"
                      value={formData.qualificationsStatement}
                      onChange={handleChange}
                      minRows={5}
                      placeholder="Enter your statement here..."
                      style={{
                        width: "100%",
                        fontSize: "16px",
                        borderColor: "#ccc",
                        borderRadius: "8px",
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* How You Heard About the Course Section */}
            <Box>
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Please Tick How You Heard of the Course You are Applying for
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ marginBottom: "10px" }}>
                (Fill the form by putting X)
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormGroup>
                    <label>
                      <input
                        type="checkbox"
                        name="newsPapersAdvertisement"
                        checked={formData.newsPapersAdvertisement === 1}
                        onChange={handleChange}
                      />
                      Newspapers Advertisement
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        name="seminarWebinar"
                        checked={formData.seminarWebinar === 1}
                        onChange={handleChange}
                      />
                      Seminar Webinar
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        name="socialMedia"
                        checked={formData.socialMedia === 1}
                        onChange={handleChange}
                      />
                      Social Media
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        name="openEvents"
                        checked={formData.openEvents === 1}
                        onChange={handleChange}
                      />
                      Open Events
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        name="other"
                        checked={formData.other === 1}
                        onChange={handleChange}
                      />
                      Other
                    </label>
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormGroup>
                    <label>
                      <input
                        type="checkbox"
                        name="radio"
                        checked={formData.radio === 1}
                        onChange={handleChange}
                      />
                      Radio
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        name="bcasWebsite"
                        checked={formData.bcasWebsite === 1}
                        onChange={handleChange}
                      />
                      Bcas Website
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        name="leaflets"
                        checked={formData.leaflets === 1}
                        onChange={handleChange}
                      />
                      Leaflets
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        name="studentReview"
                        checked={formData.studentReview === 1}
                        onChange={handleChange}
                      />
                      Student Review
                    </label>
                  </FormGroup>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Box sx={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
            {/* Title Section */}
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                padding: "10px 20px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Applicant's CheckList
              </Typography>
            </Box>

            {/* Passport Size Colour Photo */}

            {/* Document Upload Sections */}
            <Grid container spacing={2}>
              {/* Birth Certificate */}
              <Grid item xs={12} sm={6}>
                <Card
                  variant="outlined"
                  sx={{ textAlign: "center", padding: "20px" }}
                >
                  <CardContent>
                    <CloudUploadIcon
                      sx={{ fontSize: "40px", color: "#9e9e9e" }}
                    />
                    {formData.selectedFile1 && !files.selectedFile1 && (
                      <div>Current File: {formData.selectedFile1}</div>
                    )}
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ marginBottom: "10px" }}
                    >
                      Drag and drop files here
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ color: "#9e9e9e" }}
                    >
                      File should be in pdf, doc/docx format.
                    </Typography>
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ marginTop: "10px" }}
                    >
                      Browse File
                      <input
                        hidden
                        accept=".pdf,.doc,.docx"
                        type="file"
                        name="selectedFile1"
                        // value={files.selectedFile1}
                        onChange={handleFileChange}
                      />
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* NIC */}
              <Grid item xs={12} sm={6}>
                <Card
                  variant="outlined"
                  sx={{ textAlign: "center", padding: "20px" }}
                >
                  <CardContent>
                    <CloudUploadIcon
                      sx={{ fontSize: "40px", color: "#9e9e9e" }}
                    />
                    {formData.selectedFile2 && !files.selectedFile2 && (
                      <div>Current File: {formData.selectedFile2}</div>
                    )}
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ marginBottom: "10px" }}
                    >
                      Drag and drop files here
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ color: "#9e9e9e" }}
                    >
                      File should be in pdf, doc/docx format.
                    </Typography>
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ marginTop: "10px" }}
                    >
                      Browse File
                      <input
                        hidden
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        type="file"
                        name="selectedFile2"
                        //  value={files.selectedFile2}
                        onChange={handleFileChange}
                      />
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", mt: "15px", ml: 2 }}
              >
                Passport Size Colour Photo
              </Typography>

              {/* Duplicate Birth Certificate */}
              <Grid item xs={12}>
                <Card
                  variant="outlined"
                  sx={{ textAlign: "center", padding: "20px" }}
                >
                  <CardContent>
                    <CloudUploadIcon
                      sx={{ fontSize: "40px", color: "#9e9e9e" }}
                    />
                    {formData.selectedImageFile && !files.selectedImageFile && (
                      <div>Current File: {formData.selectedImageFile}</div>
                    )}
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ marginBottom: "10px" }}
                    >
                      Drag and drop files here
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ color: "#9e9e9e" }}
                    >
                      File should be in pdf, doc/docx format.
                    </Typography>
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ marginTop: "10px" }}
                    >
                      Browse File
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        name="selectedImageFile"
                        // value={files.selectedImageFile}
                        onChange={handleFileChange}
                      />
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
            <Grid container spacing={2}>
              {/* Picture Upload Section */}
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  width: "750px",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Personal Statement
                </Typography>
              </Box>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: 12 }}>
                  Reason for selecting this Course,Special Intrest and Career
                  Aspirations
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: "1px dashed #ccc",
                    padding: "20px",
                    textAlign: "center",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <TextareaAutosize
                    name="courseReason"
                    value={formData.courseReason}
                    onChange={handleChange}
                    minRows={5}
                    placeholder="Enter your statement here..."
                    style={{
                      width: "100%",
                      // padding: "10px",
                      fontSize: "16px",
                      borderColor: "#ccc",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              </Grid>

              {/* Rest of the Student Registration Form */}
              {/* Full Name */}
              <Grid item xs={12}>
                <Typography sx={{ fontSize: 16 }}>
                  Put (X) in the Check Boxes
                </Typography>
              </Grid>
              <Grid alignItems={"center"} sx={{ marginBottom: "20px", ml: 2 }}>
                <Grid item xs={4} sm={3}>
                  <label>
                    <input
                      type="checkbox"
                      name="selfChecked"
                      checked={formData.selfChecked === 1}
                      onChange={handleChange}
                    />
                    self
                  </label>
                </Grid>
                <Grid item xs={4} sm={3}>
                  <label>
                    <input
                      type="checkbox"
                      name="parentsChecked"
                      checked={formData.parentsChecked === 1}
                      onChange={handleChange}
                    />
                    parents
                  </label>
                </Grid>
                <Grid item xs={4} sm={3}>
                  <label>
                    <input
                      type="checkbox"
                      name="otherChecked"
                      checked={formData.otherChecked === 1}
                      onChange={handleChange}
                    />
                    other
                  </label>
                </Grid>
                <Grid item xs={4} sm={3}>
                  <label>
                    <input
                      type="checkbox"
                      name="spouseChecked"
                      checked={formData.spouseChecked === 1}
                      onChange={handleChange}
                    />
                    spouse
                  </label>
                </Grid>
              </Grid>

              {/* Include the remaining form sections as before */}
              {/* Example: Birth Date, Present Address, Contact Info, Emergency Contact */}
              {/* And so on... */}
            </Grid>
          </Box>

          {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

          {/* Present Address */}
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                padding: "10px 20px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Who Will be Paying Your Fee?
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              name="payingName"
              value={formData.payingName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Present Address"
              variant="outlined"
              name="payingAddress"
              value={formData.payingAddress}
              onChange={handleChange}
            />
          </Grid>

          {/* Contact Info */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Official Address"
              variant="outlined"
              name="payingOfficialAddress"
              value={formData.payingOfficialAddress}
              onChange={handleChange}
            />
          </Grid>
          {/* <Grid item xs={6}>
            <TextField
              fullWidth
              label="Official Address"
              variant="outlined"
              name="payingOfficialAddress"
              value={formData.id}
              onChange={handleChange}
            />
          </Grid> */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="City"
              variant="outlined"
              name="payingCity"
              value={formData.payingCity}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="State / Province"
              variant="outlined"
              name="payingState"
              value={formData.payingState}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Postal / Zip Code"
              type="number"
              variant="outlined"
              name="payingPostalCode"
              value={formData.payingPostalCode}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Country"
              name="payingCountry"
              value={formData.payingCountry}
              onChange={handleChange}
            ></TextField>
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Contact Number"
              type="number"
              variant="outlined"
              name="payingContactNumber"
              value={formData.payingContactNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Email"
              type="mail"
              variant="outlined"
              name="payingEmail"
              value={formData.payingEmail}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography>Do You Have Any Scholarship?</Typography>
            <FormControl component="fieldset">
              <label>
                <input
                  type="radio"
                  name="hasScholarship"
                  value="1"
                  checked={formData.hasScholarship === "1"}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="hasScholarship"
                  value="0"
                  checked={formData.hasScholarship === "0"}
                  onChange={handleChange}
                />
                No
              </label>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Typography>DECLARATION-1</Typography>
            </Grid>
            <Box
              sx={{
                border: "1px dashed #ccc",
                padding: "20px",
                textAlign: "center",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <TextareaAutosize
                minRows={5}
                value="Understand that the course I have chosen is provided strictly in accordance with the approval given by the relevant qualification awarding body. My qualification will thus be awarded direct upon my achieving the minimum academic benchmark set by the awarding body. I have been made aware that it is my responsibility to confirm the approval and recognition of the qualification by any other relevant local or international professional bodies. I am further aware that any changes that may occur in the future pertaining to the approval/recognition of the qualification would be beyond the control of BCAS and hence it cannot be held responsible for such changes."
                style={{
                  width: "100%",
                  fontSize: "16px",
                  borderColor: "#ccc",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9", // Light background to indicate it's non-editable
                }}
                readOnly
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Typography>DECLARATION-2</Typography>
            </Grid>
            <Box
              sx={{
                border: "1px dashed #ccc",
                padding: "20px",
                textAlign: "center",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <TextareaAutosize
                minRows={5}
                value="the By signaling this form, I confirm that to the best of my knowledge, the information given in this form is correct an and accurate. Further, I agree to abide by by the rules and regulations of th college. If any information given here is found to be false, I am aware my application will be cancelled/admission will be quashed and I shall have no claim whatsoever from the college. I also understand no refund or batch transfer will be effected after ten days from the start date of the course"
                style={{
                  width: "100%",
                  fontSize: "16px",
                  borderColor: "#ccc",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                }}
                readOnly
              />
            </Box>
          </Grid>

          {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

          {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

          {/* Present Address */}
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                padding: "10px 20px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                AdminUsage
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography>Admission to Course?</Typography>
            <FormControl component="fieldset">
              <label>
                <input
                  type="radio"
                  name="paymentStatus"
                  value="approved"
                  checked={formData.paymentStatus === "approved"}
                  onChange={handleChange}
                />
                approved
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentStatus"
                  value="rejected"
                  checked={formData.paymentStatus === "rejected"}
                  onChange={handleChange}
                />
                rejected
              </label>
            </FormControl>
          </Grid>

          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Student Number"
              type="number"
              variant="outlined"
              name="studentNumber"
              value={formData.studentNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Total Course Fee:LKR"
              type="number"
              variant="outlined"
              name="totalCourseFee"
              value={formData.totalCourseFee}
              onChange={handleChange}
            />
          </Grid>

          {/* Contact Info */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Registration Fee:LKR"
              type="number"
              variant="outlined"
              name="registrationFee"
              value={formData.registrationFee}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="No.Of.Installments"
              type="number"
              variant="outlined"
              name="installments"
              value={formData.installments}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Payment Discount"
              type="number"
              variant="outlined"
              name="paymentDiscount"
              value={formData.paymentDiscount}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Zoho Number"
              type="number"
              variant="outlined"
              name="zohonumber"
              value={formData.zohonumber}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Join Date"
              type="date"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

          {/* <button onClick={handlecheck}>Check</button> */}

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={location.state?.student ? handleUpdate : handleSubmit} // Calls either handleUpdate or handleSubmit based on edit mode
            >
              {location.state?.student ? "Update" : "Submit"}{" "}
              {/* Change button text based on mode */}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default AddStudentPage;
