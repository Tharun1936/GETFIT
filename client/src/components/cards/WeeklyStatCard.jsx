import React from 'react'
import styled from "styled-components"
import { BarChart } from '@mui/x-charts';


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

const data = {
  totalCaloriesBurnt: 13500,
  totalWorkots: 6,
  avgCaloriesBurntPerWorkout: 2250,
  totalWeeksCaloriesBurnt: {
    weeks: ["17th","18th","19th","20th","21st","22nd","23rd"],
    caloriesBurned: [10500, 0, 0, 3680, 0, 2000]
  },
  pieChartData: [
    {
      id:0,
      value: 6000,
      label: "Legs",
    },
    {
      id:1,
      value: 3300,
      label: "Back"
    },
    {
      id:2,
      value: 3740,
      label: "Shoulder"
    },
    {
      id: 3,
      value: 2250,
      label: "ABS"
    },
  ],
}

const WeeklyStatCard = ({ data }) => {
  return (
    <Card>
        <Title>Weekly calories Burned</Title>
        {data?.totalWeeksCaloriesBurnt && <BarChart
        xAxis={[
            {scaleType: "band", data: data?.totalWeeksCaloriesBurnt?.weeks}
        ]}
        series={[{ data: data?.totalWeeksCaloriesBurnt?.caloriesBurned}]}
        height={300}
        />}
    </Card>
  )
}

export default WeeklyStatCard
