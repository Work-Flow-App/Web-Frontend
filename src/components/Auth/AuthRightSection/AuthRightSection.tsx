import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FloowLogo } from '../../UI/FloowLogo';
import { FeatureCard } from '../../UI/FeatureCard';
import { DEFAULT_AUTH_FEATURES, DEFAULT_AUTH_TAGLINE } from '../../../enums';
import {
  RightSection,
  RightContent,
  BrandSection,
  Tagline,
  FeaturesGrid,
} from './AuthRightSection.styles';
import type { AuthRightSectionProps } from './IAuthRightSection';

export const AuthRightSection: React.FC<AuthRightSectionProps> = ({
  features = DEFAULT_AUTH_FEATURES,
  tagline = DEFAULT_AUTH_TAGLINE,
  autoPlayInterval = 4000,
  enableAutoPlay = false,
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState(1); // Start with middle card active
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  // Handle scroll to change cards
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      if (isScrolling.current) return;

      isScrolling.current = true;

      if (e.deltaY > 0) {
        // Scroll down - next card
        setActiveCardIndex((prev) => (prev + 1) % features.length);
      } else {
        // Scroll up - previous card
        setActiveCardIndex((prev) => (prev - 1 + features.length) % features.length);
      }

      // Throttle scrolling
      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    },
    [features.length]
  );

  // Attach wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // Auto-play animation
  useEffect(() => {
    if (!enableAutoPlay) return;

    const interval = setInterval(() => {
      setActiveCardIndex((prev) => (prev + 1) % features.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [features.length, autoPlayInterval, enableAutoPlay]);

  // Get the order of cards based on active index
  const getCardOrder = (index: number) => {
    const diff = (index - activeCardIndex + features.length) % features.length;

    if (diff === 0) return 'center'; // Active card
    if (diff === 1 || diff === -2) return 'right'; // Right card
    return 'left'; // Left card
  };

  return (
    <RightSection ref={containerRef}>
      <RightContent>
        <BrandSection>
          <FloowLogo variant="white" showText={true} />
          <Tagline>{tagline}</Tagline>
        </BrandSection>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              className={`card-${getCardOrder(index)}`}
            />
          ))}
        </FeaturesGrid>
      </RightContent>
    </RightSection>
  );
};
