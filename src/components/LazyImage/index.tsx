import React, { useState, useEffect, useCallback } from 'react';
import { Animated } from 'react-native';

import { Small, Original } from './styles';

const OriginalAnimated = Animated.createAnimatedComponent(Original);

interface LazyImageProps {
  smallSource: string;
  source: string;
  aspectRatio: number;
  shouldLoad: boolean;
}

const LazyImage: React.FC<LazyImageProps> = (
  {
    smallSource,
    source,
    aspectRatio,
    shouldLoad,
  } : LazyImageProps,
) => {
  const opacity = new Animated.Value(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (shouldLoad) {
      setTimeout(() => {
        setLoaded(true);
      }, 1000);
    }
  }, [shouldLoad]);

  const handleAnimate = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <Small
      source={{ uri: smallSource }}
      ratio={aspectRatio}
      resizeMode="contain"
      blurRadius={2}
    >
      { loaded && (
        <OriginalAnimated
          style={{ opacity }}
          source={{ uri: source }}
          ratio={aspectRatio}
          resizeMode="contain"
          onLoadEnd={handleAnimate}
        />
      )}
    </Small>
  );
};

export default LazyImage;
