import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;

const COLORS = {
  primary: '#F97316',
  dark: '#0A0A0A',
  white: '#FFFFFF',
};

// Floating particle component
const Particle = ({ delay, startX, startY, size }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0.6,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: -30,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: -60,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 0.5,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: startX,
          top: startY,
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    />
  );
};

// Letter animation component
const AnimatedLetter = ({ letter, index, startDelay }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(startDelay + index * 80),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.Text
      style={[
        styles.sloganLetter,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {letter}
    </Animated.Text>
  );
};

export default function SplashScreen() {
  const slogan = "UNLEASH YOUR STRENGTH";

  // Ring animations
  const ringScale = useRef(new Animated.Value(0)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;
  const ringGlow = useRef(new Animated.Value(0)).current;

  // Logo animations
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // Text animations
  const powerTranslateX = useRef(new Animated.Value(-50)).current;
  const powerOpacity = useRef(new Animated.Value(0)).current;
  const fitTranslateX = useRef(new Animated.Value(50)).current;
  const fitOpacity = useRef(new Animated.Value(0)).current;
  const fitScale = useRef(new Animated.Value(1.2)).current;

  // Line animation
  const lineWidth = useRef(new Animated.Value(0)).current;
  const lineGlow = useRef(new Animated.Value(0.5)).current;

  // Slogan animation trigger
  const [showSlogan, setShowSlogan] = useState(false);

  // Button animations
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.5)).current;

  // Camera zoom
  const cameraZoom = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.85,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    // Main animation sequence
    Animated.sequence([
      // Phase 1: Ring formation with rotation
      Animated.parallel([
        Animated.timing(ringOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(ringScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(ringRotate, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),

      // Phase 2: Logo materializes inside ring
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Ring glow pulse
        Animated.sequence([
          Animated.timing(ringGlow, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(ringGlow, {
            toValue: 0.6,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]),

      // Phase 3: POWER slides from left
      Animated.parallel([
        Animated.timing(powerOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(powerTranslateX, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),

      // Phase 4: FIT slides from right with bounce
      Animated.parallel([
        Animated.timing(fitOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(fitTranslateX, {
          toValue: 0,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(fitScale, {
            toValue: 1.1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.spring(fitScale, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
          }),
        ]),
      ]),

      // Phase 5: Line draws
      Animated.timing(lineWidth, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Start line glow loop separately
      Animated.loop(
        Animated.sequence([
          Animated.timing(lineGlow, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(lineGlow, {
            toValue: 0.5,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      ).start();

      // Show slogan after main sequence
      setShowSlogan(true);

      // Button appears
      setTimeout(() => {
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();

        // Start pulse ripple loop separately
        Animated.loop(
          Animated.parallel([
            Animated.sequence([
              Animated.timing(pulseScale, {
                toValue: 1.5,
                duration: 1500,
                useNativeDriver: true,
              }),
              Animated.timing(pulseScale, {
                toValue: 1,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(pulseOpacity, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: true,
              }),
              Animated.timing(pulseOpacity, {
                toValue: 0.5,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();

        // Camera zoom effect
        Animated.timing(cameraZoom, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }).start();
      }, 800);
    });
  }, []);

  // Generate particles
  const particles = [
    { delay: 0, startX: width * 0.1, startY: height * 0.2, size: 6 },
    { delay: 500, startX: width * 0.8, startY: height * 0.15, size: 8 },
    { delay: 1000, startX: width * 0.2, startY: height * 0.7, size: 5 },
    { delay: 1500, startX: width * 0.85, startY: height * 0.6, size: 7 },
    { delay: 800, startX: width * 0.5, startY: height * 0.1, size: 6 },
    { delay: 1200, startX: width * 0.15, startY: height * 0.5, size: 4 },
    { delay: 600, startX: width * 0.7, startY: height * 0.8, size: 5 },
    { delay: 1800, startX: width * 0.4, startY: height * 0.85, size: 6 },
  ];

  const ringRotation = ringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: cameraZoom }] }]}>
      <LinearGradient
        colors={[COLORS.dark, '#0f0f0f', COLORS.dark]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating particles */}
        {particles.map((p, i) => (
          <Particle key={i} {...p} />
        ))}

        {/* Glowing ring */}
        <Animated.View
          style={[
            styles.ringContainer,
            {
              opacity: ringOpacity,
              transform: [{ scale: ringScale }, { rotate: ringRotation }],
            },
          ]}
        >
          <Animated.View style={[styles.ringGlow, { opacity: ringGlow }]} />
          <View style={styles.ring} />
        </Animated.View>

        {/* Logo inside ring */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Text style={styles.logoIcon}>💪</Text>
        </Animated.View>

        {/* App Name */}
        <View style={styles.appNameContainer}>
          <Animated.Text
            style={[
              styles.appNamePower,
              {
                opacity: powerOpacity,
                transform: [{ translateX: powerTranslateX }],
              },
            ]}
          >
            POWER
          </Animated.Text>
          <Animated.Text
            style={[
              styles.appNameFit,
              {
                opacity: fitOpacity,
                transform: [{ translateX: fitTranslateX }, { scale: fitScale }],
              },
            ]}
          >
            FIT
          </Animated.Text>
        </View>

        {/* Glowing line */}
        <Animated.View
          style={[
            styles.lineContainer,
            {
              width: lineWidth.interpolate({
                inputRange: [0, 1],
                outputRange: [0, scale(140)],
              }),
            },
          ]}
        >
          <Animated.View
            style={[
              styles.lineGlow,
              {
                opacity: lineGlow,
              },
            ]}
          />
          <View style={styles.line} />
        </Animated.View>

        {/* Letter-by-letter slogan */}
        <View style={styles.sloganContainer}>
          {showSlogan &&
            slogan.split('').map((letter, index) => (
              <AnimatedLetter
                key={index}
                letter={letter === ' ' ? '\u00A0' : letter}
                index={index}
                startDelay={0}
              />
            ))}
        </View>

        {/* Button with pulse ripple */}
        <Animated.View
          style={[
            styles.buttonContainer,
            { opacity: buttonOpacity, transform: [{ scale: buttonScale }] },
          ]}
        >
          {/* Pulse ripple */}
          <Animated.View
            style={[
              styles.pulseRipple,
              {
                opacity: pulseOpacity,
                transform: [{ scale: pulseScale }],
              },
            ]}
          />
          <TouchableOpacity
            style={styles.button}
            activeOpacity={1}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Feather name="chevron-right" size={scale(28)} color={COLORS.white} />
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const logoSize = scale(100);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  ringContainer: {
    position: 'absolute',
    width: scale(140),
    height: scale(140),
    alignItems: 'center',
    justifyContent: 'center',
    top: height * 0.25,
  },
  ring: {
    width: scale(130),
    height: scale(130),
    borderRadius: scale(65),
    borderWidth: 3,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  ringGlow: {
    position: 'absolute',
    width: scale(150),
    height: scale(150),
    borderRadius: scale(75),
    backgroundColor: COLORS.primary,
    opacity: 0.3,
  },
  logoContainer: {
    position: 'absolute',
    top: height * 0.25 + scale(20),
    width: logoSize,
    height: logoSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: scale(55),
  },
  appNameContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(280),
    marginBottom: verticalScale(15),
  },
  appNamePower: {
    fontSize: scale(40),
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: scale(2),
  },
  appNameFit: {
    fontSize: scale(40),
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: scale(2),
  },
  lineContainer: {
    height: 4,
    marginBottom: verticalScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  line: {
    width: '100%',
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  lineGlow: {
    position: 'absolute',
    width: '100%',
    height: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    opacity: 0.5,
  },
  sloganContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    minHeight: scale(25),
  },
  sloganLetter: {
    fontSize: scale(12),
    color: COLORS.white,
    letterSpacing: scale(0.5),
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: verticalScale(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRipple: {
    position: 'absolute',
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  button: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
