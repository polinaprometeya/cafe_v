import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet ,  Text, ScrollView, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthSession } from '@/src/auth/AuthProvider';
import {
  getManualTableSelection,
  type ManualTableSelectionResponse,
  type SelectableTable,
} from '../../src/api/routes';

function formatApiDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function ReservationScreen() {
  const { token, isLoading } = useAuthSession();
  const [tables, setTables] = useState<ManualTableSelectionResponse['tables']>([]);
  const [tableLoadError, setTableLoadError] = useState<string | null>(null);
  const [isFetchingTables, setIsFetchingTables] = useState(false);

  const requestWindow = useMemo(() => {
    const start = new Date();
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    return { start, end };
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (isLoading) {
      return () => {
        isMounted = false;
      };
    }

    if (!token?.current) {
      setTables([]);
      setTableLoadError('Sign in to view table availability.');
      return () => {
        isMounted = false;
      };
    }

    (async () => {
      try {
        setIsFetchingTables(true);
        setTableLoadError(null);

        const response = await getManualTableSelection(
          {
            start_time: formatApiDateTime(requestWindow.start),
            end_time: formatApiDateTime(requestWindow.end),
            guests_amount: 2,
          },
          token.current
        );

        if (!isMounted) return;
        setTables(response.tables ?? []);
      } catch (err) {
        if (!isMounted) return;
        setTableLoadError(err instanceof Error ? err.message : String(err));
      } finally {
        if (isMounted) {
          setIsFetchingTables(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [isLoading, requestWindow, token]);

  const availableTables = useMemo(() => tables.filter((table) => table.is_available), [tables]);
  const unavailableTables = useMemo(() => tables.filter((table) => !table.is_available), [tables]);

  const renderTableSection = (
    title: string,
    data: SelectableTable[],
    cardColor: string,
    emptyMessage: string
  ) => (
    <ThemedView key={title} style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {title}
      </ThemedText>

      {data.length === 0 ? (
        <ThemedText style={styles.emptyText}>{emptyMessage}</ThemedText>
      ) : (
        data.map((table) => (
          <ThemedView key={String(table.id)} style={[styles.tableCard, { backgroundColor: cardColor }]}>
            <ThemedText type="defaultSemiBold" lightColor="#ffffff" darkColor="#ffffff">
              Table {table.number}
            </ThemedText>
            <ThemedText lightColor="#ffffff" darkColor="#ffffff">
              Seats: {table.seats}
            </ThemedText>
            <ThemedText lightColor="#ffffff" darkColor="#ffffff">
              Status: {table.is_available ? 'Available' : 'Unavailable'}
            </ThemedText>
          </ThemedView>
        ))
      )}
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Table Availability
      </ThemedText>
      <ThemedText style={styles.subtitle}>Date {requestWindow.start.toDateString()}</ThemedText>
      <ThemedText style={styles.subtitle}>Time {requestWindow.start.toLocaleTimeString()}</ThemedText>
      <ThemedText style={styles.caption}>Showing availability for the next 2 hours.</ThemedText>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {isLoading || isFetchingTables ? <ActivityIndicator style={styles.loader} /> : null}

      {tableLoadError ? (
        <ThemedText lightColor="#b91c1c" darkColor="#fca5a5" style={styles.errorText}>
          {tableLoadError}
        </ThemedText>
      ) : null}

      {!tableLoadError ? (
        <>
          {renderTableSection('Available Tables', availableTables, '#16a34a', 'No tables are available.')}
          {renderTableSection(
            'Unavailable Tables',
            unavailableTables,
            '#dc2626',
            'There are no unavailable tables right now.'
          )}
        </>
      ) : null}
      </ScrollView>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    marginBottom: 6,
  },
  caption: {
    marginBottom: 16,
    opacity: 0.7,
  },
  loader: {
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  errorText: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  emptyText: {
    opacity: 0.7,
  },
  tableCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
});

