import { google } from 'googleapis';
import {
  isProjectDriveAssetEligible,
  type ProjectDriveAsset,
} from '@/lib/project-content';

function getDriveCredentials() {
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('Missing Google Drive credentials. Set GOOGLE_DRIVE_CLIENT_EMAIL and GOOGLE_DRIVE_PRIVATE_KEY.');
  }

  return {
    client_email: clientEmail,
    private_key: privateKey,
  };
}

async function createDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: getDriveCredentials(),
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  return google.drive({ version: 'v3', auth });
}

function toPublicImageUrl(fileId: string) {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

function toThumbnailUrl(fileId: string) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
}

export async function listDriveFolderImages(folderId: string): Promise<ProjectDriveAsset[]> {
  const drive = await createDriveClient();
  const files: ProjectDriveAsset[] = [];
  let pageToken: string | undefined;

  do {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType, thumbnailLink, webContentLink, webViewLink, imageMediaMetadata(width,height))',
      orderBy: 'name_natural',
      pageSize: 200,
      pageToken,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });

    for (const file of response.data.files ?? []) {
      if (!file.id) continue;

      const asset: ProjectDriveAsset = {
        id: file.id,
        url: file.webContentLink ?? toPublicImageUrl(file.id),
        thumbnailUrl: file.thumbnailLink ?? toThumbnailUrl(file.id),
        width: file.imageMediaMetadata?.width ?? undefined,
        height: file.imageMediaMetadata?.height ?? undefined,
        name: file.name ?? undefined,
        mimeType: file.mimeType ?? undefined,
        webViewLink: file.webViewLink ?? undefined,
      };

      if (!isProjectDriveAssetEligible(asset)) {
        continue;
      }

      files.push(asset);
    }

    pageToken = response.data.nextPageToken ?? undefined;
  } while (pageToken);

  return files;
}