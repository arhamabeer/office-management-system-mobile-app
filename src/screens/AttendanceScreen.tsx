import { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import type { MyAttendanceResponse } from '@ems/types';
import { attendanceApi, fmtMinutes } from '../lib/authApi';
import { useTheme } from '../theme/theme';

function fmtTime(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function AttendanceScreen() {
  const t = useTheme();
  const [data, setData] = useState<MyAttendanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await attendanceApi.me());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const punch = async (action: 'in' | 'out') => {
    setBusy(true);
    setError(null);
    try {
      if (action === 'in') await attendanceApi.checkIn();
      else await attendanceApi.checkOut();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: t.colors.bg }]}>
        <ActivityIndicator color={t.colors.primary} />
      </View>
    );
  }

  const today = data?.today;
  const s = data?.summary;

  return (
    <ScrollView style={{ backgroundColor: t.colors.bg }} contentContainerStyle={styles.content}>
      {error ? <Text style={{ color: t.colors.danger }}>{error}</Text> : null}

      <View style={[styles.card, { backgroundColor: t.colors.surface, borderColor: t.colors.border }]}>
        <Text style={[styles.label, { color: t.colors.textMuted }]}>Today</Text>
        <View style={styles.row}>
          <Text style={{ color: t.colors.text }}>In: {fmtTime(today?.checkInAt)}</Text>
          <Text style={{ color: t.colors.text }}>Out: {fmtTime(today?.checkOutAt)}</Text>
          <Text style={{ color: t.colors.text }}>{fmtMinutes(today?.workedMinutes ?? 0)}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: t.colors.primary, opacity: busy || today?.checkInAt ? 0.5 : 1 }]}
            disabled={busy || !!today?.checkInAt}
            onPress={() => punch('in')}
          >
            <Text style={{ color: t.colors.onPrimary, fontWeight: '600' }}>Check in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnOutline, { borderColor: t.colors.border, opacity: busy || !today?.checkInAt || today?.checkOutAt ? 0.5 : 1 }]}
            disabled={busy || !today?.checkInAt || !!today?.checkOutAt}
            onPress={() => punch('out')}
          >
            <Text style={{ color: t.colors.text, fontWeight: '600' }}>Check out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {s ? (
        <View style={styles.tiles}>
          {[
            ['Present', String(s.present)],
            ['Half-days', String(s.halfDay)],
            ['Absent', String(s.absent)],
            ['Avg/day', fmtMinutes(s.avgWorkedMinutes)],
          ].map(([label, value]) => (
            <View key={label} style={[styles.tile, { backgroundColor: t.colors.surface, borderColor: t.colors.border }]}>
              <Text style={[styles.tileLabel, { color: t.colors.textMuted }]}>{label}</Text>
              <Text style={[styles.tileValue, { color: t.colors.text }]}>{value}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {(data?.records ?? []).map((r) => (
        <View key={r.id} style={[styles.recordRow, { borderBottomColor: t.colors.border }]}>
          <Text style={{ color: t.colors.text }}>{r.date}</Text>
          <Text style={{ color: t.colors.textMuted }}>{r.status}</Text>
          <Text style={{ color: t.colors.textMuted }}>{fmtMinutes(r.workedMinutes)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 12 },
  card: { borderWidth: 1, borderRadius: 12, padding: 16, gap: 12 },
  label: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  actions: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  btnOutline: { flex: 1, borderRadius: 8, paddingVertical: 12, alignItems: 'center', borderWidth: 1 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: { flexGrow: 1, minWidth: '45%', borderWidth: 1, borderRadius: 8, padding: 12 },
  tileLabel: { fontSize: 12 },
  tileValue: { fontSize: 20, fontWeight: '700', marginTop: 2 },
  recordRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
});
