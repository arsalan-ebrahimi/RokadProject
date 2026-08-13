import { BeatLoader } from 'react-spinners';

export default function Loading() {
  return (
    <div className='flex justify-center items-center'>
      <BeatLoader size={8} color='#ffffff' margin={2} />
    </div>
  );
}