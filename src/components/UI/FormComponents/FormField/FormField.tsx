import * as S from './FormField.styled';
import type { FormFieldProps } from './FormField.types';

export const FormField = (props: FormFieldProps) => {
  const { label, hideLabel, icon, required, children, className } = props;

  return (
    <S.Wrapper className={className}>
      {!hideLabel && label && (
        <S.LabelSection>
          <S.Label>
            {label}
            {required && <S.RequiredIndicator> *</S.RequiredIndicator>}
          </S.Label>
          {icon && <S.IconWrapper>{icon}</S.IconWrapper>}
        </S.LabelSection>
      )}
      <S.ContentSection>{children}</S.ContentSection>
    </S.Wrapper>
  );
};
