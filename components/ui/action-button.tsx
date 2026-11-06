import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/theme";

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "positive" | "danger" | "outline";
  disabled?: boolean;
}

export function ActionButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: ActionButtonProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        variant === "primary" && styles.primary,
        variant === "positive" && styles.positive,
        variant === "danger" && styles.danger,
        variant === "outline" && styles.outline,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, variant === "outline" && styles.outlineLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 10,
    minHeight: 46,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  primary: { backgroundColor: Colors.primary },
  positive: { backgroundColor: Colors.positive },
  danger: { backgroundColor: Colors.danger },
  outline: {
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  disabled: { opacity: 0.55 },
  label: { color: Colors.surface, fontSize: 15, fontWeight: "700" },
  outlineLabel: { color: Colors.primary },
});
