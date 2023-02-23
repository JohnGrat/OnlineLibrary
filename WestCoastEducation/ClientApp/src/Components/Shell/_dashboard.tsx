import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  useMantineTheme,
  Anchor,
  Group,
  Menu,
  Burger,
  Breadcrumbs,
} from "@mantine/core";
import { Brand } from "../_brand";
import { UserButton } from "../_user";
import { MainLinks } from "../_mainLinks";
import { User } from "../../Models/user";
import { IconExternalLink } from "@tabler/icons-react";
import { useContext, useState } from "react";
import { SignInButton } from "../_signInButton";
import AuthContext from "../../Providers/auth.provider";

function convertURL(url: string) {
  const path = url.split("/").filter(Boolean);
  let base = "";
  return path
    .map((p, i) => {
      base += `/${p}`;
      return { title: p, href: base };
    })
    .map((item, index) => (
      <Anchor href={item.href} key={index}>
        {item.title}
      </Anchor>
    ));
}

interface Props {
  children: React.ReactNode;
  history: History;
  guardData?: object;
}

function dashboard(props: any) {
  const { children, history, location, guardData }: any = props;
  const { user, logout }: Partial<{ user: User; logout: () => void }> =
    useContext(AuthContext);
  const [opened, setOpened] = useState(false);

  const bcItems = convertURL(location.pathname);
  const theme = useMantineTheme();
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <MainLinks />
        </Navbar>
      }
      aside={
        <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
          <Aside
            zIndex={1}
            p="md"
            hiddenBreakpoint="sm"
            width={{ sm: 200, lg: 300 }}
          >
            <Text>Application sidebar</Text>
          </Aside>
        </MediaQuery>
      }
      footer={
        <Footer height={60} p="md">
          Application footer
        </Footer>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{
              justifyContent: "space-between",
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              <div>
                <Brand />
              </div>
            </MediaQuery>

            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              <div>
                <Breadcrumbs separator="→">{bcItems}</Breadcrumbs>
              </div>
            </MediaQuery>

            <Group>
              {user ? (
                (
                  <Menu width={200} shadow="md" withArrow zIndex={10}>
                    <Menu.Target>
                      <UserButton
                        image={user.picture}
                        name={user.displayName}
                        role={user.role}
                      />
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        icon={<IconExternalLink size={14} />}
                        onClick={logout}
                        component="a"
                        href="/"
                      >
                        Logout
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                ) || <div style={{ width: 214 }}></div>
              ) : (
                <SignInButton />
              )}
            </Group>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}

export default dashboard;
