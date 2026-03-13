import { Cpu } from 'lucide-react';

export const TopSection = () => (
  <div className="flex w-full flex-col items-center bg-transparent py-6 md:py-10">
    <div className="flex items-center gap-2">
      <div className="bg-primary/50 p-2 rounded-xl">
        <Cpu size={28} className="text-white" />
      </div>

      <h1 className="text-center text-3xl font-black text-white md:text-5xl">
        ThunderHub
      </h1>
    </div>
    <p className="mt-2 text-center text-sm text-white/70 md:text-base">
      Monitor and manage your Lightning node from anywhere.
    </p>
  </div>
);
