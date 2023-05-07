import styled from '@emotion/styled';

export default function HomeHeroSection({ className, prop }) {
  return (
    <HomeHeroSectionBody className={'herosection ' + className}>
      <TextFrame className="d-flex flex-column">
        <h1 className="mb-4 text-white w-50">{prop.heading}</h1>
        <h4 className="mb-4 text-white w-50">{prop.body}</h4>
      </TextFrame>
      <Image prop={prop} />
    </HomeHeroSectionBody>
  );
}

const HomeHeroSectionBody = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
`;

const Image = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  background-image: url(${({ prop }) => prop.image});
  background-repeat: no-repeat;
  background-position: 50% 50%;
  height: 100%;
  width: 50%;
`;

const TextFrame = styled.div`
  padding: 56px 144px;
  overflow: hidden;
`;
