import React from 'react'
import { useState } from 'react'
import styled from "styled-components"
import TextInput from "./TextInput"
import Button from './Button'
import { UserSignUp } from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";

const Container = styled.div`
  width : 100%;
  max-width : 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;

`
const Title = styled.div`
  fontsize: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
`
const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};

`

const SignUp = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateInputs = () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return false;
    }
    return true;
  };
  const handelSignUp = async () => {
    setLoading(true);
    setButtonDisabled(true);
    if (validateInputs()) {
      try {
        const res = await UserSignUp({ name, email, password });
        
        // Check if response and data exist
        if (!res || !res.data) {
          throw new Error("Invalid response from server");
        }

        const { token, user } = res.data;
        
        // Validate token exists
        if (!token) {
          throw new Error("Token not received from server");
        }

        // Store token and dispatch login success
        localStorage.setItem("getfit-app-token", token);
        dispatch(loginSuccess(res.data));

        alert("Account Created Success");
      } catch (err) {
        // Handle different error types
        let errorMessage = "Sign up failed. Please try again.";
        
        if (err.response) {
          // Server responded with error status
          errorMessage = err.response.data?.message || err.response.data?.error || errorMessage;
        } else if (err.request) {
          // Request made but no response received (network error, CORS, etc.)
          errorMessage = "Unable to connect to server. Please check your connection.";
          console.error("Network error:", err.request);
        } else if (err.message) {
          // Error in request setup or other error
          errorMessage = err.message;
        }
        
        console.error("SignUp error:", err);
        alert(errorMessage);
      } finally {
        // Always reset loading states
        setLoading(false);
        setButtonDisabled(false);
      }
    } else {
      // Reset states if validation fails
      setLoading(false);
      setButtonDisabled(false);
    }
  };
  return (
    <Container>
      <div>
        <Title>Create New Account </Title>
        <Span>Please enter your details to create a new account</Span>
      </div>
      <div style={{
        display: "flex",
        gap: "20px",
        flexDirection: "column"
      }}>
        <TextInput
          label="Full name"
          placeholder="Enter your full name"
          value={name}
          handelChange={(e) => setName(e.target.value)}
        />
        <TextInput
          label="Email Address"
          placeholder="Enter your Email Address"
          value={email}
          handelChange={(e) => setEmail(e.target.value)}
        />

        <TextInput
          label="Password"
          placeholder="Enter your password"
          password
          value={password}
          handelChange={(e) => setPassword(e.target.value)}
        />
        <Button text="SignUp"
          onClick={handelSignUp}
          isLoading={loading}
          isDisabled={buttonDisabled}/>
      </div>
    </Container>
  )
}

export default SignUp

