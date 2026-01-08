import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring
} from 'react-native-reanimated';
import { TarotCard as TarotCardType } from '../hooks/useTarotData';

interface Props {
    card: TarotCardType;
}

const CardContainer = styled(Animated.View)`
  background-color: #2a2a40;
  border-radius: 20px;
  padding: 20px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.5;
  shadow-radius: 10px;
  elevation: 10;
  margin: 20px;
  width: 90%;
  border: 1px solid #454560;
`;

const CardImage = styled.Image`
  width: 250px;
  height: 400px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const CardName = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #e0e0e0;
  margin-bottom: 10px;
  font-family: 'System'; 
  /* 'System' usually picks up a nice serif on iOS if configured or just decent sans. 
     For 'mystical', a serif would be better, but sticking to system defaults for now 
     to avoid linking custom fonts step. */
`;

const CardDescription = styled.Text`
  font-size: 16px;
  color: #b0b0c0;
  text-align: center;
  line-height: 24px;
  padding-horizontal: 10px;
`;

export const TarotCard: React.FC<Props> = ({ card }) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(50);
    const scale = useSharedValue(0.9);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 1000 });
        translateY.value = withSpring(0, { damping: 12 });
        scale.value = withTiming(1, { duration: 800 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [
                { translateY: translateY.value },
                { scale: scale.value }
            ],
        };
    });

    return (
        <CardContainer style={animatedStyle}>
            <CardImage source={{ uri: card.image_url }} resizeMode="contain" />
            <CardName>{card.name}</CardName>
            <CardDescription>{card.description}</CardDescription>
        </CardContainer>
    );
};
