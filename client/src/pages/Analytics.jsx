import React, { useState, useEffect, useMemo } from 'react';
import styled from "styled-components";
import { BarChart, LineChart } from '@mui/x-charts';
import { getAdvancedAnalytics } from "../api";

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

const PeriodTabs = styled.div`
  display: flex;
  gap: 12px;
`;

const Tab = styled.button`
  padding: 10px 20px;
  border: 2px solid ${({ theme, $active }) => $active ? theme.primary : theme.text_primary + 40};
  border-radius: 20px;
  background: ${({ theme, $active }) => $active ? theme.primary : 'transparent'};
  color: ${({ theme, $active }) => $active ? '#fff' : theme.text_primary};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ChartCard = styled.div`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  background: ${({ theme }) => theme.card_light};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ChartTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const RecordsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const RecordCard = styled.div`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 12px;
  background: ${({ theme }) => theme.card_light};
`;

const RecordLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 8px;
`;

const RecordValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;

const Analytics = () => {
  const [period, setPeriod] = useState('monthly');
  const [analytics, setAnalytics] = useState(null);
  const [personalRecords, setPersonalRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await getAdvancedAnalytics(period);
      if (res?.data) {
        setAnalytics(res.data.analytics || []);
        setPersonalRecords(res.data.personalRecords || []);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    if (!analytics || analytics.length === 0) return null;

    const months = analytics.map(item => {
      const [year, month] = item._id.split('-');
      const date = new Date(year, parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });

    const calories = analytics.map(item => item.totalCalories || 0);
    const workouts = analytics.map(item => item.totalWorkouts || 0);
    const avgCalories = analytics.map(item => Math.round(item.avgCaloriesPerWorkout || 0));

    return { months, calories, workouts, avgCalories };
  }, [analytics]);

  return (
    <Container>
      <Wrapper>
        <Header>
          <Title>Advanced Analytics</Title>
          <PeriodTabs>
            <Tab
              $active={period === 'monthly'}
              onClick={() => setPeriod('monthly')}
            >
              Monthly
            </Tab>
            <Tab
              $active={period === 'yearly'}
              onClick={() => setPeriod('yearly')}
            >
              Yearly
            </Tab>
          </PeriodTabs>
        </Header>

        {loading ? (
          <div>Loading analytics...</div>
        ) : !chartData ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'inherit', opacity: 0.7 }}>
            No analytics data available yet. Start logging workouts to see your progress!
          </div>
        ) : (
          <>
            <ChartsGrid>
              <ChartCard>
                <ChartTitle>Total Calories Burned</ChartTitle>
                <BarChart
                  xAxis={[{ scaleType: "band", data: chartData.months }]}
                  series={[{ data: chartData.calories, label: 'Calories (kcal)' }]}
                  height={300}
                />
              </ChartCard>

              <ChartCard>
                <ChartTitle>Total Workouts</ChartTitle>
                <BarChart
                  xAxis={[{ scaleType: "band", data: chartData.months }]}
                  series={[{ data: chartData.workouts, label: 'Workouts' }]}
                  height={300}
                />
              </ChartCard>

              <ChartCard>
                <ChartTitle>Average Calories per Workout</ChartTitle>
                <LineChart
                  xAxis={[{ scaleType: "point", data: chartData.months }]}
                  series={[{ data: chartData.avgCalories, label: 'Avg Calories' }]}
                  height={300}
                />
              </ChartCard>
            </ChartsGrid>

            {personalRecords.length > 0 && (
              <ChartCard>
                <ChartTitle>Personal Records</ChartTitle>
                <RecordsGrid>
                  {personalRecords.map((record, idx) => (
                    <RecordCard key={idx}>
                      <RecordLabel>{record._id}</RecordLabel>
                      {record.maxWeight > 0 && (
                        <RecordValue>Max Weight: {record.maxWeight} kg</RecordValue>
                      )}
                      {record.maxReps > 0 && (
                        <RecordValue style={{ fontSize: '18px', marginTop: '8px' }}>
                          Max Reps: {record.maxReps}
                        </RecordValue>
                      )}
                      {record.maxCalories > 0 && (
                        <RecordValue style={{ fontSize: '18px', marginTop: '8px' }}>
                          Max Calories: {Math.round(record.maxCalories)} kcal
                        </RecordValue>
                      )}
                    </RecordCard>
                  ))}
                </RecordsGrid>
              </ChartCard>
            )}
          </>
        )}
      </Wrapper>
    </Container>
  );
};

export default Analytics;

