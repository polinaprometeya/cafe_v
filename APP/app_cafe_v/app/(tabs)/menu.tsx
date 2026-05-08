import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import Reservtion from '../features/reservation';

export default function ReservationTabScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={[styles.title, { fontFamily: Fonts.rounded }]}>
          Reservations
        </ThemedText>
      </ThemedView>
      <ThemedText style={styles.subtitle}>Create your reservation</ThemedText>
      <Reservtion />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 720,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
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
