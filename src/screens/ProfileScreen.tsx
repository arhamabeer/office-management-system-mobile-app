import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/theme';

export default function ProfileScreen() {
  const t = useTheme();
  const { profile, user, logout } = useAuth();

  if (!profile || !user) {
    return (
      <View style={[styles.center, { backgroundColor: t.colors.bg }]}>
        <Text style={{ color: t.colors.textMuted }}>Loading…</Text>
      </View>
    );
  }

  const fields: [string, string][] = [
    ['Email', profile.email],
    ['Designation', profile.designation ?? '—'],
    ['Department', profile.departmentName ?? '—'],
    ['Employment type', profile.employmentType],
    ['Role', `${user.accountType} · ${user.orgRole}`],
    ['Status', profile.status],
  ];

  return (
    <ScrollView style={{ backgroundColor: t.colors.bg }} contentContainerStyle={styles.content}>
      <Text style={[styles.name, { color: t.colors.text }]}>{profile.fullName}</Text>
      <Text style={[styles.role, { color: t.colors.textMuted }]}>{profile.designation ?? 'Employee'}</Text>

      <View style={[styles.card, { backgroundColor: t.colors.surface, borderColor: t.colors.border }]}>
        {fields.map(([label, value]) => (
          <View key={label} style={[styles.row, { borderBottomColor: t.colors.border }]}>
            <Text style={[styles.label, { color: t.colors.textMuted }]}>{label}</Text>
            <Text style={[styles.value, { color: t.colors.text }]}>{value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={[styles.logout, { borderColor: t.colors.border }]} onPress={logout}>
        <Text style={{ color: t.colors.danger, fontWeight: '600' }}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 8 },
  name: { fontSize: 22, fontWeight: '700' },
  role: { fontSize: 14, marginBottom: 8 },
  card: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1 },
  label: { fontSize: 13 },
  value: { fontSize: 14, fontWeight: '600', flexShrink: 1, textAlign: 'right', marginLeft: 12 },
  logout: { marginTop: 16, borderWidth: 1, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
});
