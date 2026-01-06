import React, { useState, useEffect, useCallback } from 'react';
import styled from "styled-components";
import { Add, Edit, Delete, CheckCircle, Cancel } from "@mui/icons-material";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { createGoal, getUserGoals, updateGoal, deleteGoal } from "../api";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 24px;
  }
`;

const Title = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 600px) {
    font-size: 24px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const GoalCard = styled.div`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  background: ${({ theme }) => theme.card_light};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const GoalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const GoalTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const GoalType = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.primary + 20};
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProgressItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProgressLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  display: flex;
  justify-content: space-between;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: ${({ theme }) => theme.text_primary + 20};
  border-radius: 6px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.primary};
  border-radius: 6px;
  transition: width 0.3s ease;
  width: ${({ $percentage }) => Math.min($percentage, 100)}%;
`;

const FormCard = styled.div`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  background: ${({ theme }) => theme.card_light};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    type: 'daily',
    targetCalories: '',
    targetWorkouts: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUserGoals('true');
      if (res?.data?.goals) {
        setGoals(res.data.goals);
      }
    } catch (err) {
      console.error("Failed to fetch goals:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingGoal) {
        await updateGoal(editingGoal._id, formData);
        alert("Goal updated successfully!");
      } else {
        await createGoal(formData);
        alert("Goal created successfully!");
      }
      setShowForm(false);
      setEditingGoal(null);
      setFormData({
        type: 'daily',
        targetCalories: '',
        targetWorkouts: '',
        startDate: '',
        endDate: '',
      });
      fetchGoals();
    } catch (err) {
      console.error("Failed to save goal:", err);
      const errorMsg = err?.response?.data?.message || "Failed to save goal";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      type: goal.type,
      targetCalories: goal.targetCalories || '',
      targetWorkouts: goal.targetWorkouts || '',
      startDate: goal.startDate ? new Date(goal.startDate).toISOString().split('T')[0] : '',
      endDate: goal.endDate ? new Date(goal.endDate).toISOString().split('T')[0] : '',
    });
    setShowForm(true);
  };

  const handleDelete = async (goalId) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;

    setLoading(true);
    try {
      await deleteGoal(goalId);
      alert("Goal deleted successfully!");
      fetchGoals();
    } catch (err) {
      console.error("Failed to delete goal:", err);
      alert("Failed to delete goal");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGoal(null);
    setFormData({
      type: 'daily',
      targetCalories: '',
      targetWorkouts: '',
      startDate: '',
      endDate: '',
    });
  };

  // Set default dates
  useEffect(() => {
    if (showForm && !formData.startDate) {
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + (formData.type === 'daily' ? 0 : formData.type === 'weekly' ? 7 : 30));
      
      setFormData(prev => ({
        ...prev,
        startDate: today.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      }));
    }
  }, [showForm, formData.type]);

  return (
    <Container>
      <Wrapper>
        <Header>
          <Title>My Goals</Title>
          {!showForm && (
            <Button
              text="Create Goal"
              leftIcon={<Add />}
              onClick={() => setShowForm(true)}
            />
          )}
        </Header>

        {showForm && (
          <FormCard>
            <Title style={{ fontSize: '24px', margin: 0 }}>
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </Title>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', display: 'block', color: 'inherit' }}>
                  Goal Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'transparent',
                    color: 'inherit',
                    fontSize: '16px',
                    width: '100%'
                  }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <TextInput
                    label="Target Calories"
                    type="number"
                    placeholder="e.g., 2000"
                    value={formData.targetCalories}
                    handelChange={(e) => handleChange('targetCalories', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <TextInput
                    label="Target Workouts"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.targetWorkouts}
                    handelChange={(e) => handleChange('targetWorkouts', e.target.value)}
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <TextInput
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    handelChange={(e) => handleChange('startDate', e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <TextInput
                    label="End Date"
                    type="date"
                    value={formData.endDate}
                    handelChange={(e) => handleChange('endDate', e.target.value)}
                    required
                  />
                </FormGroup>
              </FormRow>

              <ButtonGroup>
                <Button
                  text={editingGoal ? "Update Goal" : "Create Goal"}
                  type="submit"
                  full
                  isLoading={loading}
                  isDisabled={loading}
                />
                <Button
                  text="Cancel"
                  outlined
                  full
                  onClick={handleCancel}
                  isDisabled={loading}
                />
              </ButtonGroup>
            </form>
          </FormCard>
        )}

        {loading && !showForm ? (
          <div>Loading goals...</div>
        ) : goals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'inherit', opacity: 0.7 }}>
            No goals set yet. Create your first goal to start tracking!
          </div>
        ) : (
          <GoalsGrid>
            {goals.map((goal) => (
              <GoalCard key={goal._id}>
                <GoalHeader>
                  <div>
                    <GoalTitle>
                      {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)} Goal
                    </GoalTitle>
                    <div style={{ fontSize: '12px', color: 'inherit', opacity: 0.7, marginTop: '4px' }}>
                      {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <GoalType>{goal.type}</GoalType>
                </GoalHeader>

                <ProgressSection>
                  {goal.targetCalories > 0 && (
                    <ProgressItem>
                      <ProgressLabel>
                        <span>Calories</span>
                        <span>
                          {goal.progress?.calories?.actual || 0} / {goal.targetCalories} kcal
                          ({Math.round(goal.progress?.calories?.percentage || 0)}%)
                        </span>
                      </ProgressLabel>
                      <ProgressBar>
                        <ProgressFill $percentage={goal.progress?.calories?.percentage || 0} />
                      </ProgressBar>
                    </ProgressItem>
                  )}

                  {goal.targetWorkouts > 0 && (
                    <ProgressItem>
                      <ProgressLabel>
                        <span>Workouts</span>
                        <span>
                          {goal.progress?.workouts?.actual || 0} / {goal.targetWorkouts}
                          ({Math.round(goal.progress?.workouts?.percentage || 0)}%)
                        </span>
                      </ProgressLabel>
                      <ProgressBar>
                        <ProgressFill $percentage={goal.progress?.workouts?.percentage || 0} />
                      </ProgressBar>
                    </ProgressItem>
                  )}
                </ProgressSection>

                <ButtonGroup>
                  <Button
                    text="Edit"
                    small
                    leftIcon={<Edit />}
                    onClick={() => handleEdit(goal)}
                    flex
                  />
                  <Button
                    text="Delete"
                    small
                    outlined
                    leftIcon={<Delete />}
                    onClick={() => handleDelete(goal._id)}
                    flex
                  />
                </ButtonGroup>
              </GoalCard>
            ))}
          </GoalsGrid>
        )}
      </Wrapper>
    </Container>
  );
};

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default Goals;

