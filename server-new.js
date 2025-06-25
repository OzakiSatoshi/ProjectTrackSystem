import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// Get all accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      include: {
        contacts: true
      }
    });
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// Get single account by ID
app.get('/api/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const account = await prisma.account.findUnique({
      where: { account_id: id },
      include: {
        contacts: true
      }
    });
    
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    res.json(account);
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Failed to fetch account' });
  }
});

// Create account
app.post('/api/accounts', async (req, res) => {
  try {
    const { account_name } = req.body;
    const account = await prisma.account.create({
      data: { account_name }
    });
    res.status(201).json(account);
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Get all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        account: true
      }
    });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Get single contact by ID
app.get('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await prisma.contact.findUnique({
      where: { contact_id: id },
      include: {
        account: true
      }
    });
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// Create contact
app.post('/api/contacts', async (req, res) => {
  try {
    const { contact_name, account_id } = req.body;
    const contact = await prisma.contact.create({
      data: {
        contact_name,
        account_id
      },
      include: {
        account: true
      }
    });
    res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// Get all anken with related data
app.get('/api/anken', async (req, res) => {
  try {
    const anken = await prisma.anken.findMany({
      include: {
        contact: {
          include: {
            account: true
          }
        }
      },
      orderBy: {
        anken_id: 'desc'
      }
    });
    
    // Transform data to include contact_name and account_name at top level
    const transformedAnken = anken.map(item => ({
      ...item,
      contact_name: item.contact?.contact_name || null,
      account_name: item.contact?.account?.account_name || null
    }));
    
    res.json(transformedAnken);
  } catch (error) {
    console.error('Error fetching anken:', error);
    res.status(500).json({ error: 'Failed to fetch anken' });
  }
});

// Get single anken by ID
app.get('/api/anken/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const anken = await prisma.anken.findUnique({
      where: { anken_id: id },
      include: {
        contact: {
          include: {
            account: true
          }
        }
      }
    });
    
    if (!anken) {
      return res.status(404).json({ error: 'Anken not found' });
    }
    
    // Transform data
    const transformedAnken = {
      ...anken,
      contact_name: anken.contact?.contact_name || null,
      account_name: anken.contact?.account?.account_name || null
    };
    
    res.json(transformedAnken);
  } catch (error) {
    console.error('Error fetching anken:', error);
    res.status(500).json({ error: 'Failed to fetch anken' });
  }
});

// Create anken
app.post('/api/anken', async (req, res) => {
  try {
    const data = req.body;
    const now = new Date().toISOString();
    
    const anken = await prisma.anken.create({
      data: {
        ...data,
        created_at: now,
        updated_at: now
      },
      include: {
        contact: {
          include: {
            account: true
          }
        }
      }
    });
    
    // Transform data
    const transformedAnken = {
      ...anken,
      contact_name: anken.contact?.contact_name || null,
      account_name: anken.contact?.account?.account_name || null
    };
    
    res.status(201).json(transformedAnken);
  } catch (error) {
    console.error('Error creating anken:', error);
    res.status(500).json({ error: 'Failed to create anken' });
  }
});

// Update anken
app.put('/api/anken/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const now = new Date().toISOString();
    
    const anken = await prisma.anken.update({
      where: { anken_id: id },
      data: {
        ...data,
        updated_at: now
      },
      include: {
        contact: {
          include: {
            account: true
          }
        }
      }
    });
    
    // Transform data
    const transformedAnken = {
      ...anken,
      contact_name: anken.contact?.contact_name || null,
      account_name: anken.contact?.account?.account_name || null
    };
    
    res.json(transformedAnken);
  } catch (error) {
    console.error('Error updating anken:', error);
    res.status(500).json({ error: 'Failed to update anken' });
  }
});

// Delete anken
app.delete('/api/anken/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.anken.delete({
      where: { anken_id: id }
    });
    res.json({ message: 'Anken deleted successfully' });
  } catch (error) {
    console.error('Error deleting anken:', error);
    res.status(500).json({ error: 'Failed to delete anken' });
  }
});

// Delete contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.contact.delete({
      where: { contact_id: id }
    });
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// Delete account
app.delete('/api/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if account has any contacts
    const contactCount = await prisma.contact.count({
      where: { account_id: id }
    });
    
    if (contactCount > 0) {
      return res.status(400).json({ 
        error: 'この取引先には担当者が登録されています。先に担当者を削除してください。' 
      });
    }
    
    await prisma.account.delete({
      where: { account_id: id }
    });
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});