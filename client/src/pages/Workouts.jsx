import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from "styled-components"
import WorkoutCard from '../components/cards/WorkoutCard'
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Search, FilterList, Edit, Delete } from "@mui/icons-material";
import dayjs from "dayjs";
import { getWorkouts, updateWorkout, deleteWorkout, searchWorkouts } from "../api";
import TextInput from "../components/TextInput";
import Button from "../components/Button";

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
  max-width: 1600px;
  display: flex;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
    flex-direction: column;
  }
`;
const Left = styled.div`
  flex: 0.2;
  height: fit-content;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;
const Right = styled.div`
  flex: 1;
`;
const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const SecTitle = styled.div`
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const SearchFilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  background: ${({ theme }) => theme.card_light};
  margin-bottom: 24px;
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const EditModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.card_light};
  border-radius: 14px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Workouts = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    minCalories: '',
    maxCalories: '',
  });
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [editForm, setEditForm] = useState({
    WorkoutName: '',
    category: '',
    sets: '',
    reps: '',
    weight: '',
    duration: '',
  });

  // Format date for API call (YYYY-MM-DD)
  const formattedDate = useMemo(() => {
    return selectedDate.format("YYYY-MM-DD");
  }, [selectedDate]);

  // Fetch workouts for selected date
  const fetchWorkouts = useCallback(async (date) => {
    setLoading(true);
    try {
      const res = await getWorkouts(date);
      if (res?.data) {
        const workoutList = res.data.todaysWorkouts || res.data || [];
        setWorkouts(Array.isArray(workoutList) ? workoutList : []);
        setTotalCalories(res.data.totalCaloriesBurnt || 0);
      }
    } catch (err) {
      console.error("Failed to fetch workouts:", err?.response ?? err);
      setWorkouts([]);
      setTotalCalories(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch workouts when date changes (if not in search mode)
  useEffect(() => {
    if (!searchMode) {
      fetchWorkouts(formattedDate);
    }
  }, [formattedDate, fetchWorkouts, searchMode]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setSearchMode(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchQuery || undefined,
        category: filters.category || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        minCalories: filters.minCalories || undefined,
        maxCalories: filters.maxCalories || undefined,
      };
      
      const res = await searchWorkouts(params);
      if (res?.data?.workouts) {
        setWorkouts(res.data.workouts);
        const total = res.data.workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
        setTotalCalories(total);
      }
      setSearchMode(true);
    } catch (err) {
      console.error("Search failed:", err);
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilters({
      category: '',
      startDate: '',
      endDate: '',
      minCalories: '',
      maxCalories: '',
    });
    setSearchMode(false);
    fetchWorkouts(formattedDate);
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setEditForm({
      WorkoutName: workout.WorkoutName || workout.workoutName || '',
      category: workout.category || '',
      sets: workout.sets || '',
      reps: workout.reps || '',
      weight: workout.weight || '',
      duration: workout.duration || '',
    });
  };

  const handleUpdateWorkout = async () => {
    setLoading(true);
    try {
      await updateWorkout(editingWorkout._id, editForm);
      alert("Workout updated successfully!");
      setEditingWorkout(null);
      if (searchMode) {
        handleSearch();
      } else {
        fetchWorkouts(formattedDate);
      }
    } catch (err) {
      console.error("Failed to update workout:", err);
      const errorMsg = err?.response?.data?.message || "Failed to update workout";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (workoutId) => {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;

    setLoading(true);
    try {
      await deleteWorkout(workoutId);
      alert("Workout deleted successfully!");
      if (searchMode) {
        handleSearch();
      } else {
        fetchWorkouts(formattedDate);
      }
    } catch (err) {
      console.error("Failed to delete workout:", err);
      alert("Failed to delete workout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          <Title>Select Date</Title>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar 
              value={selectedDate}
              onChange={handleDateChange}
            />
          </LocalizationProvider>
        </Left>
        <Right>
          <Section>
            <SecTitle>
              {searchMode ? "Search Results" : `${selectedDate.format("MMMM D, YYYY")} Workouts`}
              {totalCalories > 0 && (
                <span style={{ 
                  fontSize: "16px", 
                  color: "inherit", 
                  opacity: 0.7,
                  marginLeft: "12px"
                }}>
                  ({totalCalories.toFixed(0)} kcal)
                </span>
              )}
            </SecTitle>

            <SearchFilterSection>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <TextInput
                  placeholder="Search workouts by name..."
                  value={searchQuery}
                  handelChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1 }}
                />
                <Button
                  text="Search"
                  leftIcon={<Search />}
                  onClick={handleSearch}
                  isLoading={loading}
                />
                {searchMode && (
                  <Button
                    text="Clear"
                    outlined
                    onClick={handleClearSearch}
                  />
                )}
              </div>

              <FilterRow>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'transparent',
                    color: 'inherit',
                    fontSize: '14px'
                  }}
                >
                  <option value="">All Categories</option>
                  <option value="Legs">Legs</option>
                  <option value="Back">Back</option>
                  <option value="Chest">Chest</option>
                  <option value="Shoulders">Shoulders</option>
                  <option value="Arms">Arms</option>
                  <option value="Abs">Abs</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Full Body">Full Body</option>
                </select>

                <TextInput
                  placeholder="Start Date"
                  type="date"
                  value={filters.startDate}
                  handelChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                />

                <TextInput
                  placeholder="End Date"
                  type="date"
                  value={filters.endDate}
                  handelChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                />

                <TextInput
                  placeholder="Min Calories"
                  type="number"
                  value={filters.minCalories}
                  handelChange={(e) => setFilters(prev => ({ ...prev, minCalories: e.target.value }))}
                />

                <TextInput
                  placeholder="Max Calories"
                  type="number"
                  value={filters.maxCalories}
                  handelChange={(e) => setFilters(prev => ({ ...prev, maxCalories: e.target.value }))}
                />
              </FilterRow>
            </SearchFilterSection>

            <CardWrapper>
              {loading ? (
                <div style={{ width: "100%", textAlign: "center", padding: "40px" }}>
                  Loading workouts...
                </div>
              ) : workouts.length === 0 ? (
                <div style={{ width: "100%", textAlign: "center", padding: "40px" }}>
                  No workouts found for this date
                </div>
              ) : (
                workouts.map((workout, idx) => (
                  <WorkoutCard 
                    key={workout._id ?? workout.id ?? `workout-${idx}`} 
                    workout={workout}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </CardWrapper>
          </Section>
        </Right>
      </Wrapper>

      {editingWorkout && (
        <EditModal onClick={(e) => e.target === e.currentTarget && setEditingWorkout(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <Title style={{ fontSize: '24px', margin: 0 }}>Edit Workout</Title>
            
            <TextInput
              label="Workout Name"
              value={editForm.WorkoutName}
              handelChange={(e) => setEditForm(prev => ({ ...prev, WorkoutName: e.target.value }))}
            />

            <select
              value={editForm.category}
              onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: 'inherit',
                fontSize: '14px'
              }}
            >
              <option value="">Select Category</option>
              <option value="Legs">Legs</option>
              <option value="Back">Back</option>
              <option value="Chest">Chest</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Arms">Arms</option>
              <option value="Abs">Abs</option>
              <option value="Cardio">Cardio</option>
              <option value="Full Body">Full Body</option>
            </select>

            <FilterRow>
              <TextInput
                label="Sets"
                type="number"
                value={editForm.sets}
                handelChange={(e) => setEditForm(prev => ({ ...prev, sets: e.target.value }))}
              />
              <TextInput
                label="Reps"
                type="number"
                value={editForm.reps}
                handelChange={(e) => setEditForm(prev => ({ ...prev, reps: e.target.value }))}
              />
              <TextInput
                label="Weight (kg)"
                type="number"
                value={editForm.weight}
                handelChange={(e) => setEditForm(prev => ({ ...prev, weight: e.target.value }))}
              />
              <TextInput
                label="Duration (min)"
                type="number"
                value={editForm.duration}
                handelChange={(e) => setEditForm(prev => ({ ...prev, duration: e.target.value }))}
              />
            </FilterRow>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                text="Save"
                full
                onClick={handleUpdateWorkout}
                isLoading={loading}
                isDisabled={loading}
              />
              <Button
                text="Cancel"
                outlined
                full
                onClick={() => setEditingWorkout(null)}
                isDisabled={loading}
              />
            </div>
          </ModalContent>
        </EditModal>
      )}
    </Container>
  );
};

export default Workouts;
