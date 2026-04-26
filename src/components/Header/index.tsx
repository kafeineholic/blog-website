"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { IconUser } from "@tabler/icons-react";
import { styled, useTheme } from "@mui/material";
import { useAuth } from "@/components/AuthProvider";

const Container = styled("header")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: 84,
  background: `linear-gradient(to left, ${theme.colors.orange700}, ${theme.colors.orange500})`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 24px",
  zIndex: 10,
  [theme.breakpoints.down("lg")]: {
    height: 60,
    padding: "0 16px",
  },
}));

interface IProps {
  isAdmin?: boolean;
}

const Header = ({ isAdmin }: IProps) => {
  const theme = useTheme();
  const { isLoggedIn, logout } = useAuth();
    return (
    <Container>
      <Link href="/" className="inline-flex items-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={160}
          height={46}
          className="h-10 w-auto object-contain object-left"
          priority
        />
      </Link>

      <Link
        href={isLoggedIn ? "/admin" : "/auth/login"}
        onClick={() => {
          if (isLoggedIn) {
            logout();
          }
        }}
        className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-1.5 text-lg font-semibold transition-transform hover:-translate-y-0.5"
      >
        <IconUser size={20} />
        {isLoggedIn ? 'Logout' : 'Blog Manager'}
      </Link>
    </Container>
  );
};

export default Header;