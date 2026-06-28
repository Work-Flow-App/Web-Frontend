import React, { useState, useRef, useEffect } from 'react';
import { NotificationList } from './NotificationList';
import type { INotificationList } from './INotificationList';
import { DropdownContainer, DropdownContent, Backdrop } from './NotificationDropdown.styles';

export interface NotificationDropdownProps extends INotificationList {
  /**
   * The trigger element (e.g., notification icon button)
   */
  trigger: React.ReactElement;

  /**
   * Position of the dropdown
   * @default 'bottom-right'
   */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

  /**
   * Controlled open state
   */
  open?: boolean;

  /**
   * Callback when dropdown should close
   */
  onClose?: () => void;

  /**
   * Callback when dropdown should open
   */
  onOpen?: () => void;
}

/**
 * NotificationDropdown Component
 *
 * A dropdown wrapper for NotificationList that can be triggered by any element.
 * Perfect for use with the HeaderNav notification icon.
 *
 * @example
 * ```tsx
 * <NotificationDropdown
 *   trigger={<IconButton><NotificationIcon /></IconButton>}
 *   notifications={notifications}
 *   onMailClick={(id) => console.log(id)}
 *   onViewClick={(notif) => console.log(notif)}
 * />
 * ```
 */
export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  trigger,
  position = 'bottom-right',
  open: controlledOpen,
  onClose,
  onOpen,
  notifications,
  ...notificationListProps
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const containerRef = useRef<HTMLDivElement>(null);

  const handleTriggerClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (isControlled) {
      if (isOpen && onClose) {
        onClose();
      } else if (!isOpen && onOpen) {
        onOpen();
      }
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  const handleClose = () => {
    if (isControlled && onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const triggerWithClick = React.cloneElement(trigger as React.ReactElement<any>, {
    onClick: (event: React.MouseEvent) => {
      handleTriggerClick(event);
      // Call original onClick if it exists
      const originalOnClick = (trigger as React.ReactElement<any>).props?.onClick;
      if (originalOnClick) {
        originalOnClick(event);
      }
    },
  });

  return (
    <>
      <Backdrop open={isOpen} onClick={handleClose} />
      <DropdownContainer ref={containerRef}>
        {triggerWithClick}
        <DropdownContent open={isOpen} position={position}>
          <NotificationList
            notifications={notifications}
            {...notificationListProps}
          />
        </DropdownContent>
      </DropdownContainer>
    </>
  );
};
