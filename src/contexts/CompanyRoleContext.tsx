import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService } from '../services/api/auth';
import { companyMemberService } from '../services/api/companyMember';
import type { CompanyRole, MemberResponse } from '../services/api/companyMember';
import { MemberResponseCompanyRoleEnum } from '../../workflow-api';
import { getRoleFromToken, decodeJWT } from '../utils/jwt';

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
  const [companyRole, setCompanyRole] = useState<CompanyRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isCompanyUser = useCallback((): boolean => {
    const token = authService.getAccessToken();
    if (!token) return false;
    const role = getRoleFromToken(token);
    return role === 'ROLE_COMPANY' || role === 'COMPANY';
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    if (!isCompanyUser()) return;
    const token = authService.getAccessToken();
    if (!token) return;

    // JWT sub may be username (string) or userId (number string) depending on backend config
    const payload = decodeJWT(token);
    const sub = payload?.sub ?? null;

    try {
      const { data } = await companyMemberService.getMembers();
      const members = data as MemberResponse[];

      let me: MemberResponse | undefined;

      // Try matching by username first (Spring Security default sub = username)
      if (sub) {
        me = members.find((m) => m.username === sub);
      }

      // Fall back to numeric userId if sub looks like a number
      if (!me && sub) {
        const numericId = parseInt(sub, 10);
        if (!isNaN(numericId)) {
          me = members.find((m) => m.userId === numericId);
        }
      }

      if (me?.companyRole) setCompanyRole(me.companyRole);
    } catch {
      // silently fail
    }
  }, [isCompanyUser]);

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
