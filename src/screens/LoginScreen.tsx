import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/theme';

export default function LoginScreen() {
  const t = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('owner@braincrop.io');
  const [password, setPassword] = useState('Passw0rd!');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setBusy(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.wrap, { backgroundColor: t.colors.bg }]}>
      <View style={[styles.card, { backgroundColor: t.colors.surface, borderColor: t.colors.border }]}>
        <Text style={[styles.brand, { color: t.colors.text }]}>
          Brain<Text style={{ color: t.colors.primary }}>Crop</Text>
        </Text>
        <Text style={[styles.sub, { color: t.colors.textMuted }]}>Employee Management System</Text>

        <TextInput
          style={[styles.input, { color: t.colors.text, borderColor: t.colors.border, backgroundColor: t.colors.bg }]}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor={t.colors.textMuted}
        />
        <TextInput
          style={[styles.input, { color: t.colors.text, borderColor: t.colors.border, backgroundColor: t.colors.bg }]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor={t.colors.textMuted}
        />

        {error ? <Text style={{ color: t.colors.danger }}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: t.colors.primary }]}
          onPress={onSubmit}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color={t.colors.onPrimary} />
          ) : (
            <Text style={{ color: t.colors.onPrimary, fontWeight: '600', fontSize: 16 }}>Sign in</Text>
          )}
        </TouchableOpacity>
        <Text style={[styles.hint, { color: t.colors.textMuted }]}>
          Demo: owner@braincrop.io · Passw0rd!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 400, borderWidth: 1, borderRadius: 12, padding: 24, gap: 12 },
  brand: { fontSize: 26, fontWeight: '800', textAlign: 'center' },
  sub: { fontSize: 14, textAlign: 'center', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  btn: { borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  hint: { fontSize: 12, textAlign: 'center', marginTop: 4 },
});
