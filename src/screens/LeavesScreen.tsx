import { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import type { LeaveBalanceDTO, LeaveTypeDTO, LeaveRequestDTO } from '@ems/types';
import { leavesApi } from '../lib/authApi';
import { useTheme } from '../theme/theme';

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function LeavesScreen() {
  const t = useTheme();
  const [types, setTypes] = useState<LeaveTypeDTO[]>([]);
  const [balances, setBalances] = useState<LeaveBalanceDTO[]>([]);
  const [reqs, setReqs] = useState<LeaveRequestDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [typeId, setTypeId] = useState('');
  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState(today());
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [ty, b, r] = await Promise.all([
        leavesApi.types(),
        leavesApi.balance(),
        leavesApi.requests(),
      ]);
      setTypes(ty);
      setBalances(b);
      setReqs(r);
      setTypeId((prev) => prev || ty[0]?.id || '');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const apply = async () => {
    setBusy(true);
    setError(null);
    try {
      await leavesApi.apply({ typeId, startDate, endDate, reason });
      setReason('');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Apply failed');
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

  return (
    <ScrollView style={{ backgroundColor: t.colors.bg }} contentContainerStyle={styles.content}>
      {error ? <Text style={{ color: t.colors.danger }}>{error}</Text> : null}

      <View style={styles.balances}>
        {balances.map((b) => (
          <View key={b.typeId} style={[styles.balCard, { backgroundColor: t.colors.surface, borderColor: t.colors.border }]}>
            <Text style={[styles.balName, { color: t.colors.text }]}>{b.typeName}</Text>
            <Text style={[styles.balValue, { color: t.colors.text }]}>{b.remaining}</Text>
            <Text style={{ color: t.colors.textMuted, fontSize: 12 }}>of {b.entitled}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: t.colors.surface, borderColor: t.colors.border }]}>
        <Text style={[styles.cardTitle, { color: t.colors.text }]}>Apply for leave</Text>
        <View style={styles.chips}>
          {types.map((ty) => (
            <TouchableOpacity
              key={ty.id}
              onPress={() => setTypeId(ty.id)}
              style={[
                styles.chip,
                { borderColor: t.colors.border },
                typeId === ty.id && { backgroundColor: t.colors.primary, borderColor: t.colors.primary },
              ]}
            >
              <Text style={{ color: typeId === ty.id ? t.colors.onPrimary : t.colors.text, fontSize: 12 }}>{ty.code}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput style={[styles.input, { color: t.colors.text, borderColor: t.colors.border }]} value={startDate} onChangeText={setStartDate} placeholder="Start YYYY-MM-DD" placeholderTextColor={t.colors.textMuted} />
        <TextInput style={[styles.input, { color: t.colors.text, borderColor: t.colors.border }]} value={endDate} onChangeText={setEndDate} placeholder="End YYYY-MM-DD" placeholderTextColor={t.colors.textMuted} />
        <TextInput style={[styles.input, { color: t.colors.text, borderColor: t.colors.border }]} value={reason} onChangeText={setReason} placeholder="Reason" placeholderTextColor={t.colors.textMuted} />
        <TouchableOpacity style={[styles.btn, { backgroundColor: t.colors.primary, opacity: busy ? 0.5 : 1 }]} onPress={apply} disabled={busy}>
          <Text style={{ color: t.colors.onPrimary, fontWeight: '600' }}>Submit request</Text>
        </TouchableOpacity>
      </View>

      {reqs.map((r) => (
        <View key={r.id} style={[styles.reqRow, { borderBottomColor: t.colors.border }]}>
          <Text style={{ color: t.colors.text }}>{r.typeName} · {r.startDate}{r.endDate !== r.startDate ? `→${r.endDate}` : ''}</Text>
          <Text style={{ color: t.colors.textMuted }}>{r.status}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 12 },
  balances: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  balCard: { flexGrow: 1, minWidth: '30%', borderWidth: 1, borderRadius: 8, padding: 12 },
  balName: { fontSize: 12, fontWeight: '600' },
  balValue: { fontSize: 22, fontWeight: '700', marginTop: 4 },
  card: { borderWidth: 1, borderRadius: 12, padding: 16, gap: 10 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  btn: { borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  reqRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
});
