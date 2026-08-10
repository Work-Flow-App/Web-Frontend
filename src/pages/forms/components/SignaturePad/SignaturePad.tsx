import React, { useCallback, useEffect, useRef, useState } from 'react';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Button } from '../../../../components/UI/Button';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import * as S from './SignaturePad.styles';

export interface SignaturePadProps {
  /** Handed the drawn signature as a ready-to-upload PNG file. The caller feeds it straight
   * into the same FILE-field upload path used for a picked file. */
  onSave: (file: File) => void;
}

const SIGNATURE_FILE_NAME = 'signature.png';

/**
 * Freehand signature capture rendered inside GlobalModal. Draws on a plain canvas - mouse,
 * touch and pen all normalize to pointer events, so no drawing library is needed - and
 * exports a white-backed PNG (transparent would look odd in the file link / exported PDF).
 * Modeled on CreateSubmissionModal: skipResetModal + manual validation before handing the
 * file back, so an empty signature can't be confirmed away.
 */
export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave }) => {
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnConfirm, setSkipResetModal } = useGlobalModalInnerContext();
  const { showError } = useSnackbar();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [hasSignature, setHasSignature] = useState(false);

  const paintBackground = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }, []);

  // Backing store is sized to the wrapper's actual pixel width (devicePixelRatio-aware) so
  // strokes stay crisp on hi-dpi screens. Resizing a canvas clears it, so repaint after.
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const dpr = window.devicePixelRatio || 1;
    const width = wrapper.clientWidth;
    const height = wrapper.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2.25;
      ctx.strokeStyle = '#1a1a1a';
    }
    paintBackground();
    setHasSignature(false);
  }, [paintBackground]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  const pointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    canvasRef.current?.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastPointRef.current = pointFromEvent(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    const last = lastPointRef.current;
    const point = pointFromEvent(e);
    if (!ctx || !last) return;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
    if (!hasSignature) setHasSignature(true);
  };

  const endStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false;
    lastPointRef.current = null;
    canvasRef.current?.releasePointerCapture(e.pointerId);
  };

  const handleClear = () => {
    paintBackground();
    setHasSignature(false);
  };

  useEffect(() => {
    updateModalTitle('Draw Signature');
    updateGlobalModalInnerConfig({ confirmModalButtonText: 'Use Signature' });
    setSkipResetModal?.(true);
  }, [updateModalTitle, updateGlobalModalInnerConfig, setSkipResetModal]);

  useEffect(() => {
    updateOnConfirm(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (!hasSignature) {
        showError('Please draw your signature first');
        return;
      }
      canvas.toBlob((blob) => {
        if (!blob) return;
        onSave(new File([blob], SIGNATURE_FILE_NAME, { type: 'image/png' }));
      }, 'image/png');
    });
  }, [hasSignature, onSave, showError, updateOnConfirm]);

  return (
    <S.PadWrapper>
      <S.Hint>Draw your signature below using your mouse, stylus, or finger.</S.Hint>
      <S.CanvasWrapper ref={wrapperRef}>
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
        />
        {!hasSignature && <S.Placeholder>Sign here</S.Placeholder>}
      </S.CanvasWrapper>
      <S.ActionsRow>
        <Button variant="outlined" size="small" onClick={handleClear} startIcon={<RestartAltIcon fontSize="small" />}>
          Clear
        </Button>
      </S.ActionsRow>
    </S.PadWrapper>
  );
};
