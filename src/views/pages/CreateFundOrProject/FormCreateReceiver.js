import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  FormControl,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import algosdk from "algosdk";
import { PeraWalletConnect } from "@perawallet/connect";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { getFundsForOneUser, addReceiverForOneProject } from "network/ApiAxios";
import { ShowToastMessage } from "utils/ShowToastMessage";

const wallet_type = {
  pera: "Pera Wallet",
};

const FormCreateReceiver = () => {
  // Initialize Pera Wallet
  const peraWallet = new PeraWalletConnect();
  const [formData, setFormData] = useState({
    email: "",
    sodienthoai: "",
    address: "",
    name: "",
    type_receiver_wallet: "Pera",
    receiver_wallet_address: null,
  });

  const [funds, setFunds] = useState([]); // Fund IDs fetched from server
  const [isValidAddress, setIsValidAddress] = useState(null); // Track address validity
  const [errorMessage, setErrorMessage] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);

  const [projectListForCurrentUser, setProjectListForCurrentUser] = useState(
    () => {
      const projectList = localStorage.getItem("ProjectListForCurrentUser");

      return projectList
        ? JSON.parse(projectList, (key, value) => {
            if (key === "description") {
              return undefined; // Omit the 'description' field
            }
            return value; // Keep all other fields
          })
        : [];
    }
  );

  // Validate Algorand wallet address
  const validateAlgorandAddress = (address) => {
    try {
      if (algosdk.isValidAddress(address)) {
        setIsValidAddress(true);
        setErrorMessage("");
      } else {
        setIsValidAddress(false);
        setErrorMessage("Invalid Algorand wallet address.");
      }
    } catch (error) {
      setIsValidAddress(false);
      setErrorMessage("Invalid address format.");
    }
  };
  // useEffect(() => {
  //   const fetchAllFundsForThisUser = async () => {
  //     try {
  //       const userId = localStorage.getItem("userId");
  //       const response = await getFundsForOneUser(userId);

  //       const { data } = response;
  //       setFunds(data.body);
  //     } catch (error) {
  //       console.log(
  //         "🚀 ~ file: index.js:223 ~ fetchAllFundsForThisUser ~ error:",
  //         error
  //       );
  //     }
  //   };
  //   fetchAllFundsForThisUser();
  // }, []);

  useEffect(() => {
    const disconnectWallet = async () => {
      try {
        await peraWallet.disconnect();
        setWalletConnected(false);
      } catch (error) {
        console.error("Error disconnecting wallet:", error);
      }
    };

    disconnectWallet();

    // Cleanup function để ngắt kết nối khi component unmount
    return () => {
      if (walletConnected) {
        peraWallet.disconnect().catch((error) => {
          console.error("Error during cleanup disconnect:", error);
        });
      }
    };
  }, []); // Chỉ chạy một lần khi component được mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "receiver_wallet_address") {
      validateAlgorandAddress(e.target.value); // Validate the address on input
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    const user_id = localStorage.getItem("userId"); // Get user_id from localStorage
    const finalData = {
      ...formData,
    };
    // You can submit this data to your backend
    e.preventDefault();
    if (isValidAddress) {
      console.log(
        "Submitting valid wallet address:",
        formData.receiver_wallet_address
      );
      // Handle form submission logic here (e.g., send to backend)

      try {
        console.log("Submitted Project Data:", finalData);
        finalData.project_hash = formData.receiver_wallet_address;
        const response = await addReceiverForOneProject(finalData);
        const { data } = response;
        if (data.id) {
          ShowToastMessage({
            title: "Create project",
            message: "Thêm người nhận thành công",
            type: "success",
          });
        } else {
          ShowToastMessage({
            title: "Create project",
            message: "Thêm người nhận không thành công",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error submitting project data:", error);
      }
    } else {
      setErrorMessage("Please enter a valid Algorand wallet address.");
    }
  };

  // Connect to Pera Wallet and retrieve the address
  const connectPeraWallet = async () => {
    try {
      const accounts = await peraWallet.connect();
      console.log("🚀 ~ connectPeraWal ~ accounts:", accounts);
      peraWallet.connector?.on("disconnect", handleDisconnectWallet);
      setFormData((prevData) => ({
        ...prevData,
        receiver_wallet_address: accounts[0],
      }));

      setIsValidAddress(true);
      setWalletConnected(true);
    } catch (error) {
      setErrorMessage("Error connecting to Pera Wallet.");
      console.error(error);
    }
  };

  const handleDisconnectWallet = () => {
    peraWallet.disconnect();
    setWalletConnected(false);
    setFormData((prevData) => ({
      ...prevData,
      receiver_wallet_address: "",
    }));
  };

  return (
    <Box sx={{ p: 2, width: "100%", mx: "auto" }}>
      <Grid container spacing={2}>
        {/* Project Name */}
        <Grid item size={4}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </FormControl>
        </Grid>

        {/* Fund Raise Total */}
        <Grid item size={4}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Mobile phone"
              name="sodienthoai"
              value={formData.sodienthoai}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </FormControl>
        </Grid>

        <Grid item size={4}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Your name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Địa chỉ  */}
        <Grid item size={4}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </FormControl>
        </Grid>

        <Grid item size={4}>
          {/* Status (Dropdown) */}
          <FormControl fullWidth margin="normal">
            <TextField
              id="project_id"
              name="project_id"
              value={formData.project_id ?? ""}
              onChange={handleInputChange}
              label="Chọn dự án"
              fullWidth
              required
              select
              helperText="Hãy chọn dự án bạn muốn thêm người nhận tiền"
            >
              {projectListForCurrentUser.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>

        <Grid item size={4}>
          {/* Type (Dropdown) */}
          <FormControl fullWidth margin="normal">
            <TextField
              id="type_receiver_wallet"
              name="type_receiver_wallet"
              value={formData.type_receiver_wallet ?? ""}
              onChange={handleInputChange}
              label="Loại Ví"
              fullWidth
              required
              select
            >
              {Object.entries(wallet_type).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
      </Grid>

      <>
        {/* Wallet Address */}
        <FormControl fullWidth margin="normal">
          <TextField
            label="Wallet Address"
            name="receiver_wallet_address"
            value={formData.receiver_wallet_address ?? ""}
            onChange={handleInputChange}
            fullWidth
            required
            InputProps={{
              endAdornment:
                isValidAddress !== null &&
                (isValidAddress ? (
                  <CheckCircleOutlineIcon color="success" />
                ) : (
                  <ErrorOutlineIcon color="error" />
                )),
            }}
          />
          {errorMessage && (
            <Typography variant="body2" color="error">
              {errorMessage}
            </Typography>
          )}
        </FormControl>
        {/* Pera Wallet Connect Button */}
        {walletConnected ? (
          <Typography variant="body2" color="green" gutterBottom>
            Connected to Pera Wallet: {formData.receiver_wallet_address}
          </Typography>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={connectPeraWallet}
            sx={{ mt: 2 }}
          >
            Connect via Pera Wallet
          </Button>
        )}
      </>
      {/* Submit Button */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormCreateReceiver;
