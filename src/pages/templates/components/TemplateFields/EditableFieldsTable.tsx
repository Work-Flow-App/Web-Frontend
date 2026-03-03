import React, { useState, useRef, useEffect, useCallback } from 'react';
import ShortTextIcon from '@mui/icons-material/ShortText';
import TagIcon from '@mui/icons-material/Tag';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import * as S from './EditableFieldsTable.styles';
import type { FieldTableRow } from './FieldsDataColumn';

const FIELD_TYPES = [
  { value: 'TEXT',     label: 'Text',     icon: <ShortTextIcon /> },
  { value: 'NUMBER',   label: 'Number',   icon: <TagIcon /> },
  { value: 'DATE',     label: 'Date',     icon: <CalendarTodayIcon /> },
  { value: 'BOOLEAN',  label: 'Boolean',  icon: <CheckBoxOutlinedIcon /> },
  { value: 'DROPDOWN', label: 'Dropdown', icon: <ArrowDropDownCircleOutlinedIcon /> },
  { value: 'MAP',      label: 'Map',      icon: <PlaceOutlinedIcon /> },
];

const FIELD_TYPE_ICONS: Record<string, React.ReactNode> = {
  TEXT:     <ShortTextIcon />,
  NUMBER:   <TagIcon />,
  DATE:     <CalendarTodayIcon />,
  BOOLEAN:  <CheckBoxOutlinedIcon />,
  DROPDOWN: <ArrowDropDownCircleOutlinedIcon />,
  MAP:      <PlaceOutlinedIcon />,
};

type EditableField = 'label' | 'name' | 'options' | 'orderIndex';

interface ActiveCell {
  rowId: number;
  field: EditableField;
}

interface EditableFieldsTableProps {
  fields: FieldTableRow[];
  loading?: boolean;
  onCellSave: (fieldId: number, updates: Partial<FieldTableRow>) => Promise<void>;
  onOpenPanel: (field: FieldTableRow) => void;
  onDelete: (field: FieldTableRow) => void;
}

export const EditableFieldsTable: React.FC<EditableFieldsTableProps> = ({
  fields,
  loading,
  onCellSave,
  onOpenPanel,
  onDelete,
}) => {
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
  const [editValue, setEditValue] = useState('');
  const [typeDropdownRowId, setTypeDropdownRowId] = useState<number | null>(null);
  const [savingCells, setSavingCells] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const sortedFields = [...fields].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  // Auto-focus input when a cell becomes active
  useEffect(() => {
    if (activeCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [activeCell]);

  // Close type dropdown on outside click
  useEffect(() => {
    if (typeDropdownRowId === null) return;
    const handler = () => setTypeDropdownRowId(null);
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [typeDropdownRowId]);

  const cellKey = (rowId: number, field: string) => `${rowId}:${field}`;

  const startTextEdit = useCallback((rowId: number, field: EditableField, current: string) => {
    setTypeDropdownRowId(null);
    setActiveCell({ rowId, field });
    setEditValue(current);
  }, []);

  const commitEdit = useCallback(async () => {
    if (!activeCell) return;

    const row = sortedFields.find(f => f.id === activeCell.rowId);
    if (!row) { setActiveCell(null); return; }

    const currentRaw = activeCell.field === 'orderIndex'
      ? String(row.orderIndex ?? 0)
      : String((row as any)[activeCell.field] ?? '');

    if (editValue === currentRaw) { setActiveCell(null); return; }

    const key = cellKey(activeCell.rowId, activeCell.field);
    setSavingCells(prev => new Set(prev).add(key));
    setActiveCell(null);

    const updates: Partial<FieldTableRow> =
      activeCell.field === 'orderIndex'
        ? { orderIndex: Number(editValue) }
        : { [activeCell.field]: editValue };

    try {
      await onCellSave(activeCell.rowId, updates);
    } finally {
      setSavingCells(prev => { const n = new Set(prev); n.delete(key); return n; });
    }
  }, [activeCell, editValue, sortedFields, onCellSave]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); commitEdit(); }
    if (e.key === 'Escape') { setActiveCell(null); }
  };

  const handleTypeSelect = useCallback(async (rowId: number, newType: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTypeDropdownRowId(null);
    const key = cellKey(rowId, 'jobFieldType');
    setSavingCells(prev => new Set(prev).add(key));
    try {
      await onCellSave(rowId, { jobFieldType: newType });
    } finally {
      setSavingCells(prev => { const n = new Set(prev); n.delete(key); return n; });
    }
  }, [onCellSave]);

  const handleRequiredToggle = useCallback(async (row: FieldTableRow) => {
    const key = cellKey(row.id, 'required');
    setSavingCells(prev => new Set(prev).add(key));
    try {
      await onCellSave(row.id, { required: !row.required });
    } finally {
      setSavingCells(prev => { const n = new Set(prev); n.delete(key); return n; });
    }
  }, [onCellSave]);

  const isActive = (rowId: number, field: EditableField) =>
    activeCell?.rowId === rowId && activeCell?.field === field;

  const isSaving = (rowId: number, field: string) =>
    savingCells.has(cellKey(rowId, field));

  const renderTextCell = (row: FieldTableRow, field: EditableField, value: string) => {
    const active = isActive(row.id, field);
    const saving = isSaving(row.id, field);

    if (active) {
      return (
        <S.CellInput
          ref={inputRef}
          type={field === 'orderIndex' ? 'number' : 'text'}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
        />
      );
    }

    return value
      ? <S.CellText style={{ opacity: saving ? 0.4 : 1 }}>{value}</S.CellText>
      : <S.CellPlaceholder>—</S.CellPlaceholder>;
  };

  return (
    <S.TableContainer>
      <S.TableEl>
        <S.Thead>
          <tr>
            <S.Th style={{ width: '20%' }}>Field Label</S.Th>
            <S.Th style={{ width: '18%' }}>Field Name</S.Th>
            <S.Th style={{ width: '13%' }}>Type</S.Th>
            <S.Th style={{ width: '10%' }}>Required</S.Th>
            <S.Th style={{ width: '23%' }}>Options</S.Th>
            <S.Th style={{ width: '8%' }}>Order</S.Th>
            <S.Th style={{ width: '8%' }} />
          </tr>
        </S.Thead>

        <S.Tbody>
          {loading ? (
            <tr>
              <S.EmptyState colSpan={7}>Loading fields...</S.EmptyState>
            </tr>
          ) : sortedFields.length === 0 ? (
            <tr>
              <S.EmptyState colSpan={7}>
                No fields yet. Click a type above or use 'Add Field' to get started.
              </S.EmptyState>
            </tr>
          ) : (
            sortedFields.map(row => (
              <S.Tr key={row.id}>

                {/* Field Label */}
                <S.Td
                  isEditable
                  isEditing={isActive(row.id, 'label')}
                  onClick={() => startTextEdit(row.id, 'label', row.label)}
                >
                  {isSaving(row.id, 'label') && <S.SavingDot />}
                  {renderTextCell(row, 'label', row.label)}
                </S.Td>

                {/* Field Name */}
                <S.Td
                  isEditable
                  isEditing={isActive(row.id, 'name')}
                  onClick={() => startTextEdit(row.id, 'name', row.name)}
                >
                  {isSaving(row.id, 'name') && <S.SavingDot />}
                  {renderTextCell(row, 'name', row.name)}
                </S.Td>

                {/* Type — dropdown popup */}
                <S.Td
                  isEditable
                  isEditing={typeDropdownRowId === row.id}
                  style={{ position: 'relative' }}
                  onClick={e => {
                    e.stopPropagation();
                    setActiveCell(null);
                    setTypeDropdownRowId(prev => prev === row.id ? null : row.id);
                  }}
                >
                  {isSaving(row.id, 'jobFieldType') && <S.SavingDot />}
                  <S.CellText style={{ opacity: isSaving(row.id, 'jobFieldType') ? 0.4 : 1 }}>
                    <S.TypeBadge fieldType={row.jobFieldType}>
                      {FIELD_TYPE_ICONS[row.jobFieldType]}
                      {row.jobFieldType}
                    </S.TypeBadge>
                  </S.CellText>

                  {typeDropdownRowId === row.id && (
                    <S.TypeDropdown onMouseDown={e => e.stopPropagation()}>
                      {FIELD_TYPES.map(type => (
                        <S.TypeOption
                          key={type.value}
                          isActive={type.value === row.jobFieldType}
                          onClick={e => handleTypeSelect(row.id, type.value, e)}
                        >
                          {type.icon}
                          {type.label}
                        </S.TypeOption>
                      ))}
                    </S.TypeDropdown>
                  )}
                </S.Td>

                {/* Required — click to toggle */}
                <S.Td
                  isEditable
                  onClick={() => handleRequiredToggle(row)}
                >
                  {isSaving(row.id, 'required') && <S.SavingDot />}
                  <S.CellText style={{ opacity: isSaving(row.id, 'required') ? 0.4 : 1 }}>
                    <S.RequiredBadge isRequired={row.required}>
                      {row.required ? 'Yes' : 'No'}
                    </S.RequiredBadge>
                  </S.CellText>
                </S.Td>

                {/* Options */}
                <S.Td
                  isEditable
                  isEditing={isActive(row.id, 'options')}
                  onClick={() => startTextEdit(row.id, 'options', row.options || '')}
                >
                  {isSaving(row.id, 'options') && <S.SavingDot />}
                  {renderTextCell(row, 'options', row.options || '')}
                </S.Td>

                {/* Order */}
                <S.Td
                  isEditable
                  isEditing={isActive(row.id, 'orderIndex')}
                  onClick={() => startTextEdit(row.id, 'orderIndex', String(row.orderIndex ?? 0))}
                >
                  {isSaving(row.id, 'orderIndex') && <S.SavingDot />}
                  {renderTextCell(row, 'orderIndex', String(row.orderIndex ?? 0))}
                </S.Td>

                {/* Row actions */}
                <S.Td onClick={e => e.stopPropagation()}>
                  <S.RowActions>
                    <S.ActionBtn
                      title="Edit full form"
                      onClick={e => { e.stopPropagation(); onOpenPanel(row); }}
                    >
                      <EditOutlinedIcon />
                    </S.ActionBtn>
                    <S.DeleteBtn
                      title="Delete field"
                      onClick={e => { e.stopPropagation(); onDelete(row); }}
                    >
                      <DeleteOutlineIcon />
                    </S.DeleteBtn>
                  </S.RowActions>
                </S.Td>

              </S.Tr>
            ))
          )}
        </S.Tbody>
      </S.TableEl>
    </S.TableContainer>
  );
};
