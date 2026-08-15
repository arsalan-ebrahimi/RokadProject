import { BeatLoader } from 'react-spinners';

export default function Loading({ color = "#51b5a5", size = 8, margin = 2 }) {
  return (
    <div className='flex justify-center items-center'>
      <BeatLoader size={size} color={color} margin={margin} />
    </div>
  );
}