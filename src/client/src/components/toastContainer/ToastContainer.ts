import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';

export const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    border-radius: 4px;
  }
  .Toastify__toast--error {
    border-radius: 4px;
  }
  .Toastify__toast--warning {
    border-radius: 4px;
  }
  .Toastify__toast--success {
    border-radius: 4px;
  }
`;
