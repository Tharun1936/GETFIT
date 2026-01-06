import { FitnessCenterRounded, TimelapseRounded, Edit, Delete } from "@mui/icons-material";
import React, { memo } from "react";
import styled from "styled-components";

const Card = styled.div`
  flex: 1;
  min-width: 250px;
  max-width: 400px;
  padding: 16px 18px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 600px) {
    padding: 12px 14px;
  }
`;
const Category = styled.div`
  width: fit-content;
  font-size: 14px;
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
  background: ${({ theme }) => theme.primary + 20};
  padding: 4px 10px;
  border-radius: 8px;
`;
const Name = styled.div`
  font-size: 20px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 600;
`;
const Sets = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 500;
  display: flex;
  gap: 6px;
`;
const Flex = styled.div`
  display: flex;
  gap: 16px;
`;
const Details = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.text_primary + 20};
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.text_primary + 40};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primary + 20};
    border-color: ${({ theme }) => theme.primary};
  }

  &.delete {
    color: ${({ theme }) => theme.red || '#ff4444'};
    border-color: ${({ theme }) => theme.red + 40 || 'rgba(255, 68, 68, 0.4)'};
    
    &:hover {
      background: ${({ theme }) => theme.red + 20 || 'rgba(255, 68, 68, 0.2)'};
      border-color: ${({ theme }) => theme.red || '#ff4444'};
    }
  }
`;

const CaloriesBadge = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  margin-top: 4px;
`;

const WorkoutCard = memo(({ workout, onEdit, onDelete }) => {
  return (
    <Card>
      <Category>#{workout?.category}</Category>
      <Name>{workout?.WorkoutName || workout?.workoutName}</Name>
      <Sets>
        Count: {workout?.sets} sets X {workout?.reps} reps
      </Sets>
      <Flex>
        <Details>
          <FitnessCenterRounded sx={{ fontSize: "20px" }} />
          {workout?.weight} kg
        </Details>
        <Details>
          <TimelapseRounded sx={{ fontSize: "20px" }} />
          {workout?.duration} min
        </Details>
      </Flex>
      {workout?.caloriesBurned > 0 && (
        <CaloriesBadge>
          🔥 {Math.round(workout.caloriesBurned)} kcal
        </CaloriesBadge>
      )}
      {(onEdit || onDelete) && (
        <Actions>
          {onEdit && (
            <ActionButton onClick={() => onEdit(workout)}>
              <Edit sx={{ fontSize: "16px" }} />
              Edit
            </ActionButton>
          )}
          {onDelete && (
            <ActionButton className="delete" onClick={() => onDelete(workout._id)}>
              <Delete sx={{ fontSize: "16px" }} />
              Delete
            </ActionButton>
          )}
        </Actions>
      )}
    </Card>
  );
});

WorkoutCard.displayName = "WorkoutCard";

export default WorkoutCard;