import { AlertCircle } from 'lucide-react';
import { useLogoutMutation } from '../../graphql/mutations/__generated__/logout.generated';
import { config } from '../../config/thunderhubConfig';
import { safeRedirect } from '../../utils/url';
import {
  Card,
  CardWithTitle,
  SubTitle,
  SingleLine,
  Sub4Title,
} from '../../components/generic/Styled';

import { Button } from '@/components/ui/button';

export const ButtonRow = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`w-auto flex ${className ?? ''}`} {...props}>
    {children}
  </div>
);

export const SettingsLine = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <SingleLine className={`my-2.5 ${className ?? ''}`} {...props}>
    {children}
  </SingleLine>
);

export const CheckboxText = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`text-[13px] text-muted-foreground text-justify ${className ?? ''}`}
    {...props}
  >
    {children}
  </div>
);

export const StyledContainer = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex justify-center items-center mt-4 ${className ?? ''}`}
    {...props}
  >
    {children}
  </div>
);

export const FixedWidth = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`h-[18px] w-[18px] mr-2 ${className ?? ''}`} {...props}>
    {children}
  </div>
);

export const DangerView = () => {
  const [logout] = useLogoutMutation({
    onCompleted: () => {
      safeRedirect(
        config.logoutUrl || `${config.basePath}/login`,
        `${config.basePath}/login`
      );
    },
  });

  const handleDeleteAll = () => {
    localStorage.clear();
    sessionStorage.clear();

    logout();
  };

  return (
    <CardWithTitle>
      <SubTitle>Danger Zone</SubTitle>
      <Card className="hover:border hover:border-red-500">
        <SettingsLine>
          <Sub4Title>Delete settings:</Sub4Title>
          <ButtonRow>
            <Button variant="destructive" onClick={handleDeleteAll}>
              Delete
            </Button>
          </ButtonRow>
        </SettingsLine>
        <StyledContainer>
          <FixedWidth>
            <AlertCircle size={18} className="text-muted-foreground" />
          </FixedWidth>
          <CheckboxText>
            This does not affect in any way your node, only the information
            saved in this browser.
          </CheckboxText>
        </StyledContainer>
      </Card>
    </CardWithTitle>
  );
};
