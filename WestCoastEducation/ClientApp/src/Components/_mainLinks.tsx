import {
  IconBooks,
  IconAlertCircle,
  IconUsers,
  IconAddressBook,
} from "@tabler/icons-react";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";
import { Link } from "react-router-guard";
import React, { useContext } from "react";
import { User } from "../Models/user";
import AuthContext from "../Providers/auth.provider";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  path: string;
  role: string | null;
}

function MainLink({ role = null, icon, color, label, path }: MainLinkProps) {
  const { user }: Partial<{ user: User }> = useContext(AuthContext);

  return role == null || user?.role == role ? (
    <UnstyledButton
      component={Link}
      to={path}
      sx={(theme) => ({
        display: "block",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  ) : (
    <></>
  );
}

const data = [
  {
    role: null,
    icon: <IconBooks size={16} />,
    color: "blue",
    label: "Books",
    path: "/books",
  },
  {
    role: "Admin",
    icon: <IconUsers size={16} />,
    color: "pink",
    label: "Users",
    path: "/users",
  },
];

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
