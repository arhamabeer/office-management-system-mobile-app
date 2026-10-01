import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';

export default function PlaceholderScreen({ title, hint }: { title: string; hint: string }) {
  const t = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: t.colors.bg }]}>
      <Text style={[styles.title, { color: t.colors.text }]}>{title}</Text>
      <Text style={[styles.hint, { color: t.colors.textMuted }]}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: '700' },
  hint: { fontSize: 14, marginTop: 8 },
});
