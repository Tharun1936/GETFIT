import React, { useEffect, useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import { counts } from "../utils/data";
import CountsCard from "../components/cards/CountsCard";
import WeeklyStatCard from "../components/cards/WeeklyStatCard";
import CategoryChart from "../components/cards/CategoryChart";
import AddWorkout from "../components/AddWorkout";
import WorkoutCard from "../components/cards/WorkoutCard";
import { addWorkout, getDashboardDetails, getWorkouts } from "../api";

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
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const Title = styled.div`
  padding: 0px 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;
const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
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

/**
 * Dashboard page
 *
 * Notes:
 *  - API helpers (getDashboardDetails, getWorkouts, addWorkout) read auth token from localStorage via interceptor.
 *  - getWorkouts(date) expects an optional date string (or nothing). We pass "" if not required by backend.
 *  - Ensure each child in .map() has a unique key (prefer DB id, fallback to stable item.key or index).
 */
const Dashboard = () => {
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);
  const [data, setData] = useState({});
  const [buttonLoading, setButtonLoading] = useState(false);
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [workout, setWorkout] = useState(
    `#Legs
-Back Squat
-5 setsX15 reps
-30 kg
-10 min`
  );

  // Memoize today's date calculation - only recalculates when component mounts
  const todayString = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Memoized fetch functions using useCallback to prevent recreation on every render
  const dashboardData = useCallback(async () => {
    setLoadingDashboard(true);
    try {
      const res = await getDashboardDetails();
      if (res?.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("getDashboardDetails error:", err?.response ?? err);
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  const getTodaysWorkout = useCallback(async () => {
    setLoadingWorkouts(true);
    try {
      const backendRequiresDate = false;
      const dateToUse = backendRequiresDate ? todayString : "";
      const res = await getWorkouts(dateToUse);
      const todays = res?.data?.todaysWorkouts ?? res?.data ?? [];
      setTodaysWorkouts(Array.isArray(todays) ? todays : []);
    } catch (err) {
      console.error("getWorkouts failed:", err?.response ?? err);
      setTodaysWorkouts([]);
    } finally {
      setLoadingWorkouts(false);
    }
  }, [todayString]);

  // Memoized add workout function
  const addNewWorkout = useCallback(async () => {
    setButtonLoading(true);
    try {
      const payload = { workoutString: workout };
      await addWorkout(payload);
      // Refresh both dashboard and today's workouts in parallel for better performance
      await Promise.all([dashboardData(), getTodaysWorkout()]);
    } catch (err) {
      console.error("addWorkout failed:", err?.response ?? err);
      const serverMsg = err?.response?.data?.message ?? err?.message ?? "Failed to add workout";
      alert(serverMsg);
    } finally {
      setButtonLoading(false);
    }
  }, [workout, dashboardData, getTodaysWorkout]);

  // Initial load - fetch data in parallel for faster loading
  useEffect(() => {
    Promise.all([dashboardData(), getTodaysWorkout()]);
  }, [dashboardData, getTodaysWorkout]);

  return (
    <Container>
      <Wrapper>
        <Title>Dashboard</Title>

        <FlexWrap>
          {counts.map((item, idx) => (
            <CountsCard
              key={item.key ?? item.id ?? `counts-${idx}`}
              item={item}
              value={data?.[item.key]}
            />
          ))}
        </FlexWrap>

        <FlexWrap>
          <WeeklyStatCard data={data} />
          <CategoryChart data={data} />
          <AddWorkout
            workout={workout}
            setWorkout={setWorkout}
            addNewWorkout={addNewWorkout}
            buttonLoading={buttonLoading}
          />
        </FlexWrap>

        <Section>
          <Title>Today's Workouts</Title>

          <CardWrapper>
            {loadingWorkouts ? (
              <div>Loading workouts…</div>
            ) : todaysWorkouts.length === 0 ? (
              <div>No workouts found</div>
            ) : (
              todaysWorkouts.map((w, idx) => (
                // prefer DB id fields, fallback to index
                <WorkoutCard key={w._id ?? w.id ?? `workout-${idx}`} workout={w} />
              ))
            )}
          </CardWrapper>
        </Section>
      </Wrapper>
    </Container>
  );
};

export default Dashboard;
