import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/constants/theme";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmLabel,
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmationModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onCancel}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <View accessibilityViewIsModal style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={loading}
              onPress={onCancel}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={loading}
              onPress={() => void onConfirm()}
              style={[styles.button, styles.confirmButton, loading && styles.disabled]}
            >
              {loading ? (
                <ActivityIndicator color={Colors.surface} />
              ) : (
                <Text style={styles.confirmText}>{confirmLabel}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(18, 30, 40, 0.48)",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    elevation: 8,
    maxWidth: 420,
    padding: 22,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    width: "100%",
  },
  title: { color: Colors.text, fontSize: 20, fontWeight: "800" },
  message: { color: Colors.muted, fontSize: 15, lineHeight: 22, marginTop: 10 },
  actions: { flexDirection: "row", gap: 10, justifyContent: "flex-end", marginTop: 22 },
  button: {
    alignItems: "center",
    borderRadius: 9,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 104,
    paddingHorizontal: 15,
  },
  cancelButton: { backgroundColor: Colors.background },
  confirmButton: { backgroundColor: Colors.danger },
  disabled: { opacity: 0.65 },
  cancelText: { color: Colors.text, fontSize: 14, fontWeight: "700" },
  confirmText: { color: Colors.surface, fontSize: 14, fontWeight: "700" },
});
