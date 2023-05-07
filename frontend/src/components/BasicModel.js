import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import React from "react";
import ReactDOM from "react-dom";
import { useFormik } from "formik";
import * as yup from "yup";
// import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import storage from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./BasicModel.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  firstName: yup
    .string("Enter your firstName")
    .required("First Name is required"),
  lastName: yup.string("Enter your lastName").required("Last Name is required"),
  mobileNo: yup.string("Enter your email").required("Mobile No. is required"),
  post: yup.string("Enter your email").required("Post is required"),
});

export default function BasicModal(props) {
  // const [open, setOpen] = useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  const { open, handleClose, setEntryUpdate, entryUpdate } = props;
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const [profile, setProfile] = useState(null);

  function handleProfileChange(event) {
    setFile(event.target.files[0]);
  }

  const handleUpload = (event) => {
    const file = event.target.files[0];
    // if (!file) {
    //   alert("Please choose a file first!");
    // }
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        ); // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          setProfile(url);
        });
      }
    );
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNo: "",
      post: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      // alert(JSON.stringify(values, null, 2));
      // toggleFormIsOpen();
      const emloyeedata = { ...values, profile: profile };
      try {
        const res = await fetch(`http://localhost:8000/api`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emloyeedata),
        });
        const data = await res.json();
        // console.log(data);
        // values = {
        //   firstName: "",
        //   lastName: "",
        //   email: "",
        //   mobileNo: "",
        //   post: "",
        // };
        if (data.status === "success") {
          setProfile(null);
          setEntryUpdate(!entryUpdate);
          resetForm();
        } else {
          alert("email already exist");
        }
      } catch (error) {
        console.log(error.message);
      }
    },
  });

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={{
            width: "500px",
            background: "white",
            borderRadius: "10px",
            padding: "20px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <form onSubmit={formik.handleSubmit} className="form-container">
            <TextField
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              className="form-field"
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
            />{" "}
            <TextField
              fullWidth
              id="lastName"
              name="lastName"
              className="form-field"
              label="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
            />{" "}
            <TextField
              fullWidth
              id="email"
              name="email"
              className="form-field"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />{" "}
            <TextField
              fullWidth
              id="mobileNo"
              name="mobileNo"
              className="form-field"
              label="Mobile No."
              value={formik.values.mobileNo}
              onChange={formik.handleChange}
              error={formik.touched.mobileNo && Boolean(formik.errors.mobileNo)}
              helperText={formik.touched.mobileNo && formik.errors.mobileNo}
            />{" "}
            <TextField
              fullWidth
              id="post"
              name="post"
              className="form-field"
              label="Post"
              value={formik.values.post}
              onChange={formik.handleChange}
              error={formik.touched.post && Boolean(formik.errors.post)}
              helperText={formik.touched.post && formik.errors.post}
            />
            <div className="upload-container" style={{ marginTop: "0%" }}>
              <Button
                className="upload-button"
                color="secondary"
                variant="outlined"
                component="label"
                fullWidth
                size="small"
              >
                Upload Profile Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  style={{ height: "100%" }}
                  hidden
                />
              </Button>
            </div>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              style={{
                borderRadius: "10px",
                padding: "10px 20px",
                marginTop: "20px",
                width: "auto",
              }}
            >
              Submit
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
