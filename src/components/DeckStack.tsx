import React, { useEffect } from 'react';
import { View } from 'react-native';
import styled, { useTheme as useStyledTheme } from 'styled-components/native';
import { useTheme as useAppContext } from '../theme/ThemeContext';
import { availableCardBacks, defaultCardBackId } from '../theme/cardBacks';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// --- Styled Components ---

const Container = styled.View`
  align-items: center;
  justify-content: center;
  /* Reduced height to prevent overlap */
  height: 360px; 
  width: 100%;
`;

const PulseHalo = styled(Animated.View)`
  position: absolute;
  width: 250px;
  height: 400px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 120px;
  z-index: 0;
`;

const CardBase = styled(Animated.View)`
  position: absolute;
  width: 200px;
  height: 320px;
  border-radius: 12px;
  shadow-color: ${props => props.theme.colors.surface === '#ffffff' ? '#94a3b8' : '#000'};
  shadow-offset: 0px 10px;
  shadow-opacity: 0.5;
  shadow-radius: 20px;
  elevation: 10;
`;

const BottomCard = styled(CardBase)`
  background-color: ${props => props.theme.colors.surface === '#ffffff' ? '#e2e8f0' : '#2a2a45'};
  border: 1px solid ${props => props.theme.colors.border};
  z-index: 1;
`;

const MiddleCard = styled(CardBase)`
  background-color: ${props => props.theme.colors.surface === '#ffffff' ? '#f1f5f9' : '#353555'};
  border: 1px solid ${props => props.theme.colors.border};
  z-index: 2;
`;

const TopCardContainer = styled(Animated.View)`
  width: 200px;
  height: 320px;
  border-radius: 12px;
  z-index: 3;
  overflow: hidden;
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
`;

const CardPattern = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
`;

const InnerBorder = styled.View`
  position: absolute;
  inset: 6px;
  border: 4px solid rgba(255, 255, 255, 0.05); /* Keep subtle */
  border-radius: 8px;
`;

interface Props {
  onPress: () => void;
}

export const DeckStack: React.FC<Props> = ({ onPress }) => {
  const theme = useStyledTheme();
  const { cardBack } = useAppContext();

  const selectedCardBack = availableCardBacks.find(cb => cb.id === cardBack) || availableCardBacks.find(cb => cb.id === defaultCardBackId);

  // Animation Values
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.4);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    pulseOpacity.value = withRepeat(
      withTiming(0.6, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const haloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
    backgroundColor: theme.colors.primary, // Dynamic glow color
  }));

  // Static transforms for the "messy stack" look
  const bottomCardStyle = {
    transform: [{ rotate: '-6deg' }, { translateY: 16 }, { scale: 0.95 }],
  };

  const middleCardStyle = {
    transform: [{ rotate: '3deg' }, { translateY: 8 }, { scale: 0.98 }],
  };

  return (
    <Container>
      {/* Decorative Cards */}
      <BottomCard style={bottomCardStyle} />
      <MiddleCard style={middleCardStyle} />

      {/* Active Card (The Deck Top) */}
      <TopCardContainer onTouchEnd={onPress}>
        <CardPattern
          source={selectedCardBack?.source}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(255,255,255,0.1)']}
            style={{ flex: 1 }}
          />
          <InnerBorder />
        </CardPattern>
      </TopCardContainer>
    </Container>
  );
}
