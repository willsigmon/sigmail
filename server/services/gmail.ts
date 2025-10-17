import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
];

export class GmailService {
  private oauth2Client: any;

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );
  }

  getAuthUrl(state?: string): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state,
      prompt: 'consent',
    });
  }

  async getTokenFromCode(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }

  setCredentials(accessToken: string, refreshToken?: string) {
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  async refreshAccessToken(refreshToken: string) {
    this.oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await this.oauth2Client.refreshAccessToken();
    return credentials;
  }

  async listMessages(maxResults: number = 50, pageToken?: string) {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      pageToken,
    });
    return response.data;
  }

  async getMessage(messageId: string) {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    const response = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    });
    return response.data;
  }

  async sendMessage(to: string, subject: string, body: string, from?: string) {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

    const message = [
      `To: ${to}`,
      from ? `From: ${from}` : '',
      `Subject: ${subject}`,
      '',
      body,
    ].filter(Boolean).join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return response.data;
  }

  async createDraft(to: string, subject: string, body: string, from?: string) {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

    const message = [
      `To: ${to}`,
      from ? `From: ${from}` : '',
      `Subject: ${subject}`,
      '',
      body,
    ].filter(Boolean).join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: encodedMessage,
        },
      },
    });

    return response.data;
  }

  async searchMessages(query: string, maxResults: number = 50) {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults,
    });
    return response.data;
  }

  async getThread(threadId: string) {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    const response = await gmail.users.threads.get({
      userId: 'me',
      id: threadId,
      format: 'full',
    });
    return response.data;
  }

  async modifyMessage(messageId: string, addLabels?: string[], removeLabels?: string[]) {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    const response = await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        addLabelIds: addLabels,
        removeLabelIds: removeLabels,
      },
    });
    return response.data;
  }

  async getUserProfile() {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    const response = await gmail.users.getProfile({
      userId: 'me',
    });
    return response.data;
  }
}

// Helper function to parse email message
export function parseEmailMessage(message: any) {
  const headers = message.payload?.headers || [];
  const getHeader = (name: string) => 
    headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value;

  let body = '';
  
  // Extract body from parts
  const extractBody = (parts: any[]): string => {
    for (const part of parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return Buffer.from(part.body.data, 'base64').toString('utf-8');
      }
      if (part.mimeType === 'text/html' && part.body?.data && !body) {
        body = Buffer.from(part.body.data, 'base64').toString('utf-8');
      }
      if (part.parts) {
        const nested = extractBody(part.parts);
        if (nested) return nested;
      }
    }
    return body;
  };

  if (message.payload?.parts) {
    body = extractBody(message.payload.parts);
  } else if (message.payload?.body?.data) {
    body = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
  }

  return {
    id: message.id,
    threadId: message.threadId,
    from: getHeader('from'),
    to: getHeader('to'),
    subject: getHeader('subject'),
    date: getHeader('date'),
    body,
    snippet: message.snippet,
    labelIds: message.labelIds || [],
  };
}

