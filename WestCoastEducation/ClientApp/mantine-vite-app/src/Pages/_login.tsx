import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
  } from '@mantine/core';
  import { useState } from 'react';
  import  useAuth from '../Providers/auth.provider';
  import { history } from 'react-router-guard';
  
  export function AuthenticationTitle() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { login  } : any = useAuth();

    const handleLogin = () => {
        login({ username, password }).then(() => {
        history.push('/')
        });
    };

    return (
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
        >
          Welcome back!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Do not have an account yet?{' '}
          <Anchor<'a'> href="#" size="sm" onClick={(event) => event.preventDefault()}>
            Create account
          </Anchor>
        </Text>
  
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Username" value={username}   onChange={(event) => setUsername(event.target.value)} placeholder="User123" required />
          <PasswordInput label="Password" value={password}  onChange={(event) => setPassword(event.target.value)} placeholder="Your password" required mt="md" />
          <Group position="apart" mt="lg">
            <Checkbox label="Remember me" sx={{ lineHeight: 1 }} />
            <Anchor<'a'> onClick={(event) => event.preventDefault()} href="#" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" onClick={handleLogin}>
            Sign in
          </Button>
        </Paper>
      </Container>
    );
  }