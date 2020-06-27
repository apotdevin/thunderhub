import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import { themeColors, chartColors } from 'src/styles/Themes';

export const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    border-radius: 4px;
    background-color: ${themeColors.blue2};
  }
  .Toastify__toast--error {
    border-radius: 4px;
    background-color: ${chartColors.red};
  }
  .Toastify__toast--warning {
    border-radius: 4px;
    background-color: ${chartColors.orange};
  }
  .Toastify__toast--success {
    border-radius: 4px;
    background-color: ${chartColors.green};
  }
`;
