import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  CircularProgress,
  Autocomplete,
  Menu,
  Tooltip,
  Typography,
  Divider,
  Tab,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
} from '../../../../../components/UI/Table/Table.styles';
import { CreateInvoiceModal } from './CreateInvoiceModal';
import { CreateEstimateDocumentModal } from './CreateEstimateDocumentModal';
import * as S from '../../../JobDetailsPage.styles';
import * as ES from './JobEstimateTab.styles';


interface JobEstimateTabProps {
  job: JobResponse;
}

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const mobileAddCardRef = React.useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (showAddRow && isMobile) {
      const timer = setTimeout(() => {
        mobileAddCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showAddRow, isMobile]);

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
        <ES.ButtonStartIcon />
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
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
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
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleInvoiceExpand = (id: number) => {
    setExpandedInvoiceIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
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
      await fetchEstimate();
    } catch {
      showError('Failed to approve item');
    } finally {
      setApprovingIds((prev) => { const next = new Set(prev); next.delete(itemId); return next; });
    }
  };

  const handleRejectItem = async (itemId: number) => {
    if (!estimate?.id) return;
    setApprovingIds((prev) => new Set(prev).add(itemId));
    try {
      const res = await estimateService.updateLineItemStatus(estimate.id, itemId, {
        status: LineItemStatusUpdateRequestStatusEnum.Available,
      });
      setEstimate(res.data);
      await fetchEstimate();
    } catch {
      showError('Failed to reject item');
    } finally {
      setApprovingIds((prev) => { const next = new Set(prev); next.delete(itemId); return next; });
    }
  };

  const handleRequestApproval = async (itemId: number) => {
    if (!estimate?.id) return;
    setApprovingIds((prev) => new Set(prev).add(itemId));
    try {
      await estimateService.generateEstimateDocument(estimate.id, {
        lineItemIds: [itemId],
      });
      await fetchEstimate();
    } catch {
      showError('Failed to change status to waiting approval');
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
        const originalItem = availableLineItems.find((item) => item.id === selectedExistingId);
        const isModified = originalItem && (
          newItem.productCode.trim() !== (originalItem.productCode || '').trim() ||
          newItem.productDescription.trim() !== (originalItem.productDescription || '').trim() ||
          (parseFloat(newItem.unitPrice) || 0) !== (originalItem.unitPrice || 0) ||
          (parseFloat(newItem.quantity) || 1) !== (originalItem.quantity || 1) ||
          (parseFloat(newItem.vatRate) || 0) !== (originalItem.vatRate || 0)
        );

        const res = await estimateService.linkExistingLineItem(estimate.id, selectedExistingId);

        if (isModified) {
          const newlyLinked = res.data?.lineItems?.find((li) => li.sourceLineItemId === selectedExistingId);
          if (newlyLinked?.id) {
            const payload: LineItemUpdateRequest = {
              productCode: newItem.productCode.trim(),
              productDescription: newItem.productDescription.trim(),
              unitPrice: parseFloat(newItem.unitPrice) || 0,
              quantity: parseFloat(newItem.quantity) || 1,
              vatRate: parseFloat(newItem.vatRate) || 0,
            };
            await estimateService.updateLineItem(estimate.id, newlyLinked.id, payload);
          }
        }
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
      <ES.EmptyStateText variant="body2" color="text.secondary">
        No estimate PDFs generated yet
      </ES.EmptyStateText>
    ) : (
      <StyledTableContainer>
        <StyledTable>
          <StyledTableHead>
            <StyledTableRow>
              <ES.CheckboxHeaderCell />
              <ES.CompactHeaderCell>Document</ES.CompactHeaderCell>
              <ES.CompactHeaderCell>Reference</ES.CompactHeaderCell>
              <ES.CompactHeaderCell>Valid Until</ES.CompactHeaderCell>
              <ES.CompactHeaderCell align="right">Net</ES.CompactHeaderCell>
              <ES.CompactHeaderCell align="right">VAT</ES.CompactHeaderCell>
              <ES.CompactHeaderCell align="right">Total</ES.CompactHeaderCell>
              <ES.CompactActionsCell as={StyledHeaderCell} />
            </StyledTableRow>
          </StyledTableHead>
          <StyledTableBody>
            {estimateDocs.map((doc) => {
              const isExpanded = expandedDocIds.has(doc.id!);
              const snapshots: EstimateDocumentLineItemSnapshotResponse[] = doc.lineItems || [];
              return (
                <React.Fragment key={doc.id}>
                  <ES.ClickableTableRow onClick={() => toggleDocExpand(doc.id!)}>
                    <ES.CheckboxTableCell>
                      <ES.ZeroPaddingIconButton size="small">
                        {isExpanded
                          ? <ES.SmallArrowDownIcon />
                          : <ES.SmallArrowRightIcon />}
                      </ES.ZeroPaddingIconButton>
                    </ES.CheckboxTableCell>
                    <ES.CompactTableCell>
                      <ES.DocIconBox>
                        <ES.PdfIcon />
                        <ES.DocTitle variant="body2">
                          {doc.documentNumber || `#${doc.id}`}
                        </ES.DocTitle>
                      </ES.DocIconBox>
                      {doc.createdAt && (
                        <ES.DocCaption variant="caption" color="text.secondary">
                          Created {new Date(doc.createdAt).toLocaleDateString()}
                        </ES.DocCaption>
                      )}
                    </ES.CompactTableCell>
                    <ES.CompactTableCell>{doc.reference || '—'}</ES.CompactTableCell>
                    <ES.CompactTableCell>
                      {doc.validUntil ? new Date(doc.validUntil).toLocaleDateString() : '—'}
                    </ES.CompactTableCell>
                    <ES.CompactTableCell align="right">{fmt(doc.totalNet)}</ES.CompactTableCell>
                    <ES.CompactTableCell align="right">{fmt(doc.totalVat)}</ES.CompactTableCell>
                    <ES.TotalTableCell align="right">{fmt(doc.grandTotal)}</ES.TotalTableCell>
                    <ES.CompactActionsCell onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="Open PDF">
                        <span>
                          <ES.ZeroPaddingIconButton
                            size="small" color="primary"
                            disabled={openingDocId === doc.id}
                            onClick={() => handleOpenEstimateDoc(doc.id!)}
                          >
                            {openingDocId === doc.id
                              ? <CircularProgress size={14} />
                              : <ES.SmallOpenInNewIcon />}
                          </ES.ZeroPaddingIconButton>
                        </span>
                      </Tooltip>
                    </ES.CompactActionsCell>
                  </ES.ClickableTableRow>
                  <ES.EmptyTableRow style={{ padding: 0 }}>
                    <ES.CollapseTableCell colSpan={8}>
                      <ES.DocSubheader style={{ display: isExpanded ? 'block' : 'none' }}>
                        <ES.CollapseBox>
                          <ES.CollapseCaption variant="caption" color="text.secondary">
                            Line Items ({snapshots.length})
                          </ES.CollapseCaption>
                          <StyledTable size="small">
                            <StyledTableHead>
                              <StyledTableRow>
                                <ES.CompactHeaderCell>Product Code</ES.CompactHeaderCell>
                                <ES.CompactHeaderCell>Description</ES.CompactHeaderCell>
                                <ES.CompactHeaderCell align="right">Unit</ES.CompactHeaderCell>
                                <ES.CompactHeaderCell align="right">Qty</ES.CompactHeaderCell>
                                <ES.CompactHeaderCell align="right">VAT%</ES.CompactHeaderCell>
                                <ES.CompactHeaderCell align="right">Net</ES.CompactHeaderCell>
                                <ES.CompactHeaderCell align="right">Total</ES.CompactHeaderCell>
                              </StyledTableRow>
                            </StyledTableHead>
                            <StyledTableBody>
                              {snapshots.map((snap) => (
                                <StyledTableRow key={snap.id}>
                                  <ES.CompactTableCell>{snap.productCode}</ES.CompactTableCell>
                                  <ES.CompactTableCell>{snap.productDescription}</ES.CompactTableCell>
                                  <ES.CompactTableCell align="right">{fmt(snap.unitPrice)}</ES.CompactTableCell>
                                  <ES.CompactTableCell align="right">{snap.quantity}</ES.CompactTableCell>
                                  <ES.CompactTableCell align="right">
                                    {snap.vatRate !== undefined ? `${snap.vatRate}%` : '—'}
                                  </ES.CompactTableCell>
                                  <ES.CompactTableCell align="right">{fmt(snap.netAmount)}</ES.CompactTableCell>
                                  <ES.TotalTableCell align="right">
                                    {fmt(snap.totalAmount)}
                                  </ES.TotalTableCell>
                                </StyledTableRow>
                              ))}
                            </StyledTableBody>
                          </StyledTable>
                        </ES.CollapseBox>
                      </ES.DocSubheader>
                    </ES.CollapseTableCell>
                  </ES.EmptyTableRow>
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
      <ES.EmptyStateText variant="body2" color="text.secondary">
        No invoices generated yet
      </ES.EmptyStateText>
    ) : (
      <StyledTableContainer>
        <StyledTable>
          <StyledTableHead>
            <StyledTableRow>
              <ES.CheckboxHeaderCell />
              <ES.CompactHeaderCell>Invoice #</ES.CompactHeaderCell>
              <ES.CompactHeaderCell>Reference</ES.CompactHeaderCell>
              <ES.CompactHeaderCell>Due Date</ES.CompactHeaderCell>
              <ES.CompactHeaderCell>Created</ES.CompactHeaderCell>
              <ES.CompactHeaderCell align="right">Net</ES.CompactHeaderCell>
              <ES.CompactHeaderCell align="right">VAT</ES.CompactHeaderCell>
              <ES.CompactHeaderCell align="right">Total</ES.CompactHeaderCell>
              <ES.CompactActionsCell as={StyledHeaderCell}>PDF</ES.CompactActionsCell>
            </StyledTableRow>
          </StyledTableHead>
          <StyledTableBody>
            {invoices.map((inv) => {
              const isExpanded = expandedInvoiceIds.has(inv.id!);
              const invLineItems = inv.lineItems || [];
              return (
                <React.Fragment key={inv.id}>
                  <ES.ClickableTableRow onClick={() => toggleInvoiceExpand(inv.id!)}>
                    <ES.CheckboxTableCell>
                      <ES.ZeroPaddingIconButton size="small">
                        {isExpanded
                          ? <ES.SmallArrowDownIcon />
                          : <ES.SmallArrowRightIcon />}
                      </ES.ZeroPaddingIconButton>
                    </ES.CheckboxTableCell>
                    <ES.CompactTableCell>
                      <ES.DocTitle variant="body2">
                        {inv.invoiceNumber || `#${inv.id}`}
                      </ES.DocTitle>
                    </ES.CompactTableCell>
                    <ES.CompactTableCell>{inv.reference || '—'}</ES.CompactTableCell>
                    <ES.CompactTableCell>
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}
                    </ES.CompactTableCell>
                    <ES.CompactTableCell>
                      {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '—'}
                    </ES.CompactTableCell>
                    <ES.CompactTableCell align="right">{fmt(inv.totalNet)}</ES.CompactTableCell>
                    <ES.CompactTableCell align="right">{fmt(inv.totalVat)}</ES.CompactTableCell>
                    <ES.TotalTableCell align="right">{fmt(inv.grandTotal)}</ES.TotalTableCell>
                    <ES.CompactActionsCell onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="View PDF">
                        <span>
                          <ES.ZeroPaddingIconButton
                            size="small" color="primary"
                            disabled={!inv.presignedUrl}
                            onClick={() => inv.presignedUrl && window.open(inv.presignedUrl, '_blank', 'noopener,noreferrer')}
                          >
                            <ES.SmallOpenInNewIcon />
                          </ES.ZeroPaddingIconButton>
                        </span>
                      </Tooltip>
                    </ES.CompactActionsCell>
                  </ES.ClickableTableRow>
                  <ES.EmptyTableRow style={{ padding: 0 }}>
                    <ES.CollapseTableCell colSpan={9}>
                      <ES.DocSubheader style={{ display: isExpanded ? 'block' : 'none' }}>
                        <ES.CollapseBox>
                          <StyledTable size="small">
                            <StyledTableHead>
                              <StyledTableRow>
                                <ES.CompactHeaderCell>Product Code</ES.CompactHeaderCell>
                                <ES.CompactHeaderCell>Description</ES.CompactHeaderCell>
                                <ES.CompactHeaderCell align="right">Unit</ES.CompactHeaderCell>
                                <ES.CompactHeaderCell align="right">Qty</ES.CompactHeaderCell>
                                <ES.CompactHeaderCell align="right">VAT%</ES.CompactHeaderCell>
                                <ES.CompactHeaderCell align="right">Net</ES.CompactHeaderCell>
                                <ES.CompactHeaderCell align="right">Total</ES.CompactHeaderCell>
                              </StyledTableRow>
                            </StyledTableHead>
                            <StyledTableBody>
                              {invLineItems.map((li) => (
                                <StyledTableRow key={li.id}>
                                  <ES.CompactTableCell>{li.productCode}</ES.CompactTableCell>
                                  <ES.CompactTableCell>{li.productDescription}</ES.CompactTableCell>
                                  <ES.CompactTableCell align="right">{fmt(li.unitPrice)}</ES.CompactTableCell>
                                  <ES.CompactTableCell align="right">{li.quantity}</ES.CompactTableCell>
                                  <ES.CompactTableCell align="right">
                                    {li.vatRate !== undefined ? `${li.vatRate}%` : '—'}
                                  </ES.CompactTableCell>
                                  <ES.CompactTableCell align="right">{fmt(li.netAmount)}</ES.CompactTableCell>
                                  <ES.TotalTableCell align="right">
                                    {fmt(li.totalAmount)}
                                  </ES.TotalTableCell>
                                </StyledTableRow>
                              ))}
                            </StyledTableBody>
                          </StyledTable>
                        </ES.CollapseBox>
                      </ES.DocSubheader>
                    </ES.CollapseTableCell>
                  </ES.EmptyTableRow>
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
    <ES.TabContainer>

      {/* ── Financial summary ── */}
      <ES.SummaryCardsContainer>
        {[
          { label: 'Waiting Approval', value: estimate.waitingApprovalValue, color: '#F59E0B' },
          { label: 'Approved',         value: estimate.approvedValue,         color: '#10B981' },
          { label: 'Invoiced',         value: estimate.invoicedValue,         color: '#6366F1' },
        ].map(({ label, value, color }) => (
          <S.EstimateSummaryCard key={label} accentcolor={color}>
            <ES.SummaryCardLabel variant="caption" color="text.secondary">
              {label}
            </ES.SummaryCardLabel>
            <ES.SummaryCardValue variant="h6" color={color}>
              {fmt(value)}
            </ES.SummaryCardValue>
          </S.EstimateSummaryCard>
        ))}
      </ES.SummaryCardsContainer>

      {/* ── Section 1: Line Items ── */}
      <S.CollapsibleSection>
        {/* Header */}
        <ES.SectionHeaderBox>
          <ES.SectionHeaderLeft>
            <Typography variant="body1" fontWeight={600}>
              Line items ({lineItems.length})
            </Typography>
            {someSelected && (
              <Typography variant="body2" color="primary.main">
                · {selectedIds.size} selected
              </Typography>
            )}
          </ES.SectionHeaderLeft>
          <ES.SectionHeaderRight>
            <Button
              variant="outlined" color="primary"
              onClick={handleGenerateEstimatePdf}
              disabled={selectedIds.size === 0}
            >
              <ES.ButtonStartIcon />
              Generate estimate PDF
            </Button>
            <Button
              variant="outlined" color="primary"
              onClick={handleGenerateInvoice}
              disabled={selectedIds.size === 0}
            >
              Create invoice
            </Button>
          </ES.SectionHeaderRight>
        </ES.SectionHeaderBox>

        {/* Table */}
        {isMobile && (
          <ES.MobileHeaderControls>
            <ES.MobileHeaderLeftBox>
              <ES.ZeroPaddingCheckbox
                size="small"
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={toggleAll}
                disabled={selectableItems.length === 0}
              />
              <Typography variant="body2" fontWeight={500}>
                Select All
              </Typography>
            </ES.MobileHeaderLeftBox>
            {!showAddRow && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleOpenAddRow}
              >
                Add line item
              </Button>
            )}
          </ES.MobileHeaderControls>
        )}

        {isMobile ? (
          <ES.MobileCardsContainer>
            {lineItems.length === 0 && !showAddRow ? (
              <ES.EmptyStateText variant="body2" color="text.secondary" align="center">
                No line items yet. Add one to get started.
              </ES.EmptyStateText>
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
                    <ES.EstimateMobileEditCard key={item.id}>
                      <ES.MobileEditBox>
                        <ES.StyledField size="small" fullWidth label="Product code" value={editItem.productCode}
                          onChange={(e) => setEditItem((p) => ({ ...p, productCode: e.target.value }))} />
                        <ES.StyledField size="small" fullWidth label="Description" value={editItem.productDescription}
                          onChange={(e) => setEditItem((p) => ({ ...p, productDescription: e.target.value }))} />
                        <ES.FlexGap1Box>
                          <ES.FlexField size="small" type="number" label="Unit Price" value={editItem.unitPrice}
                            onChange={(e) => setEditItem((p) => ({ ...p, unitPrice: e.target.value }))}
                            slotProps={{ htmlInput: { min: 0, step: 0.01 } }} />
                          <ES.FlexField size="small" type="number" label="Qty" value={editItem.quantity}
                            onChange={(e) => setEditItem((p) => ({ ...p, quantity: e.target.value }))}
                            slotProps={{ htmlInput: { min: 1 } }} />
                          <ES.FlexField size="small" type="number" label="VAT%" value={editItem.vatRate}
                            onChange={(e) => setEditItem((p) => ({ ...p, vatRate: e.target.value }))}
                            slotProps={{ htmlInput: { min: 0, max: 100, step: 0.1 } }} />
                        </ES.FlexGap1Box>
                        <ES.EstimateCardGrid>
                          <ES.EstimateGridItem>
                            <ES.EstimateGridLabel>Net</ES.EstimateGridLabel>
                            <ES.EstimateGridValue>{fmt(eNet)}</ES.EstimateGridValue>
                          </ES.EstimateGridItem>
                          <ES.EstimateGridItem>
                            <ES.EstimateGridLabel>VAT</ES.EstimateGridLabel>
                            <ES.EstimateGridValue>{fmt(eVat)}</ES.EstimateGridValue>
                          </ES.EstimateGridItem>
                          <ES.Span2GridItem>
                            <ES.EstimateGridLabel>Total</ES.EstimateGridLabel>
                            <ES.BoldGridValue>{fmt(eNet + eVat)}</ES.BoldGridValue>
                          </ES.Span2GridItem>
                        </ES.EstimateCardGrid>
                        <ES.EstimateCardActions>
                          <ES.ZeroPaddingIconButton size="small" color="primary" onClick={handleSaveEdit} disabled={editSaving} aria-label="Save">
                            {editSaving ? <CircularProgress size={12} /> : <ES.SmallCheckIcon />}
                          </ES.ZeroPaddingIconButton>
                          <ES.ZeroPaddingIconButton size="small" onClick={handleCancelEdit} disabled={editSaving} aria-label="Cancel">
                            <ES.SmallCloseIcon />
                          </ES.ZeroPaddingIconButton>
                        </ES.EstimateCardActions>
                      </ES.MobileEditBox>
                    </ES.EstimateMobileEditCard>
                  );
                }

                return (
                  <ES.SelectableEstimateMobileCard
                    key={item.id}
                    invoiced={invoiced}
                    isSelected={isSelected}
                    onClick={() => !invoiced && toggleRow(item.id!)}
                  >
                    <ES.EstimateCardHeader>
                      <ES.EstimateCardHeaderLeft>
                        {invoiced ? (
                          <Tooltip title={linkedInvoice ? `Part of ${linkedInvoice.invoiceNumber || `#${linkedInvoice.id}`}` : 'Already invoiced'}>
                            <ES.LockItemIcon />
                          </Tooltip>
                        ) : (
                          <ES.ZeroPaddingCheckbox
                            size="small"
                            checked={isSelected}
                            onChange={() => toggleRow(item.id!)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                        <ES.MobileCardTitle variant="subtitle2">
                          {item.productCode}
                        </ES.MobileCardTitle>
                      </ES.EstimateCardHeaderLeft>
                      <ES.CardHeaderRight>
                        <ES.StyledChip
                          label={chipConfig.label}
                          size="small"
                          color={chipConfig.color}
                          variant="filled"
                          style={chipConfig.sx}
                        />
                        {!invoiced && (
                          <ES.ZeroPaddingIconButton size="small" onClick={(e) => { e.stopPropagation(); handleMenuOpen(e, item.id!); }} aria-label="Line item actions">
                            <ES.MoreVertSmallIcon />
                          </ES.ZeroPaddingIconButton>
                        )}
                      </ES.CardHeaderRight>
                    </ES.EstimateCardHeader>

                    <Typography variant="body2" color="text.secondary">
                      {item.productDescription}
                    </Typography>

                    <ES.EstimateCardGrid>
                      <ES.EstimateGridItem>
                        <ES.EstimateGridLabel>Unit Price</ES.EstimateGridLabel>
                        <ES.EstimateGridValue>{fmt(item.unitPrice)}</ES.EstimateGridValue>
                      </ES.EstimateGridItem>
                      <ES.EstimateGridItem>
                        <ES.EstimateGridLabel>Qty</ES.EstimateGridLabel>
                        <ES.EstimateGridValue>{item.quantity}</ES.EstimateGridValue>
                      </ES.EstimateGridItem>
                      <ES.EstimateGridItem>
                        <ES.EstimateGridLabel>VAT%</ES.EstimateGridLabel>
                        <ES.EstimateGridValue>{item.vatRate !== undefined ? `${item.vatRate}%` : '—'}</ES.EstimateGridValue>
                      </ES.EstimateGridItem>
                      <ES.EstimateGridItem>
                        <ES.EstimateGridLabel>Net</ES.EstimateGridLabel>
                        <ES.EstimateGridValue>{fmt(item.netAmount)}</ES.EstimateGridValue>
                      </ES.EstimateGridItem>
                      <ES.EstimateGridItem>
                        <ES.EstimateGridLabel>VAT</ES.EstimateGridLabel>
                        <ES.EstimateGridValue>{fmt(item.vatAmount)}</ES.EstimateGridValue>
                      </ES.EstimateGridItem>
                      <ES.EstimateGridItem>
                        <ES.EstimateGridLabel>Total</ES.EstimateGridLabel>
                        <ES.BoldGridValue>{fmt(item.totalAmount)}</ES.BoldGridValue>
                      </ES.EstimateGridItem>
                    </ES.EstimateCardGrid>

                    {/* Quick action buttons at the bottom of card */}
                    {!invoiced && (status === 'WAITING_APPROVAL' || status === 'AVAILABLE') && (
                      <ES.EstimateCardActions onClick={(e) => e.stopPropagation()}>
                        {status === 'WAITING_APPROVAL' && (
                          isApproving ? (
                            <CircularProgress size={14} />
                          ) : (
                            <>
                              <Tooltip title="Approve">
                                <ES.SuccessIconButton
                                  size="small"
                                  onClick={() => handleApproveItem(item.id!)}
                                  aria-label="Approve"
                                >
                                  <ES.ActionCheckIcon />
                                </ES.SuccessIconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <ES.ErrorIconButton
                                  size="small"
                                  onClick={() => handleRejectItem(item.id!)}
                                  aria-label="Reject"
                                >
                                  <ES.ActionCloseIcon />
                                </ES.ErrorIconButton>
                              </Tooltip>
                            </>
                          )
                        )}
                        {status === 'AVAILABLE' && (
                          isApproving ? (
                            <CircularProgress size={14} />
                          ) : (
                            <>
                              <Tooltip title="Request approval">
                                <ES.SuccessIconButton
                                  size="small"
                                  onClick={() => handleRequestApproval(item.id!)}
                                  aria-label="Request approval"
                                >
                                  <ES.ActionCheckIcon />
                                </ES.SuccessIconButton>
                              </Tooltip>
                              <Tooltip title="Remove">
                                <ES.ErrorIconButton
                                  size="small"
                                  onClick={() => handleUnlink(item)}
                                  aria-label="Remove"
                                >
                                  <ES.ActionCloseIcon />
                                </ES.ErrorIconButton>
                              </Tooltip>
                            </>
                          )
                        )}
                      </ES.EstimateCardActions>
                    )}
                  </ES.SelectableEstimateMobileCard>
                );
              })
            )}

            {/* Add card on mobile */}
            {showAddRow && (
              <ES.EstimateMobileDashedCard ref={mobileAddCardRef}>
                <ES.MobileAddCardBox>
                  <ES.MobileCardTitle variant="subtitle2">
                    New Line Item
                  </ES.MobileCardTitle>
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
                      <ES.StyledField
                        {...params} placeholder="Product code..."
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
                  <ES.StyledField size="small" fullWidth label="Description..."
                    value={newItem.productDescription}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, productDescription: e.target.value }))}
                  />
                  <ES.FlexGap1Box>
                    <ES.FlexField size="small" type="number" label="Price" value={newItem.unitPrice}
                      onChange={(e) => setNewItem((prev) => ({ ...prev, unitPrice: e.target.value }))}
                      slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                    />
                    <ES.FlexField size="small" type="number" label="Qty" value={newItem.quantity}
                      onChange={(e) => setNewItem((prev) => ({ ...prev, quantity: e.target.value }))}
                      slotProps={{ htmlInput: { min: 1 } }}
                    />
                    <ES.FlexField size="small" type="number" label="VAT%" value={newItem.vatRate}
                      onChange={(e) => setNewItem((prev) => ({ ...prev, vatRate: e.target.value }))}
                      slotProps={{ htmlInput: { min: 0, max: 100, step: 0.1 } }}
                    />
                  </ES.FlexGap1Box>
                  <ES.EstimateCardGrid>
                    <ES.EstimateGridItem>
                      <ES.EstimateGridLabel>Net</ES.EstimateGridLabel>
                      <ES.EstimateGridValue>{fmt(calcNet)}</ES.EstimateGridValue>
                    </ES.EstimateGridItem>
                    <ES.EstimateGridItem>
                      <ES.EstimateGridLabel>VAT</ES.EstimateGridLabel>
                      <ES.EstimateGridValue>{fmt(calcVat)}</ES.EstimateGridValue>
                    </ES.EstimateGridItem>
                    <ES.Span2GridItem>
                      <ES.EstimateGridLabel>Total</ES.EstimateGridLabel>
                      <ES.BoldGridValue>{fmt(calcTotal)}</ES.BoldGridValue>
                    </ES.Span2GridItem>
                  </ES.EstimateCardGrid>
                  <ES.EstimateCardActions>
                    <ES.ZeroPaddingIconButton size="small" color="primary" onClick={handleSave} disabled={saving} aria-label="Save">
                      {saving ? <CircularProgress size={12} /> : <ES.SmallCheckIcon />}
                    </ES.ZeroPaddingIconButton>
                    <ES.ZeroPaddingIconButton size="small" onClick={handleCloseAddRow} disabled={saving} aria-label="Cancel">
                      <ES.SmallCloseIcon />
                    </ES.ZeroPaddingIconButton>
                  </ES.EstimateCardActions>
                </ES.MobileAddCardBox>
              </ES.EstimateMobileDashedCard>
            )}
          </ES.MobileCardsContainer>
        ) : (
          <StyledTableContainer>
            <StyledTable>
              <StyledTableHead>
                <StyledTableRow>
                  <ES.CheckboxHeaderCell>
                    <ES.ZeroPaddingCheckbox
                      size="small"
                      checked={allSelected}
                      indeterminate={someSelected && !allSelected}
                      onChange={toggleAll}
                      disabled={selectableItems.length === 0}
                    />
                  </ES.CheckboxHeaderCell>
                  <ES.CompactHeaderCell>Product Code</ES.CompactHeaderCell>
                  <ES.CompactHeaderCell>Description</ES.CompactHeaderCell>
                  <ES.CompactHeaderCell align="right">Unit</ES.CompactHeaderCell>
                  <ES.CompactHeaderCell align="right">Qty</ES.CompactHeaderCell>
                  <ES.CompactHeaderCell align="right">VAT%</ES.CompactHeaderCell>
                  <ES.CompactHeaderCell align="right">Net</ES.CompactHeaderCell>
                  <ES.CompactHeaderCell align="right">VAT</ES.CompactHeaderCell>
                  <ES.CompactHeaderCell align="right">Total</ES.CompactHeaderCell>
                  <ES.CompactHeaderCell>Status</ES.CompactHeaderCell>
                  <ES.CompactActionsCell as={StyledHeaderCell} />
                </StyledTableRow>
              </StyledTableHead>

              <StyledTableBody>
                {lineItems.length === 0 && !showAddRow ? (
                  <ES.EmptyTableRow>
                    <ES.EmptyTableCell colSpan={11} align="center">
                      No line items yet. Add one to get started.
                    </ES.EmptyTableCell>
                  </ES.EmptyTableRow>
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
                          <ES.CheckboxTableCellWidth36 />
                          <ES.CellMin130>
                            <ES.StyledField size="small" fullWidth placeholder="Product code" value={editItem.productCode}
                              onChange={(e) => setEditItem((p) => ({ ...p, productCode: e.target.value }))} />
                          </ES.CellMin130>
                          <ES.CellMin160>
                            <ES.StyledField size="small" fullWidth placeholder="Description" value={editItem.productDescription}
                              onChange={(e) => setEditItem((p) => ({ ...p, productDescription: e.target.value }))} />
                          </ES.CellMin160>
                          <ES.CellMin110>
                            <ES.EditPriceInput size="small" type="number" placeholder="0.00" value={editItem.unitPrice}
                              onChange={(e) => setEditItem((p) => ({ ...p, unitPrice: e.target.value }))}
                              slotProps={{ htmlInput: { min: 0, step: 0.01 } }} />
                          </ES.CellMin110>
                          <ES.CellMin80>
                            <ES.EditQtyInput size="small" type="number" placeholder="1" value={editItem.quantity}
                              onChange={(e) => setEditItem((p) => ({ ...p, quantity: e.target.value }))}
                              slotProps={{ htmlInput: { min: 1 } }} />
                          </ES.CellMin80>
                          <ES.CellMin85>
                            <ES.EditVatInput size="small" type="number" placeholder="0" value={editItem.vatRate}
                              onChange={(e) => setEditItem((p) => ({ ...p, vatRate: e.target.value }))}
                              slotProps={{ htmlInput: { min: 0, max: 100, step: 0.1 } }} />
                          </ES.CellMin85>
                          <ES.MutedTableCell align="right">{fmt(eNet)}</ES.MutedTableCell>
                          <ES.MutedTableCell align="right">{fmt(eVat)}</ES.MutedTableCell>
                          <ES.MutedTableCell align="right">{fmt(eNet + eVat)}</ES.MutedTableCell>
                          <ES.CompactTableCell />
                          <ES.CompactActionsCell>
                            <ES.ActionsBoxGap05>
                              <Tooltip title="Save">
                                <span>
                                  <ES.ZeroPaddingIconButton size="small" color="primary" onClick={handleSaveEdit} disabled={editSaving} aria-label="Save line item edit">
                                    {editSaving ? <CircularProgress size={12} /> : <ES.SmallCheckIcon />}
                                  </ES.ZeroPaddingIconButton>
                                </span>
                              </Tooltip>
                              <Tooltip title="Cancel">
                                <ES.ZeroPaddingIconButton size="small" onClick={handleCancelEdit} disabled={editSaving} aria-label="Cancel line item edit">
                                  <ES.SmallCloseIcon />
                                </ES.ZeroPaddingIconButton>
                              </Tooltip>
                            </ES.ActionsBoxGap05>
                          </ES.CompactActionsCell>
                        </StyledTableRow>
                      );
                    }

                    return (
                      <ES.SelectableTableRow
                        key={item.id}
                        invoiced={invoiced}
                        isSelected={isSelected}
                        onClick={() => !invoiced && toggleRow(item.id!)}
                      >
                        <ES.CheckboxTableCell>
                          {invoiced ? (
                            <Tooltip title={linkedInvoice
                              ? `Part of ${linkedInvoice.invoiceNumber || `#${linkedInvoice.id}`}`
                              : 'Already invoiced'
                            }>
                              <ES.LockItemIcon />
                            </Tooltip>
                          ) : (
                            <ES.ZeroPaddingCheckbox
                              size="small"
                              checked={isSelected}
                              onChange={() => toggleRow(item.id!)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                        </ES.CheckboxTableCell>
                        <ES.CompactTableCell>{item.productCode}</ES.CompactTableCell>
                        <ES.TruncatedDescTableCell>
                          {item.productDescription}
                        </ES.TruncatedDescTableCell>
                        <ES.CompactTableCell align="right">{fmt(item.unitPrice)}</ES.CompactTableCell>
                        <ES.CompactTableCell align="right">{item.quantity}</ES.CompactTableCell>
                        <ES.CompactTableCell align="right">
                          {item.vatRate !== undefined ? `${item.vatRate}%` : '—'}
                        </ES.CompactTableCell>
                        <ES.CompactTableCell align="right">{fmt(item.netAmount)}</ES.CompactTableCell>
                        <ES.CompactTableCell align="right">{fmt(item.vatAmount)}</ES.CompactTableCell>
                        <ES.TotalTableCell align="right">
                          {fmt(item.totalAmount)}
                        </ES.TotalTableCell>
                        <ES.CompactTableCell>
                          <ES.StyledChip
                            label={chipConfig.label}
                            size="small"
                            color={chipConfig.color}
                            variant="filled"
                            style={chipConfig.sx}
                          />
                        </ES.CompactTableCell>
                        <ES.CompactActionsCell onClick={(e) => e.stopPropagation()}>
                          <ES.QuickActionsContainer>
                            {status === 'WAITING_APPROVAL' && (
                              isApproving ? (
                                <CircularProgress size={14} />
                              ) : (
                                <>
                                  <Tooltip title="Approve">
                                    <ES.SuccessIconButton
                                      size="small"
                                      onClick={() => handleApproveItem(item.id!)}
                                      aria-label="Approve line item"
                                    >
                                      <ES.QuickActionCheckIcon />
                                    </ES.SuccessIconButton>
                                  </Tooltip>
                                  <Tooltip title="Reject">
                                    <ES.ErrorIconButton
                                      size="small"
                                      onClick={() => handleRejectItem(item.id!)}
                                      aria-label="Reject line item"
                                    >
                                      <ES.QuickActionCloseIcon />
                                    </ES.ErrorIconButton>
                                  </Tooltip>
                                </>
                              )
                            )}
                            {status === 'AVAILABLE' && (
                              isApproving ? (
                                <CircularProgress size={14} />
                              ) : (
                                <>
                                  <Tooltip title="Request approval">
                                    <ES.SuccessIconButton
                                      size="small"
                                      onClick={() => handleRequestApproval(item.id!)}
                                      aria-label="Request approval for line item"
                                    >
                                      <ES.QuickActionCheckIcon />
                                    </ES.SuccessIconButton>
                                  </Tooltip>
                                  <Tooltip title="Remove">
                                    <ES.ErrorIconButton
                                      size="small"
                                      onClick={() => handleUnlink(item)}
                                      aria-label="Remove line item"
                                    >
                                      <ES.QuickActionCloseIcon />
                                    </ES.ErrorIconButton>
                                  </Tooltip>
                                </>
                              )
                            )}
                            {!invoiced && (
                              <ES.ZeroPaddingIconButton size="small" onClick={(e) => handleMenuOpen(e, item.id!)} aria-label="Line item actions">
                                <ES.MoreVertSmallIcon />
                              </ES.ZeroPaddingIconButton>
                            )}
                          </ES.QuickActionsContainer>
                        </ES.CompactActionsCell>
                      </ES.SelectableTableRow>
                    );
                  })
                )}

                {/* Add row */}
                {showAddRow && (
                  <StyledTableRow>
                    <ES.CheckboxTableCellWidth36 />
                    <ES.CellMin150>
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
                          <ES.StyledField
                            {...params} placeholder="Product code..."
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
                    </ES.CellMin150>
                    <ES.CellMin160>
                      <ES.StyledField size="small" fullWidth placeholder="Description..."
                        value={newItem.productDescription}
                        onChange={(e) => setNewItem((prev) => ({ ...prev, productDescription: e.target.value }))}
                      />
                    </ES.CellMin160>
                    <ES.CellMin120>
                      <ES.AddPriceInput size="small" type="number" placeholder="0.00" value={newItem.unitPrice}
                        onChange={(e) => setNewItem((prev) => ({ ...prev, unitPrice: e.target.value }))}
                        slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                      />
                    </ES.CellMin120>
                    <ES.CellMin85>
                      <ES.AddQtyInput size="small" type="number" placeholder="1" value={newItem.quantity}
                        onChange={(e) => setNewItem((prev) => ({ ...prev, quantity: e.target.value }))}
                        slotProps={{ htmlInput: { min: 1 } }}
                      />
                    </ES.CellMin85>
                    <ES.CellMin90>
                      <ES.AddVatInput size="small" type="number" placeholder="0" value={newItem.vatRate}
                        onChange={(e) => setNewItem((prev) => ({ ...prev, vatRate: e.target.value }))}
                        slotProps={{ htmlInput: { min: 0, max: 100, step: 0.1 } }}
                      />
                    </ES.CellMin90>
                    <ES.MutedTableCell align="right">{fmt(calcNet)}</ES.MutedTableCell>
                    <ES.MutedTableCell align="right">{fmt(calcVat)}</ES.MutedTableCell>
                    <ES.MutedTableCell align="right">{fmt(calcTotal)}</ES.MutedTableCell>
                    <ES.CompactTableCell />
                    <ES.CompactActionsCell>
                      <ES.ActionsBoxGap05>
                        <Tooltip title="Save">
                          <span>
                            <ES.ZeroPaddingIconButton size="small" color="primary" onClick={handleSave} disabled={saving} aria-label="Save new line item">
                              {saving ? <CircularProgress size={12} /> : <ES.SmallCheckIcon />}
                            </ES.ZeroPaddingIconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <ES.ZeroPaddingIconButton size="small" onClick={handleCloseAddRow} disabled={saving} aria-label="Cancel new line item">
                            <ES.SmallCloseIcon />
                          </ES.ZeroPaddingIconButton>
                        </Tooltip>
                      </ES.ActionsBoxGap05>
                    </ES.CompactActionsCell>
                  </StyledTableRow>
                )}
                {/* Add line item row */}
                {!showAddRow && (
                  <ES.AddRowClickableTableRow
                    onClick={handleOpenAddRow}
                  >
                    <ES.AddRowCell colSpan={11}>
                      <ES.AddRowButtonBox>
                        <ES.AddIconSmall />
                        <ES.AddRowButtonText>
                          Add line item
                        </ES.AddRowButtonText>
                      </ES.AddRowButtonBox>
                    </ES.AddRowCell>
                  </ES.AddRowClickableTableRow>
                )}
              </StyledTableBody>
            </StyledTable>
          </StyledTableContainer>
        )}

        {/* Totals row */}
        <ES.TotalsFooterBox>
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
        </ES.TotalsFooterBox>
      </S.CollapsibleSection>

      {/* Row context menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <ES.StyledMenuItem
          onClick={() => {
            const item = lineItems.find((li) => li.id === menuLineItemId);
            if (item) handleStartEdit(item);
          }}
        >
          <ES.MenuItemIcon />
          Edit
        </ES.StyledMenuItem>
        <ES.StyledDeleteMenuItem
          onClick={() => {
            const item = lineItems.find((li) => li.id === menuLineItemId);
            if (item) handleUnlink(item);
          }}
        >
          <ES.MenuItemLinkOffIcon />
          Remove from estimate
        </ES.StyledDeleteMenuItem>
      </Menu>

      {/* ── Section 2: Documents ── */}
      <S.CollapsibleSection>
        <ES.DocTabsHeader>
          <ES.StyledTabs
            value={docTab}
            onChange={(_, v) => setDocTab(v)}
          >
            <Tab label={`Estimates (${estimateDocs.length})`} />
            <Tab label={`Invoices (${invoices.length})`} />
            <Tab label="All documents" />
          </ES.StyledTabs>
        </ES.DocTabsHeader>
        <ES.DocTabBody>
          {docTab === 0 && renderEstimatesTable()}
          {docTab === 1 && renderInvoicesTable()}
          {docTab === 2 && (
            <>
              {estimateDocs.length > 0 && (
                <>
                  <ES.DocSubheader variant="caption" color="text.secondary">
                    Estimate PDFs
                  </ES.DocSubheader>
                  {renderEstimatesTable()}
                  <ES.Mb2Box />
                </>
              )}
              {invoices.length > 0 && (
                <>
                  <ES.DocSubheader variant="caption" color="text.secondary">
                    Invoices
                  </ES.DocSubheader>
                  {renderInvoicesTable()}
                </>
              )}
              {estimateDocs.length === 0 && invoices.length === 0 && (
                <ES.EmptyStateText variant="body2" color="text.secondary">
                  No documents generated yet
                </ES.EmptyStateText>
              )}
            </>
          )}
        </ES.DocTabBody>
      </S.CollapsibleSection>
    </ES.TabContainer>
  );
};
