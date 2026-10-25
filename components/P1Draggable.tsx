'use client';
import { useRef } from 'react';
import type { ReactNode, RefObject } from 'react';
import { motion } from 'framer-motion';
import { didLandOnTarget } from '@/lib/p1-curriculum-logic';

interface Props {
  /** The tray / bag this item should be carried to. */
  targetRef: RefObject<HTMLDivElement | null>;
  /** Released over the target. */
  onDrop: () => void;
  /** Plain tap — kept so the game stays playable without drag. */
  onTap: () => void;
  onCarryChange?: (carrying: boolean) => void;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * A draggable, tappable item.
 *
 * The drop test compares the item's own on-screen box against the target's box,
 * both measured from the DOM, so it is immune to scrolling and zoom.
 */
export function P1Draggable({
  targetRef, onDrop, onTap, onCarryChange, ariaLabel, disabled = false, className = '', children,
}: Props) {
  const node = useRef<HTMLButtonElement>(null);
  const carrying = useRef(false);

  function landedOnTarget(): boolean {
    const item = node.current?.getBoundingClientRect();
    const zone = targetRef.current?.getBoundingClientRect();
    if (!item || !zone) return false;
    return didLandOnTarget(
      item.left + item.width / 2,
      item.top + item.height / 2,
      { left: zone.left, top: zone.top, width: zone.width, height: zone.height },
    );
  }

  return (
    <motion.button
      ref={node}
      drag={!disabled}
      dragSnapToOrigin
      dragElastic={0.1}
      dragMomentum={false}
      disabled={disabled}
      aria-label={ariaLabel}
      className={className}
      onDragStart={() => {
        carrying.current = true;
        onCarryChange?.(true);
      }}
      onDragEnd={() => {
        if (landedOnTarget()) onDrop();
        // The pointer-up that ends a drag is followed by a synthetic click; ignore
        // that one so a drop never adds the coin or item twice.
        setTimeout(() => {
          carrying.current = false;
          onCarryChange?.(false);
        }, 0);
      }}
      onClick={() => {
        if (carrying.current) return;
        onTap();
      }}
      whileTap={{ scale: 0.9 }}
    >
      {children}
    </motion.button>
  );
}
