import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';

export default function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  rightAction,
}) {
  const [hidden, setHidden] = useState(!!secureTextEntry);

  return (
    <View style={styles.wrap}>
      {icon ? <Ionicons name={icon} size={18} color={colors.textMuted} style={styles.icon} /> : null}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={hidden}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {secureTextEntry ? (
        <Pressable
          onPress={() => setHidden(!hidden)}
          hitSlop={10}
          style={({ pressed }) => pressed && styles.pressedIcon}
        >
          <Ionicons
            name={hidden ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color={colors.textMuted}
          />
        </Pressable>
      ) : (
        rightAction || null
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 52,
    backgroundColor: colors.white,
    marginBottom: spacing.md,
  },
  icon: { marginRight: spacing.sm },
  input: { flex: 1, fontSize: 15, color: colors.textPrimary },
  pressedIcon: { opacity: 0.5 },
});
