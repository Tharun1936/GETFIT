import React from 'react'
import styled from "styled-components"
import TextInput from "./TextInput"
import Button from "./Button"

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`
const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`

// note prop name changed to `addNewWorkout`
const AddWorkout = ({ workout, setWorkout, addNewWorkout, buttonLoading }) => {
  const handleClick = () => {
    if (typeof addNewWorkout !== "function") {
      console.error("addNewWorkout prop is not a function:", addNewWorkout);
      alert("Action not available. Please try again.");
      return;
    }
    addNewWorkout();
  };

  return (
    <Card>
      <Title>Add New Workout</Title>
      <TextInput
        label="Workout"
        textArea
        rows={13}
        placeholder={`Enter in this format:

#Category
-Workout Name
-Sets
-Reps
-Weight
-Duration`}
        value={workout}
        handelChange={(e) => setWorkout(e.target.value)}
      />
      <Button
        text="Add Workout"
        small
        onClick={handleClick}
        isLoading={buttonLoading}
        isDisabled={buttonLoading}
      />
    </Card>
  )
}

export default AddWorkout
