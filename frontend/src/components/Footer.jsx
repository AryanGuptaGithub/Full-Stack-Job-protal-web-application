// src/components/Footer.jsx
import styled from "styled-components";

const FooterWrapper = styled.footer`
  background-color: #1f2937;
  color: white;
  padding: 1rem;
  text-align: center;
  margin-top: 2.5rem;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <p>&copy; {new Date().getFullYear()} Job Portal. All rights reserved.</p>
    </FooterWrapper>
  );
};

export default Footer;
