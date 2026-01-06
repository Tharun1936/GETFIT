import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { Edit, Save, Cancel } from "@mui/icons-material";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { getUserProfile, updateUserProfile } from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";

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
  max-width: 800px;
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

const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  background: ${({ theme }) => theme.card_light};
  @media (max-width: 600px) {
    padding: 24px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary + 20};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  border: 4px solid ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    width: 100px;
    height: 100px;
    font-size: 40px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Profile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    img: '',
    age: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getUserProfile();
      if (res?.data?.user) {
        setProfile({
          name: res.data.user.name || '',
          email: res.data.user.email || '',
          img: res.data.user.img || '',
          age: res.data.user.age || '',
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateUserProfile(profile);
      if (res?.data?.user) {
        // Update Redux store
        const token = localStorage.getItem("getfit-app-token");
        dispatch(loginSuccess({ user: res.data.user, token }));
        setEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      const errorMsg = err?.response?.data?.message || "Failed to update profile";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    fetchProfile();
    setEditing(false);
  };

  if (loading && !profile.name) {
    return (
      <Container>
        <Wrapper>
          <div>Loading profile...</div>
        </Wrapper>
      </Container>
    );
  }

  return (
    <Container>
      <Wrapper>
        <Title>My Profile</Title>

        <ProfileCard>
          <Header>
            <Title style={{ fontSize: '24px', margin: 0 }}>Profile Information</Title>
            {!editing && (
              <Button
                text="Edit"
                small
                leftIcon={<Edit />}
                onClick={() => setEditing(true)}
              />
            )}
          </Header>

          <AvatarSection>
            <Avatar>
              {profile.img ? (
                <img src={profile.img} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                profile.name?.[0]?.toUpperCase() || 'U'
              )}
            </Avatar>
          </AvatarSection>

          <FormGroup>
            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              value={profile.name}
              handelChange={(e) => handleChange('name', e.target.value)}
              disabled={!editing}
            />
          </FormGroup>

          <FormGroup>
            <TextInput
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              value={profile.email}
              handelChange={(e) => handleChange('email', e.target.value)}
              disabled={!editing}
            />
          </FormGroup>

          <FormGroup>
            <TextInput
              label="Age"
              placeholder="Enter your age"
              type="number"
              value={profile.age}
              handelChange={(e) => handleChange('age', e.target.value)}
              disabled={!editing}
            />
          </FormGroup>

          <FormGroup>
            <TextInput
              label="Profile Image URL"
              placeholder="Enter image URL"
              value={profile.img}
              handelChange={(e) => handleChange('img', e.target.value)}
              disabled={!editing}
            />
          </FormGroup>

          {editing && (
            <ButtonGroup>
              <Button
                text="Save Changes"
                full
                leftIcon={<Save />}
                onClick={handleSave}
                isLoading={loading}
                isDisabled={loading}
              />
              <Button
                text="Cancel"
                full
                outlined
                leftIcon={<Cancel />}
                onClick={handleCancel}
                isDisabled={loading}
              />
            </ButtonGroup>
          )}
        </ProfileCard>
      </Wrapper>
    </Container>
  );
};

export default Profile;

