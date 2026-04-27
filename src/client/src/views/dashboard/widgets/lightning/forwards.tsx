import { ForwardsList } from '../../../forwards';

export const ForwardListWidget = () => {
  return (
    <div className="w-full h-full">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground my-1 block text-center">
        Forwards
      </span>
      <div
        className="w-full overflow-auto"
        style={{ height: 'calc(100% - 40px)' }}
      >
        <ForwardsList days={7} />
      </div>
    </div>
  );
};
