export class FetchError extends Error {
  public readonly status?: number;
  public readonly statusText?: string;
  public readonly body?: string;

  constructor(
    message: string,
    status?: number,
    statusText?: string,
    body?: string
  ) {
    super(message);
    this.name = 'FetchError';
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

export const wrapFetch = async <T>(
  fetchPromise: Promise<Response>,
  timeoutMs?: number
): Promise<T> => {
  let response: Response;
  if (timeoutMs != null) {
    response = await Promise.race([
      fetchPromise,
      new Promise<never>((_, rej) =>
        setTimeout(
          () => rej(new FetchError(`Timeout after ${timeoutMs}ms`)),
          timeoutMs
        )
      ),
    ]);
  } else {
    try {
      response = await fetchPromise;
    } catch (err: any) {
      throw new FetchError(`Network error: ${err.message}`);
    }
  }

  let text: string;
  try {
    text = await response.text();
  } catch (err: any) {
    throw new FetchError(
      `Failed to read response body: ${err.message}`,
      response.status,
      response.statusText
    );
  }

  if (!response.ok) {
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
    throw new FetchError(
      `HTTP ${response.status} ${response.statusText}`,
      response.status,
      response.statusText,
      typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2)
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch (err: any) {
    throw new FetchError(
      `Invalid JSON: ${err.message}`,
      response.status,
      response.statusText,
      text
    );
  }
};
