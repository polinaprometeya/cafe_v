import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthSession } from '@/src/auth/AuthProvider';
import { createReservation, getManualTableSelection, type SelectableTable } from '../../src/api/routes';

const RESERVATION_LENGTH_HOURS = 2; //2 hours window, maybe chnage it to something else
const DEFAULT_GUESTS = 2;
const MAX_GUESTS = 8; //I feel like there should me max guests

//a formatter-- so pad is what you add to current string-- The string to pad the current string with
function padNumber(value: number) {
  return String(value).padStart(2, '0');
}

function formatApiDateTime(date: Date) {
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())} ${padNumber(
    date.getHours()
  )}:${padNumber(date.getMinutes())}:${padNumber(date.getSeconds())}`;
}

function formatApiDate(date: Date) {
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
}

function createTimeWindow() {
  const start = new Date();
  const end = new Date(start.getTime() + RESERVATION_LENGTH_HOURS * 60 * 60 * 1000);

  return { start, end };
}

async function fetchTablesForTimeWindow(token: string, start: Date, end: Date) {
  const response = await getManualTableSelection(
    {
      start_time: formatApiDateTime(start),
      end_time: formatApiDateTime(end),
      guests_amount: DEFAULT_GUESTS,
    },
    token
  );

  return response.tables ?? [];
}

function keepOnlyStillAvailableSelections(tables: SelectableTable[], selectedIds: number[]) {
  const availableIds = tables
    .filter((table) => table.is_available)
    .map((table) => Number(table.id));

  return selectedIds.filter((id) => availableIds.includes(id));
}

function calculateGuestCount(selectedTables: SelectableTable[]) {
  const totalSeats = selectedTables.reduce((total, table) => total + table.seats, 0);

  if (totalSeats < 1) return 1;
  return Math.min(totalSeats, MAX_GUESTS);
}

export default function ReservationScreen() {
  const { token, isLoading } = useAuthSession();

  const [tables, setTables] = useState<SelectableTable[]>([]);
  const [selectedTableIds, setSelectedTableIds] = useState<number[]>([]);
  const [tableLoadError, setTableLoadError] = useState<string | null>(null);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [reservationMessage, setReservationMessage] = useState<string | null>(null);
  const [isFetchingTables, setIsFetchingTables] = useState(false);
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);
  const [timeWindow] = useState(createTimeWindow);

  const availableTables = tables.filter((table) => table.is_available);
  const unavailableTables = tables.filter((table) => !table.is_available);
  const selectedTables = availableTables.filter((table) => selectedTableIds.includes(Number(table.id)));
  const guestCount = calculateGuestCount(selectedTables);

  useEffect(() => {
    let active = true;

    async function loadTables() {
      if (isLoading) return;

      if (!token?.current) {
        if (!active) return;
        setTables([]);
        setSelectedTableIds([]);
        setTableLoadError('Sign in to view table availability.');
        return;
      }

      try {
        setIsFetchingTables(true);
        setTableLoadError(null);

        const nextTables = await fetchTablesForTimeWindow(token.current, timeWindow.start, timeWindow.end);

        if (!active) return;

        setTables(nextTables);

        // If a table becomes unavailable after refetching, remove it from the selected list.
        setSelectedTableIds((current) => keepOnlyStillAvailableSelections(nextTables, current));
      } catch (error) {
        if (!active) return;
        setTableLoadError(error instanceof Error ? error.message : String(error));
      } finally {
        if (active) {
          setIsFetchingTables(false);
        }
      }
    }

    loadTables();

    return () => {
      active = false;
    };
  }, [isLoading, timeWindow, token]);

  function handleTablePress(table: SelectableTable) {
    if (!table.is_available) return;

    const tableId = Number(table.id);

    setReservationError(null);
    setReservationMessage(null);

    setSelectedTableIds((current) => {
      if (current.includes(tableId)) {
        return current.filter((id) => id !== tableId);
      }

      return [...current, tableId];
    });
  }

  async function handleReservePress() {
    if (selectedTableIds.length === 0) {
      setReservationError('Select at least one available table.');
      return;
    }

    try {
      setIsSubmittingReservation(true);
      setReservationError(null);
      setReservationMessage(null);

      await createReservation({
        guests_amount: guestCount,
        date: formatApiDate(timeWindow.start),
        start_time: formatApiDateTime(timeWindow.start),
        end_time: formatApiDateTime(timeWindow.end),
        reservation_name: 'Walk-in reservation',
        reservation_number: 'N/A',
        table_ids: selectedTableIds,
      });

      setSelectedTableIds([]);
      setReservationMessage(`Reserved ${selectedTableIds.length} table(s) for the current time slot.`);

      if (token?.current) {
        const nextTables = await fetchTablesForTimeWindow(token.current, timeWindow.start, timeWindow.end);
        setTables(nextTables);
      }
    } catch (error) {
      setReservationError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSubmittingReservation(false);
    }
  }

  function renderTableSection(
    title: string,
    sectionTables: SelectableTable[],
    backgroundColor: string,
    emptyMessage: string
  ) {
    return (
      <ThemedView key={title} style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {title}
        </ThemedText>

        {sectionTables.length === 0 ? (
          <ThemedText style={styles.emptyText}>{emptyMessage}</ThemedText>
        ) : (
          sectionTables.map((table) => {
            const isSelected = selectedTableIds.includes(Number(table.id));

            return (
              <TouchableOpacity
                key={String(table.id)}
                activeOpacity={table.is_available ? 0.8 : 1}
                disabled={!table.is_available}
                onPress={() => handleTablePress(table)}
                style={[
                  styles.tableCard,
                  { backgroundColor },
                  isSelected ? styles.selectedTableCard : null,
                  !table.is_available ? styles.disabledTableCard : null,
                ]}>
                <ThemedText type="defaultSemiBold" lightColor="#ffffff" darkColor="#ffffff">
                  Table {table.number}
                </ThemedText>
                <ThemedText lightColor="#ffffff" darkColor="#ffffff">Seats: {table.seats}</ThemedText>
                <ThemedText lightColor="#ffffff" darkColor="#ffffff">
                  {table.is_available ? 'Tap to select' : 'Unavailable'}
                </ThemedText>
                {isSelected ? (
                  <ThemedText type="defaultSemiBold" lightColor="#ffffff" darkColor="#ffffff">
                    Selected
                  </ThemedText>
                ) : null}
              </TouchableOpacity>
            );
          })
        )}
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Table Availability
      </ThemedText>
      <ThemedText style={styles.subtitle}>Date {timeWindow.start.toDateString()}</ThemedText>
      <ThemedText style={styles.subtitle}>Time {timeWindow.start.toLocaleTimeString()}</ThemedText>
      <ThemedText style={styles.caption}>
        Showing availability for the next {RESERVATION_LENGTH_HOURS} hours.
      </ThemedText>

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
              Using current date/time with guest count {guestCount}.
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
          onPress={handleReservePress}
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
  selectedSection: {
    marginBottom: 20,
  },
  section: {
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

