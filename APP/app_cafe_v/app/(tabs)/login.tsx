import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { login } from '@/src/api/routes';
import { useAuthSession } from '@/src/auth/AuthProvider';

export default function LoginScreen() {
  const { signIn } = useAuthSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await login({ email, password });
      const token = (res.token ?? res.access_token ?? '') as string;
      if (!token) throw new Error('Login response did not include a token.');
      await signIn(token);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Login</ThemedText>

      <View style={styles.field}>
        <ThemedText>Email</ThemedText>
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <ThemedText>Password</ThemedText>
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="***"
          style={styles.input}
        />
      </View>

      {error ? <ThemedText style={{ color: '#b91c1c' }}>{error}</ThemedText> : null}

      <Button title={isSubmitting ? 'Logging in...' : 'Login'} disabled={isSubmitting} onPress={onSubmit} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  field: { gap: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
});

