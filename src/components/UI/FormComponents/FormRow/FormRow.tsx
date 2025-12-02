import * as S from './FormRow.styled';
import type { FormRowProps } from './FormRow.types';

export const FormRow = (props: FormRowProps): JSX.Element => {
  const { children, width, gap, ...rest } = props;
  return (
    <S.Wrapper width={width} gap={gap} {...rest}>
      {children}
    </S.Wrapper>
  );
};
