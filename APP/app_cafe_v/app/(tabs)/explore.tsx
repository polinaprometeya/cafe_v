import { Image } from 'expo-image';
import { Platform, StyleSheet, View, useWindowDimensions  } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import Reservtion from "../features/reservation";

export default function TabTwoScreen() {
  const layout = useWindowDimensions();
  return (
    <>
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={[styles.title, { fontFamily: Fonts.rounded }]}>
            Reservations
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedText style={styles.subtitle}>Create your reservation</ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText style={styles.paragraph}>
          This app has two screens:{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          The layout file in{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText> sets up the tab
          navigator.
        </ThemedText>
        <ThemedView style={styles.linkRow}>
          <ExternalLink href="https://docs.expo.dev/router/introduction">
            <ThemedText type="link">Learn more</ThemedText>
          </ExternalLink>
        </ThemedView>
      </Collapsible>
      <Reservtion></Reservtion>

    </ThemedView>

    </>


  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 720,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
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
  paragraph: {
    marginBottom: 10,
    lineHeight: 20,
  },
  linkRow: {
    marginTop: 8,
  },
});
