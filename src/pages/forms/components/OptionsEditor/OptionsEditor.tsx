import React, { useState, useEffect, useCallback, useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import * as S from './OptionsEditor.styles';

export interface OptionsEditorProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

const parseOptions = (raw?: unknown): string[] => {
  if (typeof raw !== 'string' || !raw.trim()) return [''];
  const items = raw.split(',').map((s) => s.trim());
  return items.length > 0 ? items : [''];
};

export const OptionsEditor: React.FC<OptionsEditorProps> = ({ value, onChange, error }) => {
  const [options, setOptions] = useState<string[]>(() => parseOptions(value));
  const [touchedIndices, setTouchedIndices] = useState<Set<number>>(new Set());
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    const parsed = parseOptions(value);
    setOptions(parsed);
  }, [value]);

  const updateParent = useCallback(
    (newOptions: string[]) => {
      isInternalUpdate.current = true;
      setOptions(newOptions);
      onChange(newOptions.join(', '));
    },
    [onChange]
  );

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setTouchedIndices((prev) => new Set(prev).add(index));
    updateParent(updated);
  };

  const handleAddOption = () => {
    const updated = [...options, ''];
    updateParent(updated);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 1) {
      updateParent(['']);
      setTouchedIndices(new Set());
      return;
    }
    const updated = options.filter((_, i) => i !== index);
    const newTouched = new Set<number>();
    touchedIndices.forEach((i) => {
      if (i < index) newTouched.add(i);
      else if (i > index) newTouched.add(i - 1);
    });
    setTouchedIndices(newTouched);
    updateParent(updated);
  };

  const hasEmptyOptions = options.some((opt, idx) => touchedIndices.has(idx) && !opt.trim());

  return (
    <S.OptionsContainer>
      {options.map((option, index) => {
        const isRowEmpty = touchedIndices.has(index) && !option.trim();
        return (
          <div key={index}>
            <S.OptionRow>
              <S.OptionInputWrapper>
                <S.OptionInputField
                  value={option}
                  placeholder={`Option ${index + 1}`}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  onBlur={() => setTouchedIndices((prev) => new Set(prev).add(index))}
                  className={isRowEmpty ? 'has-error' : undefined}
                />
              </S.OptionInputWrapper>
              <S.DeleteIconButton
                size="small"
                onClick={() => handleRemoveOption(index)}
                aria-label={`Remove option ${index + 1}`}
                disabled={options.length <= 1 && !option}
              >
                <DeleteOutlineIcon fontSize="small" />
              </S.DeleteIconButton>
            </S.OptionRow>
            {isRowEmpty && (
              <S.ErrorText>
                Please fill in this option or remove it
              </S.ErrorText>
            )}
          </div>
        );
      })}

      <S.AddOptionButton type="button" onClick={handleAddOption}>
        <AddIcon fontSize="small" />
        Add Option
      </S.AddOptionButton>

      {error && !hasEmptyOptions && (
        <S.ErrorText>{error}</S.ErrorText>
      )}
    </S.OptionsContainer>
  );
};

export default OptionsEditor;
