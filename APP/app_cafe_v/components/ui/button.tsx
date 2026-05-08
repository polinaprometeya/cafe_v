import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'default' | 'sm' | 'lg';

export type ButtonProps = PropsWithChildren<
  PressableProps & {
    title?: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
  }
>;

export function Button({
  children,
  title,
  disabled,
  variant = 'default',
  size = 'default',
  style,
  ...rest
}: ButtonProps) {
  const theme = useColorScheme() ?? 'light';

  const containerStyle: ViewStyle[] = [styles.base, sizeStyles[size], variantStyles[variant][theme]];
  if (disabled) containerStyle.push(styles.disabled);

  const textColor =
    disabled
      ? theme === 'light'
        ? Colors.light.icon
        : Colors.dark.icon
      : variant === 'default'
        ? theme === 'light'
          ? Colors.light.background
          : Colors.dark.background
        : theme === 'light'
          ? Colors.light.text
          : Colors.dark.text;

  const styleSpecification: NonNullable<PressableProps['style']> = (state) => {
    const userStyle = typeof style === 'function' ? style(state) : style;
    return [containerStyle, state.pressed && !disabled ? styles.pressed : undefined, userStyle];
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={styleSpecification}
      {...rest}>
      {children ?? <ThemedText style={{ color: textColor, fontWeight: '600' }}>{title}</ThemedText>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.55,
  },
});

const sizeStyles = StyleSheet.create({
  default: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 36,
    borderRadius: 8,
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    minHeight: 52,
    borderRadius: 12,
  },
}) as Record<ButtonSize, ViewStyle>;

const variantStyles = {
  default: StyleSheet.create({
    light: { backgroundColor: Colors.light.tint },
    dark: { backgroundColor: Colors.dark.tint },
  }),
  secondary: StyleSheet.create({
    light: { backgroundColor: '#e5e7eb' },
    dark: { backgroundColor: '#374151' },
  }),
  outline: StyleSheet.create({
    light: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#d1d5db' },
    dark: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#4b5563' },
  }),
  ghost: StyleSheet.create({
    light: { backgroundColor: 'transparent' },
    dark: { backgroundColor: 'transparent' },
  }),
} as const satisfies Record<ButtonVariant, Record<'light' | 'dark', ViewStyle>>;
