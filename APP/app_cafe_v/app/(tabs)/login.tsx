import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function Login() {
  return (
    <ThemedView style={{ flex: 1, padding: 24 }}>
      <ThemedText type="title">Login</ThemedText>
    </ThemedView>
  );
}
