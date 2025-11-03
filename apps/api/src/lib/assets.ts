type FinalizeAssetParams = {
  bucket: R2Bucket | undefined;
  fileName?: string | null;
  targetPrefix: string;
};

const TMP_PREFIX = 'tmp/';

const normalizeKey = (key: string) => key.replace(/^\/+/, '');

const normalizePrefix = (prefix: string) =>
  prefix.replace(/^\/+/, '').replace(/\/+$/, '');

export async function finalizeAssetPath({
  bucket,
  fileName,
  targetPrefix,
}: FinalizeAssetParams): Promise<string | undefined> {
  if (!fileName) {
    return undefined;
  }

  const trimmed = fileName.trim();

  if (!trimmed) {
    return undefined;
  }

  const normalizedKey = normalizeKey(trimmed);

  if (!normalizedKey.startsWith(TMP_PREFIX)) {
    return trimmed;
  }

  if (!bucket) {
    throw new Error('Storage bucket not configured');
  }

  const asset = await bucket.get(normalizedKey);

  if (!asset) {
    throw new Error(`Temporary asset not found: ${normalizedKey}`);
  }

  const target = normalizePrefix(targetPrefix);
  const fileSuffix = normalizedKey.slice(TMP_PREFIX.length);
  const destinationKey = `${target}/${fileSuffix}`;

  const uploadResult = await bucket.put(destinationKey, asset.body, {
    customMetadata: asset.customMetadata,
    httpMetadata: asset.httpMetadata,
  });

  if (!uploadResult) {
    throw new Error(`Failed to persist asset to ${destinationKey}`);
  }

  await bucket.delete(normalizedKey);

  return `/${destinationKey}`;
}
