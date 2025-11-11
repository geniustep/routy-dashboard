import axios, { AxiosInstance } from 'axios'

export interface OdooSession {
  uid: number
  username: string
  session_id: string
  db: string
}

class OdooClient {
  private client: AxiosInstance
  private session: OdooSession | null = null

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    // Load session from localStorage
    const savedSession = localStorage.getItem('odoo_session')
    if (savedSession) {
      try {
        this.session = JSON.parse(savedSession)
      } catch (e) {
        localStorage.removeItem('odoo_session')
      }
    }
  }

  async authenticate(db: string, login: string, password: string): Promise<OdooSession> {
    const response = await this.client.post('/web/session/authenticate', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        db,
        login,
        password,
      },
    })

    if (response.data.error) {
      throw new Error(response.data.error.message || 'Authentication failed')
    }

    const session = response.data.result as OdooSession
    this.session = session
    localStorage.setItem('odoo_session', JSON.stringify(session))
    return session
  }

  async call(model: string, method: string, args: any[] = [], kwargs: any = {}): Promise<any> {
    if (!this.session) {
      throw new Error('Not authenticated')
    }

    const response = await this.client.post('/web/dataset/call_kw', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model,
        method,
        args,
        kwargs,
      },
    })

    if (response.data.error) {
      const errorMessage = response.data.error.data?.message || response.data.error.message || 'Unknown error'
      throw new Error(errorMessage)
    }

    return response.data.result
  }

  async search(model: string, domain: any[] = [], fields: string[] = [], limit?: number, offset?: number): Promise<any[]> {
    const kwargs: any = { fields }
    if (limit) kwargs.limit = limit
    if (offset) kwargs.offset = offset
    return this.call(model, 'search_read', [domain], kwargs)
  }

  async read(model: string, ids: number[], fields: string[] = []): Promise<any[]> {
    return this.call(model, 'read', [ids], { fields })
  }

  async create(model: string, values: any): Promise<number> {
    return this.call(model, 'create', [values])
  }

  async write(model: string, ids: number[], values: any): Promise<boolean> {
    return this.call(model, 'write', [ids, values])
  }

  async unlink(model: string, ids: number[]): Promise<boolean> {
    return this.call(model, 'unlink', [ids])
  }

  logout() {
    this.session = null
    localStorage.removeItem('odoo_session')
  }

  getSession(): OdooSession | null {
    return this.session
  }

  isAuthenticated(): boolean {
    return this.session !== null
  }
}

export const odooClient = new OdooClient(import.meta.env.VITE_API_URL)
