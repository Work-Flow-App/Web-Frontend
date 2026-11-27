import { describe, it, expect, vi, beforeEach } from 'vitest';

const assetList = vi.fn();

vi.mock('../../../workflow-api', () => ({
  Configuration: vi.fn(),
  AssetsApi: vi.fn().mockImplementation(() => ({ assetList })),
  AssetAssignmentsApi: vi.fn(),
  WorkerAssetsApi: vi.fn(),
  AssetResponseLocationTypeEnum: {},
  AssetAssignmentCreateRequestExplicitLocationTypeEnum: {},
}));

vi.mock('./axiosConfig', () => ({ axiosInstance: {} }));
vi.mock('../../config/env', () => ({ env: { apiBaseUrl: 'https://api.test' } }));

import { assetService } from './asset';

/** Serves `total` assets named a0, a1, ... in pages of `size`, like GET /assets. */
function serveAssets(total: number, archivedIds: number[] = []) {
  assetList.mockImplementation(async (page: number, size: number) => {
    const ids = Array.from({ length: total }, (_, i) => i).slice(page * size, (page + 1) * size);
    return {
      data: {
        content: ids.map((id) => ({ id, name: `a${id}`, archived: archivedIds.includes(id) })),
        page: { size, number: page, totalElements: total, totalPages: Math.ceil(total / size) },
      },
    };
  });
}

describe('assetService.getAllAssetPages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns assets past the first 100', async () => {
    serveAssets(1234);

    const { data } = await assetService.getAllAssetPages();

    expect(data).toHaveLength(1234);
    expect(data.at(-1)?.name).toBe('a1233');
    expect(assetList).toHaveBeenCalledTimes(13);
    expect(new Set(assetList.mock.calls.map(([page]) => page)).size).toBe(13);
  });

  it('makes one request when everything fits on a page', async () => {
    serveAssets(40);

    const { data } = await assetService.getAllAssetPages();

    expect(data).toHaveLength(40);
    expect(assetList).toHaveBeenCalledTimes(1);
    expect(assetList).toHaveBeenCalledWith(0, 100, undefined, undefined, undefined);
  });

  it('drops archived when filtering by availability, since the backend would then ignore available', async () => {
    serveAssets(3);

    await assetService.getAllAssetPages({ archived: false, available: true, groupId: 9 });

    expect(assetList).toHaveBeenCalledWith(0, 100, undefined, true, 9);
  });

  it('keeps only archived assets, since archived=true also returns active ones', async () => {
    serveAssets(5, [1, 3]);

    const { data } = await assetService.getAllAssetPages({ archived: true });

    expect(assetList).toHaveBeenCalledWith(0, 100, true, undefined, undefined);
    expect(data.map((asset) => asset.id)).toEqual([1, 3]);
  });
});
