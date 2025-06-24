const express = require('express');
const cors = require('cors');
const path = require('path');
const prisma = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

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
        created_at: 'desc'
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

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
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