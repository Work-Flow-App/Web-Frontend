import React, { useCallback, useMemo, useState } from 'react';
import { CircularProgress, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { Badge } from '../../../../../components/UI/Badge';
import { Button } from '../../../../../components/UI/Button';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../../components/UI/GlobalModal';
import { companyService } from '../../../../../services/api';
import type { CompanyDocumentResponse } from '../../../../../services/api';
import { useFetch } from '../../../../../hooks/useFetch';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { useCompanyRole } from '../../../../../contexts/CompanyRoleContext';
import { extractErrorMessage } from '../../../../../utils/errorHandler';
import { getDocumentTypeLabel, getDocumentTypeVariant } from '../../../../../utils/documentTypeLabels';
import { DocumentForm } from './DocumentForm';
import {
  TabHeader,
  TabHeaderText,
  TabTitle,
  TabDescription,
  ToolsRow,
  SearchBox,
  SearchInput,
  SearchIconWrap,
  TableWrap,
  StyledTable,
  TableHeadCell,
  TableRow,
  TableCell,
  DocNameCell,
  DocIconBadge,
  CellStack,
  CellPrimaryText,
  CellSecondaryText,
  KebabButton,
  EmptyRow,
  LoadingContainer,
} from './DocumentsTab.styles';

const formatDate = (value?: string): string => (value ? new Date(value).toLocaleDateString() : '—');

export const DocumentsTab: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const { canEdit, canDelete } = useCompanyRole();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuState, setMenuState] = useState<{ anchor: HTMLElement; doc: CompanyDocumentResponse } | null>(null);

  const fetchDocuments = useCallback(() => companyService.getDocuments(), []);
  const { data, loading, refetch } = useFetch<CompanyDocumentResponse[]>(fetchDocuments, [], {
    onError: (err) => showError(extractErrorMessage(err, 'Failed to load documents.')),
  });

  const documents = useMemo(() => data || [], [data]);

  const filteredDocuments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return documents;
    return documents.filter(
      (doc) => doc.title?.toLowerCase().includes(query) || doc.fileName?.toLowerCase().includes(query)
    );
  }, [documents, searchQuery]);

  const openDocumentForm = useCallback(
    (document?: CompanyDocumentResponse) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'companyDocumentForm',
        children: (
          <DocumentForm
            document={document}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              refetch();
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, refetch]
  );

  const handleDelete = useCallback(
    (doc: CompanyDocumentResponse) => {
      if (!doc.id) return;
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'deleteCompanyDocument',
        children: (
          <ConfirmationModal
            title="Delete Document"
            message={`Delete "${doc.title}"?`}
            description="This action cannot be undone."
            variant="danger"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await companyService.deleteDocument(doc.id!);
                showSuccess('Document deleted.');
                resetGlobalModalOuterProps();
                refetch();
              } catch (error) {
                showError(extractErrorMessage(error, 'Failed to delete document.'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, showSuccess, showError, refetch]
  );

  const closeMenu = () => setMenuState(null);

  return (
    <>
      <TabHeader>
        <TabHeaderText>
          <TabTitle>Company Documents</TabTitle>
          <TabDescription>Certificates, licenses, insurance and other company documents.</TabDescription>
        </TabHeaderText>
        <ToolsRow>
          <SearchBox>
            <SearchIconWrap>
              <SearchIcon />
            </SearchIconWrap>
            <SearchInput
              placeholder="Search documents"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>
          {canEdit && (
            <Button variant="contained" color="primary" size="small" onClick={() => openDocumentForm()}>
              Upload Document
            </Button>
          )}
        </ToolsRow>
      </TabHeader>

      <TableWrap>
        {loading ? (
          <LoadingContainer>
            <CircularProgress size={32} />
          </LoadingContainer>
        ) : filteredDocuments.length === 0 ? (
          <EmptyRow>
            {documents.length === 0 ? 'No documents uploaded yet.' : 'No documents match your search.'}
          </EmptyRow>
        ) : (
          <StyledTable>
            <thead>
              <tr>
                <TableHeadCell>Document</TableHeadCell>
                <TableHeadCell>Type</TableHeadCell>
                <TableHeadCell>Visibility</TableHeadCell>
                <TableHeadCell>Validity</TableHeadCell>
                <TableHeadCell>Uploaded</TableHeadCell>
                <TableHeadCell />
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <DocNameCell>
                      <DocIconBadge>
                        <InsertDriveFileOutlinedIcon />
                      </DocIconBadge>
                      <CellStack>
                        <CellPrimaryText>{doc.title}</CellPrimaryText>
                        {doc.fileName && <CellSecondaryText>{doc.fileName}</CellSecondaryText>}
                      </CellStack>
                    </DocNameCell>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getDocumentTypeVariant(doc.type)}>{getDocumentTypeLabel(doc.type)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={doc.isPublic ? 'success' : 'default'}>{doc.isPublic ? 'Public' : 'Private'}</Badge>
                  </TableCell>
                  <TableCell>
                    {doc.validityStartDate || doc.validityEndDate ? (
                      <CellStack>
                        <CellPrimaryText>{formatDate(doc.validityStartDate)}</CellPrimaryText>
                        <CellSecondaryText>to {formatDate(doc.validityEndDate)}</CellSecondaryText>
                      </CellStack>
                    ) : (
                      <CellSecondaryText>No expiry</CellSecondaryText>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(doc.createdAt)}</TableCell>
                  <TableCell>
                    <KebabButton
                      type="button"
                      aria-label="Document actions"
                      onClick={(e) => setMenuState({ anchor: e.currentTarget, doc })}
                    >
                      <MoreVertIcon fontSize="small" />
                    </KebabButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </StyledTable>
        )}
      </TableWrap>

      <Menu anchorEl={menuState?.anchor} open={Boolean(menuState)} onClose={closeMenu}>
        {menuState?.doc.fileUrl && (
          <MenuItem
            onClick={() => {
              window.open(menuState.doc.fileUrl, '_blank', 'noopener,noreferrer');
              closeMenu();
            }}
          >
            Download
          </MenuItem>
        )}
        {canEdit && (
          <MenuItem
            onClick={() => {
              if (menuState) openDocumentForm(menuState.doc);
              closeMenu();
            }}
          >
            Edit
          </MenuItem>
        )}
        {canDelete && (
          <MenuItem
            onClick={() => {
              if (menuState) handleDelete(menuState.doc);
              closeMenu();
            }}
          >
            Delete
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
