import { createServer } from 'node:http';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  INITIAL_AUDIT_LOGS,
  INITIAL_COMPLAINTS,
  INITIAL_CUSTOMERS,
  INITIAL_INTERNAL_MESSAGES,
  INITIAL_JOB_CARDS,
  INITIAL_MISMATCH_CASES,
  INITIAL_PAYMENTS,
  INITIAL_RETREAD_ORDERS,
  INITIAL_SAP_EXCHANGE,
  INITIAL_TYRE_COMPANIES,
  INITIAL_TYRES,
  INITIAL_WHATSAPP_MESSAGES
} from './src/data/mockData';

const port = Number(process.env.API_PORT || 3001);
const stateFile = resolve(process.cwd(), 'server-state.json');

const initialState = {
  jobCards: INITIAL_JOB_CARDS,
  tyres: INITIAL_TYRES,
  mismatchCases: INITIAL_MISMATCH_CASES,
  auditLogs: INITIAL_AUDIT_LOGS,
  internalMessages: INITIAL_INTERNAL_MESSAGES,
  whatsAppMessages: INITIAL_WHATSAPP_MESSAGES,
  tyreCompanies: INITIAL_TYRE_COMPANIES,
  customers: INITIAL_CUSTOMERS,
  retreadOrders: INITIAL_RETREAD_ORDERS,
  complaints: INITIAL_COMPLAINTS,
  payments: INITIAL_PAYMENTS,
  sapExchangePayload: INITIAL_SAP_EXCHANGE
};

type WorkflowState = typeof initialState;

const loadState = (): WorkflowState => {
  if (!existsSync(stateFile)) return initialState;
  try {
    return { ...initialState, ...JSON.parse(readFileSync(stateFile, 'utf8')) };
  } catch {
    return initialState;
  }
};

let state = loadState();

const send = (response: import('node:http').ServerResponse, status: number, body: unknown) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  response.end(JSON.stringify(body));
};

const server = createServer((request, response) => {
  if (request.method === 'OPTIONS') {
    send(response, 204, {});
    return;
  }

  if (request.method === 'GET' && request.url === '/api/health') {
    send(response, 200, { status: 'ok', service: 'tvs-tread-api' });
    return;
  }

  if (request.method === 'GET' && request.url === '/api/state') {
    send(response, 200, state);
    return;
  }

  if (request.method === 'PUT' && request.url === '/api/state') {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', () => {
      try {
        const nextState = JSON.parse(body) as Partial<WorkflowState>;
        state = { ...state, ...nextState };
        writeFileSync(stateFile, JSON.stringify(state, null, 2));
        send(response, 200, { saved: true });
      } catch {
        send(response, 400, { saved: false, error: 'Invalid JSON payload' });
      }
    });
    return;
  }

  send(response, 404, { error: 'Not found' });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`TVS TREAD API listening on http://localhost:${port}`);
});
