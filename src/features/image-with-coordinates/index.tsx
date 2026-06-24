import { useRef, type ImgHTMLAttributes } from "react";
import {
  BodyXS,
  surfaceSolidSecondary,
  surfaceTransparentDeep,
} from "@salutejs/sdds-platform-ai/styled-components";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  background: ${surfaceTransparentDeep};
  padding: 6px;
  border-radius: 12px;
  width: 100%;
  display: grid;
  place-items: center;
`;

const StyledImg = styled.img`
  display: block;
  max-width: 100%;
`;

const Coordinates = styled(BodyXS)`
  position: absolute;
  background: ${surfaceSolidSecondary};
  padding: 2px 8px;
  border-radius: 6px;
  pointer-events: none;
  white-space: nowrap;
`;

export function ImageWithCoordinates(props: ImgHTMLAttributes<HTMLImageElement>) {
  const coordRef = useRef<HTMLSpanElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const el = coordRef.current;
    const img = imgRef.current;
    if (!el || !img) return;

    const ratioX = img.naturalWidth / img.offsetWidth;
    const ratioY = img.naturalHeight / img.offsetHeight;
    const natX = Math.round(e.nativeEvent.offsetX * ratioX);
    const natY = Math.round(e.nativeEvent.offsetY * ratioY);

    el.style.left = `${e.nativeEvent.offsetX + 40}px`;
    el.style.top = `${e.nativeEvent.offsetY + 12}px`;
    el.textContent = `x: ${natX} y: ${natY}`;
  };

  const handleMouseLeave = () => {
    const el = coordRef.current;
    if (!el) return;
    el.textContent = "";
    el.style.left = "-9999px";
  };

  return (
    <Wrapper>
      <StyledImg
        {...props}
        ref={imgRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      <Coordinates as="span" ref={coordRef} style={{ left: "-9999px", top: 0 }} />
    </Wrapper>
  );
}
