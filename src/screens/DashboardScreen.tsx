import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { BRAND } from '@ems/config';
import { useTheme } from '../theme/theme';

const CARDS = [
  { label: "Today's Attendance", value: '—', hint: 'Check-in lands in M2' },
  { label: 'Leave Balance', value: '—', hint: 'Quota & balance land in M3' },
  { label: 'Latest Payslip', value: '—', hint: 'Payroll lands in M4' },
  { label: 'Pending Approvals', value: '3', hint: 'Approvals inbox (demo)' },
];

export default function DashboardScreen() {
  const t = useTheme();
  return (
    <ScrollView
      style={{ backgroundColor: t.colors.bg }}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.h1, { color: t.colors.text }]}>Welcome to {BRAND.productName}</Text>
      <Text style={[styles.sub, { color: t.colors.textMuted }]}>
        Your employee self-service portal
      </Text>

      {CARDS.map((c) => (
        <View
          key={c.label}
          style={[styles.card, { backgroundColor: t.colors.surface, borderColor: t.colors.border }]}
        >
          <Text style={[styles.cardLabel, { color: t.colors.textMuted }]}>{c.label}</Text>
          <Text style={[styles.cardValue, { color: t.colors.text }]}>{c.value}</Text>
          <Text style={[styles.cardHint, { color: t.colors.textMuted }]}>{c.hint}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  h1: { fontSize: 24, fontWeight: '700' },
  sub: { fontSize: 14, marginBottom: 8 },
  card: { borderWidth: 1, borderRadius: 12, padding: 16, gap: 4 },
  cardLabel: { fontSize: 14 },
  cardValue: { fontSize: 28, fontWeight: '700' },
  cardHint: { fontSize: 12 },
});
