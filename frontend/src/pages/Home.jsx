// src/pages/Home.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { RocketLaunchIcon, MagnifyingGlassIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// Tailwind "animate-bounce" equivalent
const bounce = keyframes`
  0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
  50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); }
`;

// Styled components
const HeroSection = styled.div`
  background: linear-gradient(to bottom right, #bfdbfe, #d1fae5);
  min-height: 100vh;
  padding: 5rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const HeroIcon = styled(RocketLaunchIcon)`
  height: 4rem;
  width: 4rem;
  color: #2563eb;
  margin-bottom: 1rem;
  animation: ${bounce} 1s infinite;
`;

const HeroTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const HeroText = styled.p`
  font-size: 1.125rem;
  color: #4b5563;
  margin-bottom: 2rem;
  max-width: 600px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: white;
  border-radius: 9999px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-decoration: none;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${props => props.bgHover || props.bg};
  }

  background-color: ${props => props.bg};
`;

const Section = styled.section`
  background-color: #f9fafb;
  padding: 3rem 0;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media(min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled.div`
  text-align: center;
`;

const FeatureIconWrapper = styled.div`
  display: inline-block;
  background-color: ${props => props.bg || "#e0e7ff"};
  border-radius: 9999px;
  padding: 1rem;
  margin-bottom: 0.5rem;
`;

const FeatureIcon = styled.div`
  height: 2rem;
  width: 2rem;
  color: ${props => props.color || "#2563eb"};
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const FeatureText = styled.p`
  color: #4b5563;
`;

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection>
        <HeroIcon />
        <HeroTitle>Launch Your Career with Job Portal</HeroTitle>
        <HeroText>
          Discover thousands of job opportunities and find the perfect match for your skills and aspirations.
        </HeroText>
        <ButtonGroup>
          <StyledLink to="/jobs" bg="#2563eb" bgHover="#1d4ed8">
            <MagnifyingGlassIcon className="h-5 w-5" />
            Find Jobs
          </StyledLink>
          <StyledLink to="/register" bg="#22c55e" bgHover="#16a34a">
            <BriefcaseIcon className="h-5 w-5" />
            Get Started
          </StyledLink>
        </ButtonGroup>
      </HeroSection>

      <Section>
        <Container>
          <SectionTitle>Why Choose Job Portal?</SectionTitle>
          <Grid>
            <FeatureCard>
              <FeatureIconWrapper bg="#bfdbfe">
                <MagnifyingGlassIcon style={{ width: 32, height: 32, color: '#2563EB' }} />
              </FeatureIconWrapper>
              <FeatureTitle>Extensive Job Listings</FeatureTitle>
              <FeatureText>Access a wide range of job postings from various industries and locations.</FeatureText>
            </FeatureCard>

            <FeatureCard>
              <FeatureIconWrapper bg="#bbf7d0">
                {/* UserIcon could go here */}
              </FeatureIconWrapper>
              <FeatureTitle>Personalized Experience</FeatureTitle>
              <FeatureText>Tailor your job search and receive recommendations based on your profile.</FeatureText>
            </FeatureCard>

            <FeatureCard>
              <FeatureIconWrapper bg="#fef9c3">
                <BriefcaseIcon style={{ width: 32, height: 32, color: '#D97706' }} />
              </FeatureIconWrapper>
              <FeatureTitle>Career Growth Resources</FeatureTitle>
              <FeatureText>Find tools and articles to help you advance your career.</FeatureText>
            </FeatureCard>
          </Grid>
        </Container>
      </Section>

      <Footer />
    </>
  );
};

export default Home;
