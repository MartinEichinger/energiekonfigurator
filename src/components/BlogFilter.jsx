import styled from '@emotion/styled';
import Checkbox from './Checkbox';

export default function BlogFilter({ className, colors }) {
  return (
    <BlogFilterBody className={'herosection ' + className}>
      <div className="d-flex flex-row align-items-center">
        <h4 className="text-purpleGrey me-3 mb-0">KATEGORIE</h4>
        <hr className="w-100" />
      </div>
      <div className="d-flex flex-row mt-3">
        <Checkbox className="sandyBrown50  me-5" colors={colors} text="Fotovoltaik" />
        <Checkbox className="sandyBrown50" colors={colors} text="PV Speicher" />
      </div>
    </BlogFilterBody>
  );
}

const BlogFilterBody = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
`;
