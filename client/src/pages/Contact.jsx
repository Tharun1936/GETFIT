import React, { useState } from 'react';
import styled from "styled-components";
import { Email, Phone, LocationOn, AccessTime, Send } from "@mui/icons-material";
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
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 0px 16px;
  @media (max-width: 900px) {
    gap: 32px;
  }
`;

const Title = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  text-align: center;
  @media (max-width: 600px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const ContactInfoCard = styled.div`
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

const CardTitle = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 8px;
  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.text_primary + 10};
  
  &:last-child {
    border-bottom: none;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ theme }) => theme.primary + 20};
  color: ${({ theme }) => theme.primary};
  flex-shrink: 0;
  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
  }
`;

const InfoContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const FormCard = styled.div`
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ theme }) => theme.primary + 20};
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: #fff;
    transform: translateY(-2px);
  }
`;

const FAQSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  background: ${({ theme }) => theme.card_light};
`;

const FAQItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.text_primary + 10};
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const FAQQuestion = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const FAQAnswer = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.6;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <Container>
      <Wrapper>
        <div>
          <Title>Get In Touch</Title>
          <Subtitle>
            Have questions about your fitness journey? We're here to help! 
            Reach out to us and we'll respond as soon as possible.
          </Subtitle>
        </div>

        <ContentWrapper>
          <ContactInfoCard>
            <CardTitle>Contact Information</CardTitle>
            
            <InfoItem>
              <IconWrapper>
                <Email />
              </IconWrapper>
              <InfoContent>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>support@getfit.com</InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <IconWrapper>
                <Phone />
              </IconWrapper>
              <InfoContent>
                <InfoLabel>Phone</InfoLabel>
                <InfoValue>7676637718</InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <IconWrapper>
                <LocationOn />
              </IconWrapper>
              <InfoContent>
                <InfoLabel>Address</InfoLabel>
                <InfoValue>
                  123 Fitness Street<br />
                  Health City, HC 12345<br />
                  KR Nagar,Mysuru
                </InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <IconWrapper>
                <AccessTime />
              </IconWrapper>
              <InfoContent>
                <InfoLabel>Business Hours</InfoLabel>
                <InfoValue>
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </InfoValue>
              </InfoContent>
            </InfoItem>

            <div>
              <InfoLabel style={{ marginBottom: '12px' }}>Follow Us</InfoLabel>
              <SocialLinks>
                <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </SocialLink>
                <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </SocialLink>
                <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </SocialLink>
                <SocialLink href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </SocialLink>
              </SocialLinks>
            </div>
          </ContactInfoCard>

          <FormCard>
            <CardTitle>Send Us a Message</CardTitle>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <TextInput
                  label="Your Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  handelChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <TextInput
                  label="Email Address"
                  placeholder="Enter your email address"
                  type="email"
                  value={formData.email}
                  handelChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <TextInput
                  label="Subject"
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  handelChange={(e) => handleChange('subject', e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <TextInput
                  label="Message"
                  placeholder="Tell us how we can help..."
                  textArea
                  rows={6}
                  value={formData.message}
                  handelChange={(e) => handleChange('message', e.target.value)}
                  required
                />
              </FormGroup>

              <Button
                text="Send Message"
                htmlType="submit"
                isLoading={loading}
                isDisabled={loading}
                rightIcon={<Send />}
                full
              />
            </form>
          </FormCard>
        </ContentWrapper>

        <FAQSection>
          <CardTitle>Frequently Asked Questions</CardTitle>
          
          <FAQItem>
            <FAQQuestion>How do I track my workouts?</FAQQuestion>
            <FAQAnswer>
              You can track your workouts by going to the Dashboard page and using the "Add Workout" feature. 
              Simply enter your workout details in the specified format, and it will be automatically saved and tracked.
            </FAQAnswer>
          </FAQItem>

          <FAQItem>
            <FAQQuestion>Can I view my workout history?</FAQQuestion>
            <FAQAnswer>
              Yes! Navigate to the Workouts page where you can select any date from the calendar to view 
              all your workouts for that specific day, including total calories burned.
            </FAQAnswer>
          </FAQItem>

          <FAQItem>
            <FAQQuestion>How are calories calculated?</FAQQuestion>
            <FAQAnswer>
              Calories are calculated based on your workout duration, weight used, and exercise intensity. 
              Our algorithm uses standard fitness formulas to provide accurate calorie burn estimates.
            </FAQAnswer>
          </FAQItem>

          <FAQItem>
            <FAQQuestion>Where can I find workout tutorials?</FAQQuestion>
            <FAQAnswer>
              Check out our Tutorials page! We have curated YouTube videos organized by workout categories 
              including Legs, Back, Chest, Shoulders, Arms, Abs, Cardio, and Full Body workouts.
            </FAQAnswer>
          </FAQItem>

          <FAQItem>
            <FAQQuestion>Is my data secure?</FAQQuestion>
            <FAQAnswer>
              Absolutely! We use industry-standard encryption and security measures to protect your personal 
              information and workout data. Your privacy is our top priority.
            </FAQAnswer>
          </FAQItem>
        </FAQSection>
      </Wrapper>
    </Container>
  );
};

export default Contact;

