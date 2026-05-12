import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthSession } from '@/src/auth/AuthProvider';
import {
  createReservation,
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

function formatApiDate(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export default function ReservationScreen() {
  const { token, isLoading } = useAuthSession();
  const [tables, setTables] = useState<ManualTableSelectionResponse['tables']>([]);
  const [selectedTableIds, setSelectedTableIds] = useState<number[]>([]);
  const [tableLoadError, setTableLoadError] = useState<string | null>(null);
  const [isFetchingTables, setIsFetchingTables] = useState(false);
  const [reservationMessage, setReservationMessage] = useState<string | null>(null);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);

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

  useEffect(() => {
    const availableTableIds = new Set(
      tables.filter((table) => table.is_available).map((table) => Number(table.id))
    );

    setSelectedTableIds((current) => current.filter((id) => availableTableIds.has(id)));
  }, [tables]);

  const availableTables = useMemo(() => tables.filter((table) => table.is_available), [tables]);
  const unavailableTables = useMemo(() => tables.filter((table) => !table.is_available), [tables]);
  const selectedTables = useMemo(
    () => availableTables.filter((table) => selectedTableIds.includes(Number(table.id))),
    [availableTables, selectedTableIds]
  );
  const derivedGuestsAmount = useMemo(() => {
    const totalSeats = selectedTables.reduce((sum, table) => sum + table.seats, 0);

    return Math.min(Math.max(totalSeats || 1, 1), 8);
  }, [selectedTables]);

  const toggleTableSelection = (table: SelectableTable) => {
    if (!table.is_available) return;

    const tableId = Number(table.id);
    setReservationError(null);
    setReservationMessage(null);
    setSelectedTableIds((current) =>
      current.includes(tableId) ? current.filter((id) => id !== tableId) : [...current, tableId]
    );
  };

  const reserveSelectedTables = async () => {
    if (selectedTableIds.length === 0) {
      setReservationError('Select at least one available table.');
      return;
    }

    try {
      setIsSubmittingReservation(true);
      setReservationError(null);
      setReservationMessage(null);

      await createReservation({
        guests_amount: derivedGuestsAmount,
        date: formatApiDate(requestWindow.start),
        start_time: formatApiDateTime(requestWindow.start),
        end_time: formatApiDateTime(requestWindow.end),
        reservation_name: 'Walk-in reservation',
        reservation_number: 'N/A',
        table_ids: selectedTableIds,
      });

      setReservationMessage(`Reserved ${selectedTableIds.length} table(s) for the current time slot.`);
      setSelectedTableIds([]);

      if (token?.current) {
        const refreshed = await getManualTableSelection(
          {
            start_time: formatApiDateTime(requestWindow.start),
            end_time: formatApiDateTime(requestWindow.end),
            guests_amount: 2,
          },
          token.current
        );

        setTables(refreshed.tables ?? []);
      }
    } catch (err) {
      setReservationError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmittingReservation(false);
    }
  };

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
          <TouchableOpacity
            key={String(table.id)}
            activeOpacity={table.is_available ? 0.8 : 1}
            disabled={!table.is_available}
            onPress={() => toggleTableSelection(table)}
            style={[
              styles.tableCard,
              { backgroundColor: cardColor },
              selectedTableIds.includes(Number(table.id)) ? styles.selectedTableCard : null,
              !table.is_available ? styles.disabledTableCard : null,
            ]}>
            <ThemedText type="defaultSemiBold" lightColor="#ffffff" darkColor="#ffffff">
              Table {table.number}
            </ThemedText>
            <ThemedText lightColor="#ffffff" darkColor="#ffffff">Seats: {table.seats}</ThemedText>
            <ThemedText lightColor="#ffffff" darkColor="#ffffff">
              Status: {table.is_available ? 'Tap to select' : 'Unavailable'}
            </ThemedText>
            {selectedTableIds.includes(Number(table.id)) ? (
              <ThemedText type="defaultSemiBold" lightColor="#ffffff" darkColor="#ffffff">
                Selected
              </ThemedText>
            ) : null}
          </TouchableOpacity>
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

        {selectedTables.length > 0 ? (
          <ThemedView style={styles.selectedSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Selected Tables
            </ThemedText>
            <ThemedText style={styles.selectionSummary}>
              {selectedTables.map((table) => `Table ${table.number}`).join(', ')}
            </ThemedText>
            <ThemedText style={styles.selectionSummary}>
              Using current date/time with guest count {derivedGuestsAmount}.
            </ThemedText>
          </ThemedView>
        ) : null}

        {tableLoadError ? (
          <ThemedText lightColor="#b91c1c" darkColor="#fca5a5" style={styles.errorText}>
            {tableLoadError}
          </ThemedText>
        ) : null}

        {reservationError ? (
          <ThemedText lightColor="#b91c1c" darkColor="#fca5a5" style={styles.errorText}>
            {reservationError}
          </ThemedText>
        ) : null}

        {reservationMessage ? (
          <ThemedText lightColor="#166534" darkColor="#86efac" style={styles.successText}>
            {reservationMessage}
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

        <Button
          title={isSubmittingReservation ? 'Reserving...' : 'Reserve Selected Tables'}
          disabled={selectedTableIds.length === 0 || isSubmittingReservation || !!tableLoadError}
          onPress={reserveSelectedTables}
          style={styles.reserveButton}
        />
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
  successText: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  selectedSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  selectionSummary: {
    marginBottom: 8,
  },
  emptyText: {
    opacity: 0.7,
  },
  tableCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  selectedTableCard: {
    borderWidth: 3,
    borderColor: '#1d4ed8',
  },
  disabledTableCard: {
    opacity: 0.75,
  },
  reserveButton: {
    marginTop: 8,
  },
});

