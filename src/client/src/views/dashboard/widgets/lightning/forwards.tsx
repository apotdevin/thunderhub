import { ForwardsList } from '../../../forwards';

export const ForwardListWidget = () => {
  return (
    <div className="w-full h-full">
      <h4 className="font-black w-full text-center my-2">Forwards</h4>
      <div
        className="w-full overflow-auto"
        style={{ height: 'calc(100% - 40px)' }}
      >
        <ForwardsList days={7} />
      </div>
    </div>
  );
};
