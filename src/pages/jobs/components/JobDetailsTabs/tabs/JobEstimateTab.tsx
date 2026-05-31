import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Chip,
  Collapse,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  TextField,
  Autocomplete,
  Menu,
  MenuItem,
  Checkbox,
  Typography,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LockIcon from '@mui/icons-material/Lock';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import type {
  JobResponse,
  EstimateResponse,
  EstimateLineItemResponse,
  LineItemResponse,
  LineItemCreateRequest,
  LineItemUpdateRequest,
  InvoiceResponse,
  EstimateDocumentResponse,
  EstimateDocumentLineItemSnapshotResponse,
} from '../../../../../services/api';
import {
  estimateService,
  lineItemService,
  EstimateLineItemResponseStatusEnum,
  LineItemStatusUpdateRequestStatusEnum,
} from '../../../../../services/api';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { useCurrency } from '../../../../../contexts/CurrencyContext';
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
import { CreateEstimateDocumentModal } from './CreateEstimateDocumentModal';
import * as S from '../../../JobDetailsPage.styles';

interface JobEstimateTabProps {
  job: JobResponse;
}

const CC = { py: '5px', px: '10px', fontSize: '0.8125rem' };
const FIELD_SX = { '& .MuiInputBase-root': { fontSize: '0.8125rem' } };

const defaultNewItem = {
  productCode: '',
  productDescription: '',
  unitPrice: '',
  quantity: '1',
  vatRate: '0',
};

type ItemStatus = 'AVAILABLE' | 'WAITING_APPROVAL' | 'APPROVED' | 'INVOICED';

const STATUS_CHIP: Record<ItemStatus, { label: string; color: 'default' | 'success' | 'warning' | 'info'; sx?: object }> = {
  AVAILABLE:         { label: 'Available',         color: 'success' },
  WAITING_APPROVAL:  { label: 'Waiting Approval',  color: 'warning' },
  APPROVED:          { label: 'Approved',           color: 'info' },
  INVOICED:          { label: 'Invoiced',           color: 'default', sx: { backgroundColor: '#D1FAE5', color: '#065F46' } },
};

export const JobEstimateTab: React.FC<JobEstimateTabProps> = ({ job }) => {
  const { showError } = useSnackbar();
  const { formatCurrency: fmt } = useCurrency();
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

  // Per-item approve state
  const [approvingIds, setApprovingIds] = useState<Set<number>>(new Set());

  // Inline edit state
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState(defaultNewItem);
  const [editSaving, setEditSaving] = useState(false);

  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [expandedInvoiceIds, setExpandedInvoiceIds] = useState<Set<number>>(new Set());

  const [estimateDocs, setEstimateDocs] = useState<EstimateDocumentResponse[]>([]);
  const [expandedDocIds, setExpandedDocIds] = useState<Set<number>>(new Set());
  const [openingDocId, setOpeningDocId] = useState<number | null>(null);

  const [docTab, setDocTab] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuLineItemId, setMenuLineItemId] = useState<number | null>(null);

  // ── Fetching ───────────────────────────────────────────────────

  const fetchInvoices = useCallback(async (estimateId: number) => {
    try {
      const res = await estimateService.listInvoicesForEstimate(estimateId);
      const data = Array.isArray(res.data) ? res.data : [];
      setInvoices(data.slice().sort((a, b) =>
        (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
        (a.createdAt ? new Date(a.createdAt).getTime() : 0)
      ));
    } catch { /* non-critical */ }
  }, []);

  const fetchEstimateDocs = useCallback(async (estimateId: number) => {
    try {
      const res = await estimateService.listEstimateDocuments(estimateId);
      const data = Array.isArray(res.data) ? res.data : [];
      setEstimateDocs(data.slice().sort((a, b) =>
        (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
        (a.createdAt ? new Date(a.createdAt).getTime() : 0)
      ));
    } catch { /* non-critical */ }
  }, []);

  const fetchEstimate = useCallback(async () => {
    if (!job.id) return;
    try {
      setLoading(true);
      const res = await estimateService.getByJobId(job.id);
      setEstimate(res.data);
      if (res.data?.id) {
        await fetchInvoices(res.data.id);
        await fetchEstimateDocs(res.data.id);
      }
    } catch {
      showError('Failed to load estimate');
    } finally {
      setLoading(false);
    }
  }, [job.id, showError, fetchInvoices, fetchEstimateDocs]);

  useEffect(() => { fetchEstimate(); }, [fetchEstimate]);

  // ── Derived ────────────────────────────────────────────────────

  const lineItemInvoiceMap = useMemo(() => {
    const map = new Map<number, InvoiceResponse>();
    invoices.forEach((inv) =>
      (inv.lineItems || []).forEach((li) => {
        const key = li.sourceLineItemId ?? li.id;
        if (key !== undefined) map.set(key, inv);
      })
    );
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

  const lineItems: EstimateLineItemResponse[] = estimate.lineItems || [];

  const getStatus = (li: EstimateLineItemResponse): ItemStatus =>
    (li.status as ItemStatus) ?? 'AVAILABLE';

  const isInvoiced = (li: EstimateLineItemResponse) =>
    getStatus(li) === EstimateLineItemResponseStatusEnum.Invoiced;

  const selectableItems = lineItems.filter((li) => !isInvoiced(li));
  const allSelected = selectableItems.length > 0 && selectableItems.every((li) => selectedIds.has(li.id!));
  const someSelected = selectableItems.some((li) => selectedIds.has(li.id!));

  const linkedSourceIds = lineItems.map((li) => li.sourceLineItemId).filter((id): id is number => id != null);

  // ── Handlers ──────────────────────────────────────────────────

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

  const toggleDocExpand = (id: number) => {
    setExpandedDocIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleInvoiceExpand = (id: number) => {
    setExpandedInvoiceIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, id: number) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setMenuLineItemId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuLineItemId(null);
  };

  const handleUnlink = async (item: EstimateLineItemResponse) => {
    if (!estimate?.id || !item.id) return;
    handleMenuClose();
    try {
      await estimateService.unlinkLineItem(estimate.id, item.id);
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(item.id!); return next; });
      await fetchEstimate();
    } catch {
      showError('Failed to remove line item');
    }
  };

  const handleApproveItem = async (itemId: number) => {
    if (!estimate?.id) return;
    setApprovingIds((prev) => new Set(prev).add(itemId));
    try {
      const res = await estimateService.updateLineItemStatus(estimate.id, itemId, {
        status: LineItemStatusUpdateRequestStatusEnum.Approved,
      });
      setEstimate(res.data);
    } catch {
      showError('Failed to approve item');
    } finally {
      setApprovingIds((prev) => { const next = new Set(prev); next.delete(itemId); return next; });
    }
  };

  const handleStartEdit = (item: EstimateLineItemResponse) => {
    handleMenuClose();
    setEditingItemId(item.id!);
    setEditItem({
      productCode: item.productCode || '',
      productDescription: item.productDescription || '',
      unitPrice: String(item.unitPrice ?? ''),
      quantity: String(item.quantity ?? '1'),
      vatRate: String(item.vatRate ?? '0'),
    });
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditItem(defaultNewItem);
  };

  const handleSaveEdit = async () => {
    if (!estimate?.id || !editingItemId) return;
    if (!editItem.productCode.trim()) { showError('Product code is required'); return; }
    setEditSaving(true);
    try {
      const payload: LineItemUpdateRequest = {
        productCode: editItem.productCode.trim(),
        productDescription: editItem.productDescription.trim(),
        unitPrice: parseFloat(editItem.unitPrice) || 0,
        quantity: parseFloat(editItem.quantity) || 1,
        vatRate: parseFloat(editItem.vatRate) || 0,
      };
      const res = await estimateService.updateLineItem(estimate.id, editingItemId, payload);
      setEstimate(res.data);
      handleCancelEdit();
    } catch {
      showError('Failed to update line item');
    } finally {
      setEditSaving(false);
    }
  };

  const handleOpenAddRow = async () => {
    setShowAddRow(true);
    setNewItem(defaultNewItem);
    setSelectedExistingId(null);
    setPickerLoading(true);
    try {
      const res = await lineItemService.getAll();
      const all: LineItemResponse[] = Array.isArray(res.data) ? res.data : [];
      setAvailableLineItems(all.filter((item) => item.id !== undefined && !linkedSourceIds.includes(item.id!)));
    } catch {
      showError('Failed to load existing line items');
    } finally {
      setPickerLoading(false);
    }
  };

  const handleCloseAddRow = () => {
    setShowAddRow(false);
    setNewItem(defaultNewItem);
    setSelectedExistingId(null);
  };

  const handleSave = async () => {
    if (!estimate?.id) return;
    if (!newItem.productCode.trim()) { showError('Product code is required'); return; }
    if (!selectedExistingId && !newItem.productDescription.trim()) { showError('Description is required'); return; }
    setSaving(true);
    try {
      if (selectedExistingId) {
        await estimateService.linkExistingLineItem(estimate.id, selectedExistingId);
      } else {
        const payload: LineItemCreateRequest = {
          productCode: newItem.productCode.trim(),
          productDescription: newItem.productDescription.trim(),
          unitPrice: parseFloat(newItem.unitPrice) || 0,
          quantity: parseInt(newItem.quantity) || 1,
          vatRate: parseFloat(newItem.vatRate) || 0,
        };
        await estimateService.createAndLinkLineItem(estimate.id, payload);
      }
      handleCloseAddRow();
      await fetchEstimate();
    } catch {
      showError('Failed to add line item');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateInvoice = () => {
    if (selectedIds.size === 0) { showError('Select at least one line item'); return; }
    const invoiceLineItems = lineItems.filter(
      (li) => li.id !== undefined && selectedIds.has(li.id!) && !isInvoiced(li)
    );
    if (invoiceLineItems.length === 0) { showError('All selected line items are already invoiced'); return; }
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.LARGE,
      fieldName: 'createInvoice',
      children: (
        <CreateInvoiceModal
          estimateId={estimate!.id!}
          lineItems={invoiceLineItems}
          onSuccess={() => { resetGlobalModalOuterProps(); setSelectedIds(new Set()); fetchEstimate(); }}
        />
      ),
    });
  };

  const handleGenerateEstimatePdf = () => {
    if (selectedIds.size === 0) { showError('Select at least one line item'); return; }
    const selectedLineItems = lineItems.filter(
      (li) => li.id !== undefined && selectedIds.has(li.id!)
    );
    if (selectedLineItems.length === 0) { showError('No valid line items selected'); return; }
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.LARGE,
      fieldName: 'createEstimateDocument',
      children: (
        <CreateEstimateDocumentModal
          estimateId={estimate!.id!}
          lineItems={selectedLineItems}
          onSuccess={() => { resetGlobalModalOuterProps(); setSelectedIds(new Set()); fetchEstimate(); }}
        />
      ),
    });
  };

  const handleOpenEstimateDoc = async (docId: number) => {
    setOpeningDocId(docId);
    try {
      const res = await estimateService.getEstimateDocument(docId);
      const url = res.data?.presignedUrl;
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      showError('Failed to fetch estimate PDF. Please try again.');
    } finally {
      setOpeningDocId(null);
    }
  };

  const calcNet = (() => {
    const price = parseFloat(newItem.unitPrice) || 0;
    const qty = parseFloat(newItem.quantity) || 1;
    return price * qty;
  })();
  const calcVat = (() => {
    const rate = parseFloat(newItem.vatRate);
    return isNaN(rate) ? 0 : calcNet * (rate / 100);
  })();
  const calcTotal = calcNet + calcVat;

  // ── Document tables ────────────────────────────────────────────

  const renderEstimatesTable = () => (
    estimateDocs.length === 0 ? (
      <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
        No estimate PDFs generated yet
      </Typography>
    ) : (
      <StyledTableContainer>
        <StyledTable>
          <StyledTableHead>
            <TableRow>
              <StyledHeaderCell sx={{ ...CC, width: 36, px: '8px' }} />
              <StyledHeaderCell sx={CC}>Document</StyledHeaderCell>
              <StyledHeaderCell sx={CC}>Reference</StyledHeaderCell>
              <StyledHeaderCell sx={CC}>Valid Until</StyledHeaderCell>
              <StyledHeaderCell align="right" sx={CC}>Net</StyledHeaderCell>
              <StyledHeaderCell align="right" sx={CC}>VAT</StyledHeaderCell>
              <StyledHeaderCell align="right" sx={CC}>Total</StyledHeaderCell>
              <ActionsCell as={StyledHeaderCell} sx={CC} />
            </TableRow>
          </StyledTableHead>
          <StyledTableBody>
            {estimateDocs.map((doc) => {
              const isExpanded = expandedDocIds.has(doc.id!);
              const snapshots: EstimateDocumentLineItemSnapshotResponse[] = doc.lineItems || [];
              return (
                <React.Fragment key={doc.id}>
                  <StyledTableRow onClick={() => toggleDocExpand(doc.id!)} sx={{ cursor: 'pointer' }}>
                    <StyledTableCell sx={{ ...CC, width: 36, px: '8px' }}>
                      <IconButton size="small" sx={{ p: 0 }}>
                        {isExpanded
                          ? <KeyboardArrowDownIcon sx={{ fontSize: '1rem' }} />
                          : <KeyboardArrowRightIcon sx={{ fontSize: '1rem' }} />}
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell sx={CC}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PictureAsPdfIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 'inherit' }}>
                          {doc.documentNumber || `#${doc.id}`}
                        </Typography>
                      </Box>
                      {doc.createdAt && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Created {new Date(doc.createdAt).toLocaleDateString()}
                        </Typography>
                      )}
                    </StyledTableCell>
                    <StyledTableCell sx={CC}>{doc.reference || '—'}</StyledTableCell>
                    <StyledTableCell sx={CC}>
                      {doc.validUntil ? new Date(doc.validUntil).toLocaleDateString() : '—'}
                    </StyledTableCell>
                    <StyledTableCell align="right" sx={CC}>{fmt(doc.totalNet)}</StyledTableCell>
                    <StyledTableCell align="right" sx={CC}>{fmt(doc.totalVat)}</StyledTableCell>
                    <StyledTableCell align="right" sx={{ ...CC, fontWeight: 600 }}>{fmt(doc.grandTotal)}</StyledTableCell>
                    <ActionsCell sx={CC} onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="Open PDF">
                        <span>
                          <IconButton
                            size="small" color="primary"
                            disabled={openingDocId === doc.id}
                            onClick={() => handleOpenEstimateDoc(doc.id!)}
                          >
                            {openingDocId === doc.id
                              ? <CircularProgress size={14} />
                              : <OpenInNewIcon sx={{ fontSize: '1rem' }} />}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </ActionsCell>
                  </StyledTableRow>
                  <TableRow sx={{ p: 0 }}>
                    <StyledTableCell colSpan={8} sx={{ p: 0, border: 0 }}>
                      <Collapse in={isExpanded} unmountOnExit>
                        <Box sx={{ backgroundColor: 'action.hover', px: 2, py: 1 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 0.75 }}>
                            Line Items ({snapshots.length})
                          </Typography>
                          <StyledTable size="small">
                            <StyledTableHead>
                              <TableRow>
                                <StyledHeaderCell sx={CC}>Product Code</StyledHeaderCell>
                                <StyledHeaderCell sx={CC}>Description</StyledHeaderCell>
                                <StyledHeaderCell align="right" sx={CC}>Unit</StyledHeaderCell>
                                <StyledHeaderCell align="right" sx={CC}>Qty</StyledHeaderCell>
                                <StyledHeaderCell align="right" sx={CC}>VAT%</StyledHeaderCell>
                                <StyledHeaderCell align="right" sx={CC}>Net</StyledHeaderCell>
                                <StyledHeaderCell align="right" sx={CC}>Total</StyledHeaderCell>
                              </TableRow>
                            </StyledTableHead>
                            <StyledTableBody>
                              {snapshots.map((snap) => (
                                <StyledTableRow key={snap.id}>
                                  <StyledTableCell sx={CC}>{snap.productCode}</StyledTableCell>
                                  <StyledTableCell sx={CC}>{snap.productDescription}</StyledTableCell>
                                  <StyledTableCell align="right" sx={CC}>{fmt(snap.unitPrice)}</StyledTableCell>
                                  <StyledTableCell align="right" sx={CC}>{snap.quantity}</StyledTableCell>
                                  <StyledTableCell align="right" sx={CC}>
                                    {snap.vatRate !== undefined ? `${snap.vatRate}%` : '—'}
                                  </StyledTableCell>
                                  <StyledTableCell align="right" sx={CC}>{fmt(snap.netAmount)}</StyledTableCell>
                                  <StyledTableCell align="right" sx={{ ...CC, fontWeight: 600 }}>
                                    {fmt(snap.totalAmount)}
                                  </StyledTableCell>
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
    )
  );

  const renderInvoicesTable = () => (
    invoices.length === 0 ? (
      <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
        No invoices generated yet
      </Typography>
    ) : (
      <StyledTableContainer>
        <StyledTable>
          <StyledTableHead>
            <TableRow>
              <StyledHeaderCell sx={{ ...CC, width: 36, px: '8px' }} />
              <StyledHeaderCell sx={CC}>Invoice #</StyledHeaderCell>
              <StyledHeaderCell sx={CC}>Reference</StyledHeaderCell>
              <StyledHeaderCell sx={CC}>Due Date</StyledHeaderCell>
              <StyledHeaderCell sx={CC}>Created</StyledHeaderCell>
              <StyledHeaderCell align="right" sx={CC}>Net</StyledHeaderCell>
              <StyledHeaderCell align="right" sx={CC}>VAT</StyledHeaderCell>
              <StyledHeaderCell align="right" sx={CC}>Total</StyledHeaderCell>
              <ActionsCell as={StyledHeaderCell} sx={CC}>PDF</ActionsCell>
            </TableRow>
          </StyledTableHead>
          <StyledTableBody>
            {invoices.map((inv) => {
              const isExpanded = expandedInvoiceIds.has(inv.id!);
              const invLineItems = inv.lineItems || [];
              return (
                <React.Fragment key={inv.id}>
                  <StyledTableRow onClick={() => toggleInvoiceExpand(inv.id!)} sx={{ cursor: 'pointer' }}>
                    <StyledTableCell sx={{ ...CC, width: 36, px: '8px' }}>
                      <IconButton size="small" sx={{ p: 0 }}>
                        {isExpanded
                          ? <KeyboardArrowDownIcon sx={{ fontSize: '1rem' }} />
                          : <KeyboardArrowRightIcon sx={{ fontSize: '1rem' }} />}
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell sx={CC}>
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 'inherit' }}>
                        {inv.invoiceNumber || `#${inv.id}`}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell sx={CC}>{inv.reference || '—'}</StyledTableCell>
                    <StyledTableCell sx={CC}>
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}
                    </StyledTableCell>
                    <StyledTableCell sx={CC}>
                      {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '—'}
                    </StyledTableCell>
                    <StyledTableCell align="right" sx={CC}>{fmt(inv.totalNet)}</StyledTableCell>
                    <StyledTableCell align="right" sx={CC}>{fmt(inv.totalVat)}</StyledTableCell>
                    <StyledTableCell align="right" sx={{ ...CC, fontWeight: 600 }}>{fmt(inv.grandTotal)}</StyledTableCell>
                    <ActionsCell sx={CC} onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="View PDF">
                        <span>
                          <IconButton
                            size="small" color="primary"
                            disabled={!inv.presignedUrl}
                            onClick={() => inv.presignedUrl && window.open(inv.presignedUrl, '_blank', 'noopener,noreferrer')}
                          >
                            <OpenInNewIcon sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </ActionsCell>
                  </StyledTableRow>
                  <TableRow sx={{ p: 0 }}>
                    <StyledTableCell colSpan={9} sx={{ p: 0, border: 0 }}>
                      <Collapse in={isExpanded} unmountOnExit>
                        <Box sx={{ backgroundColor: 'action.hover', px: 2, py: 1 }}>
                          <StyledTable size="small">
                            <StyledTableHead>
                              <TableRow>
                                <StyledHeaderCell sx={CC}>Product Code</StyledHeaderCell>
                                <StyledHeaderCell sx={CC}>Description</StyledHeaderCell>
                                <StyledHeaderCell align="right" sx={CC}>Unit</StyledHeaderCell>
                                <StyledHeaderCell align="right" sx={CC}>Qty</StyledHeaderCell>
                                <StyledHeaderCell align="right" sx={CC}>VAT%</StyledHeaderCell>
                                <StyledHeaderCell align="right" sx={CC}>Net</StyledHeaderCell>
                                <StyledHeaderCell align="right" sx={CC}>Total</StyledHeaderCell>
                              </TableRow>
                            </StyledTableHead>
                            <StyledTableBody>
                              {invLineItems.map((li) => (
                                <StyledTableRow key={li.id}>
                                  <StyledTableCell sx={CC}>{li.productCode}</StyledTableCell>
                                  <StyledTableCell sx={CC}>{li.productDescription}</StyledTableCell>
                                  <StyledTableCell align="right" sx={CC}>{fmt(li.unitPrice)}</StyledTableCell>
                                  <StyledTableCell align="right" sx={CC}>{li.quantity}</StyledTableCell>
                                  <StyledTableCell align="right" sx={CC}>
                                    {li.vatRate !== undefined ? `${li.vatRate}%` : '—'}
                                  </StyledTableCell>
                                  <StyledTableCell align="right" sx={CC}>{fmt(li.netAmount)}</StyledTableCell>
                                  <StyledTableCell align="right" sx={{ ...CC, fontWeight: 600 }}>
                                    {fmt(li.totalAmount)}
                                  </StyledTableCell>
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
    )
  );

  // ── Render ─────────────────────────────────────────────────────

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

      {/* ── Financial summary ── */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {[
          { label: 'Waiting Approval', value: estimate.waitingApprovalValue, color: '#F59E0B' },
          { label: 'Approved',         value: estimate.approvedValue,         color: '#10B981' },
          { label: 'Invoiced',         value: estimate.invoicedValue,         color: '#6366F1' },
        ].map(({ label, value, color }) => (
          <S.EstimateSummaryCard key={label} accentcolor={color}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}
              sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
              {label}
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5, color }}>
              {fmt(value)}
            </Typography>
          </S.EstimateSummaryCard>
        ))}
      </Box>

      {/* ── Section 1: Line Items ── */}
      <S.CollapsibleSection>
        {/* Header */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', flexWrap: 'wrap', gap: 1,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body1" fontWeight={600}>
              Line items ({lineItems.length})
            </Typography>
            {someSelected && (
              <Typography variant="body2" color="primary.main">
                · {selectedIds.size} selected
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined" color="primary"
              onClick={handleGenerateEstimatePdf}
              disabled={selectedIds.size === 0}
            >
              <ReceiptLongIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
              Generate estimate PDF
            </Button>
            <Button
              variant="outlined" color="primary"
              onClick={handleGenerateInvoice}
              disabled={selectedIds.size === 0}
            >
              Create invoice
            </Button>
          </Box>
        </Box>

        {/* Table */}
        <StyledTableContainer>
          <StyledTable>
            <StyledTableHead>
              <TableRow>
                <StyledHeaderCell sx={{ ...CC, width: 36, px: '8px' }}>
                  <Checkbox
                    size="small"
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    onChange={toggleAll}
                    disabled={selectableItems.length === 0}
                    sx={{ p: 0 }}
                  />
                </StyledHeaderCell>
                <StyledHeaderCell sx={CC}>Product Code</StyledHeaderCell>
                <StyledHeaderCell sx={CC}>Description</StyledHeaderCell>
                <StyledHeaderCell align="right" sx={CC}>Unit</StyledHeaderCell>
                <StyledHeaderCell align="right" sx={CC}>Qty</StyledHeaderCell>
                <StyledHeaderCell align="right" sx={CC}>VAT%</StyledHeaderCell>
                <StyledHeaderCell align="right" sx={CC}>Net</StyledHeaderCell>
                <StyledHeaderCell align="right" sx={CC}>VAT</StyledHeaderCell>
                <StyledHeaderCell align="right" sx={CC}>Total</StyledHeaderCell>
                <StyledHeaderCell sx={CC}>Status</StyledHeaderCell>
                <ActionsCell as={StyledHeaderCell} sx={CC} />
              </TableRow>
            </StyledTableHead>

            <StyledTableBody>
              {lineItems.length === 0 && !showAddRow ? (
                <StyledTableRow sx={{ '&:hover': { background: 'inherit' } }}>
                  <StyledTableCell colSpan={11} align="center" sx={{ ...CC, color: 'text.secondary', py: 3 }}>
                    No line items yet. Add one to get started.
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                lineItems.map((item) => {
                  const status = getStatus(item);
                  const invoiced = status === 'INVOICED';
                  const isEditing = editingItemId === item.id;
                  const isSelected = selectedIds.has(item.id!);
                  const linkedInvoice = invoiced ? lineItemInvoiceMap.get(item.id!) : undefined;
                  const chipConfig = STATUS_CHIP[status];
                  const isApproving = approvingIds.has(item.id!);

                  if (isEditing) {
                    const eNet = (parseFloat(editItem.unitPrice) || 0) * (parseFloat(editItem.quantity) || 1);
                    const eVat = eNet * ((parseFloat(editItem.vatRate) || 0) / 100);
                    return (
                      <StyledTableRow key={item.id}>
                        <StyledTableCell sx={{ ...CC, width: 36 }} />
                        <StyledTableCell sx={{ ...CC, minWidth: 130 }}>
                          <TextField size="small" fullWidth placeholder="Product code" value={editItem.productCode}
                            onChange={(e) => setEditItem((p) => ({ ...p, productCode: e.target.value }))} sx={FIELD_SX} />
                        </StyledTableCell>
                        <StyledTableCell sx={{ ...CC, minWidth: 160 }}>
                          <TextField size="small" fullWidth placeholder="Description" value={editItem.productDescription}
                            onChange={(e) => setEditItem((p) => ({ ...p, productDescription: e.target.value }))} sx={FIELD_SX} />
                        </StyledTableCell>
                        <StyledTableCell sx={{ ...CC, minWidth: 110 }}>
                          <TextField size="small" type="number" placeholder="0.00" value={editItem.unitPrice}
                            onChange={(e) => setEditItem((p) => ({ ...p, unitPrice: e.target.value }))}
                            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                            sx={{ ...FIELD_SX, width: 100, '& input': { textAlign: 'right' } }} />
                        </StyledTableCell>
                        <StyledTableCell sx={{ ...CC, minWidth: 80 }}>
                          <TextField size="small" type="number" placeholder="1" value={editItem.quantity}
                            onChange={(e) => setEditItem((p) => ({ ...p, quantity: e.target.value }))}
                            slotProps={{ htmlInput: { min: 1 } }}
                            sx={{ ...FIELD_SX, width: 70, '& input': { textAlign: 'right' } }} />
                        </StyledTableCell>
                        <StyledTableCell sx={{ ...CC, minWidth: 85 }}>
                          <TextField size="small" type="number" placeholder="0" value={editItem.vatRate}
                            onChange={(e) => setEditItem((p) => ({ ...p, vatRate: e.target.value }))}
                            slotProps={{ htmlInput: { min: 0, max: 100, step: 0.1 } }}
                            sx={{ ...FIELD_SX, width: 75, '& input': { textAlign: 'right' } }} />
                        </StyledTableCell>
                        <StyledTableCell align="right" sx={{ ...CC, color: 'text.secondary' }}>{fmt(eNet)}</StyledTableCell>
                        <StyledTableCell align="right" sx={{ ...CC, color: 'text.secondary' }}>{fmt(eVat)}</StyledTableCell>
                        <StyledTableCell align="right" sx={{ ...CC, color: 'text.secondary' }}>{fmt(eNet + eVat)}</StyledTableCell>
                        <StyledTableCell sx={CC} />
                        <ActionsCell sx={CC}>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Save">
                              <span>
                                <IconButton size="small" color="primary" onClick={handleSaveEdit} disabled={editSaving} aria-label="Save line item edit">
                                  {editSaving ? <CircularProgress size={12} /> : <CheckIcon sx={{ fontSize: '1rem' }} />}
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Cancel">
                              <IconButton size="small" onClick={handleCancelEdit} disabled={editSaving} aria-label="Cancel line item edit">
                                <CloseIcon sx={{ fontSize: '1rem' }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </ActionsCell>
                      </StyledTableRow>
                    );
                  }

                  return (
                    <StyledTableRow
                      key={item.id}
                      onClick={() => !invoiced && toggleRow(item.id!)}
                      sx={{
                        cursor: invoiced ? 'default' : 'pointer',
                        opacity: invoiced ? 0.7 : 1,
                        ...(isSelected ? { backgroundColor: 'action.selected' } : {}),
                      }}
                    >
                      <StyledTableCell sx={{ ...CC, width: 36, px: '8px' }}>
                        {invoiced ? (
                          <Tooltip title={linkedInvoice
                            ? `Part of ${linkedInvoice.invoiceNumber || `#${linkedInvoice.id}`}`
                            : 'Already invoiced'
                          }>
                            <LockIcon sx={{ fontSize: '0.85rem', color: 'text.disabled' }} />
                          </Tooltip>
                        ) : (
                          <Checkbox
                            size="small"
                            checked={isSelected}
                            onChange={() => toggleRow(item.id!)}
                            onClick={(e) => e.stopPropagation()}
                            sx={{ p: 0 }}
                          />
                        )}
                      </StyledTableCell>
                      <StyledTableCell sx={CC}>{item.productCode}</StyledTableCell>
                      <StyledTableCell sx={{ ...CC, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.productDescription}
                      </StyledTableCell>
                      <StyledTableCell align="right" sx={CC}>{fmt(item.unitPrice)}</StyledTableCell>
                      <StyledTableCell align="right" sx={CC}>{item.quantity}</StyledTableCell>
                      <StyledTableCell align="right" sx={CC}>
                        {item.vatRate !== undefined ? `${item.vatRate}%` : '—'}
                      </StyledTableCell>
                      <StyledTableCell align="right" sx={CC}>{fmt(item.netAmount)}</StyledTableCell>
                      <StyledTableCell align="right" sx={CC}>{fmt(item.vatAmount)}</StyledTableCell>
                      <StyledTableCell align="right" sx={{ ...CC, fontWeight: 600 }}>
                        {fmt(item.totalAmount)}
                      </StyledTableCell>
                      <StyledTableCell sx={CC}>
                        <Chip
                          label={chipConfig.label}
                          size="small"
                          color={chipConfig.color}
                          variant="filled"
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, ...chipConfig.sx }}
                        />
                      </StyledTableCell>
                      <ActionsCell sx={CC} onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {status === 'WAITING_APPROVAL' && (
                            <Tooltip title="Approve">
                              <span>
                                <Button
                                  variant="contained" color="success"
                                  disabled={isApproving}
                                  onClick={() => handleApproveItem(item.id!)}
                                  sx={{ minWidth: 0, padding: '2px 8px', fontSize: '0.7rem', height: 24 }}
                                >
                                  {isApproving ? <CircularProgress size={10} /> : 'Approve'}
                                </Button>
                              </span>
                            </Tooltip>
                          )}
                          {!invoiced && (
                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, item.id!)} aria-label="Line item actions">
                              <MoreVertIcon sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          )}
                        </Box>
                      </ActionsCell>
                    </StyledTableRow>
                  );
                })
              )}

              {/* Add row */}
              {showAddRow && (
                <StyledTableRow>
                  <StyledTableCell sx={{ ...CC, width: 36 }} />
                  <StyledTableCell sx={{ ...CC, minWidth: 150 }}>
                    <Autocomplete
                      freeSolo size="small" options={availableLineItems} loading={pickerLoading}
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
                            unitPrice: String(value.unitPrice ?? ''),
                            quantity: String(value.quantity ?? '1'),
                            vatRate: String(value.vatRate ?? '0'),
                          });
                          setSelectedExistingId(value.id ?? null);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params} placeholder="Product code..." sx={FIELD_SX}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {pickerLoading && <CircularProgress size={12} />}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </StyledTableCell>
                  <StyledTableCell sx={{ ...CC, minWidth: 160 }}>
                    <TextField size="small" fullWidth placeholder="Description..."
                      value={newItem.productDescription}
                      onChange={(e) => setNewItem((prev) => ({ ...prev, productDescription: e.target.value }))}
                      sx={FIELD_SX}
                    />
                  </StyledTableCell>
                  <StyledTableCell sx={{ ...CC, minWidth: 120 }}>
                    <TextField size="small" type="number" placeholder="0.00" value={newItem.unitPrice}
                      onChange={(e) => setNewItem((prev) => ({ ...prev, unitPrice: e.target.value }))}
                      slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                      sx={{ ...FIELD_SX, width: 110, '& input': { textAlign: 'right' } }}
                    />
                  </StyledTableCell>
                  <StyledTableCell sx={{ ...CC, minWidth: 85 }}>
                    <TextField size="small" type="number" placeholder="1" value={newItem.quantity}
                      onChange={(e) => setNewItem((prev) => ({ ...prev, quantity: e.target.value }))}
                      slotProps={{ htmlInput: { min: 1 } }}
                      sx={{ ...FIELD_SX, width: 75, '& input': { textAlign: 'right' } }}
                    />
                  </StyledTableCell>
                  <StyledTableCell sx={{ ...CC, minWidth: 90 }}>
                    <TextField size="small" type="number" placeholder="0" value={newItem.vatRate}
                      onChange={(e) => setNewItem((prev) => ({ ...prev, vatRate: e.target.value }))}
                      slotProps={{ htmlInput: { min: 0, max: 100, step: 0.1 } }}
                      sx={{ ...FIELD_SX, width: 80, '& input': { textAlign: 'right' } }}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right" sx={{ ...CC, color: 'text.secondary' }}>{fmt(calcNet)}</StyledTableCell>
                  <StyledTableCell align="right" sx={{ ...CC, color: 'text.secondary' }}>{fmt(calcVat)}</StyledTableCell>
                  <StyledTableCell align="right" sx={{ ...CC, color: 'text.secondary' }}>{fmt(calcTotal)}</StyledTableCell>
                  <StyledTableCell sx={CC} />
                  <ActionsCell sx={CC}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Save">
                        <span>
                          <IconButton size="small" color="primary" onClick={handleSave} disabled={saving} aria-label="Save new line item">
                            {saving ? <CircularProgress size={12} /> : <CheckIcon sx={{ fontSize: '1rem' }} />}
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <IconButton size="small" onClick={handleCloseAddRow} disabled={saving} aria-label="Cancel new line item">
                          <CloseIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ActionsCell>
                </StyledTableRow>
              )}
              {/* Add line item row */}
              {!showAddRow && (
                <StyledTableRow
                  onClick={handleOpenAddRow}
                  sx={{
                    cursor: 'pointer',
                    '&:hover td': { backgroundColor: 'action.hover' },
                  }}
                >
                  <StyledTableCell colSpan={11} sx={{ ...CC, py: 1 }}>
                    <Box sx={{
                      display: 'inline-flex', alignItems: 'center', gap: 0.5,
                      px: 1.5, py: 0.5, borderRadius: 1,
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                    }}>
                      <AddIcon sx={{ fontSize: '0.9rem' }} />
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: 'inherit' }}>
                        Add line item
                      </Typography>
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </StyledTableBody>
          </StyledTable>
        </StyledTableContainer>

        {/* Totals row */}
        <Box sx={{
          display: 'flex', justifyContent: 'flex-end', gap: 3,
          px: 2, py: 1, borderTop: '1px solid', borderColor: 'divider',
          backgroundColor: 'action.hover',
        }}>
          <Typography variant="body2" color="text.secondary">
            Net: <strong>{fmt(estimate.totalNet)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            VAT: <strong>{fmt(estimate.totalVat)}</strong>
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Typography variant="body2" fontWeight={700}>
            Total: {fmt(estimate.grandTotal)}
          </Typography>
        </Box>
      </S.CollapsibleSection>

      {/* Row context menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            const item = lineItems.find((li) => li.id === menuLineItemId);
            if (item) handleStartEdit(item);
          }}
          sx={{ fontSize: '0.8125rem' }}
        >
          <EditIcon sx={{ fontSize: '1rem', mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            const item = lineItems.find((li) => li.id === menuLineItemId);
            if (item) handleUnlink(item);
          }}
          sx={{ color: 'error.main', fontSize: '0.8125rem' }}
        >
          <LinkOffIcon sx={{ fontSize: '1rem', mr: 1 }} />
          Remove from estimate
        </MenuItem>
      </Menu>

      {/* ── Section 2: Documents ── */}
      <S.CollapsibleSection>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs
            value={docTab}
            onChange={(_, v) => setDocTab(v)}
            sx={{ minHeight: 40, '& .MuiTab-root': { minHeight: 40, fontSize: '0.8125rem', py: 0.5 } }}
          >
            <Tab label={`Estimates (${estimateDocs.length})`} />
            <Tab label={`Invoices (${invoices.length})`} />
            <Tab label="All documents" />
          </Tabs>
        </Box>
        <Box sx={{ p: 2 }}>
          {docTab === 0 && renderEstimatesTable()}
          {docTab === 1 && renderInvoicesTable()}
          {docTab === 2 && (
            <>
              {estimateDocs.length > 0 && (
                <>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}
                    sx={{ display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Estimate PDFs
                  </Typography>
                  {renderEstimatesTable()}
                  <Box sx={{ mb: 2 }} />
                </>
              )}
              {invoices.length > 0 && (
                <>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}
                    sx={{ display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Invoices
                  </Typography>
                  {renderInvoicesTable()}
                </>
              )}
              {estimateDocs.length === 0 && invoices.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No documents generated yet
                </Typography>
              )}
            </>
          )}
        </Box>
      </S.CollapsibleSection>
    </Box>
  );
};
