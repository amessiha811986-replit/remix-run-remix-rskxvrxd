import { RemixBrowser, RemixServer } from '@remix-run/react';
import type { RemixBrowserProps, RemixServerProps } from '@remix-run/react';
import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToPipeableStream } from 'react-dom/server';
import stream from 'node:stream';
import type { EntryContext } from '@remix-run/node';
import { createReadableStreamFromReadable } from '@remix-run/node';
import { isbot } from 'isbot';
import * as constants from "../utils/constants";

const PassThrough = stream.PassThrough;
export interface RemixProviderProps {
  type: 'Client' | 'Server';
  clientOptions?: RemixBrowserProps;
  serverOptions?: RemixServerProps;
};

export interface ServerTemplateProps {
  request: Request;
  remixContext: EntryContext;
};

export type Comp<P> = (props: P) => React.JSX.Element;
export const Remix: Comp<RemixProviderProps> = ({
  type,
  clientOptions,
  serverOptions,
}) => {
  return (
    <StrictMode>
      {type === 'Client' ? (
        <RemixBrowser {...(clientOptions as RemixBrowserProps)} />
      ) : (
        <RemixServer {...(serverOptions as RemixServerProps)} />
      )}
    </StrictMode>
  );
};

export type ServerEntryRequestHandler = (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) => Promise<unknown>;

export interface ServerEntryRequestHandlers {
  handleBotRequest: ServerEntryRequestHandler;
  handleBrowserRequest: ServerEntryRequestHandler;
};
 
export const renderOnClient = (Template: Comp<{}>) => {
  startTransition(() => {
    hydrateRoot(document, <Template />);
  });
};

export const renderOnServer = (Template: Comp<ServerTemplateProps>) => {
  function handleBotRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext
  ) {
    return new Promise(
      (resolve: <T>(value: T) => void, reject: <T>(reason: T) => void) => {
        let shellRendered = false;
        const { pipe, abort } = renderToPipeableStream(
          <Template request={request} remixContext={remixContext} />,
          {
            onAllReady() {
              shellRendered = true;
              const body = new PassThrough();
              const stream = createReadableStreamFromReadable(body);
              responseHeaders.set('Content-Type', 'text/html');

              resolve(
                new Response(stream, {
                  headers: responseHeaders,
                  status: responseStatusCode,
                })
              );

              pipe(body);
            },
            onShellError(error: unknown) {
              reject(error);
            },
            onError(error: unknown) {
              responseStatusCode = 500;
              // Log streaming rendering errors from inside the shell.  Don't log
              // errors encountered during initial shell rendering since they'll
              // reject and get logged in handleDocumentRequest.
              if (shellRendered) {
                reject(error);
              }
            },
          }
        );

        setTimeout(abort, ABORT_DELAY);
      }
    );
  }

  function handleBrowserRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext
  ) {
    return new Promise((resolve, reject) => {
      let shellRendered = false;
      const { pipe, abort } = renderToPipeableStream(
        <Template request={request} remixContext={remixContext} />,
        {
          onShellReady() {
            shellRendered = true;
            const body = new PassThrough();
            const stream = createReadableStreamFromReadable(body);

            responseHeaders.set('Content-Type', 'text/html');

            resolve(
              new Response(stream, {
                headers: responseHeaders,
                status: responseStatusCode,
              })
            );

            pipe(body);
          },
          onShellError(error: unknown) {
            reject(error);
          },
          onError(error: unknown) {
            responseStatusCode = 500;
            // Log streaming rendering errors from inside the shell.  Don't log
            // errors encountered during initial shell rendering since they'll
            // reject and get logged in handleDocumentRequest.
            if (shellRendered) {
              console.error(error);
            }
          },
        }
      );

      setTimeout(abort, ABORT_DELAY);
    });
  }

  return {
    handleBotRequest: handleBotRequest as ServerEntryRequestHandler,
    handleBrowserRequest: handleBrowserRequest as ServerEntryRequestHandler,
  } as ServerEntryRequestHandlers;
};

export const empty = constants.empty;
export const userAgent = constants.userAgent;
export const isBot = constants.isBot;
export const ABORT_DELAY = constants.ABORT_DELAY;