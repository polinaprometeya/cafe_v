import { StyleSheet } from 'react-native';

import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthSession } from '@/src/auth/AuthProvider';

export default function LogoutScreen() {
  const { signOut } = useAuthSession();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Logout</ThemedText>
      <ThemedText style={{ opacity: 0.8 }}>You are currently signed in.</ThemedText>
      <Button title="Logout" onPress={signOut} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
});

