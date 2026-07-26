import React, { useCallback, useMemo, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { Badge } from '../../../components/UI/Badge';
import { TabsWrapper, StyledTabs, StyledTab, TabContent } from '../../company/CompanyProfile/CompanyProfile.styles';
import { companyService } from '../../../services/api';
import type { CompanyDocumentResponse, CompanyPostResponse, PublicCompanyProfileResponse } from '../../../services/api';
import { useFetch } from '../../../hooks/useFetch';
import { getInitials } from '../../../utils/getInitials';
import { getDocumentTypeLabel, getDocumentTypeVariant } from '../../../utils/documentTypeLabels';
import { PublicPostCard } from './components/PublicPostCard';
import {
  PageContainer,
  TopBar,
  BrandLink,
  SignInButtonLink,
  Content,
  ProfileCard,
  CoverBanner,
  ProfileHeaderRow,
  LogoCircle,
  LogoImage,
  LogoInitials,
  ProfileInfo,
  CompanyName,
  Tagline,
  MetaRow,
  MetaLink,
  Description,
  FeedSection,
  DocumentList,
  DocumentRow,
  DocumentIconWrap,
  DocumentInfo,
  DocumentTitleRow,
  DocumentTitleText,
  DocumentMetaText,
  EmptyState,
  NotFoundState,
  LoadingContainer,
} from './PublicCompanyProfile.styles';

const TABS = ['posts', 'documents'] as const;

const toAbsoluteUrl = (url: string): string => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

const formatAddress = (address?: PublicCompanyProfileResponse['address']): string | undefined => {
  if (!address) return undefined;
  const parts = [address.town, address.country].filter(Boolean);
  return parts.length ? parts.join(', ') : undefined;
};

const formatDate = (value?: string): string => (value ? new Date(value).toLocaleDateString() : '');

export const PublicCompanyProfile: React.FC = () => {
  const { companyId: companyIdParam } = useParams<{ companyId: string }>();
  const [activeTab, setActiveTab] = useState(0);

  const companyId = Number(companyIdParam);
  const isValidCompanyId = Boolean(companyIdParam) && Number.isFinite(companyId);

  const fetchProfile = useCallback(() => companyService.getPublicProfile(companyId), [companyId]);
  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
  } = useFetch<PublicCompanyProfileResponse>(fetchProfile, [companyId], { skip: !isValidCompanyId });

  const fetchPosts = useCallback(() => companyService.getPublicPosts(companyId), [companyId]);
  const { data: postsData, loading: postsLoading } = useFetch<CompanyPostResponse[]>(fetchPosts, [companyId], {
    skip: !isValidCompanyId,
  });

  const fetchDocuments = useCallback(() => companyService.getPublicDocuments(companyId), [companyId]);
  const { data: documentsData, loading: documentsLoading } = useFetch<CompanyDocumentResponse[]>(
    fetchDocuments,
    [companyId],
    { skip: !isValidCompanyId }
  );

  const posts = useMemo(() => postsData || [], [postsData]);
  const documents = useMemo(() => documentsData || [], [documentsData]);

  const addressLine = formatAddress(profile?.address);

  return (
    <PageContainer>
      <TopBar>
        <BrandLink to="/login">WorkFloww</BrandLink>
        <SignInButtonLink to="/login">Sign in</SignInButtonLink>
      </TopBar>

      <Content>
        {!isValidCompanyId ? (
          <NotFoundState>This company page link is invalid.</NotFoundState>
        ) : profileLoading ? (
          <LoadingContainer>
            <CircularProgress size={32} />
          </LoadingContainer>
        ) : profileError || !profile ? (
          <NotFoundState>This company page isn&apos;t available.</NotFoundState>
        ) : (
          <>
            <ProfileCard>
              <CoverBanner />
              <ProfileHeaderRow>
                <LogoCircle>
                  {profile.logoUrl ? (
                    <LogoImage src={profile.logoUrl} alt={profile.name || 'Company logo'} />
                  ) : (
                    <LogoInitials>{getInitials(profile.name)}</LogoInitials>
                  )}
                </LogoCircle>
                <ProfileInfo>
                  <CompanyName>{profile.name || 'Company'}</CompanyName>
                  {profile.tagline && <Tagline>{profile.tagline}</Tagline>}
                  {(profile.website || addressLine) && (
                    <MetaRow>
                      {profile.website && (
                        <MetaLink href={toAbsoluteUrl(profile.website)} target="_blank" rel="noopener noreferrer">
                          <LanguageOutlinedIcon fontSize="small" />
                          {profile.website}
                        </MetaLink>
                      )}
                      {addressLine && (
                        <span>
                          <PlaceOutlinedIcon fontSize="small" />
                          {addressLine}
                        </span>
                      )}
                    </MetaRow>
                  )}
                  {profile.description && <Description>{profile.description}</Description>}
                </ProfileInfo>
              </ProfileHeaderRow>
            </ProfileCard>

            <TabsWrapper>
              <StyledTabs value={activeTab} onChange={(_: SyntheticEvent, val: number) => setActiveTab(val)}>
                <StyledTab label="Posts" />
                <StyledTab label="Documents" />
              </StyledTabs>
            </TabsWrapper>

            {activeTab === TABS.indexOf('posts') && (
              <TabContent>
                <FeedSection>
                  {postsLoading ? (
                    <LoadingContainer>
                      <CircularProgress size={28} />
                    </LoadingContainer>
                  ) : posts.length === 0 ? (
                    <EmptyState>This company hasn&apos;t shared any public posts yet.</EmptyState>
                  ) : (
                    posts.map((post) => <PublicPostCard key={post.id} post={post} />)
                  )}
                </FeedSection>
              </TabContent>
            )}

            {activeTab === TABS.indexOf('documents') && (
              <TabContent>
                {documentsLoading ? (
                  <LoadingContainer>
                    <CircularProgress size={28} />
                  </LoadingContainer>
                ) : documents.length === 0 ? (
                  <EmptyState>This company hasn&apos;t shared any public documents yet.</EmptyState>
                ) : (
                  <DocumentList>
                    {documents.map((doc) => (
                      <DocumentRow key={doc.id} href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                        <DocumentIconWrap>
                          <InsertDriveFileOutlinedIcon />
                        </DocumentIconWrap>
                        <DocumentInfo>
                          <DocumentTitleRow>
                            <DocumentTitleText>{doc.title || doc.fileName || 'Document'}</DocumentTitleText>
                            <Badge variant={getDocumentTypeVariant(doc.type)}>{getDocumentTypeLabel(doc.type)}</Badge>
                          </DocumentTitleRow>
                          {(doc.validityStartDate || doc.validityEndDate) && (
                            <DocumentMetaText>
                              Valid {formatDate(doc.validityStartDate)}
                              {doc.validityEndDate ? ` to ${formatDate(doc.validityEndDate)}` : ''}
                            </DocumentMetaText>
                          )}
                        </DocumentInfo>
                        <DownloadOutlinedIcon fontSize="small" />
                      </DocumentRow>
                    ))}
                  </DocumentList>
                )}
              </TabContent>
            )}
          </>
        )}
      </Content>
    </PageContainer>
  );
};
