import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import type { SalaryStructureDTO, PayslipDTO } from '@ems/types';
import { payrollApi, fmtMoney } from '../lib/authApi';
import { useTheme } from '../theme/theme';

export default function PayslipsScreen() {
  const t = useTheme();
  const [salary, setSalary] = useState<SalaryStructureDTO | null>(null);
  const [slips, setSlips] = useState<PayslipDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [s, p] = await Promise.all([payrollApi.salary(), payrollApi.payslips()]);
      setSalary(s);
      setSlips(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: t.colors.bg }]}>
        <ActivityIndicator color={t.colors.primary} />
      </View>
    );
  }

  const cur = salary?.currency ?? 'PKR';

  return (
    <ScrollView style={{ backgroundColor: t.colors.bg }} contentContainerStyle={styles.content}>
      {error ? <Text style={{ color: t.colors.danger }}>{error}</Text> : null}

      {salary ? (
        <View style={styles.tiles}>
          <View style={[styles.tile, { backgroundColor: t.colors.surface, borderColor: t.colors.border }]}>
            <Text style={[styles.label, { color: t.colors.textMuted }]}>Salary / mo</Text>
            <Text style={[styles.value, { color: t.colors.text }]}>{fmtMoney(salary.monthlySalary, cur)}</Text>
          </View>
          <View style={[styles.tile, { backgroundColor: t.colors.surface, borderColor: t.colors.border }]}>
            <Text style={[styles.label, { color: t.colors.textMuted }]}>Net / mo</Text>
            <Text style={[styles.value, { color: t.colors.primary }]}>{fmtMoney(salary.monthlyNet, cur)}</Text>
          </View>
        </View>
      ) : (
        <Text style={{ color: t.colors.textMuted }}>No salary structure set.</Text>
      )}

      <Text style={[styles.heading, { color: t.colors.text }]}>Payslips</Text>
      {slips.map((p) => (
        <View key={p.id} style={[styles.row, { backgroundColor: t.colors.surface, borderColor: t.colors.border }]}>
          <View>
            <Text style={{ color: t.colors.text, fontWeight: '600' }}>{p.month}</Text>
            <Text style={{ color: t.colors.textMuted, fontSize: 12 }}>{p.status}</Text>
          </View>
          <Text style={{ color: t.colors.text, fontWeight: '700' }}>{fmtMoney(p.netPay, p.currency)}</Text>
        </View>
      ))}
      {!slips.length ? <Text style={{ color: t.colors.textMuted }}>No payslips yet.</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 12 },
  tiles: { flexDirection: 'row', gap: 8 },
  tile: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 16 },
  label: { fontSize: 12 },
  value: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  heading: { fontSize: 16, fontWeight: '600', marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderRadius: 10, padding: 14 },
});
