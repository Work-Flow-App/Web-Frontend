import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { companyMemberService } from '../services/api/companyMember';
import type { CompanyRole, MemberResponse } from '../services/api/companyMember';
import { MemberResponseCompanyRoleEnum } from '../../workflow-api';
import { decodeJWT } from '../utils/jwt';
import { useAuth } from './AuthContext';

export interface CompanyRoleContextValue {
  companyRole: CompanyRole | null;
  isLoading: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageFinances: boolean;
  canManageWorkers: boolean;
  canInviteMembers: boolean;
  canManageRoles: boolean;
  canManageSubscription: boolean;
  refresh: () => Promise<void>;
}

const CompanyRoleContext = createContext<CompanyRoleContextValue | undefined>(undefined);

export const useCompanyRole = (): CompanyRoleContextValue => {
  const ctx = useContext(CompanyRoleContext);
  if (!ctx) throw new Error('useCompanyRole must be used within CompanyRoleProvider');
  return ctx;
};

const EDIT_ROLES: CompanyRole[] = [
  MemberResponseCompanyRoleEnum.CompanyAdmin,
  MemberResponseCompanyRoleEnum.Manager,
  MemberResponseCompanyRoleEnum.Editor,
];
const MANAGER_ROLES: CompanyRole[] = [
  MemberResponseCompanyRoleEnum.CompanyAdmin,
  MemberResponseCompanyRoleEnum.Manager,
];

export const CompanyRoleProvider = ({ children }: { children: ReactNode }) => {
  const { accessToken, userRole } = useAuth();
  const [companyRole, setCompanyRole] = useState<CompanyRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async (): Promise<void> => {
    if (!accessToken || (userRole !== 'ROLE_COMPANY' && userRole !== 'COMPANY')) {
      setCompanyRole(null);
      return;
    }

    const payload = decodeJWT(accessToken);
    const sub = payload?.sub ?? null;

    try {
      const { data } = await companyMemberService.getMembers();
      const members = data as MemberResponse[];

      let currentMember: MemberResponse | undefined;

      if (sub) {
        currentMember = members.find((m) => m.username === sub);
      }

      if (!currentMember && sub) {
        const numericId = parseInt(sub, 10);
        if (!isNaN(numericId)) {
          currentMember = members.find((m) => m.userId === numericId);
        }
      }

      if (currentMember?.companyRole) {
        setCompanyRole(currentMember.companyRole);
      } else if (!currentMember) {
        // Owner has ROLE_COMPANY but no company_members row — grant full admin access
        setCompanyRole(MemberResponseCompanyRoleEnum.CompanyAdmin);
      }
    } catch {
      // silently fail
    }
  }, [accessToken, userRole]);

  useEffect(() => {
    setIsLoading(true);
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const has = (roles: CompanyRole[]) => !!companyRole && roles.includes(companyRole);

  return (
    <CompanyRoleContext.Provider
      value={{
        companyRole,
        isLoading,
        canEdit: has(EDIT_ROLES),
        canDelete: has(MANAGER_ROLES),
        canManageFinances: has(MANAGER_ROLES),
        canManageWorkers: has(MANAGER_ROLES),
        canInviteMembers: has(MANAGER_ROLES),
        canManageRoles: companyRole === MemberResponseCompanyRoleEnum.CompanyAdmin,
        canManageSubscription: companyRole === MemberResponseCompanyRoleEnum.CompanyAdmin,
        refresh,
      }}
    >
      {children}
    </CompanyRoleContext.Provider>
  );
};
