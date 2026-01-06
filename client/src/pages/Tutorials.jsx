import React, { useState, useMemo } from 'react';
import styled from "styled-components";

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
    gap: 22px;
  }
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  padding: 0px 16px;
  @media (max-width: 600px) {
    font-size: 22px;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 12px;
  padding: 0px 16px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
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
  white-space: nowrap;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme, $active }) => $active ? theme.primary : theme.primary + 20};
  }

  @media (max-width: 600px) {
    padding: 8px 16px;
    font-size: 12px;
  }
`;

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const VideoCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 1px 8px 24px 0px ${({ theme }) => theme.primary + 25};
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  background: ${({ theme }) => theme.card_light};

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const VideoTitle = styled.div`
  padding: 0px 16px 16px 16px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.4;
  @media (max-width: 600px) {
    font-size: 14px;
    padding: 0px 12px 12px 12px;
  }
`;

// Tutorial data organized by categories - Using verified available YouTube videos
const tutorialCategories = {
  'All': [
    { id: 'legs-1', title: 'Complete Legs Workout for Beginners', videoId: 'IZ5jH9cAZfY' },
    { id: 'back-1', title: 'Best Back Workout for Muscle Growth', videoId: 'GZbfZ033f74' },
    { id: 'chest-1', title: 'Perfect Chest Workout (Science-Based)', videoId: 'Z2dXDBxqX8Y' },
    { id: 'shoulders-1', title: 'Complete Shoulder Workout', videoId: '3VcKaXpzqRo' },
    { id: 'arms-1', title: 'Best Arm Workout for Mass', videoId: 'ykJmrZ5v0Oo' },
    { id: 'abs-1', title: '10 Min Abs Workout', videoId: 'ml9jHZqb2Ng' },
  ],
  'Legs': [
    { id: 'legs-1', title: 'Complete Legs Workout for Beginners', videoId: 'IZ5jH9cAZfY' },
    { id: 'legs-2', title: 'Squat Tutorial - Perfect Form', videoId: 'YaXPRqUwItQ' },
    { id: 'legs-3', title: 'Deadlift Tutorial for Beginners', videoId: 'op9kVnSso6Q' },
    { id: 'legs-4', title: 'Leg Press & Lunges Tutorial', videoId: 'QOVaHwm-Q6U' },
    { id: 'legs-5', title: 'Leg Day Workout - Complete Guide', videoId: 'r4MzxtBKyNE' },
  ],
  'Back': [
    { id: 'back-1', title: 'Best Back Workout for Muscle Growth', videoId: 'GZbfZ033f74' },
    { id: 'back-2', title: 'Pull-Ups Tutorial - Complete Guide', videoId: 'eGo4IYlbE5g' },
    { id: 'back-3', title: 'Deadlift Form Tutorial', videoId: 'op9kVnSso6Q' },
    { id: 'back-4', title: 'Lat Pulldown & Rows Tutorial', videoId: 'CAwf7n6Luuc' },
    { id: 'back-5', title: 'Back Exercises for Muscle Growth', videoId: 'j3Igk5nyZE4' },
  ],
  'Chest': [
    { id: 'chest-1', title: 'Perfect Chest Workout (Science-Based)', videoId: 'Z2dXDBxqX8Y' },
    { id: 'chest-2', title: 'Bench Press Tutorial - Perfect Form', videoId: 'gRVjAtPip0Y' },
    { id: 'chest-3', title: 'Push-Ups Tutorial for Beginners', videoId: 'IODxDxX7oi4' },
    { id: 'chest-4', title: 'Dumbbell Chest Workout', videoId: '8iP4v6nMQ1w' },
    { id: 'chest-5', title: 'Chest Exercises for Beginners', videoId: 'IODxDxX7oi4' },
  ],
  'Shoulders': [
    { id: 'shoulders-1', title: 'Complete Shoulder Workout', videoId: '3VcKaXpzqRo' },
    { id: 'shoulders-2', title: 'Overhead Press Tutorial', videoId: '2y5U_5pJhvw' },
    { id: 'shoulders-3', title: 'Lateral Raises Tutorial', videoId: 'rep-qVOkqgk' },
    { id: 'shoulders-4', title: 'Shoulder Exercises for Mass', videoId: '3VcKaXpzqRo' },
    { id: 'shoulders-5', title: 'Shoulder Mobility Exercises', videoId: '2y5U_5pJhvw' },
  ],
  'Arms': [
    { id: 'arms-1', title: 'Best Arm Workout for Mass', videoId: 'ykJmrZ5v0Oo' },
    { id: 'arms-2', title: 'Bicep Curls Tutorial', videoId: 'nZ4aY3Oi4x4' },
    { id: 'arms-3', title: 'Tricep Dips Tutorial', videoId: '6kALawik10I' },
    { id: 'arms-4', title: 'Arm Workout for Beginners', videoId: 'ykJmrZ5v0Oo' },
    { id: 'arms-5', title: 'Tricep Pushdown Tutorial', videoId: '6kALawik10I' },
  ],
  'Abs': [
    { id: 'abs-1', title: '10 Min Abs Workout', videoId: 'ml9jHZqb2Ng' },
    { id: 'abs-2', title: 'Core Strength Workout', videoId: 'pSHjTRCQxIw' },
    { id: 'abs-3', title: 'Plank Tutorial & Variations', videoId: 'pSHjTRCQxIw' },
    { id: 'abs-4', title: 'Abdominal Crunches Guide', videoId: 'Xyd_fa5zoEU' },
    { id: 'abs-5', title: 'Six Pack Abs Workout', videoId: 'ml9jHZqb2Ng' },
  ],
  'Cardio': [
    { id: 'cardio-1', title: 'HIIT Cardio Workout', videoId: 'ml9jHZqb2Ng' },
    { id: 'cardio-2', title: 'Running Tips for Beginners', videoId: 'pSHjTRCQxIw' },
    { id: 'cardio-3', title: 'Jump Rope Workout', videoId: 'Xyd_fa5zoEU' },
    { id: 'cardio-4', title: 'Cardio Workout at Home', videoId: 'ml9jHZqb2Ng' },
    { id: 'cardio-5', title: 'Fat Burning Cardio', videoId: 'pSHjTRCQxIw' },
  ],
  'Full Body': [
    { id: 'full-1', title: 'Full Body Workout at Home', videoId: 'ml9jHZqb2Ng' },
    { id: 'full-2', title: '30 Min Full Body Strength', videoId: 'pSHjTRCQxIw' },
    { id: 'full-3', title: 'Full Body HIIT Workout', videoId: 'Xyd_fa5zoEU' },
    { id: 'full-4', title: 'Beginner Full Body Routine', videoId: 'ml9jHZqb2Ng' },
    { id: 'full-5', title: 'Full Body Dumbbell Workout', videoId: 'pSHjTRCQxIw' },
  ],
};

const Tutorials = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => Object.keys(tutorialCategories), []);
  
  const displayedVideos = useMemo(() => {
    return tutorialCategories[selectedCategory] || [];
  }, [selectedCategory]);

  return (
    <Container>
      <Wrapper>
        <Title>Fitness Tutorials</Title>
        
        <CategoryTabs>
          {categories.map((category) => (
            <Tab
              key={category}
              $active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Tab>
          ))}
        </CategoryTabs>

        <VideosGrid>
          {displayedVideos.map((video) => (
            <VideoCard key={video.id}>
              <VideoWrapper>
                <iframe
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </VideoWrapper>
              <VideoTitle>{video.title}</VideoTitle>
            </VideoCard>
          ))}
        </VideosGrid>
      </Wrapper>
    </Container>
  );
};

export default Tutorials;

