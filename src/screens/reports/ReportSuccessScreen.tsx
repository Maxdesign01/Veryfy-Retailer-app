import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowForwardIcon } from '../../components/icons/ArrowForwardIcon';
import { CheckCircleFilledIcon } from '../../components/icons/CheckCircleFilledIcon';

interface ReportSuccessScreenProps {
  navigation: any;
  route: any;
}

export const ReportSuccessScreen: React.FC<ReportSuccessScreenProps> = ({
  navigation,
  route,
}) => {
  const reportId = route?.params?.reportId || 'VFY-RP-10482';

  const handleDone = () => {
    navigation.navigate('Main', { screen: 'Reports' });
  };

  const handleViewReports = () => {
    navigation.navigate('Main', { screen: 'Reports' });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Green Checkmark Circle */}
          <View style={styles.iconCircle}>
            <CheckCircleFilledIcon size={44} color="#166534" />
          </View>

          {/* Overline */}
          <Text style={styles.overline}>SUBMITTED SUCCESSFULLY</Text>

          {/* Heading */}
          <Text style={styles.heading}>Report received</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Thanks for helping us review potentially unsafe or counterfeit products.
          </Text>

          {/* Report ID Card */}
          <View style={styles.idCard}>
            <Text style={styles.idLabel}>REPORT ID</Text>
            <Text style={styles.idValue}>{reportId}</Text>
            <Text style={styles.idNote}>Keep this number for your records.</Text>
          </View>

          {/* Divider Line */}
          <View style={styles.divider} />

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Pressable
              style={styles.doneButton}
              onPress={handleDone}
              accessibilityRole="button"
              accessibilityLabel="Done"
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>

            <Pressable
              style={styles.viewReportsButton}
              onPress={handleViewReports}
              accessibilityRole="button"
              accessibilityLabel="View Reports"
            >
              <Text style={styles.viewReportsText}>View Reports</Text>
              <ArrowForwardIcon size={18} color="#3D52D5" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  overline: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#161616',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 12,
    marginBottom: 28,
  },
  idCard: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  idLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  idValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#161616',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  idNote: {
    fontSize: 12,
    color: '#666666',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 24,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  doneButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#3D52D5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  viewReportsButton: {
    width: '100%',
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  viewReportsText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3D52D5',
  },
});
