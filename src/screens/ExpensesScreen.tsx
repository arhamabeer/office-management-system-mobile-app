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
import type { ExpenseCategoryDTO, ExpenseClaimDTO } from '@ems/types';
import { expensesApi, fmtMoney } from '../lib/authApi';
import { useTheme } from '../theme/theme';

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function ExpensesScreen() {
  const t = useTheme();
  const [categories, setCategories] = useState<ExpenseCategoryDTO[]>([]);
  const [claims, setClaims] = useState<ExpenseClaimDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [incurredOn, setIncurredOn] = useState(today());
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [cats, cl] = await Promise.all([expensesApi.categories(), expensesApi.claims()]);
      setCategories(cats);
      setClaims(cl);
      setCategoryId((prev) => prev || cats[0]?.id || '');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await expensesApi.create({
        categoryId,
        amount: Number(amount),
        incurredOn,
        description,
        submit: true,
      });
      setAmount('');
      setDescription('');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submit failed');
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

      <View style={[styles.card, { backgroundColor: t.colors.surface, borderColor: t.colors.border }]}>
        <Text style={[styles.cardTitle, { color: t.colors.text }]}>File an expense claim</Text>
        <View style={styles.chips}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setCategoryId(c.id)}
              style={[
                styles.chip,
                { borderColor: t.colors.border },
                categoryId === c.id && { backgroundColor: t.colors.primary, borderColor: t.colors.primary },
              ]}
            >
              <Text style={{ color: categoryId === c.id ? t.colors.onPrimary : t.colors.text, fontSize: 12 }}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput style={[styles.input, { color: t.colors.text, borderColor: t.colors.border }]} value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="Amount (PKR)" placeholderTextColor={t.colors.textMuted} />
        <TextInput style={[styles.input, { color: t.colors.text, borderColor: t.colors.border }]} value={incurredOn} onChangeText={setIncurredOn} placeholder="Date YYYY-MM-DD" placeholderTextColor={t.colors.textMuted} />
        <TextInput style={[styles.input, { color: t.colors.text, borderColor: t.colors.border }]} value={description} onChangeText={setDescription} placeholder="Description" placeholderTextColor={t.colors.textMuted} />
        <TouchableOpacity style={[styles.btn, { backgroundColor: t.colors.primary, opacity: busy ? 0.5 : 1 }]} onPress={submit} disabled={busy}>
          <Text style={{ color: t.colors.onPrimary, fontWeight: '600' }}>Submit claim</Text>
        </TouchableOpacity>
      </View>

      {claims.map((c) => (
        <View key={c.id} style={[styles.reqRow, { borderBottomColor: t.colors.border }]}>
          <Text style={{ color: t.colors.text }}>{c.categoryName} · {fmtMoney(c.amount, c.currency)}</Text>
          <Text style={{ color: t.colors.textMuted }}>{c.status}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 12 },
  card: { borderWidth: 1, borderRadius: 12, padding: 16, gap: 10 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  btn: { borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  reqRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
});
