import styled from 'styled-components/native';

interface SmallProps {
  ratio: number;
}

export const Small = styled.ImageBackground<SmallProps>`
  width: 100%;
  aspect-ratio: ${(props) => props.ratio};
`;

export const Original = styled.Image<SmallProps>`
  width: 100%;
  aspect-ratio: ${(props) => props.ratio};
`;
