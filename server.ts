import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { PRODUCTS } from './src/data/products.ts';
import fs from 'fs/promises';
import Stripe from 'stripe';

const PORT = 3000;
const DB_PATH = path.join(process.cwd(), 'db.json');

// Initialize in-memory database
let db = {
  products: PRODUCTS.map(p => ({ ...p, _id: p.id })),
  users: [],
  orders: []
};

// Optional Stripe initialization (lazy to avoid crashing without key)
let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      console.warn('STRIPE_SECRET_KEY is missing. Using mock checkout.');
      return null as any; // Safe fallback handled in the route
    }
    stripeClient = new Stripe(key, { apiVersion: '2023-10-16' });
  }
  return stripeClient;
}

async function loadDb() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    db = { ...db, ...JSON.parse(data) };
  } catch (err) {
    // If db.json doesn't exist, we just save the initial one
    await saveDb();
  }
}

async function saveDb() {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

async function startServer() {
  await loadDb();

  const app = express();
  
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/products', (req, res) => {
    res.json(db.products);
  });

  app.get('/api/products/:slug', (req, res) => {
    const prod = db.products.find(p => p.slug === req.params.slug);
    if (!prod) return res.status(404).json({ error: 'Product not found' });
    res.json(prod);
  });

  // Admin: Update product
  app.put('/api/admin/products/:id', async (req, res) => {
    const index = db.products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Not found' });
    
    db.products[index] = { ...db.products[index], ...req.body };
    await saveDb();
    res.json(db.products[index]);
  });

  // Admin: Create product
  app.post('/api/admin/products', async (req, res) => {
    const newProd = { id: Date.now().toString(), slug: Date.now().toString(), ...req.body };
    db.products.push(newProd);
    await saveDb();
    res.json(newProd);
  });
  
  app.delete('/api/admin/products/:id', async (req, res) => {
    db.products = db.products.filter(p => p.id !== req.params.id);
    await saveDb();
    res.json({ success: true });
  });

  // Orders
  app.post('/api/orders', async (req, res) => {
    const order = { id: `ORD-${Date.now()}`, date: new Date().toISOString(), status: 'pending', ...req.body };
    db.orders.push(order);
    await saveDb();
    res.json(order);
  });

  app.get('/api/admin/orders', (req, res) => {
    res.json(db.orders);
  });
  
  app.put('/api/admin/orders/:id', async (req, res) => {
    const index = db.orders.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Not found' });
    
    db.orders[index] = { ...db.orders[index], ...req.body };
    await saveDb();
    res.json(db.orders[index]);
  });

  // Stripe Checkout
  app.post('/api/create-checkout-session', async (req, res) => {
    const { items, email } = req.body;
    
    const stripe = getStripe();
    if (!stripe) {
      // Mock successful checkout if no API key is provided
      const mockOrder = {
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        status: 'pending',
        items,
        email: email || 'guest@example.com',
        total: items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
      };
      db.orders.push(mockOrder);
      await saveDb();
      return res.json({ url: '/order-success' });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: email,
        line_items: items.map((item: any) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              images: [item.image.startsWith('http') ? item.image : `https://example.com${item.image}`], // Replace with real domain in prod
            },
            unit_amount: Math.round(item.price * 100), // Stripe expects cents
          },
          quantity: item.quantity,
        })),
        success_url: `${req.headers.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cart`,
      });

      res.json({ url: session.url, sessionId: session.id });
    } catch (error: any) {
      console.error('Stripe error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Simple mock auth
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    // VERY simple mock login: anyone can login as admin with admin/admin
    if (email === 'admin@pokecraft.com' && password === 'admin') {
      res.json({ user: { email, role: 'admin' }, token: 'mock-admin-token' });
    } else {
      res.json({ user: { email, role: 'customer' }, token: 'mock-customer-token' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
