import { BeatLoader } from 'react-spinners';

export default function Loading({ color = "var(--color-primary)", size = 8, margin = 2 }) {
  return (
    <div className='flex justify-center items-center'>
      <BeatLoader size={size} color={color} margin={margin} />
    </div>
  );
}