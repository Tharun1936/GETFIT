import { CircularProgress } from "@mui/material";
import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  border-radius: 10px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: min-content;
  padding: 16px 26px;
  box-shadow: 1px 20px 35px 0px ${({ theme }) => theme.primary + 40};
  border: 1px solid ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.primary};

  @media (max-width: 600px) {
    padding: 8px 12px;
  }

  /* variant: use transient $variant */
  ${({ $variant, theme }) =>
    $variant === "secondary"
      ? `
    background: ${theme.secondary};
    border: 1px solid ${theme.secondary};
  `
      : ``}

  /* transient styling props (won't be forwarded to DOM) */
  ${({ $isDisabled }) =>
    $isDisabled &&
    `
    opacity: 0.8;
    cursor: not-allowed;
  `}

  ${({ $isLoading }) =>
    $isLoading &&
    `
    opacity: 0.8;
    cursor: not-allowed;
  `}

  ${({ $flex }) =>
    $flex &&
    `
    flex: 1;
  `}

  ${({ $small }) =>
    $small &&
    `
    padding: 10px 28px;
  `}

  ${({ $outlined, theme }) =>
    $outlined &&
    `
    background: transparent;
    color: ${theme.primary};
    box-shadow: none;
    border: 1px solid ${theme.primary};
  `}

  ${({ $full }) =>
    $full &&
    `
    width: 100%;
  `}
`;

/**
 * AppButton - exported as default from Button.jsx
 *
 * Props:
 *  - text, leftIcon, rightIcon
 *  - isLoading, isDisabled (booleans)
 *  - variant ("primary" | "secondary")  -> passed as $variant
 *  - htmlType (string) -> actual <button type="..."> (e.g. "button"|"submit")
 *  - onClick
 *  - flex, small, outlined, full (booleans for styling)
 */
const AppButton = ({
  text,
  isLoading = false,
  isDisabled = false,
  rightIcon,
  leftIcon,
  variant = "primary",
  htmlType = "button",
  onClick,
  flex = false,
  small = false,
  outlined = false,
  full = false,
}) => {
  return (
    <StyledButton
      type={htmlType}
      onClick={() => !isDisabled && !isLoading && onClick?.()}
      $isDisabled={isDisabled}
      $isLoading={isLoading}
      $variant={variant}
      $flex={flex}
      $small={small}
      $outlined={outlined}
      $full={full}
      disabled={isDisabled || isLoading}
    >
      {isLoading && (
        <CircularProgress style={{ width: "18px", height: "18px", color: "inherit" }} />
      )}
      {leftIcon}
      {text}
      {isLoading && <> . . .</>}
      {rightIcon}
    </StyledButton>
  );
};

export default AppButton;
