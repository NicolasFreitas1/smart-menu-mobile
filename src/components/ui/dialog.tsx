import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { X } from 'lucide-react-native';

interface DialogProps {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ visible, onClose, children }) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color="#6b7280" />
          </TouchableOpacity>
          {children}
        </View>
      </View>
    </Modal>
  );
};

export const DialogHeader: React.FC<{ style?: ViewStyle; children?: React.ReactNode }> = ({
  style,
  children,
}) => (
  <View style={[styles.header, style]}>
    {children}
  </View>
);

export const DialogTitle: React.FC<{ style?: TextStyle; children?: React.ReactNode }> = ({
  style,
  children,
}) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

export const DialogDescription: React.FC<{ style?: TextStyle; children?: React.ReactNode }> = ({
  style,
  children,
}) => (
  <Text style={[styles.description, style]}>{children}</Text>
);

export const DialogFooter: React.FC<{ style?: ViewStyle; children?: React.ReactNode }> = ({
  style,
  children,
}) => (
  <View style={[styles.footer, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
});
