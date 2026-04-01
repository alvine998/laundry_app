import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import normalize from 'react-native-normalize';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'google';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  style,
  textStyle,
  ...rest
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isGoogle = variant === 'google';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        isPrimary && styles.primaryButton,
        isSecondary && styles.secondaryButton,
        isOutline && styles.outlineButton,
        isGoogle && styles.googleButton,
        style,
      ]}
      {...rest}
    >
      {isGoogle && (
        <View style={styles.googleIconContainer}>
          <FontAwesome name="google" size={normalize(16)} color="#FFFFFF" />
        </View>
      )}
      <Text
        style={[
          styles.text,
          isPrimary && styles.primaryText,
          isSecondary && styles.secondaryText,
          isOutline && styles.outlineText,
          isGoogle && styles.googleText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(24),
    borderRadius: normalize(24), 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: normalize(8),
    width: '100%',
  },
  text: {
    fontSize: normalize(16),
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#0084F4', // Laundry Now Blue
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#1E293B', // Dark slate for partner selection
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#0084F4',
  },
  outlineText: {
    color: '#0084F4',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  googleText: {
    color: '#1C1C1E',
  },
  googleIconContainer: {
    marginRight: normalize(12),
    width: normalize(28),
    height: normalize(28),
    borderRadius: normalize(14),
    backgroundColor: '#EA4335', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});
