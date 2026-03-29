import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Chip,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import type { JobResponse, EstimateResponse, LineItemResponse, LineItemCreateRequest } from '../../../../../services/api';
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

const FIELD_SX = { '& .MuiInputBase-root': { fontSize: '0.875rem' } };

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

  const fetchEstimate = useCallback(async () => {
    if (!job.id) return;
    try {
      setLoading(true);
      const res = await estimateService.getByJobId(job.id);
      setEstimate(res.data);
    } catch {
      showError('Failed to load estimate');
    } finally {
      setLoading(false);
    }
  }, [job.id, showError]);

  useEffect(() => {
    fetchEstimate();
  }, [fetchEstimate]);

  const handleUnlink = useCallback(
    async (lineItem: LineItemResponse) => {
      if (!estimate?.id || !lineItem.id) return;
      try {
        const res = await estimateService.unlinkLineItem(estimate.id, lineItem.id);
        setEstimate(res.data);
      } catch {
        showError('Failed to remove line item');
      }
    },
    [estimate?.id, showError]
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
    if (!newItem.productCode.trim()) {
      showError('Product code is required');
      return;
    }
    if (!newItem.productDescription.trim() && !selectedExistingId) {
      showError('Description is required');
      return;
    }
    setSaving(true);
    try {
      let res;
      if (selectedExistingId) {
        res = await estimateService.linkExistingLineItem(estimate.id, selectedExistingId);
      } else {
        const payload: LineItemCreateRequest = {
          productCode: newItem.productCode.trim(),
          productDescription: newItem.productDescription.trim(),
          coreOrSub: newItem.coreOrSub,
          unitPrice: parseFloat(newItem.unitPrice) || 0,
          quantity: parseInt(newItem.quantity) || 1,
          vatRate: parseFloat(newItem.vatRate) || 0,
        };
        res = await estimateService.createAndLinkLineItem(estimate.id, payload);
      }
      setEstimate(res.data);
      handleCloseAddRow();
    } catch {
      showError('Failed to add line item');
    } finally {
      setSaving(false);
    }
  }, [estimate?.id, newItem, selectedExistingId, showError, handleCloseAddRow]);

  const handleCreateInvoice = useCallback(() => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.LARGE,
      fieldName: 'createInvoice',
      children: (
        <CreateInvoiceModal
          job={job}
          lineItems={estimate?.lineItems || []}
          onSuccess={() => resetGlobalModalOuterProps()}
        />
      ),
    });
  }, [job, estimate?.lineItems, setGlobalModalOuterProps, resetGlobalModalOuterProps]);

  const fmt = (val?: number) => (val !== undefined ? `£${val.toFixed(2)}` : '—');

  const calcNet = useMemo(() => {
    const price = parseFloat(newItem.unitPrice) || 0;
    const qty = parseInt(newItem.quantity) || 0;
    return price * qty;
  }, [newItem.unitPrice, newItem.quantity]);

  const calcVat = useMemo(() => calcNet * ((parseFloat(newItem.vatRate) || 0) / 100), [calcNet, newItem.vatRate]);
  const calcTotal = calcNet + calcVat;

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
        <S.DetailsSectionTitle>Line Items ({lineItems.length})</S.DetailsSectionTitle>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" color="primary" onClick={handleCreateInvoice}>
            Create Invoice
          </Button>
        </Box>
      </S.EstimateTableHeader>

      <StyledTableContainer>
        <StyledTable>
          <StyledTableHead>
            <TableRow>
              <StyledHeaderCell>Code</StyledHeaderCell>
              <StyledHeaderCell>Description</StyledHeaderCell>
              <StyledHeaderCell>Type</StyledHeaderCell>
              <StyledHeaderCell align="right">Unit Price</StyledHeaderCell>
              <StyledHeaderCell align="right">Qty</StyledHeaderCell>
              <StyledHeaderCell align="right">VAT %</StyledHeaderCell>
              <StyledHeaderCell align="right">Net</StyledHeaderCell>
              <StyledHeaderCell align="right">VAT</StyledHeaderCell>
              <StyledHeaderCell align="right">Total</StyledHeaderCell>
              <ActionsCell as={StyledHeaderCell}>Actions</ActionsCell>
            </TableRow>
          </StyledTableHead>

          <StyledTableBody>
            {lineItems.length === 0 && !showAddRow && (
              <StyledTableRow>
                <StyledTableCell colSpan={10} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                  No line items yet
                </StyledTableCell>
              </StyledTableRow>
            )}

            {lineItems.map((item) => (
              <StyledTableRow key={item.id}>
                <StyledTableCell>{item.productCode}</StyledTableCell>
                <StyledTableCell>
                  <div>{item.productDescription}</div>
                  {item.additionalDetails && (
                    <S.DocumentMeta>{item.additionalDetails}</S.DocumentMeta>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  <Chip
                    label={item.coreOrSub}
                    size="small"
                    color={item.coreOrSub === 'CORE' ? 'primary' : 'default'}
                    variant="outlined"
                  />
                </StyledTableCell>
                <StyledTableCell align="right">{fmt(item.unitPrice)}</StyledTableCell>
                <StyledTableCell align="right">{item.quantity}</StyledTableCell>
                <StyledTableCell align="right">
                  {item.vatRate !== undefined ? `${item.vatRate}%` : '—'}
                </StyledTableCell>
                <StyledTableCell align="right">{fmt(item.netAmount)}</StyledTableCell>
                <StyledTableCell align="right">{fmt(item.vatAmount)}</StyledTableCell>
                <StyledTableCell align="right">{fmt(item.totalAmount)}</StyledTableCell>
                <ActionsCell>
                  <Tooltip title="Unlink from estimate">
                    <IconButton size="small" onClick={() => handleUnlink(item)} color="error">
                      <LinkOffIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ActionsCell>
              </StyledTableRow>
            ))}

            {showAddRow && (
              <StyledTableRow>
                {/* Code — freeSolo autocomplete suggests existing items */}
                <StyledTableCell sx={{ minWidth: 160 }}>
                  <Autocomplete
                    freeSolo
                    size="small"
                    options={availableLineItems}
                    loading={pickerLoading}
                    getOptionLabel={(opt) =>
                      typeof opt === 'string' ? opt : opt.productCode || ''
                    }
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
                            <>
                              {pickerLoading && <CircularProgress size={14} />}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </StyledTableCell>

                {/* Description */}
                <StyledTableCell sx={{ minWidth: 180 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Description..."
                    value={newItem.productDescription}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, productDescription: e.target.value }))
                    }
                    sx={FIELD_SX}
                  />
                </StyledTableCell>

                {/* Type */}
                <StyledTableCell sx={{ minWidth: 90 }}>
                  <Select
                    size="small"
                    value={newItem.coreOrSub}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        coreOrSub: e.target.value as 'CORE' | 'SUB',
                      }))
                    }
                    sx={{ fontSize: '0.875rem' }}
                  >
                    <MenuItem value="CORE">CORE</MenuItem>
                    <MenuItem value="SUB">SUB</MenuItem>
                  </Select>
                </StyledTableCell>

                {/* Unit Price */}
                <StyledTableCell sx={{ minWidth: 130 }}>
                  <TextField
                    size="small"
                    type="number"
                    placeholder="0.00"
                    value={newItem.unitPrice}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, unitPrice: e.target.value }))
                    }
                    inputProps={{ min: 0, step: 0.01 }}
                    sx={{ ...FIELD_SX, width: 120, '& input': { textAlign: 'right' } }}
                  />
                </StyledTableCell>

                {/* Qty */}
                <StyledTableCell sx={{ minWidth: 100 }}>
                  <TextField
                    size="small"
                    type="number"
                    placeholder="1"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, quantity: e.target.value }))
                    }
                    inputProps={{ min: 1 }}
                    sx={{ ...FIELD_SX, width: 90, '& input': { textAlign: 'right' } }}
                  />
                </StyledTableCell>

                {/* VAT % */}
                <StyledTableCell sx={{ minWidth: 110 }}>
                  <TextField
                    size="small"
                    type="number"
                    placeholder="0"
                    value={newItem.vatRate}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, vatRate: e.target.value }))
                    }
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                    sx={{ ...FIELD_SX, width: 100, '& input': { textAlign: 'right' } }}
                  />
                </StyledTableCell>

                {/* Calculated: Net */}
                <StyledTableCell align="right" sx={{ color: 'text.secondary' }}>
                  {fmt(calcNet)}
                </StyledTableCell>

                {/* Calculated: VAT */}
                <StyledTableCell align="right" sx={{ color: 'text.secondary' }}>
                  {fmt(calcVat)}
                </StyledTableCell>

                {/* Calculated: Total */}
                <StyledTableCell align="right" sx={{ color: 'text.secondary' }}>
                  {fmt(calcTotal)}
                </StyledTableCell>

                {/* Actions */}
                <ActionsCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Save">
                      <span>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? <CircularProgress size={14} /> : <CheckIcon fontSize="small" />}
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Cancel">
                      <IconButton size="small" onClick={handleCloseAddRow} disabled={saving}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ActionsCell>
              </StyledTableRow>
            )}

            {!showAddRow && (
              <StyledTableRow sx={{ '&:hover': { background: 'inherit' } }}>
                <StyledTableCell colSpan={10}>
                  <Box
                    onClick={() => handleOpenAddRow(linkedIds)}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 2,
                      py: 0.75,
                      borderRadius: '20px',
                      backgroundColor: 'primary.main',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      fontFamily: 'Manrope, sans-serif',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'primary.dark' },
                    }}
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
    </>
  );
};
