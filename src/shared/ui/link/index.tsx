import styled from "styled-components";
import { Link as LinkLib } from "@tanstack/react-router";
import { bodyS, textPrimary, textPrimaryHover } from "@salutejs/sdds-themes/tokens";

type LinkProps = {
  to?: string;
  params?: Record<string, string | undefined>;
  search?: Record<string, string | undefined>;
  from?: string;
  children?: React.ReactNode;
  target?: string;
  replace?: boolean;
  disabled?: boolean;
  preload?: boolean;
  activeOptions?: { exact?: boolean; includeHash?: boolean; includeSearch?: boolean };
  mask?: { to?: string; from?: string };
};

export const Link = styled(LinkLib as React.ComponentType<LinkProps & React.RefAttributes<HTMLAnchorElement>>)`
  text-decoration: none;
  display: inline-flex;
`;

export const ExternalLink = styled.a`
  text-decoration: none;
  ${bodyS};

  color: ${textPrimary};
  &:hover {
    color: ${textPrimaryHover};
  }
`;
