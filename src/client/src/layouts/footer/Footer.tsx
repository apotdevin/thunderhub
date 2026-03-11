import { config } from '../../config/thunderhubConfig';
import { Link } from '../../components/link/Link';
import { Emoji } from '../../components/emoji/Emoji';
import { fontColors } from '../../styles/Themes';

import { useLocation } from 'react-router-dom';

export const Footer = () => {
  const { pathname } = useLocation();

  return (
    <div className="absolute bottom-0 w-full h-[120px]">
      <div className="w-full bg-[#151727] px-4">
        <div
          className={
            pathname === '/login'
              ? 'max-w-[1000px] mx-auto px-4 lg:px-0'
              : undefined
          }
        >
          <div className="py-4 pb-8 md:pb-4 min-h-[120px] text-white flex flex-col justify-center items-center">
            <div className="w-full flex flex-col justify-center items-center md:flex-row md:justify-between">
              <div className="flex flex-col justify-center items-center md:justify-start md:items-start">
                <div className="flex justify-center items-center">
                  <div className="font-extrabold text-white">ThunderHub</div>
                  <div className="text-xs ml-2">{config.npmVersion}</div>
                </div>
                <div className="text-sm text-[#b0b3c7]">
                  Open-source Lightning Node Manager.
                </div>
              </div>
              <div className="flex flex-col my-4 justify-center items-center md:my-0 md:justify-start md:items-end">
                <Link
                  href={'https://github.com/apotdevin/thunderhub'}
                  color={fontColors.blue}
                >
                  Github
                </Link>
                <Link
                  href={'https://twitter.com/thunderhubio'}
                  color={fontColors.blue}
                >
                  Twitter
                </Link>
              </div>
            </div>
            <div className="text-sm text-[#b0b3c7] w-full text-center mt-4">
              Made in Munich with <Emoji symbol={'🧡 '} label={'heart'} /> and{' '}
              <Emoji symbol={'⚡'} label={'lightning'} />.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
