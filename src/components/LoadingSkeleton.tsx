import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface LoadingSkeletonProps {
  message?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  message = 'Analyzing product...' 
}) => {
  const [progress] = useState(new Animated.Value(0));
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentProcess, setCurrentProcess] = useState('Scraping product data...');

  useEffect(() => {
    // Animate progress bar (simulates ~30 second total time)
    Animated.timing(progress, {
      toValue: 100,
      duration: 30000, // 30 seconds
      useNativeDriver: false,
    }).start();

    // Update elapsed time every second
    const timeInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    // Update process messages every few seconds
    const processInterval = setInterval(() => {
      setElapsedTime(currentTime => {
        if (currentTime < 5) {
          setCurrentProcess('🔍 Scraping product data from Amazon/Flipkart...');
        } else if (currentTime < 10) {
          setCurrentProcess('🤖 Running AI analysis with Gemini...');
        } else if (currentTime < 15) {
          setCurrentProcess('🔎 Finding similar products...');
        } else if (currentTime < 20) {
          setCurrentProcess('💰 Checking prices on Flipkart & Snapdeal...');
        } else if (currentTime < 25) {
          setCurrentProcess('✨ Generating recommendations...');
        } else {
          setCurrentProcess('🎯 Finalizing results...');
        }
        return currentTime;
      });
    }, 2000); // Update every 2 seconds

    return () => {
      clearInterval(timeInterval);
      clearInterval(processInterval);
    };
  }, [progress]);

  return (
    <View style={styles.container}>
      {/* Main Message */}
      <Text style={styles.message}>{message}</Text>
      
      {/* Elapsed Time */}
      <Text style={styles.timeText}>{elapsedTime}s elapsed</Text>

      {/* Progress Bar Container */}
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: progress.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {/* Progress Percentage */}
      <Animated.Text style={styles.percentText}>
        {progress.interpolate({
          inputRange: [0, 100],
          outputRange: ['0%', '100%'],
        })}
      </Animated.Text>

      {/* Current Process */}
      <View style={styles.processContainer}>
        <View style={styles.pulseIndicator} />
        <Text style={styles.processText}>{currentProcess}</Text>
      </View>

      {/* Process Steps */}
      <View style={styles.stepsContainer}>
        <View style={styles.stepItem}>
          <Text style={styles.stepIcon}>✅</Text>
          <Text style={styles.stepText}>Scraping product data</Text>
        </View>
        <View style={styles.stepItem}>
          <Text style={styles.stepIcon}>{elapsedTime >= 5 ? '✅' : '⏳'}</Text>
          <Text style={styles.stepText}>Running AI analysis</Text>
        </View>
        <View style={styles.stepItem}>
          <Text style={styles.stepIcon}>{elapsedTime >= 15 ? '✅' : '⏳'}</Text>
          <Text style={styles.stepText}>Finding alternatives</Text>
        </View>
        <View style={styles.stepItem}>
          <Text style={styles.stepIcon}>{elapsedTime >= 20 ? '✅' : '⏳'}</Text>
          <Text style={styles.stepText}>Checking prices</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F9FAFB',
  },
  message: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 24,
  },
  progressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 6,
  },
  percentText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 24,
  },
  processContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  pulseIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  processText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  stepsContainer: {
    width: '100%',
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stepIcon: {
    fontSize: 18,
  },
  stepText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
});
