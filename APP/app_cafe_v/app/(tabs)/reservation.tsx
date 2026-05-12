import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import ReservationScreen from '../features/reservation';

export default function ReservationTabScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={[styles.title, { fontFamily: Fonts.rounded }]}>
          Reservations
        </ThemedText>
      </ThemedView>
      <ThemedText style={styles.subtitle}>Create your reservation</ThemedText>
      <ThemedView style={styles.content}>
        <ReservationScreen />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 720,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    width: '100%',
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  subtitle: {
    marginBottom: 16,
    fontSize: 16,
    opacity: 0.8,
  },
});
