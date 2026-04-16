import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Chip,
  Collapse,
  Divider,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  Checkbox,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import type { JobResponse, EstimateResponse, LineItemResponse, LineItemCreateRequest, InvoiceResponse } from '../../../../../services/api';
import { estimateService, lineItemService } from '../../../../../services/api';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { useGlobalModalOuterContext, ModalSizes } from '../../../../../components/UI/GlobalModal';
import { Loader } from '../../../../../components/UI/Loader/Loader';
import { Button } from '../../../../../components/UI/Button';
import {
  StyledTableContainer,
  StyledTable,
  StyledTableHead,
  StyledTableBody,
  StyledTableRow,
  StyledHeaderCell,
  StyledTableCell,
  ActionsCell,
} from '../../../../../components/UI/Table/Table.styles';
import { CreateInvoiceModal } from './CreateInvoiceModal';
import * as S from '../../../JobDetailsPage.styles';

interface JobEstimateTabProps {
  job: JobResponse;
}

const COMPACT_CELL = { py: '5px', px: '10px', fontSize: '0.8125rem' };
const FIELD_SX = { '& .MuiInputBase-root': { fontSize: '0.8125rem' } };

const defaultNewItem = {
  productCode: '',
  productDescription: '',
  coreOrSub: 'CORE' as 'CORE' | 'SUB',
  unitPrice: '',
  quantity: '1',
  vatRate: '0',
};

export const JobEstimateTab: React.FC<JobEstimateTabProps> = ({ job }) => {
  const { showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddRow, setShowAddRow] = useState(false);
  const [availableLineItems, setAvailableLineItems] = useState<LineItemResponse[]>([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [newItem, setNewItem] = useState(defaultNewItem);
  const [selectedExistingId, setSelectedExistingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [expandedInvoiceIds, setExpandedInvoiceIds] = useState<Set<number>>(new Set());

  const fetchInvoices = useCallback(async (estimateId: number) => {
    try {
      const res = await estimateService.listInvoicesForEstimate(estimateId);
      const data = Array.isArray(res.data) ? res.data : [];
      setInvoices(data.slice().sort((a, b) => {
        const dA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dB - dA;
      }));
    } catch {
      // non-critical — silently ignore
    }
  }, []);

  const fetchEstimate = useCallback(async () => {
    if (!job.id) return;
    try {
      setLoading(true);
      const res = await estimateService.getByJobId(job.id);
      setEstimate(res.data);
      if (res.data?.id) await fetchInvoices(res.data.id);
    } catch {
      showError('Failed to load estimate');
    } finally {
      setLoading(false);
    }
  }, [job.id, showError, fetchInvoices]);

  useEffect(() => {
    fetchEstimate();
  }, [fetchEstimate]);

  const handleUnlink = useCallback(
    async (lineItem: LineItemResponse) => {
      if (!estimate?.id || !lineItem.id) return;
      try {
        await estimateService.unlinkLineItem(estimate.id, lineItem.id);
        setSelectedIds((prev) => { const next = new Set(prev); next.delete(lineItem.id!); return next; });
        await fetchEstimate();
      } catch {
        showError('Failed to remove line item');
      }
    },
    [estimate?.id, showError, fetchEstimate]
  );

  const handleOpenAddRow = useCallback(
    async (linkedIds: number[]) => {
      setShowAddRow(true);
      setNewItem(defaultNewItem);
      setSelectedExistingId(null);
      setPickerLoading(true);
      try {
        const res = await lineItemService.getAll();
        const all: LineItemResponse[] = Array.isArray(res.data) ? res.data : [];
        setAvailableLineItems(all.filter((item) => item.id !== undefined && !linkedIds.includes(item.id!)));
      } catch {
        showError('Failed to load existing line items');
      } finally {
        setPickerLoading(false);
      }
    },
    [showError]
  );

  const handleCloseAddRow = useCallback(() => {
    setShowAddRow(false);
    setNewItem(defaultNewItem);
    setSelectedExistingId(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (!estimate?.id) return;
    if (!newItem.productCode.trim()) { showError('Product code is required'); return; }
    if (!newItem.productDescription.trim() && !selectedExistingId) { showError('Description is required'); return; }
    setSaving(true);
    try {
      if (selectedExistingId) {
        await estimateService.linkExistingLineItem(estimate.id, selectedExistingId);
      } else {
        const payload: LineItemCreateRequest = {
          productCode: newItem.productCode.trim(),
          productDescription: newItem.productDescription.trim(),
          coreOrSub: newItem.coreOrSub,
          unitPrice: parseFloat(newItem.unitPrice) || 0,
          quantity: parseInt(newItem.quantity) || 1,
          vatRate: parseFloat(newItem.vatRate) || 0,
        };
        // Create via lineItemCreate (correct VAT computation) then link, instead of
        // estimateCreateAndLink which treats vatRate as a multiplier not a percentage
        const created = await lineItemService.create(payload);
        await estimateService.linkExistingLineItem(estimate.id, created.data.id!);
      }
      handleCloseAddRow();
      await fetchEstimate();
    } catch {
      showError('Failed to add line item');
    } finally {
      setSaving(false);
    }
  }, [estimate?.id, newItem, selectedExistingId, showError, handleCloseAddRow, fetchEstimate]);

  const handleGenerateInvoice = useCallback(() => {
    if (selectedIds.size === 0) {
      showError('Please select at least one line item to generate an invoice');
      return;
    }

    const lineItems: LineItemResponse[] = estimate?.lineItems || [];
    // Strictly exclude any already-invoiced items regardless of checkbox state
    const invoiceLineItems = lineItems.filter(
      (li) => li.id !== undefined && selectedIds.has(li.id!) && !li.invoiced
    );

    if (invoiceLineItems.length === 0) {
      showError('All selected line items have already been invoiced');
      return;
    }

    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.LARGE,
      fieldName: 'createInvoice',
      children: (
        <CreateInvoiceModal
          estimateId={estimate!.id!}
          lineItems={invoiceLineItems}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            setSelectedIds(new Set());
            fetchEstimate();
          }}
        />
      ),
    });
  }, [job, estimate?.lineItems, selectedIds, setGlobalModalOuterProps, resetGlobalModalOuterProps]);

  const fmt = (val?: number) => (val !== undefined ? `£${val.toFixed(2)}` : '—');

  const calcNet = useMemo(() => {
    const price = parseFloat(newItem.unitPrice) || 0;
    const qty = parseFloat(newItem.quantity) || 1;
    return price * qty;
  }, [newItem.unitPrice, newItem.quantity]);

  const calcVat = useMemo(() => {
    const rate = parseFloat(newItem.vatRate);
    return isNaN(rate) ? 0 : calcNet * (rate / 100);
  }, [calcNet, newItem.vatRate]);
  const calcTotal = calcNet + calcVat;

  // Map: lineItemId → invoice that contains it (for the identifier badge)
  // Must be before any early returns to satisfy Rules of Hooks
  const lineItemInvoiceMap = useMemo(() => {
    const map = new Map<number, InvoiceResponse>();
    invoices.forEach((inv) => {
      (inv.lineItems || []).forEach((li) => {
        if (li.id !== undefined) map.set(li.id, inv);
      });
    });
    return map;
  }, [invoices]);

  if (loading) return <Loader size={40} centered minHeight="200px" />;

  if (!estimate) {
    return (
      <S.EstimateEmptyState>
        <ReceiptLongIcon />
        <S.InfoValue>No estimate found for this job</S.InfoValue>
      </S.EstimateEmptyState>
    );
  }

  const lineItems: LineItemResponse[] = estimate.lineItems || [];
  const linkedIds = lineItems.map((li) => li.id!).filter(Boolean);
  const selectableItems = lineItems.filter((li) => !li.invoiced);
  const allSelected = selectableItems.length > 0 && selectableItems.every((li) => selectedIds.has(li.id!));
  const someSelected = selectableItems.some((li) => selectedIds.has(li.id!));

  const toggleRow = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectableItems.map((li) => li.id!).filter(Boolean)));
    }
  };

  const toggleInvoiceExpand = (id: number) => {
    setExpandedInvoiceIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <>
      <S.EstimateTotalsRow>
        <S.EstimateTotalCard>
          <S.DetailLabel>Net Total</S.DetailLabel>
          <S.EstimateTotalValue>{fmt(estimate.totalNet)}</S.EstimateTotalValue>
        </S.EstimateTotalCard>
        <S.EstimateTotalCard>
          <S.DetailLabel>VAT</S.DetailLabel>
          <S.EstimateTotalValue>{fmt(estimate.totalVat)}</S.EstimateTotalValue>
        </S.EstimateTotalCard>
        <S.EstimateTotalCard>
          <S.DetailLabel>Grand Total</S.DetailLabel>
          <S.EstimateTotalValue>{fmt(estimate.grandTotal)}</S.EstimateTotalValue>
        </S.EstimateTotalCard>
      </S.EstimateTotalsRow>

      <S.EstimateTableHeader>
        <S.DetailsSectionTitle>
          Line Items ({lineItems.length})
          {someSelected && ` · ${selectedIds.size} selected`}
        </S.DetailsSectionTitle>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" color="primary" onClick={handleGenerateInvoice}>
            Create Invoice
          </Button>
        </Box>
      </S.EstimateTableHeader>

      <StyledTableContainer>
        <StyledTable>
          <StyledTableHead>
            <TableRow>
              {/* Select-all checkbox */}
              <StyledHeaderCell sx={{ ...COMPACT_CELL, width: 36, px: '8px' }}>
                <Checkbox
                  size="small"
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  onChange={toggleAll}
                  disabled={lineItems.length === 0}
                  sx={{ p: 0 }}
                />
              </StyledHeaderCell>
              <StyledHeaderCell sx={COMPACT_CELL}>Product Code</StyledHeaderCell>
              <StyledHeaderCell sx={COMPACT_CELL}>Description</StyledHeaderCell>
              <StyledHeaderCell sx={COMPACT_CELL}>Type</StyledHeaderCell>
              <StyledHeaderCell sx={COMPACT_CELL}>Status</StyledHeaderCell>
              <StyledHeaderCell align="right" sx={COMPACT_CELL}>Unit Price</StyledHeaderCell>
              <StyledHeaderCell align="right" sx={COMPACT_CELL}>Qty</StyledHeaderCell>
              <StyledHeaderCell align="right" sx={COMPACT_CELL}>VAT %</StyledHeaderCell>
              <StyledHeaderCell align="right" sx={COMPACT_CELL}>Net</StyledHeaderCell>
              <StyledHeaderCell align="right" sx={COMPACT_CELL}>VAT</StyledHeaderCell>
              <StyledHeaderCell align="right" sx={COMPACT_CELL}>Total</StyledHeaderCell>
              <ActionsCell as={StyledHeaderCell} sx={COMPACT_CELL}>Actions</ActionsCell>
            </TableRow>
          </StyledTableHead>

          <StyledTableBody>
            {lineItems.length === 0 && !showAddRow && (
              <StyledTableRow>
                <StyledTableCell colSpan={12} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                  No line items yet
                </StyledTableCell>
              </StyledTableRow>
            )}

            {lineItems.map((item) => {
              const linkedInvoice = item.invoiced ? lineItemInvoiceMap.get(item.id!) : undefined;
              return (
              <StyledTableRow
                key={item.id}
                onClick={() => !item.invoiced && toggleRow(item.id!)}
                sx={(theme) => ({
                  cursor: item.invoiced ? 'default' : 'pointer',
                  ...(item.invoiced
                    ? { backgroundColor: theme.palette.warning.light + '22' }
                    : selectedIds.has(item.id!)
                    ? { backgroundColor: 'action.selected' }
                    : {}),
                })}
              >
                <StyledTableCell sx={{ ...COMPACT_CELL, width: 36, px: '8px' }}>
                  <Checkbox
                    size="small"
                    checked={selectedIds.has(item.id!)}
                    disabled={!!item.invoiced}
                    onChange={() => toggleRow(item.id!)}
                    onClick={(e) => e.stopPropagation()}
                    sx={{ p: 0 }}
                  />
                </StyledTableCell>
                <StyledTableCell sx={COMPACT_CELL}>{item.productCode}</StyledTableCell>
                <StyledTableCell sx={COMPACT_CELL}>
                  <div>{item.productDescription}</div>
                  {item.additionalDetails && (
                    <S.DocumentMeta>{item.additionalDetails}</S.DocumentMeta>
                  )}
                </StyledTableCell>
                <StyledTableCell sx={COMPACT_CELL}>
                  <Chip
                    label={item.coreOrSub}
                    size="small"
                    color={item.coreOrSub === 'CORE' ? 'primary' : 'default'}
                    variant="outlined"
                  />
                </StyledTableCell>
                <StyledTableCell sx={COMPACT_CELL}>
                  {item.invoiced ? (
                    <Tooltip title={linkedInvoice ? `Part of ${linkedInvoice.invoiceNumber || `Invoice #${linkedInvoice.id}`}` : 'Already invoiced'}>
                      <Chip
                        label={linkedInvoice
                          ? linkedInvoice.invoiceNumber || `#${linkedInvoice.id}`
                          : 'Invoiced'}
                        size="small"
                        color="warning"
                        variant="filled"
                        icon={<ReceiptLongIcon style={{ fontSize: '0.75rem' }} />}
                        sx={{ fontSize: '0.7rem', height: 20, cursor: 'default' }}
                      />
                    </Tooltip>
                  ) : (
                    <Chip label="Available" size="small" color="success" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
                  )}
                </StyledTableCell>
                <StyledTableCell align="right" sx={COMPACT_CELL}>{fmt(item.unitPrice)}</StyledTableCell>
                <StyledTableCell align="right" sx={COMPACT_CELL}>{item.quantity}</StyledTableCell>
                <StyledTableCell align="right" sx={COMPACT_CELL}>
                  {item.vatRate !== undefined ? `${item.vatRate}%` : '—'}
                </StyledTableCell>
                <StyledTableCell align="right" sx={COMPACT_CELL}>{fmt(item.netAmount)}</StyledTableCell>
                <StyledTableCell align="right" sx={COMPACT_CELL}>{fmt(item.vatAmount)}</StyledTableCell>
                <StyledTableCell align="right" sx={COMPACT_CELL}>{fmt(item.totalAmount)}</StyledTableCell>
                <ActionsCell sx={COMPACT_CELL} onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="Unlink from estimate">
                    <IconButton size="small" onClick={() => handleUnlink(item)} color="error">
                      <LinkOffIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                  </Tooltip>
                </ActionsCell>
              </StyledTableRow>
              );
            })}

            {showAddRow && (
              <StyledTableRow>
                <StyledTableCell sx={{ ...COMPACT_CELL, width: 36 }} />

                {/* Code — freeSolo autocomplete */}
                <StyledTableCell sx={{ ...COMPACT_CELL, minWidth: 150 }}>
                  <Autocomplete
                    freeSolo
                    size="small"
                    options={availableLineItems}
                    loading={pickerLoading}
                    getOptionLabel={(opt) => typeof opt === 'string' ? opt : opt.productCode || ''}
                    inputValue={newItem.productCode}
                    onInputChange={(_, value, reason) => {
                      setNewItem((prev) => ({ ...prev, productCode: value }));
                      if (reason === 'input') setSelectedExistingId(null);
                    }}
                    onChange={(_, value) => {
                      if (value && typeof value !== 'string') {
                        setNewItem({
                          productCode: value.productCode || '',
                          productDescription: value.productDescription || '',
                          coreOrSub: (value.coreOrSub || 'CORE') as 'CORE' | 'SUB',
                          unitPrice: String(value.unitPrice ?? ''),
                          quantity: String(value.quantity ?? '1'),
                          vatRate: String(value.vatRate ?? '0'),
                        });
                        setSelectedExistingId(value.id ?? null);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Product code..."
                        sx={FIELD_SX}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>{pickerLoading && <CircularProgress size={12} />}{params.InputProps.endAdornment}</>
                          ),
                        }}
                      />
                    )}
                  />
                </StyledTableCell>

                {/* Description */}
                <StyledTableCell sx={{ ...COMPACT_CELL, minWidth: 160 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Description..."
                    value={newItem.productDescription}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, productDescription: e.target.value }))}
                    sx={FIELD_SX}
                  />
                </StyledTableCell>

                {/* Type */}
                <StyledTableCell sx={{ ...COMPACT_CELL, minWidth: 85 }}>
                  <Select
                    size="small"
                    value={newItem.coreOrSub}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, coreOrSub: e.target.value as 'CORE' | 'SUB' }))}
                    sx={{ fontSize: '0.8125rem' }}
                  >
                    <MenuItem value="CORE">CORE</MenuItem>
                    <MenuItem value="SUB">SUB</MenuItem>
                  </Select>
                </StyledTableCell>

                {/* Status — empty for new rows */}
                <StyledTableCell sx={COMPACT_CELL} />

                {/* Unit Price */}
                <StyledTableCell sx={{ ...COMPACT_CELL, minWidth: 120 }}>
                  <TextField
                    size="small"
                    type="number"
                    placeholder="0.00"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, unitPrice: e.target.value }))}
                    inputProps={{ min: 0, step: 0.01 }}
                    sx={{ ...FIELD_SX, width: 110, '& input': { textAlign: 'right' } }}
                  />
                </StyledTableCell>

                {/* Qty */}
                <StyledTableCell sx={{ ...COMPACT_CELL, minWidth: 85 }}>
                  <TextField
                    size="small"
                    type="number"
                    placeholder="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, quantity: e.target.value }))}
                    inputProps={{ min: 1 }}
                    sx={{ ...FIELD_SX, width: 75, '& input': { textAlign: 'right' } }}
                  />
                </StyledTableCell>

                {/* VAT % */}
                <StyledTableCell sx={{ ...COMPACT_CELL, minWidth: 90 }}>
                  <TextField
                    size="small"
                    type="number"
                    placeholder="0"
                    value={newItem.vatRate}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, vatRate: e.target.value }))}
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                    sx={{ ...FIELD_SX, width: 80, '& input': { textAlign: 'right' } }}
                  />
                </StyledTableCell>

                <StyledTableCell align="right" sx={{ ...COMPACT_CELL, color: 'text.secondary' }}>{fmt(calcNet)}</StyledTableCell>
                <StyledTableCell align="right" sx={{ ...COMPACT_CELL, color: 'text.secondary' }}>{fmt(calcVat)}</StyledTableCell>
                <StyledTableCell align="right" sx={{ ...COMPACT_CELL, color: 'text.secondary' }}>{fmt(calcTotal)}</StyledTableCell>

                <ActionsCell sx={COMPACT_CELL}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Save">
                      <span>
                        <IconButton size="small" color="primary" onClick={handleSave} disabled={saving}>
                          {saving ? <CircularProgress size={12} /> : <CheckIcon sx={{ fontSize: '1rem' }} />}
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Cancel">
                      <IconButton size="small" onClick={handleCloseAddRow} disabled={saving}>
                        <CloseIcon sx={{ fontSize: '1rem' }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ActionsCell>
              </StyledTableRow>
            )}

            {!showAddRow && (
              <StyledTableRow sx={{ '&:hover': { background: 'inherit' } }}>
                <StyledTableCell colSpan={12} sx={COMPACT_CELL}>
                  <Box
                    onClick={() => handleOpenAddRow(linkedIds)}
                    sx={(theme) => ({
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 2,
                      py: 0.6,
                      borderRadius: '20px',
                      backgroundColor: theme.palette.buttonColors.primary,
                      color: theme.palette.buttonColors.primaryContrast,
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      fontFamily: 'Manrope, sans-serif',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: theme.palette.buttonColors.primaryHover },
                    })}
                  >
                    <AddIcon sx={{ fontSize: '1rem' }} />
                    Add New Line Item
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </StyledTableBody>
        </StyledTable>
      </StyledTableContainer>

      {/* ── Generated Invoices ── */}
      {invoices.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <S.EstimateTableHeader>
            <S.DetailsSectionTitle>Generated Invoices ({invoices.length})</S.DetailsSectionTitle>
          </S.EstimateTableHeader>

          <StyledTableContainer>
            <StyledTable>
              <StyledTableHead>
                <TableRow>
                  <StyledHeaderCell sx={{ ...COMPACT_CELL, width: 36, px: '8px' }} />
                  <StyledHeaderCell sx={COMPACT_CELL}>Invoice #</StyledHeaderCell>
                  <StyledHeaderCell sx={COMPACT_CELL}>Reference</StyledHeaderCell>
                  <StyledHeaderCell sx={COMPACT_CELL}>Due Date</StyledHeaderCell>
                  <StyledHeaderCell sx={COMPACT_CELL}>Created</StyledHeaderCell>
                  <StyledHeaderCell align="right" sx={COMPACT_CELL}>Net</StyledHeaderCell>
                  <StyledHeaderCell align="right" sx={COMPACT_CELL}>VAT</StyledHeaderCell>
                  <StyledHeaderCell align="right" sx={COMPACT_CELL}>Total</StyledHeaderCell>
                  <ActionsCell as={StyledHeaderCell} sx={COMPACT_CELL}>PDF</ActionsCell>
                </TableRow>
              </StyledTableHead>

              <StyledTableBody>
                {invoices.map((inv) => {
                  const isExpanded = expandedInvoiceIds.has(inv.id!);
                  const invLineItems: LineItemResponse[] = inv.lineItems || [];
                  return (
                    <React.Fragment key={inv.id}>
                      {/* Invoice summary row */}
                      <StyledTableRow
                        onClick={() => toggleInvoiceExpand(inv.id!)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <StyledTableCell sx={{ ...COMPACT_CELL, width: 36, px: '8px' }}>
                          <IconButton size="small" sx={{ p: 0 }}>
                            {isExpanded
                              ? <KeyboardArrowDownIcon sx={{ fontSize: '1rem' }} />
                              : <KeyboardArrowRightIcon sx={{ fontSize: '1rem' }} />}
                          </IconButton>
                        </StyledTableCell>
                        <StyledTableCell sx={COMPACT_CELL}>
                          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 'inherit' }}>
                            {inv.invoiceNumber || `#${inv.id}`}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell sx={COMPACT_CELL}>{inv.reference || '—'}</StyledTableCell>
                        <StyledTableCell sx={COMPACT_CELL}>
                          {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}
                        </StyledTableCell>
                        <StyledTableCell sx={COMPACT_CELL}>
                          {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '—'}
                        </StyledTableCell>
                        <StyledTableCell align="right" sx={COMPACT_CELL}>{fmt(inv.totalNet)}</StyledTableCell>
                        <StyledTableCell align="right" sx={COMPACT_CELL}>{fmt(inv.totalVat)}</StyledTableCell>
                        <StyledTableCell align="right" sx={{ ...COMPACT_CELL, fontWeight: 600 }}>{fmt(inv.grandTotal)}</StyledTableCell>
                        <ActionsCell sx={COMPACT_CELL} onClick={(e) => e.stopPropagation()}>
                          <Tooltip title="View PDF">
                            <span>
                              <IconButton
                                size="small"
                                color="primary"
                                disabled={!inv.presignedUrl}
                                onClick={() => inv.presignedUrl && window.open(inv.presignedUrl, '_blank', 'noopener,noreferrer')}
                              >
                                <OpenInNewIcon sx={{ fontSize: '1rem' }} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </ActionsCell>
                      </StyledTableRow>

                      {/* Expanded line items for this invoice */}
                      <TableRow sx={{ p: 0 }}>
                        <StyledTableCell colSpan={9} sx={{ p: 0, border: 0 }}>
                          <Collapse in={isExpanded} unmountOnExit>
                            <Box sx={(theme) => ({ backgroundColor: theme.palette.action.hover, px: 2, py: 1 })}>
                              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 0.75 }}>
                                Line Items ({invLineItems.length})
                              </Typography>
                              <StyledTable size="small">
                                <StyledTableHead>
                                  <TableRow>
                                    <StyledHeaderCell sx={COMPACT_CELL}>Product Code</StyledHeaderCell>
                                    <StyledHeaderCell sx={COMPACT_CELL}>Description</StyledHeaderCell>
                                    <StyledHeaderCell sx={COMPACT_CELL}>Type</StyledHeaderCell>
                                    <StyledHeaderCell align="right" sx={COMPACT_CELL}>Unit Price</StyledHeaderCell>
                                    <StyledHeaderCell align="right" sx={COMPACT_CELL}>Qty</StyledHeaderCell>
                                    <StyledHeaderCell align="right" sx={COMPACT_CELL}>VAT %</StyledHeaderCell>
                                    <StyledHeaderCell align="right" sx={COMPACT_CELL}>Net</StyledHeaderCell>
                                    <StyledHeaderCell align="right" sx={COMPACT_CELL}>Total</StyledHeaderCell>
                                  </TableRow>
                                </StyledTableHead>
                                <StyledTableBody>
                                  {invLineItems.map((li) => (
                                    <StyledTableRow key={li.id}>
                                      <StyledTableCell sx={COMPACT_CELL}>{li.productCode}</StyledTableCell>
                                      <StyledTableCell sx={COMPACT_CELL}>{li.productDescription}</StyledTableCell>
                                      <StyledTableCell sx={COMPACT_CELL}>
                                        <Chip
                                          label={li.coreOrSub}
                                          size="small"
                                          color={li.coreOrSub === 'CORE' ? 'primary' : 'default'}
                                          variant="outlined"
                                        />
                                      </StyledTableCell>
                                      <StyledTableCell align="right" sx={COMPACT_CELL}>{fmt(li.unitPrice)}</StyledTableCell>
                                      <StyledTableCell align="right" sx={COMPACT_CELL}>{li.quantity}</StyledTableCell>
                                      <StyledTableCell align="right" sx={COMPACT_CELL}>
                                        {li.vatRate !== undefined ? `${li.vatRate}%` : '—'}
                                      </StyledTableCell>
                                      <StyledTableCell align="right" sx={COMPACT_CELL}>{fmt(li.netAmount)}</StyledTableCell>
                                      <StyledTableCell align="right" sx={{ ...COMPACT_CELL, fontWeight: 600 }}>{fmt(li.totalAmount)}</StyledTableCell>
                                    </StyledTableRow>
                                  ))}
                                </StyledTableBody>
                              </StyledTable>
                            </Box>
                          </Collapse>
                        </StyledTableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </StyledTableBody>
            </StyledTable>
          </StyledTableContainer>
        </>
      )}
    </>
  );
};
