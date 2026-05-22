import { CompanyMembersApi, Configuration } from '../../../workflow-api';
import type {
  MemberResponse,
  MemberInvitationCheckResponse,
  MemberInvitationStatusResponse,
  MemberInviteRequest,
  MemberInviteResponse,
  MemberSignupRequest,
  MemberSignupResponse,
  MemberResponseCompanyRoleEnum,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type CompanyRole = MemberResponseCompanyRoleEnum;

export type {
  MemberResponse,
  MemberInvitationCheckResponse,
  MemberInvitationStatusResponse,
  MemberInviteRequest,
  MemberInviteResponse,
  MemberSignupRequest,
  MemberSignupResponse,
};

export { MemberResponseCompanyRoleEnum as CompanyRoleEnum };

function getCompanyMembersApi(): CompanyMembersApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new CompanyMembersApi(config, env.apiBaseUrl, axiosInstance);
}

export const companyMemberService = {
  async checkInvitation(token: string) {
    return getCompanyMembersApi().companyMemberCheckInvitation(token);
  },

  async getMembers() {
    return getCompanyMembersApi().companyMemberListMembers();
  },

  async inviteMember(data: MemberInviteRequest) {
    return getCompanyMembersApi().companyMemberInviteMember(data);
  },

  async getInvitations() {
    return getCompanyMembersApi().companyMemberListInvitations();
  },

  async updateMemberRole(id: number, companyRole: CompanyRole) {
    return getCompanyMembersApi().companyMemberChangeMemberRole(id, { companyRole });
  },

  async removeMember(id: number) {
    return getCompanyMembersApi().companyMemberRemoveMember(id);
  },
};
