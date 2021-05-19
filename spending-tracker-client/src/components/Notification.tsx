import React from 'react';
import styled from 'styled-components';
import { Layer } from 'grommet';
import {
  selectNotification,
  close,
  NotificationType,
} from '../state/slices/notification';
import { useAppSelector, useAppDispatch } from '../hooks';

const NotificationLayer = styled(Layer)<{ type: string }>`
  width: 50vw;
  text-align: center;
  background: ${({ theme, type }) =>
    type === 'error' ? theme.colourPalette.error : theme.colourPalette.warning};
  font-size: 1.2rem;
  color: #fff;
`;

function getTypeLabel(type: NotificationType): string {
  switch (type) {
    case 'warning':
      return 'Warning: ';
    case 'error':
    default:
      return 'Error: ';
  }
}

export function Notification() {
  const dispatch = useAppDispatch();
  const { open, message, type } = useAppSelector(selectNotification);
  const typeLabel = getTypeLabel(type);

  setTimeout(() => {
    dispatch(close());
  }, 5000); // Could pass timeout as prop

  return (
    <>
      {open && (
        <NotificationLayer
          role="alert"
          position="bottom"
          modal={false}
          margin={{ vertical: 'medium', horizontal: 'small' }}
          responsive={false}
          plain
          type={type}
        >
          <p>
            {typeLabel}
            {message}
          </p>
        </NotificationLayer>
      )}
    </>
  );
}
